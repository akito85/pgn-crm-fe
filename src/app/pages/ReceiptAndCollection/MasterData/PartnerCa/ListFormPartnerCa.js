import {
  LeftOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Form, Spin } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { FormStepper, FormFooter } from "../../../../../components/FormStepNavigation";


import {
  getTypeDDL,
  createPartner,
  createValidasiPartner,
  getAllApprovalList,
  getDetailPartner,
  getListApprovalById,
  getListCategory,
  updatePartner,
  getPartnerList,
  getCollectionAgentList,
  saveDraftPartnerCa,
} from "../../../../../redux/slices/receipt_collection/partnerCa";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { dateFormatting } from "../../../../../utils";
import PartnerCaForm from "./PartnerCaForm";
import SVGIcon from "../../../../../assets/Icon/index";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import BaseContainer from "../../../../../components/BaseContainer";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ContentModalConfirm from "./ContentModalConfirm";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import {
  showModalError,
  showModalSuccess,
} from "../../../../../redux/slices/general_slice";
import { bytesConverter } from "../../../../../utils/bytesConverter";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import { configApp } from "../../../../../constants/configApp";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";

const ListFormPartnerCa = (props) => {
  const { type } = props;
  const {
    data_detail,
    dataListAppHierId,
    dataListAppHierDetail,
    loading,
    dataType,
    dataPartner,
    dataCollectionAgent,
  } = useSelector((state) => state.partnerCa);

  // Declaration
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const location = useLocation();
  const { id } = location?.state || {};
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [loadingForm, setLoadingForm] = useState(loading);
  const [loadingSave, setLoadingSave] = useState(false);
  const [current, setCurrent] = useState(0);

  const steps = [
    { title: "Create", value: "Create", paramValue: ["partnerCode", "caCode", "effStartDate", "effEndDate", "settlementBank"] },
    { title: "Approval", value: "Approval", paramValue: ["apphierId"] },
    { title: "Attachment", value: "Attachment" },
  ];



  const handleError = ({ values, errorFields, outOfDate }) => {
    console.log("Validation Failed:", errorFields);
  };

  const next = () => {
    const fieldsToValidate = steps[current]?.paramValue;
    if (fieldsToValidate) {
      form
        .validateFields(fieldsToValidate)
        .then(() => {
          if (current < steps.length - 1) {
            setCurrent(current + 1);
          }
        })
        .catch((err) => {
          // Handle validation errors if needed
          handleError({ values: form.getFieldsValue(), errorFields: err.errorFields });
        });
    } else {
      if (current < steps.length - 1) {
        setCurrent(current + 1);
      }
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };







  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailPartner(id));
    }
  }, [dispatch, id, type]);




  useEffect(() => {
    dispatch(getAllApprovalList());
    dispatch(getTypeDDL());
    dispatch(getPartnerList());
    dispatch(getCollectionAgentList());
  }, [dispatch]);

  useEffect(() => {
    if (dataListAppHierId && dataListAppHierId.length > 0) {
      const tempAppHier = dataListAppHierId.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
      setAppHierOptions(tempAppHier);
    }
  }, [dataListAppHierId]);

  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getListApprovalById({ id: selectedHierarchy }));
    }
  }, [dispatch, selectedHierarchy]);

  useEffect(() => {
    if (dataListAppHierDetail && dataListAppHierDetail.length > 0) {
      const data = dataListAppHierDetail.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a.employeeDetail.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setAppHierDataDetail(data);
    } else {
      setAppHierDataDetail([]);
    }
  }, [dataListAppHierDetail]);

  useEffect(() => {
    if (
      formValue.approvalHierarchy &&
      !appHierOptions
        .map((item) => item.value)
        .includes(formValue.approvalHierarchy)
    ) {
      form.setFieldsValue({ approvalHierarchy: null });
      setSelectedHierarchy(null);
    }
  }, [formValue, appHierOptions, form]);

  useEffect(() => {
    if (id && data_detail) {

      form.setFieldsValue({
        id: data_detail?.partner.id,
        partnerCode: data_detail?.partner?.partnerCode,
        partnerName: data_detail?.partner?.partnerName,
        effStartDate:
          data_detail?.partner?.effStartDate === null
            ? moment()
            : moment(data_detail?.partner?.effStartDate).clone(),
        effEndDate:
          data_detail?.partner?.effEndDate === null
            ? ""
            : moment(data_detail?.partner?.effEndDate).clone(),
        tokenExpirationTime: data_detail?.partner?.tokenExpirationTime,
        seckeySignature: data_detail?.partner?.secKeySignature,
        type: data_detail?.partner?.type,
        apphierId: data_detail?.partner?.apphierId,
      });

      setSelectedHierarchy(data_detail?.partner?.apphierId);

      setListDataAttachment(
        (data_detail?.attachmentDtoList || []).map((attachData) => ({
          ...attachData,
          fileSize: bytesConverter(attachData.fileSize || 0),
          dataType: "exist",
        }))
      );
    }
  }, [data_detail, id]);



  useEffect(() => {
    if (
      formValue.apphierId &&
      !appHierOptions.map((item) => item.value).includes(formValue.apphierId)
    ) {
      form.setFieldsValue({ apphierId: null });
      setSelectedHierarchy(null);
    }
  }, [formValue, appHierOptions, form]);



  const [sendBody, setSendBody] = useState();

  const handleSubmitForm = (formValue) => {
    const dataValue = {
      // partnerId: id,
      partnerCode: formValue.partnerCode,
      caCode: formValue.caCode,
      settlementBank: formValue.settlementBank,
      effStartDate: moment(formValue.effStartDate).format(dateFormatting.date),
      effEndDate: formValue.effEndDate
        ? moment(formValue.endDate).format(dateFormatting.date)
        : null,
      appHierId: formValue.apphierId,
    };

    console.log("data value partner ca: ", dataValue);

    setSendBody(dataValue);
    const bodyValidasiUpdate = {
      ...dataValue,
      id: data_detail?.partner?.id,
    };
    if (type !== "update") {
      dispatch(createValidasiPartner(dataValue))
        .unwrap()
        .then(async (data) => {
          const sukses = data?.success;
          if (sukses === false) {
            setModalConfirm(false);
          }
          setModalConfirm(true);
        });
    } else {
      dispatch(createValidasiPartner(bodyValidasiUpdate))
        .unwrap()
        .then(async (data) => {
          const sukses = data?.success;
          if (sukses === false) {
            setModalConfirm(false);
          }
          setModalConfirm(true);
          setSendBody(bodyValidasiUpdate)
        });
    }

  };


  const handleCancelModalConfirm = () => {
    setModalConfirm(false);
  };

  // Validation Button Back
  const handleBack = () => {
    navigate(-1);
  };

  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
      setSelectedHierarchy("");
      setListDataAttachment([]);
    } else {
      dispatch(getDetailPartner(id));
    }
  };



  // Breadcrumbs
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
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_PARTNER_CA,
      breadcrumbName: "Partner Collecting Agent Mapping",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.CREATE_PARTNER_CA,
      breadcrumbName: `${type === "create" ? "Create" : "Update"}`,
    },
  ];


  //kriim bodyy
  const handleSave = async () => {
    setLoadingSave(true);
    const successMessageCreate = {
      title: "Successfull",
      description: `Your data has been submited`,
      return: true,
    };

    const successMessageUpdate = {
      title: "Successfull",
      description: `Your data has been submited`,
      return: true,
    };

    if (type === "update") {
      dispatch(updatePartner(sendBody))
        .unwrap()
        .then(async () => {
          const id = data_detail?.partner?.id;
          setLoadingForm(true);
          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist"
          );
          for (let icon = 0; icon < filterDataAttach.length; icon++) {
            const element = filterDataAttach[icon];
            const body = {
              referensiId: data_detail?.partner?.id,
              files: element.file,
              category: "PARTNER_CA",
              fileCategoryId: element.fileCategoryId,
            };
            const response = await receiptCollectionHttpService.uploadImage(
              `/v1/dbs/api/attachment/upload/v1`,
              body
            );
          }
          setLoadingForm(false);
          handleCancelModalConfirm();
          form.resetFields();
          setSelectedHierarchy("");
          setListDataAttachment([]);
          dispatch(showModalSuccess(successMessageUpdate));
          dispatch(showModalSuccess(successMessageUpdate));
          handleClear();
          setLoadingSave(false);
        })
        .catch((error) => {
          setLoadingSave(false);
          setModalConfirm(false);
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
            const message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            dispatch(showModalError(message));
          }
        });
    } else {
      dispatch(createPartner(sendBody))
        .unwrap()
        .then(async (data) => {
          let id = data.id;
          setLoadingForm(true);
          for (let icon = 0; icon < listDataAttachment.length; icon++) {
            const element = listDataAttachment[icon];

            const body = {
              files: element.file,
              fileCategoryId: element.fileCategoryId,
              referensiId: id,
              category: "PARTNER_CA",
            };
            const response = await receiptCollectionHttpService.uploadImage(
              `/v1/dbs/api/attachment/upload/v1`,
              body
            );
          }
          setLoadingForm(false);
          handleCancelModalConfirm();
          handleClear();
          dispatch(showModalSuccess(successMessageCreate));
          setLoadingSave(false);
        })
        .catch((error) => {
          setLoadingSave(false);
          setModalConfirm(false);
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
            const message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            dispatch(showModalError(message));
          }
        });
    }
  };

  const handleSaveDraft = () => {
    const dataValue = {
      // partnerId: id,
      partnerCode: formValue.partnerCode,
      caCode: formValue.caCode,
      settlementBank: formValue.settlementBank,
      effStartDate: moment(formValue.effStartDate).format(dateFormatting.date),
      effEndDate: formValue.effEndDate
        ? moment(formValue.endDate).format(dateFormatting.date)
        : null,
      appHierId: formValue.apphierId,
    };
    dispatch(saveDraftPartnerCa(dataValue))
      .unwrap()
      .then(() => {
        handleClear();
        handleBack();
      });
  };

  return (
    <>
      <BreadCrumb routes={routes} />
      <Spin spinning={loadingForm}>
        <FormStepper
          steps={steps}
          current={current}
          onPrev={prev}
          onNext={next}
        />
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmitForm}
          onFinishFailed={handleError}
        >
          <div
            style={{
              display: current !== 0 ? "none" : undefined,
            }}
          >
            <PartnerCaForm
              dataType={dataType}
              form={form}
              dataPartner={dataPartner}
              dataCollectionAgent={dataCollectionAgent}
            />
          </div>
          <div
            style={{
              display: current !== 1 ? "none" : undefined,
            }}
          >
            <BaseContainer header={"APPROVAL INFORMATION"}>
              <ApprovalComponentGeneral
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </BaseContainer>
          </div>
          <div
            style={{
              display: current !== 2 ? "none" : undefined,
            }}
          >
            <BaseContainer header={"ATTACHMENT INFORMATION"}>
              <AttachmentComponent
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                typeSelector="partnerCa"
                dispatch={dispatch}
                getAPICategory={getListCategory}
                service={receiptCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
                typeRBI={"data"}
              />
            </BaseContainer>
          </div>
          <FormFooter
            current={current}
            totalSteps={steps.length}
            onPrev={prev}
            onNext={next}
            onCancel={handleBack}
            onClear={handleClear}
            onSaveDraft={handleSaveDraft}
            onSubmit={() => form.submit()}
            type={type}
          />
        </Form>
      </Spin>
      <ModalCustom
        isOpen={modalConfirm}
        handleCancel={handleCancelModalConfirm}
        header={"Confirmation"}
        width={1000}
        type={"confirmation"}
        footer={
          <div className="w-full flex justify-between gap-5 p-4">
            <ButtonComponent onClick={handleCancelModalConfirm} type="default">
              Cancel
            </ButtonComponent>
            <ButtonComponent
              type="submit"
              onClick={handleSave}
              className="!bg-[#28a745] !border-[#28a745] hover:!bg-[#218838]"
              isPrimary
              loading={loadingSave}
            >
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <ContentModalConfirm
          data={sendBody}
          tabData={steps}
          listDataAttachment={listDataAttachment}
          listDataAppHierDetail={appHierDataDetail}
          dataOption={appHierOptions}
          selectedHierarchy={selectedHierarchy}
        />
      </ModalCustom>

      {/* Modal Back*/}
      <ModalConfirm
        isOpen={modalBack}
        handleCancel={() => setModalBack(false)}
        handleOk={() => navigate(-1)}
        width={600}
      >
        <div className="flex justify-center mt-5 gap-[20px]">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <p className="text-[18px] font-bold">
            Are you sure you want to back?
          </p>
        </div>
      </ModalConfirm>
    </>
  );
};

export default ListFormPartnerCa;
