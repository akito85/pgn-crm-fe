import { WarningOutlined } from "@ant-design/icons";
import { Form, Spin } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import { FormStepper, FormFooter } from "../../../../../components/FormStepNavigation";
import {
  createPartner,
  createValidasiPartner,
  getAllApprovalList,
  getDetailPartner,
  getListApprovalById,
  getListCategory,
  updatePartner,
  getPartnerList,
  getCollectionAgentList,
  getBankListDDL,
  saveDraftPartnerCa,
} from "../../../../../redux/slices/receipt_collection/partnerCa";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { dateFormatting } from "../../../../../utils";
import PartnerCaForm from "./PartnerCaForm";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import CardContainer from "../../../../../components/CardContainer";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ContentModalConfirm from "./ContentModalConfirm";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import {
  showModalSuccess,
} from "../../../../../redux/slices/general_slice";
import { bytesConverter } from "../../../../../utils/bytesConverter";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import { configApp } from "../../../../../constants/configApp";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";

const steps = [
  { title: "CREATE", value: "Create", paramValue: ["partnerId", "collectingAgentId", "settlementBankId", "startDate"] },
  { title: "APPROVAL", value: "Approval", paramValue: ["apphierId"] },
  { title: "ATTACHMENT", value: "Attachment" },
];

