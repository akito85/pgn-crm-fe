import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { Select, Spin, Form } from "antd";
import BaseContainer from "../../../../../components/BaseContainer";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import DetailText from "../../../../../components/DetailText";
import { SYSTEM_SETUP_ROUTES } from "../../../../../routes/system_setup/setup_routes";
import SVGIcon from "../../../../../assets/Icon/index";
import {
  createCostCenter,
  getCostCenterDetail,
  getType,
  updateCostCenter,
} from "../../../../../redux/slices/system_setup/master_data/master_cost_center";
import { LeftOutlined, WarningOutlined } from "@ant-design/icons";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import InputComponent from "../../../../../components/InputComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import { formMessageRequired } from "../../../../../utils";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";
import userHttpService from "../../../../../redux/services/userHttpService";
import { validateCreateUpdate } from "../../../../../redux/slices/general_slice";

const CostCenterForm = (props) => {
  const { type } = props;

  const { typeData, loading, data_detail } = useSelector(
    (state) => state.master_cost_center
  );
  const { bodyError, isLoading } = useSelector(state => state?.general);

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const formValue = form.getFieldsValue();
  const data_type = typeData?.data;
  const id = location?.state?.id;

  const [modalConfirmation, setModalConfirmation] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [description, setDescription] = useState("");
  const [mandatoryFieldType, setMandatoryFieldType] = useState(false);
  const [payload, setPayload] = useState({});


  useEffect(() => {
    if (id) {
      dispatch(getCostCenterDetail(id));
      dispatch(getType());
    } else {
      dispatch(getType());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && data_detail?.data?.id) {
      form.setFieldsValue({
        code: data_detail?.data?.code,
        name: data_detail?.data?.name,
        type: data_detail?.data?.type,
        valName: data_detail?.data?.valName,
        valCode: data_detail?.data?.valCode,
        description: data_detail?.data?.description,
      });
      setMandatoryFieldType(!!data_detail?.data?.type);
    }
  }, [form, id, data_detail]);

  const handleCancel = () => {
    setModalConfirmation(false);
    form.resetFields();
  };


  const onFinish = async (formValue) => {
    try {
      let body;
      let url;
      if (type === 'update') {
        body = { ...formValue, id: location?.state?.id };
        url = '/v1/dbs/api/costcenter/validate-update'
      } else {
        body = formValue
        url = '/v1/dbs/api/costcenter/validate-create'
      }
      setPayload({
        requestBody: body,
        validateCreateUpdate: { body: body, services: userHttpService, endPoint: url, type}
      })
      await dispatch(validateCreateUpdate({ body: body, services: userHttpService, endPoint: url, type }))?.unwrap();
      setModalConfirmation(true);
    } catch (error) {
      setModalConfirmation(false);
    }
  };

  // handle Confirm
  const submitForm = () => {
    setModalConfirmation(false);
    const { typeAction, ...keys } = payload?.requestBody
    if (type === "update") {
      dispatch(updateCostCenter(keys))
        .unwrap()
        .then(() => {
          form.resetFields();
        })
        .catch(() => {
          setModalConfirmation(false);
        });
    } else {
      dispatch(createCostCenter(keys))
        .unwrap()
        .then(() => {
          form.resetFields();
        })
        .catch(() => {
          setModalConfirmation(false);
        });
    }
  };

  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_COST_CENTER,
      breadcrumbName: "Cost Center",
    },
    {
      path: SYSTEM_SETUP_ROUTES.CREATE_HIERARCHY,
      breadcrumbName: `${type === "create" ? "Create Cost Center" : "Update Cost Center"
        }`,
    },
  ];

  const handleClick = () => {
    if (type === "update") {
      dispatch(getCostCenterDetail(id));
    } else {
      form.resetFields();
      setMandatoryFieldType(false)
    }
  };

  const handleSelectType = (e) => {
    setMandatoryFieldType(!!e);
    if (!e) {
      form.resetFields(['valName', 'valCode'])
    }
  };


  const handleRetry = () => {
    handleCancelTryAgain();
    if (bodyError?.action === 'CREATE_COST_CENTER') {
      dispatch(createCostCenter(payload?.requestBody))
    } else if (bodyError?.action === 'UPDATE_COST_CENTER') {
      dispatch(updateCostCenter(payload?.requestBody))
    } else if (bodyError?.action === 'GET_COST_CENTER_DETAIL') {
      dispatch(getCostCenterDetail(id))
    } else if (bodyError?.action === 'VALIDATE_CREATE_UPDATE') {
      dispatch(validateCreateUpdate(payload?.validateCreateUpdate))
    } else {
      dispatch(getType())
    }
  };


  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry)
  return (
    <LayoutMenu>
      <Spin spinning={loading || isLoading}>
        <BreadCrumb routes={routes} />
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <BaseContainer
            header={`${type === "create" ? "CREATE COST CENTER" : "UPDATE COST CENTER"
              }`}
          >
            <div className={"w-full flex flex-col"}>
              <div className={"flex w-full flex-row gap-4"}>
                <Form.Item
                  label={"Code"}
                  name={"code"}
                  className="w-full"
                  rules={formMessageRequired("Code")}
                >
                  <InputComponent disabled={type !== "create"} />
                </Form.Item>
                <Form.Item
                  label={"Cost Center Name"}
                  name={"name"}
                  className="w-full"
                  rules={formMessageRequired("Cost Center Name")}
                >
                  <InputComponent />
                </Form.Item>
              </div>
              <Form.Item label={"Type"} name={"type"} className={"w-full"}>
                <SelectComponent onChange={handleSelectType}>
                  {data_type?.map((index, key) => (
                    <Select.Option value={index?.value}>
                      {index?.name}
                    </Select.Option>
                  ))}
                </SelectComponent>
              </Form.Item>
              <div className={"flex w-full flex-row gap-4"}>
                <Form.Item
                  label={"Value Name"}
                  name={"valName"}
                  className="w-full"
                  rules={
                    mandatoryFieldType
                      ? formMessageRequired("Value Name")
                      : undefined
                  }
                >
                  <InputComponent disabled={mandatoryFieldType === false} />
                </Form.Item>
                <Form.Item
                  label={"Value Code"}
                  name={"valCode"}
                  className="w-full"
                  rules={
                    mandatoryFieldType
                      ? formMessageRequired("Value Code")
                      : undefined
                  }
                >
                  <InputComponent disabled={mandatoryFieldType === false} />
                </Form.Item>
              </div>
              <Form.Item
                className={"w-full"}
                name={"description"}
                label={"Description"}
              >
                <InputComponent
                  type="textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Item>
            </div>
          </BaseContainer>
          <div className={"w-full my-5 flex"}>
            <ButtonComponent
              type={"submit"}
              border={false}
              icon={
                <LeftOutlined
                  style={{
                    color: "#fff",
                    fontSize: 24,
                    justifyItems: "center",
                  }}
                ></LeftOutlined>
              }
              onClick={() => setModalBack(true)}
            >
              Back
            </ButtonComponent>
            <div className={"w-full flex justify-end gap-3"}>
              <ButtonComponent
                type={"submit"}
                border={false}
                icon={
                  <SVGIcon
                    name={
                      type === "update" ? "IconButtonReset" : "IconButtonClear"
                    }
                    width={24}
                  />
                }
                onClick={handleClick}
              >
                {type === "update" ? "Reset" : "Clear"}
              </ButtonComponent>
              <ButtonComponent
                type={"submit"}
                border={false}
                htmlType={"submit"}
              >
                Save
              </ButtonComponent>
            </div>
          </div>
        </Form>
      </Spin>

      <ModalCustom
        isOpen={modalConfirmation}
        type={"confirmation"}
        header={"CONFIRMATION"}
        handleCancel={() => setModalConfirmation(false)}
        width={600}
        footer={
          <div className="w-full flex justify-end gap-5">
            <ButtonComponent onClick={() => setModalConfirmation(false)} type="default">
              Cancel
            </ButtonComponent>
            <ButtonComponent onClick={submitForm} type="submit">
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <div className="w-full p-5">
          <span className="text-primary uppercase font-bold">
            Cost Center Information
          </span>

          <div className="w-full pt-[30px] pl-5">
            <div className={"w-full grid grid-cols-3"}>
              <DetailText label={"Cost Center Name"}>
                {formValue?.name}
              </DetailText>
              <DetailText label={"Code"}>{formValue?.code}</DetailText>
            </div>
            <div className={"w-full grid grid-cols-3"}>
              <DetailText label={"Type"}>{formValue?.type}</DetailText>
              <DetailText label={"Value Name"}>{formValue?.valName}</DetailText>
              <DetailText label={"Value Code"}>{formValue?.valCode}</DetailText>
            </div>
            <div className="col-span-2"></div>

            <div className="col-span-2">
              <DetailText label={"Description"}>
                {formValue?.description}
              </DetailText>
            </div>
          </div>
        </div>
      </ModalCustom>

      {/* modal back */}
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

      {/* render try again */}
      {renderModal()}
    </LayoutMenu>
  );
};

export default CostCenterForm;
