import React, { useState, useEffect, useCallback } from 'react'
import { Form, Spin } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import HeaderDetail from '../../../HeaderDetail'
import BaseContainer from '../../../../../../../components/BaseContainer'
import LayoutMenu from '../../../../../../../components/SidebarMenu/LayoutMenu'
import BreadCrumbAdvanced from '../../../../../../../components/BreadCrumbAdvanced'
import { dateFormatting, requiredMessage } from '../../../../../../../utils'
import InputComponent from '../../../../../../../components/InputComponent'
import DateComponent from '../../../../../../../components/DateComponent'
import GasUtilizationTableInline from './GasUtilizationTableInline'
import ButtonComponent from '../../../../../../../components/ButtonComponent'
import SVGIcon from "../../../../../../../assets/Icon/index";
import { LeftOutlined } from '@ant-design/icons'
import accountManagementService from '../../../../../../../redux/services/account_management/accountManagementService'
import { validateCreateUpdate } from '../../../../../../../redux/slices/general_slice'
import ModalCustom from '../../../../../../../components/Modal/ModalCustom'
import DetailText from '../../../../../../../components/DetailText'
import moment from 'moment'
import { createUpdateGasUtilization, getDetailGasUtilization, getDdlUtilizationName } from '../../../../../../../redux/slices/account_management/detailAccount/gasUtilizationSlice'
import ModalBack from '../../../../../../../components/Modal/ModalBack'
import NxBaseContainer from '../../../../../../../components/Nx/NxBaseContainer'
import NxCardContainer from '../../../../../../../components/Nx/NxCardContainer'