const ListFormPartnerCa = (props) => {
  const { type } = props;
  const {
    data_detail,
    dataListAppHierId,
    dataListAppHierDetail,
    loading,
    dataPartner,
    dataCollectionAgent,
    dataBankList,
  } = useSelector((state) => state.partnerCa);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const location = useLocation();
  const { id } = location?.state || {};
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [loadingForm, setLoadingForm] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [current, setCurrent] = useState(0);
  const [sendBody, setSendBody] = useState();
  const [valuePage, setValuePage] = useState(steps[0].value);

  useEffect(() => {
    setValuePage(steps[current].value);
  }, [current]);

  useEffect(() => {
    dispatch(getAllApprovalList());
    dispatch(getPartnerList());
    dispatch(getCollectionAgentList());
    dispatch(getBankListDDL());
  }, [dispatch]);

  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailPartner(id));
    }
  }, [dispatch, id, type]);

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
        employeeDetail: a.employeeDetail.map((b, idx) => ({ ...b, key: idx + 1 })),
      }));
      setAppHierDataDetail(data);
    } else {
      setAppHierDataDetail([]);
    }
  }, [dataListAppHierDetail]);

  useEffect(() => {
    if (id && data_detail) {
      const entity = data_detail?.partnerCaMapping;
      form.setFieldsValue({
        id: entity?.id,
        partnerId: entity?.partnerId,
        collectingAgentId: entity?.collectingAgentId,
        settlementBankId: entity?.settlementBankId,
        startDate: entity?.startDate ? moment(entity?.startDate).clone() : null,
        endDate: entity?.endDate ? moment(entity?.endDate).clone() : null,
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
    const fieldsToValidate = steps[current]?.paramValue;
    if (fieldsToValidate) {
      form.validateFields(fieldsToValidate)
        .then(() => { if (current < steps.length - 1) setCurrent(current + 1); })
        .catch((error) => { console.log("Validation failed:", error); });
    } else if (current < steps.length - 1) {
      setCurrent(current + 1);
    }
  };

  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleSubmitForm = (formValue) => {
    const dataValue = {
      partnerId: formValue.partnerId,
      collectingAgentId: formValue.collectingAgentId,
      settlementBankId: formValue.settlementBankId,
      startDate: moment(formValue.startDate).format(dateFormatting.date),
      endDate: formValue.endDate
        ? moment(formValue.endDate).format(dateFormatting.date)
        : null,
      apphierId: formValue.apphierId,
    };

    setSendBody(dataValue);
    const bodyValidasiUpdate = { ...dataValue, id: data_detail?.partnerCaMapping?.id };

    if (type === "update") {
      dispatch(createValidasiPartner(bodyValidasiUpdate))
        .unwrap()
        .then((data) => {
          if (data?.success !== false) {
            setModalConfirm(true);
            setSendBody(bodyValidasiUpdate);
          }
        });
    } else {
      dispatch(createValidasiPartner(dataValue))
        .unwrap()
        .then((data) => { if (data?.success !== false) setModalConfirm(true); });
    }
  };

  const handleSaveDraft = () => {
    const values = form.getFieldsValue();
    const dataValue = {
      id,
      partnerId: values.partnerId,
      collectingAgentId: values.collectingAgentId,
      settlementBankId: values.settlementBankId,
      startDate: values.startDate
        ? moment(values.startDate).format(dateFormatting.date)
        : null,
      endDate: values.endDate
        ? moment(values.endDate).format(dateFormatting.date)
        : null,
      apphierId: values.apphierId,
    };
    dispatch(saveDraftPartnerCa(dataValue))
      .unwrap()
      .then(() => { navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_PARTNER_CA); });
  };

  const handleCancelModalConfirm = () => { setModalConfirm(false); };

  const handleBack = () => {
    const values = form.getFieldsValue();
    if (values === null || Object.keys(values).length === 0) {
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

  const handleError = ({ errorFields }) => {
    console.log("Validation Failed:", errorFields);
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
        await dispatch(updatePartner(sendBody)).unwrap();
        setLoadingForm(true);
        try {
          const filterDataAttach = listDataAttachment.filter((item) => item.dataType !== "exist");
          for (const element of filterDataAttach) {
            try {
              const body = {
                referensiId: data_detail?.partnerCaMapping?.id,
                files: element.file,
                category: "PARTNER_CA",
                fileCategoryId: element.fileCategoryId,
              };
              await receiptCollectionHttpService.uploadImage(`/v1/dbs/api/attachment/upload/v1`, body);
            } catch (uploadError) {
              console.error(`Failed to upload file ${element.fileName ?? "attachment"}:`, uploadError);
            }
          }
        } finally {
          setLoadingForm(false);
        }
        handleCancelModalConfirm();
        form.resetFields();
        setSelectedHierarchy("");
        setListDataAttachment([]);
        dispatch(showModalSuccess(successMessage));
        handleClear();
      } else {
        const data = await dispatch(createPartner(sendBody)).unwrap();
        setLoadingForm(true);
        try {
          for (const element of listDataAttachment) {
            try {
              const body = {
                files: element.file,
                fileCategoryId: element.fileCategoryId,
                referensiId: data.id,
                category: "PARTNER_CA",
              };
              await receiptCollectionHttpService.uploadImage(`/v1/dbs/api/attachment/upload/v1`, body);
            } catch (uploadError) {
              console.error(`Failed to upload file ${element.fileName ?? "attachment"}:`, uploadError);
            }
          }
        } finally {
          setLoadingForm(false);
        }
        handleCancelModalConfirm();
        handleClear();
        dispatch(showModalSuccess(successMessage));
      }
    } catch (error) {
      console.error("Upload failed:", error);
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
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_PARTNER_CA,
      breadcrumbName: "Partner Collecting Agent Mapping",
    },
    {
      path: type === "create"
        ? RECEIPT_AND_COLLECTION_ROUTES.CREATE_PARTNER_CA
        : RECEIPT_AND_COLLECTION_ROUTES.UPDATE_PARTNER_CA,
      breadcrumbName: type === "create" ? "Create" : "Update",
    },
  ];

  return (
    <>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading || loadingForm}>
        <FormStepper steps={steps} current={current} onPrev={prev} onNext={next} />
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmitForm}
          onFinishFailed={handleError}
        >
          <div style={{ display: valuePage === steps[0].value ? undefined : "none" }}>
            <PartnerCaForm
              form={form}
              dataPartner={dataPartner}
              dataCollectionAgent={dataCollectionAgent}
              dataBankList={dataBankList}
            />
          </div>
          <div style={{ display: valuePage === steps[1].value ? undefined : "none" }}>
            <CardContainer header="APPROVAL INFORMATION">
              <ApprovalComponentGeneral
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </CardContainer>
          </div>
          <div style={{ display: valuePage === steps[2].value ? undefined : "none" }}>
            <CardContainer header="ATTACHMENT INFORMATION">
              <AttachmentComponent
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                typeSelector="partnerCa"
                dispatch={dispatch}
                getAPICategory={getListCategory}
                service={receiptCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
                typeRBI="data"
                mandatory={true}
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
          tabData={steps}
          listDataAttachment={listDataAttachment}
          listDataAppHierDetail={appHierDataDetail}
          dataOption={appHierOptions}
          selectedHierarchy={selectedHierarchy}
          dataPartner={dataPartner}
          dataCollectionAgent={dataCollectionAgent}
          dataBankList={dataBankList}
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
    </>
  );
};

ListFormPartnerCa.propTypes = {
  type: PropTypes.string,
};

export default ListFormPartnerCa;
