import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Form, Select, Alert, Spin } from "antd";
import moment from "moment";
import { WarningOutlined } from "@ant-design/icons";
import BaseContainer from "../../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import { requiredMessage } from "../../../../../../utils";
import SelectComponent from "../../../../../../components/SelectComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import InputComponent from "../../../../../../components/InputComponent";
import { dateFormatting } from "../../../../../../utils";
import {
  assignGasSource,
  getAccountGasSource,
  getCalorieType,
  getAllAccountGasSourcePaginate,
} from "../../../../../../redux/slices/account_management/detailAccount/accountGasSource";
import GasSourceTable from "./GasSourceTable";
import ModalConfirmationLayout from "./ModalConfirmationLayout";
import { ModalConfirm } from "../../../../../../components/Modal/ModalPopUp";
import UtilsDate from "../ServicePoint/Asset/UtilsDate";
import { getGrantedAccessAccount } from "../../../../../../redux/slices/account_management/accountManagement";
import ToolbarAccount from "../../../ComponentAccount/ToolbarAccount";
import accountManagementService from "../../../../../../redux/services/account_management/accountManagementService";
import {
  clearBodyMessage,
  hideModalError,
  validateCreateUpdate,
} from "../../../../../../redux/slices/general_slice";

const GasSourceInformation = () => {
  // Selector
  const { data_ags, data_calorie_type, loading } = useSelector(
    (state) => state.accountGasSource,
  );
  const { access_account } = useSelector((state) => state.accountManagement);

  const { data_accountDetail } = useSelector(
    (state) => state.accountManagement,
  );
  // Declaration
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const location = useLocation();
  const id = location?.state?.idAccount;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [modalAssign, setModalAssign] = useState(false);
  const [description, setDescription] = useState("");
  const [dataAGS, setDataAGS] = useState(0);
  const [dataTableGasQuality, setDataTableGasQuality] = useState([]);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [bodyData, setBodyData] = useState("");
  const [modalFailed, setModalFailed] = useState("");
  const [messageFailed, setMessageFailed] = useState("");
  const [flag, setFlag] = useState(0);

  // Use Effect

  useEffect(() => {
    if (location?.pathname.includes("account-standard")) {
      dispatch(
        getGrantedAccessAccount(
          "/account-management/account-standard/gas-source",
        ),
      );
    } else {
      dispatch(
        getGrantedAccessAccount(
          "/account-management/account-onetime/gas-source",
        ),
      );
    }
  }, [dispatch]);

  useEffect(() => {
    if (dataAGS !== 0) {
      // Function insert data
      const obj = data_ags?.filter((a) => a.gasSourceId === dataAGS)?.[0];

      form.setFieldsValue({
        name: obj?.name,
        uom: obj?.uom,
        description: obj?.description,
      });

      setDataTableGasQuality(obj?.detail);
    }
  }, [form, dataAGS, data_ags]);

  const handleOnChange = (value) => {
    setDataAGS(value);
    return value;
  };

  const handleCancelForm = () => {
    setModalConfirm(false);
    form.resetFields();
    setModalAssign(false);
    setDataTableGasQuality([]);
    setFlag(0);
  };

  const handleConfirm = async (value) => {
    try {
      let url;
      let bodyRequest;
      bodyRequest = {
        accountId: id,
        gasSourceCodeId: value.calorieCode,
        calorieType: value.calorieType,
        startDate: moment(value.startDate).format(dateFormatting.date),
        remark: value.remark,
        needValidation: flag === 0 ? true : false,
      };
      setBodyData(bodyRequest);
      url = "/v1/dbs/api/gas-source/validate-assign";
      await dispatch(
        validateCreateUpdate({
          body: bodyRequest,
          services: accountManagementService,
          endPoint: url,
          type: "create",
        }),
      )?.unwrap();
      setModalAssign(false);
      setModalConfirm(true);
    } catch (error) {
      if (
        error?.message ===
        "Warning! The previous gas source end date will be set to H-1 from new start date"
      ) {
        dispatch(hideModalError());
        dispatch(clearBodyMessage());
        setModalFailed(true);
        setMessageFailed(error?.message);
        setFlag(1);
      }
    }
  };

  const onFinish = async () => {
    try {
      const body = {
        ...bodyData,
        needValidation: flag === 0 ? true : false,
      };
      setModalFailed(false);
      await dispatch(assignGasSource({ body: body }))?.unwrap();
      handleCancelForm();
      await dispatch(
        getAllAccountGasSourcePaginate({
          id,
          search: encodeURIComponent(JSON.stringify(search)),
          sort,
          page,
          pageSize,
        }),
      )?.unwrap();
    } catch (error) {
      setModalConfirm(false);
      setModalFailed(false);
      setModalConfirm(false);
      form.resetFields();
      setDataTableGasQuality([]);
      setFlag(0);
    }
  };

  const itemActions = [
    //action toolbar
    {
      action: "Create",
      render: (
        <div className="w-full flex justify-end mb-[30px]">
          <ButtonComponent
            type={"submit"}
            onClick={async () => {
              form.resetFields();
              setDataTableGasQuality([]);
              await dispatch(getCalorieType())?.unwrap();
              await dispatch(
                getAccountGasSource(
                  data_accountDetail?.accountInformation?.costCenterId,
                ),
              )?.unwrap();
              setModalAssign(true);
            }}
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
          >
            Create Gas Source
          </ButtonComponent>
        </div>
      ),
    },
  ];

  return (
    <Fragment>
      <BaseContainer header={"GAS SOURCE LIST"}>
        <Spin spinning={loading}>
          <div className="w-full flex justify-end mb-[30px]">
            <ToolbarAccount
              items={itemActions}
              advancedAccess={access_account}
            />
          </div>
          {/* <div className="w-full flex justify-end mb-[30px]">
            <ButtonComponent
              type={"submit"}
              onClick={() => {
                setModalAssign(true);
              }}
              icon={<SVGIcon name="IconButtonCreate" width={24} />}
            >
              Create
            </ButtonComponent>
          </div> */}

          <div className={"w-full"}>
            <GasSourceTable
              type={"information"}
              accessAccount={access_account}
            />
          </div>

          {/* Modal Assign */}
          <ModalCustom
            isOpen={modalAssign}
            type="confirmation"
            header="ASSIGN GAS SOURCE"
            width={1000}
            handleCancel={handleCancelForm}
            footer={
              <div className={"w-full flex justify-end gap-5"}>
                <div className=" flex gap-5">
                  <Form.Item>
                    <ButtonComponent type="default" onClick={handleCancelForm}>
                      Cancel
                    </ButtonComponent>
                  </Form.Item>
                  <Form.Item>
                    <ButtonComponent
                      type="submit"
                      htmlType={"submit"}
                      form={"formGasSourceAssign"}
                    >
                      Save
                    </ButtonComponent>
                  </Form.Item>
                </div>
              </div>
            }
          >
            <Form
              id={"formGasSourceAssign"}
              layout={"vertical"}
              form={form}
              onFinish={handleConfirm}
            >
              <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
                {"GAS SOURCE ASSIGNMENT INFORMATION"}
              </div>
              <div className="w-full">
                <div className="grid grid-cols-2 gap-2 mb-5">
                  <Form.Item
                    label={"Calorie Type"}
                    name={"calorieType"}
                    rules={[
                      {
                        message: requiredMessage("Calorie Type"),
                        required: true,
                      },
                    ]}
                  >
                    <SelectComponent>
                      {data_calorie_type &&
                        data_calorie_type?.map((ta, index) => (
                          <Select.Option value={ta.calorieId} key={index}>
                            {ta.calorieName}
                          </Select.Option>
                        ))}
                    </SelectComponent>
                  </Form.Item>

                  <Form.Item
                    label={"Start Date"}
                    name={"startDate"}
                    rules={[
                      {
                        message: requiredMessage("Start Date"),
                        required: true,
                      },
                    ]}
                  >
                    <UtilsDate allowClear />
                  </Form.Item>
                </div>
                <Form.Item label={"Remark"} name={"remark"}>
                  <InputComponent
                    type="textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Item>
              </div>

              <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
                {"GAS QUALITY INFORMATION"}
              </div>

              <div className="w-full">
                <div className="grid grid-cols-3 gap-3">
                  <Form.Item
                    label={"Calorie Code"}
                    name={"calorieCode"}
                    rules={[
                      {
                        message: requiredMessage("Calorie Code"),
                        required: true,
                      },
                    ]}
                    getValueFromEvent={handleOnChange}
                  >
                    <SelectComponent>
                      {data_ags &&
                        data_ags?.map((ta, index) => (
                          <Select.Option value={ta.gasSourceId} key={index}>
                            {ta.calorieCode}
                          </Select.Option>
                        ))}
                    </SelectComponent>
                  </Form.Item>

                  <Form.Item label={"Name"} name={"name"}>
                    <InputComponent disabled />
                  </Form.Item>

                  <Form.Item label={"UOM"} name={"uom"}>
                    <InputComponent disabled />
                  </Form.Item>
                </div>

                <Form.Item label={"Description"} name={"description"}>
                  <InputComponent
                    type="textarea"
                    disabled
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Item>

                <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
                  {"GAS QUALITY DETAIL"}
                </div>

                <div className={"w-full"}>
                  <GasSourceTable
                    type={"detail"}
                    dataNoApi={dataTableGasQuality}
                  />
                </div>
              </div>
            </Form>
          </ModalCustom>

          {/* Modal Confirmation */}
          <ModalConfirmationLayout
            isOpen={modalConfirm}
            data={bodyData}
            dataGSD={dataTableGasQuality}
            apiAGS={data_ags}
            apiCalorieType={data_calorie_type}
            handleCancel={() => {
              setModalConfirm(false);
              setModalAssign(true);
            }}
            handleConfirm={() => {
              setFlag(0);
              onFinish();
            }}
          />

          {/* Modal Failed Assign */}
          <ModalConfirm
            isOpen={modalFailed}
            useOk={true}
            handleCancel={() => {
              form.resetFields();
              setDataTableGasQuality([]);
              setModalFailed(false);
            }}
            handleOk={() => {
              setFlag(1);
              onFinish();
            }}
          >
            <div className="flex justify-center gap-[20px] mt-6">
              <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
              <p className={"text-[18px] font-bold"}>
                Are you sure want to assign new gas source?
              </p>
            </div>
            <Alert message={messageFailed} type={"error"} />
          </ModalConfirm>
        </Spin>
      </BaseContainer>
    </Fragment>
  );
};

export default GasSourceInformation;
