import {
  WarningOutlined,
} from "@ant-design/icons";
import { Form, Spin } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import { FormStepper, FormFooter } from "../../../../../components/FormStepNavigation";
import {
  createPaymentWarrantyPartner,
  updatePaymentWarrantyPartner,
  saveDraftPaymentWarrantyPartner,
  getDetailPaymentWarrantyPartner,
  getAllApprovalList,
  getListApprovalById,
  getListCategory,
} from "../../../../../redux/slices/receipt_collection/paymentWarrantyPartner";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import PaymentWarrantyPartnerForm from "./PaymentWarrantyPartnerForm";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import BaseContainer from "../../../../../components/BaseContainer";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ContentModalConfirm from "./ContentModalConfirm";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import {
  showModalError,
  showModalSuccess,
} from "../../../../../redux/slices/general_slice";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import { configApp } from "../../../../../constants/configApp";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import { bytesConverter } from "../../../../../utils/bytesConverter";

const ListFormPaymentWarrantyPartner = (props) => {
  const { type } = props;
  const {
    data_detail,
    dataListAppHierId,
    dataListAppHierDetail,
    loading,
    dataType,
  } = useSelector((state) => state.paymentWarrantyPartner);

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
  const [loadingSave, setLoadingSave] = useState(false);
  const [current, setCurrent] = useState(0);

  const steps = [
    { title: "CREATE", value: "Partner" },
    { title: "APPROVAL", value: "Approval" },
    { title: "ATTACHMENT", value: "Attachment" },
  ];

  useEffect(() => {
    if (id && type === "update") {
        dispatch(getDetailPaymentWarrantyPartner(id));
    }
  }, [dispatch, id, type]);

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
    if (id && data_detail) {
      const partner = data_detail?.partner || {};
      const formattedData = {
        ...partner,
        apphierId: partner.appHierId,
        address: {
          street: partner.streetName,
          building: partner.building,
          addressNum: partner.addressNum,
          district: partner.district,
          city: partner.city,
          province: partner.province,
          country: partner.country,
          zipCode: partner.zipCode,
        },
        contact: {
          contactPerson: partner.contactPerson,
          phoneNum: partner.phoneNum,
          email: partner.email,
        }
      };
      
      form.setFieldsValue(formattedData);
      setSelectedHierarchy(partner?.appHierId);
      setListDataAttachment(
        (data_detail?.attachmentDtoList || []).map((attachData) => ({
          ...attachData,
          fileSize: bytesConverter(attachData.fileSize || 0),
          dataType: "exist",
        }))
      );
    }
  }, [data_detail, id, form]);

  const [tabData] = useState([
    {
      value: "Partner", 
      paramValue: [
        "partnerName", "partnerType", "swiftCode", "npwp", "licenseNum", "parentId",
        ["address", "street"], ["address", "building"], ["address", "addressNum"], ["address", "district"], 
        ["address", "city"], ["address", "province"], ["address", "country"], ["address", "zipCode"],
        ["contact", "contactPerson"], ["contact", "phoneNum"], ["contact", "email"]
      ]
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);

  const [sendBody, setSendBody] = useState();

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

  const handleSubmitForm = (formValue) => {
    if (listDataAttachment.length === 0) {
      dispatch(showModalError({
        title: "Warning",
        description: "Attachment is mandatory. Please upload at least one file.",
        return: false
      }));
      return;
    }
    const dataValue = {
      ...formValue,
      appHierId: selectedHierarchy,
      attachmentIds: listDataAttachment.filter(a => a.dataType === 'exist').map(a => a.id)
    };
    if (id) dataValue.id = id;
    setSendBody(dataValue);
    setModalConfirm(true);
  };

  const handleSaveDraft = () => {
    const values = form.getFieldsValue();
    const dataValue = {
      ...values,
      id: id,
    };
    dispatch(saveDraftPaymentWarrantyPartner(dataValue))
      .unwrap()
      .then(() => {
        navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_PAYMENT_WARRANTY_PARTNER);
      });
  };

  const handleBack = () => {
    if (Object.keys(form.getFieldsValue()).length === 0) {
      navigate(-1);
    } else {
      setModalBack(true);
    }
  };

  const handleClear = () => {
    form.resetFields();
    setSelectedHierarchy("");
    setListDataAttachment([]);
  };

  const handleSave = async () => {
    setLoadingSave(true);
    const successMessage = {
      title: "Successfull",
      description: `Your data has been submitted`,
      return: false,
    };

    const action = type === "update" ? updatePaymentWarrantyPartner : createPaymentWarrantyPartner;

    dispatch(action(sendBody))
      .unwrap()
      .then(async (res) => {
        const referensiId = res.id || id;
        const newAttachments = listDataAttachment.filter(item => item.dataType !== "exist");
        
        for (const element of newAttachments) {
          const body = {
            referensiId: referensiId,
            files: element.file,
            category: "PAYMENT_WARRANTY_PARTNER",
            fileCategoryId: element.fileCategoryId,
          };
          await receiptCollectionHttpService.uploadImage(`/v1/dbs/api/attachment/upload/v1`, body);
        }

        setModalConfirm(false);
        dispatch(showModalSuccess(successMessage));
        navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_PAYMENT_WARRANTY_PARTNER);
      })
      .catch((error) => {
        setLoadingSave(false);
        setModalConfirm(false);
      });
  };

  const routes = [
    { path: "", breadcrumbName: "Receipt & Collection" },
    { path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_PAYMENT_WARRANTY_PARTNER, breadcrumbName: "Payment Warranty Partner" },
    { path: "", breadcrumbName: `${type === "create" ? "Create" : "Update"}` },
  ];

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading}>
        <FormStepper steps={steps} current={current} onPrev={prev} onNext={next} />
        <Form layout="vertical" form={form} onFinish={handleSubmitForm}>
          <div style={{ display: current !== 0 ? "none" : undefined }}>
            <PaymentWarrantyPartnerForm dataType={dataType} form={form} />
          </div>
          <div style={{ display: current !== 1 ? "none" : undefined }}>
            <BaseContainer header={"APPROVAL INFORMATION"}>
              <ApprovalComponentGeneral
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </BaseContainer>
          </div>
          <div style={{ display: current !== 2 ? "none" : undefined }}>
            <BaseContainer header={"ATTACHMENT INFORMATION"}>
              <AttachmentComponent
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                typeSelector="paymentWarrantyPartner"
                dispatch={dispatch}
                getAPICategory={getListCategory}
                service={receiptCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
                typeRBI={"data"}
                mandatory={true}
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
        handleCancel={() => setModalConfirm(false)}
        header={"Confirmation"}
        width={1000}
        type={"confirmation"}
        footer={
          <div className="w-full flex justify-between gap-5 p-4">
            <ButtonComponent onClick={() => setModalConfirm(false)} type="default">Cancel</ButtonComponent>
            <ButtonComponent isPrimary onClick={handleSave} loading={loadingSave}>Confirm</ButtonComponent>
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

      <ModalConfirm
        isOpen={modalBack}
        handleCancel={() => setModalBack(false)}
        handleOk={() => navigate(-1)}
        width={600}
      >
        <div className="flex justify-center mt-5 gap-[20px]">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <p className="text-[18px] font-bold">Are you sure you want to back?</p>
        </div>
      </ModalConfirm>
    </LayoutMenu>
  );
};

export default ListFormPaymentWarrantyPartner;
