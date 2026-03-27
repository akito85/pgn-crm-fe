import { Form, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import DetailText from "../../../../../components/DetailText";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import { SYSTEM_SETUP_ROUTES } from "../../../../../routes/system_setup/setup_routes";
import SVGIcon from "../../../../../assets/Icon/index";
import { useDispatch, useSelector } from "react-redux";
import {
  createMasterJob,
  getDetailMasterJob,
  updateMasterJob,
} from "../../../../../redux/slices/system_setup/master_data/master_job";
import { LeftOutlined, WarningOutlined } from "@ant-design/icons";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import InputComponent from "../../../../../components/InputComponent";
import { formMessageRequired } from "../../../../../utils";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";
import { validateCreateUpdate } from "../../../../../redux/slices/general_slice";
import userHttpService from "../../../../../redux/services/userHttpService";

const JobForm = (props) => {
  const { type } = props;
  const { bodyError, isLoading } = useSelector(state => state?.general);
  const { data_detail, loading } = useSelector((state) => state.master_job);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const id = location?.state?.id;

  const [openModal, setOpenModal] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [description, setDescription] = useState("");
  const [payload, setPayload] = useState({})

  useEffect(() => {
    if (id) {
      dispatch(getDetailMasterJob(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (id && data_detail) {
      form.setFieldsValue({
        jobName: data_detail?.jobName,
        description: data_detail?.description,
      });
    }
  }, [id, form, data_detail]);

  const saveAction = async () => {
    try {
      handleCancel()
      if (type === "update") {
        await dispatch(updateMasterJob(payload?.requestBody))?.unwrap();
      } else {
        await dispatch(createMasterJob(payload?.requestBody))?.unwrap();
      }
    } catch (error) {
      handleCancel()

    }
  };

  const handleCancel = () => {
    setOpenModal(false);
  };
  const routes = [
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_JOB,
      breadcrumbName: "List Job",
    },
    {
      path: "",
      breadcrumbName: `${type === "update" ? "Update Job" : "Create Job"}`,
    },
  ];


  const onFinish = async (values) => {
    try {
      let url;
      let body;
      if (type === 'update') {
        body = { ...values, jobId: location?.state?.id }
        url = '/v1/dbs/api/job/validate-update'
      } else {
        body = values
        url = '/v1/dbs/api/job/validate-create'
      }
      setPayload({
        requestBody: body,
        validateCreateUpdate: { body: body, services: userHttpService, endPoint: url, type}
      })
      await dispatch(validateCreateUpdate({ body: body, services: userHttpService, endPoint: url, type }))?.unwrap()
      setOpenModal(true);
    } catch (error) {
      setOpenModal(false);
    }
  };
  const onFinishFailed = () => {
    setOpenModal(false);
  };

  const handleClick = () => {
    if (type === "update") {
      dispatch(getDetailMasterJob(id));
    } else {
      form.resetFields();
    }
  };

  const handleRetry = () => {
    handleCancelTryAgain()
    handleCancel()
    if (bodyError?.action === 'CREATE_MASTER_JOB') {
      dispatch(createMasterJob(payload?.requestBody))
    } else if (bodyError?.action === 'UPDATE_MASTER_JOB') {
      dispatch(updateMasterJob(payload?.requestBody))
    } else if (bodyError?.action ==='VALIDATE_CREATE_UPDATE') {
      dispatch(validateCreateUpdate(payload?.validateCreateUpdate))
    } else{
      dispatch(getDetailMasterJob(id))
    }
  }


  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry)
  return (
    <>
      <Spin spinning={loading || isLoading}>
        <BreadCrumb routes={routes} />
        <Form
          form={form}
          layout={"vertical"}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <BaseContainer
            header={type === "update" ? "UPDATE JOB" : "CREATE JOB"}
          >
            <div className="flex flex-col w-full">
              <Form.Item
                className={"w-1/2"}
                name={"jobName"}
                label={"Job Name"}
                rules={formMessageRequired("Job Name")}
              >
                <InputComponent disabled={type === "update"} onInput={(e) =>
                  (e.target.value = e.target.value.trimStart())
                } />
              </Form.Item>
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

          <div className={"w-full flex my-5"}>
            <div>
              <ButtonComponent
                type={"submit"}
                onClick={() => setModalBack(true)}
                icon={
                  <LeftOutlined
                    style={{
                      color: "#fff",
                      fontSize: 24,
                      justifyItems: "center",
                    }}
                  ></LeftOutlined>
                }
              >
                Back
              </ButtonComponent>
            </div>
            <div className={"w-full justify-end flex gap-2"}>
              <ButtonComponent
                icon={
                  <SVGIcon
                    name={
                      type === "update" ? "IconButtonReset" : "IconButtonClear"
                    }
                    width={24}
                  />
                }
                type={"submit"}
                border={false}
                onClick={handleClick}
              >
                {type === "update" ? "Reset" : "Clear"}
              </ButtonComponent>
              <ButtonComponent type={"submit"} htmlType={"submit"}>
                Save
              </ButtonComponent>
            </div>
          </div>
        </Form>

        <ModalCustom
          isOpen={openModal}
          handleCancel={handleCancel}
          header={"CONFIRMATION"}
          width={500}
          type={"confirmation"}
        >
          <div className="w-full flex flex-col gap-4">
            <span className="text-primary uppercase">Job Information</span>
            <div className="flex flex-col gap-4 pl-4">
              <DetailText label={"Job name"}>{formValue?.jobName}</DetailText>
              <DetailText label={"Description"}>
                {formValue?.description}
              </DetailText>
            </div>
          </div>

          <div className="flex justify-end gap-5">
            <ButtonComponent onClick={handleCancel} type="default">
              Cancel
            </ButtonComponent>
            <ButtonComponent onClick={saveAction} type="submit">
              Submit
            </ButtonComponent>
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

        {/* render modal try again */}
        {renderModal()}
      </Spin>
    </>
  );
};

export default JobForm;
