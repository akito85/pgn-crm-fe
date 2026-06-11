import { WarningOutlined } from "@ant-design/icons";
import { Form, Spin } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import RadioTabs from "../../../../../components/RadioTabs";
import { FormStepper, FormFooter } from "../../../../../components/FormStepNavigation";
import {
  createPartner,
  createValidasiPartner,
  getAllApprovalList,
  getDetailPartner,
  getListApprovalById,
  getListCategory,
  updatePartner,
  saveDraftPartner,
  getDetailDraftPartner,
} from "../../../../../redux/slices/receipt_collection/partner";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { dateFormatting } from "../../../../../utils";
import PartnerForm from "./PartnerForm";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import CardContainer from "../../../../../components/CardContainer";
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

const steps = [
  { title: "CREATE", value: "Partner" },
  { title: "APPROVAL", value: "Approval" },
  { title: "ATTACHMENT", value: "Attachment" },
];

const ListFormPartner = (props) => {
  const { type } = props;
  const {
    data_detail,
    dataListAppHierId,
    dataListAppHierDetail,
    loading,
  } = useSelector((state) => state.partner);

  // Declaration
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const location = useLocation();
  const { id, status } = location?.state || {};
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [loadingForm, setLoadingForm] = useState(loading);
  const [loadingSave, setLoadingSave] = useState(false);
  const [current, setCurrent] = useState(0);





  useEffect(() => {
    if (id && type === "update") {
      if (status === "Draft") {
        dispatch(getDetailDraftPartner(id));
      } else {
        dispatch(getDetailPartner(id));
      }
    }
  }, [dispatch, id, type, status]);




  useEffect(() => {
    dispatch(getAllApprovalList());
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
        secKeySignature: data_detail?.partner?.secKeySignature,
        apphierId: data_detail?.partner?.appHierId,
      });

      setSelectedHierarchy(data_detail?.partner?.appHierId);

      setListDataAttachment(
        (data_detail?.attachmentDtoList || []).map((attachData) => ({
          ...attachData,
          fileSize: bytesConverter(attachData.fileSize || 0),
          dataType: "exist",
        }))
      );
    }
  }, [data_detail, id, form]);

  // Define tabData before using it in useState

  const [tabData, setTabData] = useState([
    {
      value: "Partner", paramValue: ["partnerCode",
        "partnerName",
        "effStartDate",
        "effEndDate",
        "tokenExpirationTime",
        "secKeySignature",
      ]
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);

  const [valuePage, setValuePage] = useState(steps[0].value);
  const [sendBody, setSendBody] = useState();

  useEffect(() => {
    setValuePage(steps[current].value);
  }, [current]);

  const next = () => {
    const fieldsToValidate = tabData[current]?.paramValue;
    if (fieldsToValidate) {
      form
        .validateFields(fieldsToValidate)
        .then(() => {
          if (current < steps.length - 1) {
            setCurrent(current + 1);
          }
        })
        .catch((error) => {
          console.log("Validation failed:", error);
        });
    } else {
      if (current < steps.length - 1) {
        setCurrent(current + 1);
      }
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  useEffect(() => {
    if (
      formValue.apphierId &&
      !appHierOptions.map((item) => item.value).includes(formValue.apphierId)
    ) {
      form.setFieldsValue({ apphierId: null });
      setSelectedHierarchy(null);
    }
  }, [formValue, appHierOptions, form]);
  const handleSubmitForm = (formValue) => {
    const dataValue = {
      // partnerId: id,
      partnerCode: formValue.partnerCode,
      partnerName: formValue.partnerName,
      tokenExpirationTime: formValue.tokenExpirationTime,
      seckeySignature: formValue.secKeySignature,
      effStartDate: moment(formValue.effStartDate).format(dateFormatting.date),
      effEndDate: formValue.effEndDate
        ? moment(formValue.effEndDate).format(dateFormatting.date)
        : null,
      apphierId: formValue.apphierId,
    };

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

  const handleSaveDraft = () => {
    const values = form.getFieldsValue();
    const dataValue = {
      id: id,
      partnerCode: values.partnerCode,
      partnerName: values.partnerName,
      tokenExpirationTime: values.tokenExpirationTime,
      seckeySignature: values.secKeySignature,
      effStartDate: values.effStartDate ? moment(values.effStartDate).format(dateFormatting.date) : null,
      effEndDate: values.effEndDate ? moment(values.effEndDate).format(dateFormatting.date) : null,
      apphierId: values.apphierId,
    };

    dispatch(saveDraftPartner(dataValue))
      .unwrap()
      .then(() => {
        navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_PARTNER);
      });
  };


  const handleCancelModalConfirm = () => {
    setModalConfirm(false);
  };

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

  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
      setSelectedHierarchy("");
      setListDataAttachment([]);
    } else {
      dispatch(getDetailPartner(id));
    }
  };

  //handle Error
  const handleError = ({ values, errorFields, outOfDate }) => {
    setTabData((prevState) => {
      const res = prevState.map((item) => {
        if (!item.paramValue || item.paramValue.length < 0) {
          return {
            value: item.value,
            paramValue: item.paramValue,
          };
        }
        const errorBadge = errorFields.reduce(
          (current, next) =>
            item.paramValue.includes(next.name[0]) ? current + 1 : current,
          0
        );
        return {
          value: item.value,
          paramValue: item.paramValue,
          errorBadge,
        };
      });
      return res;
    });
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
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_PARTNER,
      breadcrumbName: "Partner",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.CREATE_PARTNER,
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
          setLoadingForm(true);
          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist"
          );
          for (let icon = 0; icon < filterDataAttach.length; icon++) {
            const element = filterDataAttach[icon];
            const body = {
              referensiId: data_detail?.partner?.id,
              files: element.file,
              category: "PARTNER",
              fileCategoryId: element.fileCategoryId,
            };
            await receiptCollectionHttpService.uploadImage(
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
              category: "PARTNER",
            };
            await receiptCollectionHttpService.uploadImage(
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

  return (
    <>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading || loadingForm}>
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
              display: valuePage !== tabData[0].value ? "none" : undefined,
            }}
          >
            <PartnerForm
              form={form}
            />
          </div>
          <div
            style={{
              display: valuePage !== tabData[1].value ? "none" : undefined,
            }}
          >
            <CardContainer header={"APPROVAL INFORMATION"}>
              <ApprovalComponentGeneral
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </CardContainer>
          </div>
          <div
            style={{
              display: valuePage !== tabData[2].value ? "none" : undefined,
            }}
          >
            <CardContainer header={"ATTACHMENT INFORMATION"}>
              <AttachmentComponent
                type={type}
                mandatory
                data={listDataAttachment}
                updateData={setListDataAttachment}
                typeSelector="partner"
                dispatch={dispatch}
                getAPICategory={getListCategory}
                service={receiptCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
                typeRBI={"data"}
              />
            </CardContainer>
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
              className="!bg-[#28a745] !border-[#28a745] hover:!bg-[#218838]"
              isPrimary
              onClick={handleSave}
              loading={loadingSave}
            >
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <ContentModalConfirm
          data={sendBody}
          tabData={tabData}
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

export default ListFormPartner;
