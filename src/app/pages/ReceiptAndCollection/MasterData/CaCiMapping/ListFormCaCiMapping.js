import { WarningOutlined } from "@ant-design/icons";
import { Form, Spin } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import { FormStepper, FormFooter } from "../../../../../components/FormStepNavigation";
import {
  createCaCiMapping,
  createValidasiCaCiMapping,
  getAllApprovalListCaCiMapping,
  getDetailCaCiMapping,
  getDetailDraftCaCiMapping,
  getListApprovalByIdCaCiMapping,
  updateCaCiMapping,
  saveDraftCaCiMapping,
  getTypeDDLCaCiMapping,
  getListPartnerDDL,
  getListCollectingAgentDDL,
  getListDeliveryChannelDDL,
  getListCategoryCaCiMapping,
} from "../../../../../redux/slices/receipt_collection/caCiMapping";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { dateFormatting } from "../../../../../utils";
import CaCiMappingForm from "./CaCiMappingForm";
import ContentModalConfirmCaCiMapping from "./ContentModalConfirmCaCiMapping";
import CardContainer from "../../../../../components/CardContainer";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import {
  showModalSuccess,
} from "../../../../../redux/slices/general_slice";
import { bytesConverter } from "../../../../../utils/bytesConverter";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import { configApp } from "../../../../../constants/configApp";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";

const steps = [
  { title: "PAYMENT CHANNEL CA CI MAPPING", value: "CaCiMapping" },
  { title: "APPROVAL", value: "Approval" },
  { title: "ATTACHMENT", value: "Attachment" },
];

