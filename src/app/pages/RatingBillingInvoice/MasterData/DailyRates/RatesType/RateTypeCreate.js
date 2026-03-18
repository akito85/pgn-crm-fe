import { LeftOutlined, WarningOutlined } from "@ant-design/icons";
import { Form, Spin } from "antd";
import React, { useEffect, useState } from "react";
import BaseContainer from "../../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import InputComponent from "../../../../../../components/InputComponent";
import { RBI_ROUTES } from "../../../../../../routes/rating_billing/rbi_routes";
import { formMessageRequired } from "../../../../../../utils";
import SVGIcon from "../../../../../../assets/Icon/index";
import { useLocation, useNavigate } from "react-router-dom";
import { ModalConfirm } from "../../../../../../components/Modal/ModalPopUp";
import DetailText from "../../../../../../components/DetailText";
import { useDispatch, useSelector } from "react-redux";
import {
  createRateType,
  getDetailRateType,
  updateRateType,
} from "../../../../../../redux/slices/rating_billing_invoice/MasterData/rateType";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import { validateCreateUpdate } from "../../../../../../redux/slices/general_slice";
import ratingBillingHttpService from "../../../../../../redux/services/ratingBillingHttpService";

const RateTypeCreate = ({ type }) => {
  const [form] = Form.useForm();
  const { data_detail, loading } = useSelector((state) => state.rate_type);
  const formValue = form.getFieldsValue();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [modalBack, setModalBack] = useState(false);
  const [showModalConfirmation, setShowModalConfirmation] = useState(false);
  const [kirimBody, setKirimBody] = useState("");
  const { id } = location?.state || {};

  // Validation Button Back
  const handleBack = () => {
    if (
      form.getFieldValue() === null ||
      Object.keys(form.getFieldValue()).length === 0
    ) {
      navigate(-1);
    } else {
      setModalBack(true);
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
      path: RBI_ROUTES.DAILY_RATE_VIEW,
      breadcrumbName: "Daily Rate",
    },
    {
      path: RBI_ROUTES.DAILY_RATE_CREATE,
      breadcrumbName: `${type === "create" ? "Create" : "Update"} Rate Type`,
    },
  ];

  //useEffect
  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailRateType(id));
    }
  }, [id, dispatch, type]);

  //useEffect update
  useEffect(() => {
    if (id && type === "update") {
      form.setFieldsValue({
        id: data_detail?.typeId,
        code: data_detail?.code,
        desc: data_detail?.description,
      });
    }
  }, [id, dispatch, type, data_detail]);

  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
    } else {
      dispatch(getDetailRateType(id));
    }
  };

  // Validate Data before Modal
  const checkDataValidity = async (formValue) => {
    const url =
      type === "create"
        ? "/v1/dbs/api/rate-type/validate-create"
        : "/v1/dbs/api/rate-type/validate-update";

    const dataValue = {
      typeId: data_detail?.typeId,
      code: formValue?.code,
      description: formValue?.desc,
    };

    try {
      await dispatch(
        validateCreateUpdate({
          body: type === "create" ? formValue : dataValue,
          services: ratingBillingHttpService,
          endPoint: url,
          type: type,
        })
      )?.unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSubmitForm = async (formValue) => {
    const dataValue = {
      code: formValue?.code,
      description: formValue?.desc,
    };

    const isDataValid = await checkDataValidity(dataValue);

    if (isDataValid) {
      setShowModalConfirmation(true);
      setKirimBody(dataValue);
    } else {
      setShowModalConfirmation(false);
    }
  };

  const handleConfirm = () => {
    if (type === "create") {
      const body = { ...kirimBody };
      dispatch(createRateType(body))
        .unwrap()
        .then(() => {
          form.resetFields();
          setShowModalConfirmation(false);
        });
    } else {
      const body = {
        typeId: data_detail?.typeId,
        ...kirimBody,
      };
      dispatch(updateRateType(body))
        .unwrap()
        .then(() => {
          setShowModalConfirmation(false);
        });
    }
  };

  return (
    <div>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading}>
        <Form layout="vertical" form={form} onFinish={handleSubmitForm}>
          <BaseContainer header={"Rate Type Information"}>
            <div className="w-1/2">
              <Form.Item
                label="Code"
                name={"code"}
                rules={formMessageRequired("Code")}
              >
                <InputComponent maxLength={100}/>
              </Form.Item>
            </div>
            <Form.Item
              label="Description"
              name={"desc"}
              rules={formMessageRequired("Description")}
            >
              <InputComponent rows={5} type="textarea" />
            </Form.Item>
          </BaseContainer>

          <div className="flex w-full justify-between align-middle my-3">
            <ButtonComponent
              type={"submit"}
              onClick={() => handleBack()}
              icon={
                <LeftOutlined
                  style={{
                    color: "#fff",
                    fontSize: 24,
                    justifyItems: "center",
                  }}
                />
              }
            >
              Back
            </ButtonComponent>
            <div className="flex align-middle gap-3">
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
                onClick={handleClear}
              >
                {type === "update" ? "Reset" : "Clear"}
              </ButtonComponent>
              <ButtonComponent htmlType="submit" type="submit">
                Save
              </ButtonComponent>
            </div>
          </div>
        </Form>
      </Spin>

      {/* modalConfirmation */}
      {/* <ModalConfirm
        isOpen={showModalConfirmation}
        handleCancel={() => setShowModalConfirmation(false)}
        handleOk={handleConfirm}
        width={400}
        header={"Confirmation"}
      > */}
      <ModalCustom
        isOpen={showModalConfirmation}
        type={"confirmation"}
        header={"CONFIRMATION"}
        width={450}
        handleCancel={() => setShowModalConfirmation(false)}
        footer={
          <div className={"w-full flex justify-end gap-5"}>
            <ButtonComponent
              type={"default"}
              onClick={() => setShowModalConfirmation(false)}
            >
              Cancel
            </ButtonComponent>
            <ButtonComponent
              type={"submit"}
              border={false}
              onClick={handleConfirm}
            >
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <div className="w-full p-5">
          <span className="text-primary uppercase font-bold">
            Rate Type Information
          </span>

          <div className="grid grid-cols-2 gap-5 pt-[30px]">
            <DetailText label="Code">{formValue?.code}</DetailText>
            <div className="w-full col-span-2">
              <DetailText label="Description">{formValue?.desc}</DetailText>
            </div>
          </div>
        </div>
      </ModalCustom>

      {/* Modal Back*/}
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
    </div>
  );
};

export default RateTypeCreate;