const GasUtilizationForm = ({type}) => {
  const { data_detail, ddlUtilizationName } = useSelector(
    (state) =>  state.accountGasUtilization
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const accountId = location?.state?.idAccount;
  const customerId = location?.state?.idCustomer;
  const idUpdate = location?.state?.id;

  const [dataTableGasUtilization, setDataTableGasUtilization] = useState([]);
  const [body, setBody] = useState({});
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formCreate] = Form.useForm();

  const [form] = Form.useForm();

  useEffect(() => console.log("location state:", location.state), [location.state]);

  useEffect(() => {
    if(type === 'update'){
      dispatch(getDetailGasUtilization({id:idUpdate}))
    }
    dispatch(getDdlUtilizationName())
  }, [dispatch, idUpdate, type]);

  const assert = useCallback((data) => {
    if (data) {
      form.setFieldsValue({
        effectiveDate: moment(data?.effectiveDate).clone(),
        description: data?.description
      })

      const arrayTemp = data?.gasUtilsDtl?.map((item) => {
        return {
            key: item?.nameId,
            name: {
              key: `${item?.nameId}`,
              label: item?.name.toUpperCase(),
              value: item?.nameId
            },
            percentage: item?.percentage
        };
      });
    
      setDataTableGasUtilization(arrayTemp)
    }
  }, [form])

  useEffect(() => {
    if (data_detail && type === "update") {
        assert(data_detail);
    }
}, [data_detail, type, assert]);
  
  const handleSave = async (formValue) => {
    let validateValueObj;
    let body;
    try {
      if (type === "create") {
        body = {
          accountId: accountId,
          description: formValue?.description,
          effectiveDate: moment(formValue?.effectiveDate).format(dateFormatting.date),
          gasUtilsDtl: dataTableGasUtilization?.map((item) => {
            return{
              name: item?.name?.value,
              percentage: item?.percentage
            }
          })
        } 
        validateValueObj = {
          body: body,
          services: accountManagementService,
          endPoint:
            "/v1/dbs/api/account-detail/gas-utilization/validate-create-update",
          type,
        }
      } else {
        body = {
          id: data_detail?.id,
          accountId: accountId,
          description: formValue?.description,
          effectiveDate: moment(formValue?.effectiveDate).format(dateFormatting.date),
          gasUtilsDtl: dataTableGasUtilization?.map((item) => {
            return{
              name: item?.name?.value,
              percentage: item?.percentage
            }
          })
        } 
        validateValueObj = {
          body: body,
          services: accountManagementService,
          endPoint:
            "/v1/dbs/api/account-detail/gas-utilization/validate-create-update",
          type,
        }
      }

      await dispatch(validateCreateUpdate(validateValueObj))?.unwrap();
      setOpenConfirmation(true)
      setBody({
        body: body,
        validateValue: validateValueObj,
      });
    } catch (error) {
      return;
    }
  }

  const handleConfirmation = async () => {
    await dispatch(createUpdateGasUtilization(body?.body))?.unwrap();
  };


  const handleResetClear = () => {
    if(type === 'create'){
      form.resetFields();
      setDataTableGasUtilization([])
    } else {
      assert(data_detail)
    }
  };


  return (
    <>
      <LayoutMenu>
        <Spin spinning={false}>
        <BreadCrumbAdvanced  />
          <HeaderDetail
            data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
            dispatch={dispatch}
            idAccount={accountId}
            idCustomer={customerId}
            type={'standard'}
          />

          <div className="flex flex-col gap-4 mt-4">
            <NxCardContainer border header={"GAS UTILIZATION INFORMATION"}>
              <NxBaseContainer border>
                <Form id={"form"} layout='vertical' form={form} onFinish={handleSave}>
                  <div className={"grid grid-cols-1 w-full gap-x-6"}>
                    <Form.Item
                      name={"effectiveDate"}
                      label={"Effective Date"}
                      rules={[
                        {
                          message: requiredMessage("Effective Date!"),
                          required: true,
                        },
                      ]}
                    >
                    <DateComponent disabled={type === "update"} />
                    </Form.Item>
                    <Form.Item name={"description"} label={"Description"}>
                      <InputComponent
                        type="textarea"
                        value={"description"}
                      />
                    </Form.Item>
                  </div>
                </Form>
              </NxBaseContainer>
            </NxCardContainer>

            <NxCardContainer border header={"GAS UTILIZATION DETAIL"}>
              <GasUtilizationTableInline
                dataTableGasUtilization =  {dataTableGasUtilization}
                setDataTableGasUtilization = {setDataTableGasUtilization}
                dispatch={dispatch}
                ddlUtilizationName={ddlUtilizationName}
                setIsEdit={setIsEdit}
              />
            </NxCardContainer>

            <NxBaseContainer border>
              <div className="flex justify-between">
                <ButtonComponent
                  type={"menu"}
                  onClick={()=>{navigate(-1)}}
                >
                  Cancel
                </ButtonComponent>
                              <div className="flex w-full justify-end gap-x-4">
                  <ButtonComponent
                    onClick={handleResetClear}
                    type={"reject"}
                    icon={<SVGIcon name="IconButtonClear" width={24} />}
                  >
                    { type === "update" ? "Reset" : "Clear" }
                  </ButtonComponent>
                  <ButtonComponent type="submit" htmlType={"submit"} form={"form"} disabled={isEdit}>
                    Save
                  </ButtonComponent>
                </div>
              </div>
            </NxBaseContainer>
          </div>

          {/* <div className={"w-full my-5 flex"}>
            <Link
              state={{
                section: "Gas Utilization",
                idAccount: accountId,
                idCustomer: customerId,
              }}
            >
              <ButtonComponent
                icon={
                  <LeftOutlined style={{ fontSize: "24px", color: "#fff" }} />
                }
                type="submit"
                onClick={() => setModalBack(true)}
                disabled={isEdit}
                // onClick={() => navigate(-1)}
              >
                Back
              </ButtonComponent>
            </Link>
            <div className={"w-full flex justify-end gap-5"}>
              <ButtonComponent
                icon={
                  <SVGIcon
                    name={
                      type === "update" ? `IconButtonReset` : `IconButtonClear`
                    }
                    width={24}
                  />
                }
                type="submit"
                onClick={handleResetClear}
                disabled={isEdit}
              >
                {type === "update" ? "Reset" : "Clear"}
              </ButtonComponent>
              <ButtonComponent type="submit" htmlType={"submit"} form={"form"} disabled={isEdit}>
                Save
              </ButtonComponent>
            </div>
          </div> */}

          {/* Modal Confirmation */}
          <ModalCustom
            header={`CONFIRMATION`}
            isOpen={openConfirmation}
            type={"confirmation"}
            handleCancel={() => {
              setOpenConfirmation(false);
            }}
            width={900}
            footer={
              <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
                <ButtonComponent
                    onClick={() => {
                      setOpenConfirmation(false);
                    }}
                    type="default"
                >
                    Cancel
                </ButtonComponent>
                <ButtonComponent
                    onClick={handleConfirmation}
                    type={'submit'}
                >
                    Confirm
                </ButtonComponent>
              </div>
            }
          >
            <div>
              <div className="text-primary text-xs font-bold uppercase py-4">
                Gas Utilization Information
              </div>
              <div className='w-full grid grid-cols-3'>
                <DetailText label={'Effective Date'}>{moment(body?.body?.effectiveDate).format(dateFormatting.date)}</DetailText>
                <DetailText label={'Description'}>{body?.body?.description}</DetailText>
              </div>
              <p className="text-primary text-xs font-bold uppercase pt-[30px]">
                {"Gas Utilization Detail"}
              </p>
              <GasUtilizationTableInline
                dataTableGasUtilization =  {dataTableGasUtilization}
                setDataTableGasUtilization = {setDataTableGasUtilization}
                dispatch={dispatch}
                ddlUtilizationName={ddlUtilizationName}
                type={"preview"}
              />
            </div>
          </ModalCustom>

          {/* Modal Back */}
          <ModalBack
            isOpen={modalBack}
            handleCancel={() => setModalBack(false)}
            handleOk={() => navigate(-1)}
          />
        </Spin>
      </LayoutMenu>
    </>
  )
}

export default GasUtilizationForm