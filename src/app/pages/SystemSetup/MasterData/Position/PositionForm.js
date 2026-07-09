import { Button, Form, Input, Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import { SYSTEM_SETUP_ROUTES } from "../../../../../routes/system_setup/setup_routes";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import DetailText from "../../../../../components/DetailText";
import { useDispatch, useSelector } from "react-redux";
import {
  createMasterPosition,
  getAllCostCenterDDL,
  getDetailMasterPosition,
  updateMasterPosition,
} from "../../../../../redux/slices/system_setup/master_data/master_position";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import { ArrowLeftOutlined, WarningOutlined } from "@ant-design/icons";
import { formMessageRequired } from "../../../../../utils";
import InputComponent from "../../../../../components/InputComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";
import userHttpService from "../../../../../redux/services/userHttpService";
import { validateCreateUpdate } from "../../../../../redux/slices/general_slice";
import NxCardContainer from "../../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../../components/Nx/NxBaseContainer";
const { Option } = Select;
const PositionForm = (props) => {
  const { type } = props;
  const {
    data_cost_center,
    data_detail: data_position,
    loading,
  } = useSelector((state) => state.master_position);
  const { bodyError, isLoading } = useSelector(state => state?.general);

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const formValue = form.getFieldsValue();
  const [payload, setPayload] = useState({});
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (location?.state?.id) {
      dispatch(getDetailMasterPosition(location?.state?.id));
      dispatch(getAllCostCenterDDL());
    } else {
      dispatch(getAllCostCenterDDL());
    }
  }, [dispatch, location]);

  useEffect(() => {
    if (location.state?.id) {
      form.setFieldsValue({
        name: data_position?.name,
        description: data_position?.description,
        costCenter: data_position?.costCenterId,
      });
    }
  }, [data_position]);
  const routes = [
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_MASTER_POSITION,
      breadcrumbName: "List Position",
    },
    {
      path: "",
      breadcrumbName: `${type === "update" ? "Update Position" : "Create Position"
        }`,
    },
  ];
  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (type === "update") {
        await dispatch(updateMasterPosition(payload?.requestBody))?.unwrap();
      } else {
        await dispatch(createMasterPosition(payload?.requestBody))?.unwrap();
      }
    } finally {
      setIsSaving(false);
      handleCancel()
    }
  };

  const onFinish = async (formValue) => {
    setIsValidating(true);
    try {
      let url;
      let body;
      if (type === 'update') {
        body = { ...formValue, id: location?.state?.id }
        url = '/v1/dbs/api/position/validate-update'
      } else {
        body = formValue
        url = '/v1/dbs/api/position/validate-create'
      }
      setPayload({
        requestBody: body,
        validateCreateUpdate: { body: body, services: userHttpService, endPoint: url, type }
      });
      await dispatch(validateCreateUpdate({ body: body, services: userHttpService, endPoint: url, type }))?.unwrap();
      setOpenModal(true);
    } catch (error) {
      setOpenModal(false);
    } finally {
      setIsValidating(false);
    }
  };


  const onFinishFailed = () => {
    setOpenModal(false);
  };
  const handleCancel = () => {
    setOpenModal(false);
  };
  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
    } else {
      form.setFieldsValue({
        name: data_position?.name,
        description: data_position?.description,
        costCenter: data_position?.costCenterId,
      });
    }
  };
  // render cost center
  const costCenterName = data_cost_center?.data?.find(item => item?.id === formValue?.costCenter)?.name;


  const handleRetry = () => {
    handleCancelTryAgain()
    handleCancel()
    if (bodyError?.action === 'CREATE_MASTER_POSITION') {
      dispatch(createMasterPosition(payload?.requestBody))
    } else if (bodyError?.action === 'UPDATE_MASTER_POSITION') {
      dispatch(updateMasterPosition(payload?.requestBody))
    } else if (bodyError?.action === 'GET_DETAIL_MASTER_POSITION') {
      dispatch(getDetailMasterPosition(location?.state?.id))
    } else if (bodyError?.action === 'VALIDATE_CREATE_UPDATE') {
      dispatch(validateCreateUpdate(payload?.validateCreateUpdate))
    } else {
      dispatch(getAllCostCenterDDL())
    }
  }
  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry)

  return (
    <>
      <BreadCrumb routes={routes} />
      <div className={"my-5"}>
        <Form
          layout={"vertical"}
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className={"my-5"}
        >
          <div className="flex flex-col gap-y-4">
            <Spin spinning={loading || isLoading}>
              <NxCardContainer
                header={`${type === "update" ? "UPDATE POSITION" : "CREATE POSITION"
                  }`}
              >
                <div className={"flex flex-col w-full"}>
                  <div className={"flex gap-4"}>
                    <Form.Item
                      className={"w-full"}
                      label={"Name"}
                      rules={formMessageRequired("name")}
                      name={"name"}
                    >
                      <Input disabled={type === 'update'} onInput={(e) =>
                        (e.target.value = e.target.value.trimStart())
                      } />
                    </Form.Item>
                    <Form.Item
                      className={"w-full"}
                      label={"Cost Center"}
                      rules={formMessageRequired("cost center")}
                      name={"costCenter"}
                      initialValue={formValue?.costcenter}
                    >
                      <SelectComponent>
                        {data_cost_center?.data?.map((index, key) => (
                          <Option value={index.id} key={key}>
                            {index.name}
                          </Option>
                        ))}
                      </SelectComponent>
                    </Form.Item>
                  </div>
                  <Form.Item label={"Description"} name={"description"}>
                    <InputComponent type="textarea" />

                  </Form.Item>
                </div>
              </NxCardContainer>
            </Spin>
            <NxBaseContainer border>
              <div className={"w-full flex"}>
                <div>
                  <NavLink className="justify-items-start">
                    <Button
                      type={"menu"}
                      onClick={() => setModalBack(true)}
                    >
                      Back
                    </Button>
                  </NavLink>
                </div>
                <div className={"w-full justify-end flex gap-2"}>
                  <Button
                    icon={<SVGIcon name="IconButtonClear" width={14} />}
                    type={"reject"}
                    onClick={handleClear}
                  >
                    {type === "create" ? "Clear" : "Reset"}
                  </Button>
                  <Button type={"approve"} htmlType={"submit"} loading={isValidating} disabled={isValidating}>
                    Save
                  </Button>
                </div>
              </div>
            </NxBaseContainer>
          </div>
        </Form>
      </div>
      <ModalCustom
        isOpen={openModal}
        handleCancel={handleCancel}
        header={"CONFIRMATION"}
        width={700}
        type={"confirmation"}
        loading={isSaving}
      >
        <div className="flex flex-col gap-y-4">
          {/* <div className={"w-full flex flex-col h-[20vh] flex-wrap gap-y-3"}> */}
          <NxCardContainer header={"POSITION INFORMATION"}>
            <div className={"w-full grid grid-cols-2"}>
              <DetailText label={"Position Name"}>{formValue?.name}</DetailText>
              <DetailText label={"Cost Center"}>{costCenterName}</DetailText>
            </div>
            <div>
              <div className={"w-full grid grid-cols-1 gap-3"}>
                <DetailText label={"Description"}>
                  {formValue?.description}
                </DetailText>
              </div>
            </div>
          </NxCardContainer>
          {/* </div> */}
          <div className={"flex w-full justify-end gap-2"}>
            <ButtonComponent onClick={handleCancel} disabled={isSaving}>Cancel</ButtonComponent>
            <ButtonComponent type={"submit"} onClick={handleSave} loading={isSaving} disabled={isSaving}>
              Confirm
            </ButtonComponent>
          </div>
        </div>
      </ModalCustom>
      <ModalConfirm
        isOpen={modalBack}
        handleCancel={() => setModalBack(false)}
        handleOk={() => navigate(-1)}
        width={400}
      >
        <div className="flex justify-center mt-5 gap-[20px]">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <p className="text-[18px] font-bold">
            Are you sure you want to back?
          </p>
        </div>
      </ModalConfirm>

      {/* render modal try again */}
      {renderModal()}
    </>
  );
};

export default PositionForm;
