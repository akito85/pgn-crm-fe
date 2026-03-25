import { WarningOutlined } from "@ant-design/icons";
import { Form, Spin } from "antd";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import { FormStepper, FormFooter } from "../../../../../components/FormStepNavigation";
import {
  createPayChannelConfig,
  createValidasiPayChannelConfig,
  getAllApprovalListPayChannelConfig,
  getDetailPayChannelConfig,
  getDetailDraftPayChannelConfig,
  getListApprovalByIdPayChannelConfig,
  updatePayChannelConfig,
  saveDraftPayChannelConfig,
  getListMappingDDL,
  getListCategoryPayChannelConfig,
} from "../../../../../redux/slices/receipt_collection/setting";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { dateFormatting } from "../../../../../utils";
import SettingsForm from "./SettingsForm";
import ContentModalConfirm from "./ContentModalConfirm";
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
  { title: "PAYMENT CHANNEL CONFIGURATION", value: "Setting" },
  { title: "APPROVAL", value: "Approval" },
  { title: "ATTACHMENT", value: "Attachment" },
];

const ListFormSettings = (props) => {
  const { type } = props;
  const {
    data_detail,
    dataListAppHierId,
    dataListAppHierDetail,
    loading,
    dataMappingList,
  } = useSelector((state) => state.receiptSetting);

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
  const isSubmittingRef = useRef(false);

  const [tabData, setTabData] = useState([
    {
      value: "Setting",
      paramValue: ["mappingId", "startDate", "endDate", "startHour", "startMinute", "endHour", "endMinute"],
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);

  const valuePage = useMemo(() => steps[current]?.value, [current]);

  useEffect(() => {
    dispatch(getAllApprovalListPayChannelConfig());
    dispatch(getListMappingDDL());
  }, [dispatch]);

  useEffect(() => {
    if (id && type === "update") {
      if (status === "Draft") {
        dispatch(getDetailDraftPayChannelConfig(id));
      } else {
        dispatch(getDetailPayChannelConfig(id));
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
      dispatch(getListApprovalByIdPayChannelConfig({ id: selectedHierarchy }));
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
      const entity = data_detail?.payChannelConfig;
      if (!entity) {
        return;
      }
      const formatCodeName = (code, name) => {
        if (code && name) return `${code} - ${name}`;
        return code || name || "";
      };
      form.setFieldsValue({
        id: entity?.id,
        mappingId: entity?.mappingId,
        partnerCode: formatCodeName(entity?.partnerCode, entity?.partnerName),
        caCode: formatCodeName(entity?.caCode, entity?.collectingAgentName),
        dcCode: formatCodeName(entity?.deliveryChannelCode, entity?.deliveryChannelName),
        type: entity?.type,
        startDate: entity?.startDate ? moment(entity?.startDate).clone() : null,
        endDate: entity?.endDate ? moment(entity?.endDate).clone() : null,
        startHour: entity?.startHour,
        startMinute: entity?.startMinute,
        endHour: entity?.endHour,
        endMinute: entity?.endMinute,
        apphierId: entity?.apphierId,
      });
      setSelectedHierarchy(entity?.apphierId);
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
      mappingId: formValue.mappingId,
      startDate: moment(formValue.startDate).format(dateFormatting.date),
      endDate: formValue.endDate
        ? moment(formValue.endDate).format(dateFormatting.date)
        : null,
      startHour: formValue.startHour,
      startMinute: formValue.startMinute,
      endHour: formValue.endHour,
      endMinute: formValue.endMinute,
      apphierId: formValue.apphierId,
    };

    setSendBody(dataValue);
    const bodyValidasiUpdate = { ...dataValue, id: data_detail?.payChannelConfig?.id };

    if (type !== "update") {
      dispatch(createValidasiPayChannelConfig(dataValue))
        .unwrap()
        .then((data) => {
          if (data?.success !== false) setModalConfirm(true);
        });
    } else {
      dispatch(createValidasiPayChannelConfig(bodyValidasiUpdate))
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
      mappingId: values.mappingId,
      startDate: values.startDate
        ? moment(values.startDate).format(dateFormatting.date)
        : null,
      endDate: values.endDate
        ? moment(values.endDate).format(dateFormatting.date)
        : null,
      startHour: values.startHour,
      startMinute: values.startMinute,
      endHour: values.endHour,
      endMinute: values.endMinute,
      apphierId: values.apphierId,
    };

    dispatch(saveDraftPayChannelConfig(dataValue))
      .unwrap()
      .then(() => {
        navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_SETTINGS);
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
      dispatch(getDetailPayChannelConfig(id));
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
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setLoadingSave(true);
    const successMessage = {
      title: "Successfull",
      description: "Your data has been submitted",
      return: true,
    };

    try {
      if (type === "update") {
        await dispatch(updatePayChannelConfig(sendBody)).unwrap();
        setLoadingForm(true);
        const filterDataAttach = listDataAttachment.filter(
          (item) => item.dataType !== "exist"
        );
        const uploadedFiles = [];
        for (const element of filterDataAttach) {
          const body = {
            referensiId: data_detail?.payChannelConfig?.id,
            files: element.file,
            category: "RECEIPT_SETTING",
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
        const data = await dispatch(createPayChannelConfig(sendBody)).unwrap();
        setLoadingForm(true);
        const uploadedFiles = [];
        for (const element of listDataAttachment) {
          const body = {
            files: element.file,
            fileCategoryId: element.fileCategoryId,
            referensiId: data?.data?.id || data.id,
            category: "RECEIPT_SETTING",
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
      isSubmittingRef.current = false;
      setLoadingSave(false);
    }
  };

  const routes = [
    { path: "", breadcrumbName: "System Setup" },
    { path: "", breadcrumbName: "Master Data" },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_SETTINGS,
      breadcrumbName: "Payment Channel Configuration",
    },
    {
      path: type === "create"
        ? RECEIPT_AND_COLLECTION_ROUTES.CREATE_SETTINGS
        : RECEIPT_AND_COLLECTION_ROUTES.UPDATE_SETTINGS,
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
            <SettingsForm
              form={form}
              dataMappingList={dataMappingList}
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
                typeSelector="receiptSetting"
                dispatch={dispatch}
                getAPICategory={getListCategoryPayChannelConfig}
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
        <ContentModalConfirm
          data={sendBody}
          tabData={tabData}
          listDataAttachment={listDataAttachment}
          listDataAppHierDetail={appHierDataDetail}
          dataOption={appHierOptions}
          selectedHierarchy={selectedHierarchy}
          dataMappingList={dataMappingList}
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

export default ListFormSettings;