const ListFormCaCiMapping = (props) => {
  const { type } = props;
  const {
    data_detail,
    dataListAppHierId,
    dataListAppHierDetail,
    loading,
    dataType,
    dataPartnerList,
    dataCollectingAgentList,
    dataDeliveryChannelList,
  } = useSelector((state) => state.caCiMapping);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
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
  const [sendBody, setSendBody] = useState();



  const [tabData, setTabData] = useState([
    {
      value: "CaCiMapping",
      paramValue: ["partnerId", "collectingAgentId", "deliveryChannelId", "name", "type", "effStartDate", "effEndDate"],
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);

  const [valuePage, setValuePage] = useState(steps[0].value);

  useEffect(() => {
    setValuePage(steps[current].value);
  }, [current, steps]);

  useEffect(() => {
    dispatch(getAllApprovalListCaCiMapping());
    dispatch(getTypeDDLCaCiMapping());
    dispatch(getListPartnerDDL());
    dispatch(getListCollectingAgentDDL());
    dispatch(getListDeliveryChannelDDL());
  }, [dispatch]);

  useEffect(() => {
    if (id && type === "update") {
      if (status === "Draft") {
        dispatch(getDetailDraftCaCiMapping(id));
      } else {
        dispatch(getDetailCaCiMapping(id));
      }
    }
  }, [dispatch, id, type, status]);

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
      dispatch(getListApprovalByIdCaCiMapping({ id: selectedHierarchy }));
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
    if (id && data_detail) {
      const entity = data_detail?.caCiMapping;
      form.setFieldsValue({
        id: entity?.id,
        partnerId: entity?.partnerId,
        collectingAgentId: entity?.collectingAgentId,
        deliveryChannelId: entity?.deliveryChannelId,
        name: entity?.name,
        type: entity?.type,
        effStartDate: entity?.effStartDate ? moment(entity?.effStartDate).clone() : null,
        effEndDate: entity?.effEndDate ? moment(entity?.effEndDate).clone() : null,
        apphierId: entity?.appHierId,
      });
      setSelectedHierarchy(entity?.appHierId);
      setListDataAttachment(
        (data_detail?.attachmentDtoList || []).map((attachData) => ({
          ...attachData,
          fileSize: bytesConverter(attachData.fileSize || 0),
          dataType: "exist",
        }))
      );
    }
  }, [data_detail, id, form]);

  const next = () => {
    const fieldsToValidate = tabData[current]?.paramValue;
    if (fieldsToValidate) {
      form
        .validateFields(fieldsToValidate)
        .then(() => {
          if (current < steps.length - 1) setCurrent(current + 1);
        })
        .catch((error) => {
          console.log("Validation failed:", error);
        });
    } else {
      if (current < steps.length - 1) setCurrent(current + 1);
    }
  };

  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleSubmitForm = (formValue) => {
    const dataValue = {
      partnerId: formValue.partnerId,
      collectingAgentId: formValue.collectingAgentId,
      deliveryChannelId: formValue.deliveryChannelId,
      name: formValue.name,
      type: formValue.type,
      effStartDate: moment(formValue.effStartDate).format(dateFormatting.date),
      effEndDate: formValue.effEndDate
        ? moment(formValue.effEndDate).format(dateFormatting.date)
        : null,
      apphierId: formValue.apphierId,
    };

    setSendBody(dataValue);
    const bodyValidasiUpdate = { ...dataValue, id: data_detail?.caCiMapping?.id };

    if (type !== "update") {
      dispatch(createValidasiCaCiMapping(dataValue))
        .unwrap()
        .then((data) => {
          if (data?.success !== false) setModalConfirm(true);
        });
    } else {
      dispatch(createValidasiCaCiMapping(bodyValidasiUpdate))
        .unwrap()
        .then((data) => {
          if (data?.success !== false) {
            setModalConfirm(true);
            setSendBody(bodyValidasiUpdate);
          }
        });
    }
  };

  const handleSaveDraft = () => {
    const values = form.getFieldsValue();
    const dataValue = {
      id,
      partnerId: values.partnerId,
      collectingAgentId: values.collectingAgentId,
      deliveryChannelId: values.deliveryChannelId,
      name: values.name,
      type: values.type,
      effStartDate: values.effStartDate
        ? moment(values.effStartDate).format(dateFormatting.date)
        : null,
      effEndDate: values.effEndDate
        ? moment(values.effEndDate).format(dateFormatting.date)
        : null,
      apphierId: values.apphierId,
    };

    dispatch(saveDraftCaCiMapping(dataValue))
      .unwrap()
      .then(() => {
        navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_CA_CI_MAPPING);
      });
  };

  const handleCancelModalConfirm = () => {
    setModalConfirm(false);
  };

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
      dispatch(getDetailCaCiMapping(id));
    }
  };

  const handleError = ({ errorFields }) => {
    setTabData((prevState) => {
      return prevState.map((item) => {
        if (!item.paramValue || item.paramValue.length < 0) return item;
        const errorBadge = errorFields.reduce(
          (current, next) =>
            item.paramValue.includes(next.name[0]) ? current + 1 : current,
          0
        );
        return { ...item, errorBadge };
      });
    });
  };

  const handleSave = async () => {
    setLoadingSave(true);
    const successMessage = {
      title: "Successfull",
      description: "Your data has been submitted",
      return: true,
    };

    try {
      if (type === "update") {
        await dispatch(updateCaCiMapping(sendBody)).unwrap();
        setLoadingForm(true);
        const filterDataAttach = listDataAttachment.filter(
          (item) => item.dataType !== "exist"
        );
        const uploadedFiles = [];
        for (const element of filterDataAttach) {
          const body = {
            referensiId: data_detail?.caCiMapping?.id,
            files: element.file,
            category: "PAYMENT_CHANNEL_CA_CI_MAPPING",
            fileCategoryId: element.fileCategoryId,
          };
          await receiptCollectionHttpService.uploadImage(
            `/v1/dbs/api/attachment/upload/v1`,
            body
          );
          uploadedFiles.push(element);
        }
        setLoadingForm(false);
        handleCancelModalConfirm();
        form.resetFields();
        setSelectedHierarchy("");
        setListDataAttachment([]);
        dispatch(showModalSuccess(successMessage));
        handleClear();
      } else {
        const data = await dispatch(createCaCiMapping(sendBody)).unwrap();
        setLoadingForm(true);
        const uploadedFiles = [];
        for (const element of listDataAttachment) {
          const body = {
            files: element.file,
            fileCategoryId: element.fileCategoryId,
            referensiId: data.id,
            category: "PAYMENT_CHANNEL_CA_CI_MAPPING",
          };
          await receiptCollectionHttpService.uploadImage(
            `/v1/dbs/api/attachment/upload/v1`,
            body
          );
          uploadedFiles.push(element);
        }
        setLoadingForm(false);
        handleCancelModalConfirm();
        handleClear();
        dispatch(showModalSuccess(successMessage));
      }
    } catch (error) {
      console.error("Upload failed, uploaded files:", error);
      setLoadingForm(false);
      setModalConfirm(false);
    } finally {
      setLoadingSave(false);
    }
  };

  const routes = [
    { path: "", breadcrumbName: "System Setup" },
    { path: "", breadcrumbName: "Master Data" },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_CA_CI_MAPPING,
      breadcrumbName: "Payment Channel CA CI Mapping",
    },
    {
      path: type === "create"
        ? RECEIPT_AND_COLLECTION_ROUTES.CREATE_CA_CI_MAPPING
        : RECEIPT_AND_COLLECTION_ROUTES.UPDATE_CA_CI_MAPPING,
      breadcrumbName: type === "create" ? "Create" : "Update",
    },
  ];

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading || loadingForm}>
        <FormStepper steps={steps} current={current} onPrev={prev} onNext={next} />
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmitForm}
          onFinishFailed={handleError}
        >
          <div style={{ display: valuePage !== tabData[0].value ? "none" : undefined }}>
            <CaCiMappingForm
              form={form}
              dataPartnerList={dataPartnerList}
              dataCollectingAgentList={dataCollectingAgentList}
              dataDeliveryChannelList={dataDeliveryChannelList}
              dataType={dataType}
            />
          </div>
          <div style={{ display: valuePage !== tabData[1].value ? "none" : undefined }}>
            <CardContainer header="APPROVAL INFORMATION">
              <ApprovalComponentGeneral
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </CardContainer>
          </div>
          <div style={{ display: valuePage !== tabData[2].value ? "none" : undefined }}>
            <CardContainer header="ATTACHMENT INFORMATION">
              <AttachmentComponent
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                typeSelector="caCiMapping"
                dispatch={dispatch}
                getAPICategory={getListCategoryCaCiMapping}
                service={receiptCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
                typeRBI="data"
                mandatory
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
        header="Confirmation"
        width={1000}
        type="confirmation"
        footer={
          <div className="w-full flex justify-between gap-5 p-4">
            <ButtonComponent onClick={handleCancelModalConfirm} type="default">
              Cancel
            </ButtonComponent>
            <ButtonComponent
              className="!bg-[#28a745] !border-[#28a745] hover:!bg-[#218838]"
              isPrimary
              onClick={handleSave}
              loading={loadingSave || loadingForm}
              disabled={loadingSave || loadingForm}
            >
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <ContentModalConfirmCaCiMapping
          data={sendBody}
          tabData={tabData}
          listDataAttachment={listDataAttachment}
          listDataAppHierDetail={appHierDataDetail}
          dataOption={appHierOptions}
          selectedHierarchy={selectedHierarchy}
          dataPartnerList={dataPartnerList}
          dataCollectingAgentList={dataCollectingAgentList}
          dataDeliveryChannelList={dataDeliveryChannelList}
        />
      </ModalCustom>

      <ModalConfirm
        isOpen={modalBack}
        handleCancel={() => setModalBack(false)}
        handleOk={() => navigate(-1)}
        width={600}
      >
        <div className="flex justify-center mt-5 gap-[20px]">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <p className="text-[18px] font-bold">Are you sure you want to go back?</p>
        </div>
      </ModalConfirm>
    </LayoutMenu>
  );
};

export default ListFormCaCiMapping;
