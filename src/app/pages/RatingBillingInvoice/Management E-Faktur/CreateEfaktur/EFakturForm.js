import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Spin, Form } from "antd";
import moment from "moment";
import {
  LeftOutlined,
  RightOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import { INVOICE_ROUTES } from "../../../../../routes/invoice/invoice_routes";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import EFakturSectionForm from "./EFakturSectionForm ";
import ConfirmationLayout from "./ConfirmationLayout";
import { dateFormatting } from "../../../../../utils";
import {
  ModalError,
  ModalConfirm,
} from "../../../../../components/Modal/ModalPopUp";
import ModalCustom from "../../../../../components/Modal/ModalCustom"; // ✅ DITAMBAHKAN
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import { configApp } from "../../../../../constants/configApp";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import CardContainer from "../../../../../components/CardContainer";
import { FormStepper } from "../../../../../components/FormStepNavigation";
import {
  createEFakturManual,
  getAllApprovalList,
  getListApprovalById,
  getListCategory,
} from "../../../../../redux/slices/rating_billing_invoice/efakturSlice";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import { getConfigFileRBIData } from "../../../../../redux/slices/attachmentSlice";

const EFakturForm = ({ type }) => {
  // Selector
  const { loading, data_approval_list, data_approval } = useSelector(
    (state) => state.efaktur,
  );

  // Declaration
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const location = useLocation();

  // State
  const [current, setCurrent] = useState(0);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [listDataDetail, setListDataDetail] = useState([]);
  const [bodyData, setBodyData] = useState({});
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [typeSubmit, setTypeSubmit] = useState(false);
  const [tabPages, setTabPages] = useState([
    {
      value: "Create-Faktur",
      paramValue: [
        "fakturType",
        "fakturDate",
        "taxPeriod",
        "fakturCode",
        "taxYear",
        "country",
        "description",
        "customerName",
        "email",
        "taxIdentificationNumber",
        "nitku",
        "customerAddress",
        "downPayment",
      ],
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);
  const [loadingForm, setLoadingForm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false); // ✅ ini yang dipakai untuk ModalCustom
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  const isLoading = loading || loadingForm;

  const steps = [
    { title: "CREATE E-FAKTUR", value: "Create-Faktur" },
    { title: "APPROVAL", value: "Approval" },
    { title: "ATTACHMENT", value: "Attachment" },
  ];

  const [valuePage, setValuePage] = useState(steps[0].value);

  useEffect(() => {
    setValuePage(steps[current].value);
  }, [current]);

  const next = () => {
    const fieldsToValidate = tabPages[current]?.paramValue;
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

  // Use Effect
  useEffect(() => {
    dispatch(getAllApprovalList());
  }, [dispatch]);

  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getListApprovalById(selectedHierarchy));
    }
  }, [dispatch, selectedHierarchy]);

  useEffect(() => {
    if (data_approval_list && data_approval_list.length > 0) {
      const data = data_approval_list.map((a, index) => ({
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
  }, [data_approval_list]);

  useEffect(() => {
    if (data_approval && data_approval.length > 0) {
      const tempAppHier = data_approval.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
      setAppHierOptions(tempAppHier);
    }
  }, [data_approval]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Invoice",
    },
    {
      path: INVOICE_ROUTES.EFAKTUR_VIEW,
      breadcrumbName: "E-Faktur Management",
    },
    {
      path: INVOICE_ROUTES.EFAKTUR_CREATE,
      breadcrumbName: "Create E-Faktur",
    },
  ];

  // Handle Clear
  const handleClear = () => {
    form.resetFields();
    setAppHierDataDetail([]);
    setSelectedHierarchy(undefined);
    setListDataAttachment([]);
    setListDataDetail([]);
    setBodyData({});
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  const handleRetry = () => {
    setModalError(false);
    setBodyError({});
    if (bodyData && Object.keys(bodyData).length > 0) {
      handleConfirm();
    }
  };

  const handleMandatory = (
    setListSectionInfo = () => {},
    listDataAttachment,
    errorFields,
  ) => {
    setListSectionInfo((prevState) => {
      const res = prevState.map((item) => {
        const errorBadge =
          item.value !== "Attachment"
            ? (errorFields || []).reduce(
                (current, next) =>
                  item.paramValue.includes(next.name[0])
                    ? current + 1
                    : current,
                0,
              )
            : listDataAttachment.length < 1
              ? 1
              : 0;
        return {
          value: item.value,
          paramValue: item.paramValue,
          errorBadge,
        };
      });
      return res;
    });
  };

  // Handle Save Form
  const handleSave = (formValue) => {
    let errorBody = {};

    if (listDataAttachment.length === 0) {
      errorBody = {
        title: "Failed",
        message: "Attachment is mandatory. Please upload at least one file.",
      };
      setBodyError(errorBody);
      setModalError(true);
      handleMandatory(setTabPages, listDataAttachment);
      return;
    }

    if (listDataDetail.length === 0) {
      errorBody = {
        title: "Failed",
        message: "Detail Transaction is mandatory. Please insert data.",
      };
      setBodyError(errorBody);
      setModalError(true);
      handleMandatory(setTabPages, listDataAttachment);
      return;
    }

    const invalidItems = listDataDetail.filter((item) => {
      const isValid =
        item.type && item.productCode && item.productName && item.uom;
      return !isValid;
    });

    if (invalidItems.length > 0) {
      errorBody = {
        title: "Failed",
        message: `${invalidItems.length} detail transaction(s) have missing required fields. Please complete all fields.`,
      };
      setBodyError(errorBody);
      setModalError(true);
      return;
    }

    setBodyData({
      ...formValue,
    });
    setModalConfirm(true); // ✅ buka ModalCustom confirmation

    setTabPages([
      {
        value: "Create-Faktur",
        paramValue: [
          "fakturType",
          "fakturDate",
          "taxPeriod",
          "fakturCode",
          "taxYear",
          "country",
          "description",
          "customerName",
          "email",
          "taxIdentificationNumber",
          "nitku",
          "customerAddress",
          "downPayment",
        ],
      },
      { value: "Approval", paramValue: ["apphierId"] },
      { value: "Attachment" },
    ]);
  };

  // Handle Confirm
  const handleConfirm = () => {
    setModalConfirm(false);

    if (!listDataDetail || listDataDetail.length === 0) {
      setBodyError({
        title: "Failed",
        message: "Detail Transaction is required",
      });
      setModalError(true);
      return;
    }

    const detailsItems = listDataDetail.map((item) => {
      const transformed = {
        type: item.type || "",
        code: item.productCode || "",
        name: item.productName || "",
        uomCode: item.uom || "",
        unitPrice: String(item.unitPrice || 0),
        qty: String(item.quantity || 0),
        ppnRate: String(item.vatRate || 0),
        ppnbmRate: String(item.ppnbmRate || 0),
      };
      return transformed;
    });

    const body = {
      apphierId: String(bodyData.apphierId),
      fakturType: bodyData.fakturType,
      fakturDate: moment(bodyData.fakturDate).format("YYYY-MM-DD"),
      fakturKode: bodyData.fakturCode,
      taxPeriod: String(bodyData.taxPeriod),
      taxYear: String(bodyData.taxYear),
      country: bodyData.country,
      desc: bodyData.description || "",
      customerName: bodyData.customerName,
      customerEmail: bodyData.email,
      customerTin: bodyData.taxIdentificationNumber,
      customerNitku: bodyData.nitku,
      customerAddress: bodyData.customerAddress,
      downPaymentAmount: String(bodyData.downPayment || 0),
      isDraft: !typeSubmit,
      detailsItems: detailsItems,
    };

    dispatch(createEFakturManual({ body }))
      .unwrap()
      .then(async (dataForm) => {
        const efakturId = dataForm.created_id;

        if (efakturId && listDataAttachment.length > 0) {
          setLoadingForm(true);

          let uploadSuccess = 0;
          let uploadFailed = 0;

          for (let i = 0; i < listDataAttachment.length; i++) {
            const element = listDataAttachment[i];

            try {
              const formData = new FormData();
              formData.append("files", element.file);
              formData.append("refId", String(efakturId));
              formData.append("categoryId", String(element.fileCategoryId));

              const response = await ratingBillingHttpService.uploadAttachment(
                `/v1/dbs/api/rbi/e-invoice/upload-attachment`,
                formData,
              );

              if (response.success) {
                uploadSuccess++;
              } else {
                uploadFailed++;
              }
            } catch (uploadError) {
              console.error(
                `Error uploading attachment ${i + 1}:`,
                uploadError,
              );
              uploadFailed++;
            }
          }

          setLoadingForm(false);
        }

        setModalConfirm(false);
        handleClear();
        navigate(INVOICE_ROUTES.EFAKTUR_VIEW);
      })
      .catch((error) => {
        setLoadingForm(false);

        const message =
          error.response?.data?.message || error.message || error.toString();
        setBodyError({
          title: "Failed",
          message,
        });
        setModalError(true);
      });
  };

  // Handle Error Tab Form
  const handleError = ({ values, errorFields, outOfDate }) => {
    handleMandatory(setTabPages, listDataAttachment, errorFields);
  };

  return (
    <LayoutMenu>
      <Spin spinning={isLoading}>
        <BreadCrumb routes={routes} />

        <FormStepper
          steps={steps}
          current={current}
          onPrev={prev}
          onNext={next}
        />

        <Form
          layout="vertical"
          form={form}
          onFinish={handleSave}
          onFinishFailed={handleError}
        >
          {/* Step 1: Create E-Faktur */}
          <div
            style={{
              display: valuePage !== tabPages[0].value ? "none" : undefined,
            }}
          >
            <EFakturSectionForm
              type={type}
              form={form}
              listDataDetail={listDataDetail}
              setListDataDetail={setListDataDetail}
            />
          </div>

          {/* Step 2: Approval */}
          <div
            style={{
              display: valuePage !== tabPages[1].value ? "none" : undefined,
            }}
          >
            <CardContainer subHeader={"Approval Information"}>
              <ApprovalComponentGeneral
                type={type}
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </CardContainer>
          </div>

          {/* Step 3: Attachment */}
          <div
            style={{
              display: valuePage !== tabPages[2].value ? "none" : undefined,
            }}
          >
            <CardContainer subHeader={"Attachment Information"}>
              <AttachmentComponent
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                dispatch={dispatch}
                getAPICategory={getListCategory}
                typeSelector="efaktur"
                service={ratingBillingHttpService}
                configApplication={configApp.INVOICE_SERVICE}
                getAPIGuard={getConfigFileRBIData}
                typeRBI={"data"}
                mandatory={true}
              />
            </CardContainer>
          </div>

          {/* Footer Buttons */}
          <div className="w-full flex justify-between mt-10">
            <div className="flex">
              <ButtonComponent
                type={"submit"}
                onClick={() => setModalBack(true)}
                icon={<LeftOutlined style={{ color: "#fff", fontSize: 24 }} />}
              >
                Back
              </ButtonComponent>
            </div>

            <div className="flex gap-5">
              {current > 0 && (
                <ButtonComponent
                  onClick={prev}
                  type={"default"}
                  icon={
                    <LeftOutlined style={{ color: "#1890ff", fontSize: 24 }} />
                  }
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#1890ff",
                    color: "#1890ff",
                  }}
                >
                  Previous
                </ButtonComponent>
              )}

              <Form.Item>
                <ButtonComponent
                  icon={
                    <SVGIcon
                      name="IconButtonClear"
                      width={24}
                      color={"#FFFFFF"}
                    />
                  }
                  type="submit"
                  onClick={handleClear}
                >
                  Clear
                </ButtonComponent>
              </Form.Item>

              {current < steps.length - 1 && (
                <ButtonComponent
                  onClick={next}
                  type={"submit"}
                  icon={
                    <RightOutlined style={{ color: "#fff", fontSize: 18 }} />
                  }
                >
                  Next
                </ButtonComponent>
              )}

              {current === steps.length - 1 && (
                <>
                  <Form.Item>
                    <ButtonComponent
                      type="submit"
                      htmlType={"submit"}
                      onClick={() => setTypeSubmit(false)}
                    >
                      Save As Draft
                    </ButtonComponent>
                  </Form.Item>
                  <Form.Item>
                    <ButtonComponent
                      type="submit"
                      htmlType={"submit"}
                      onClick={() => setTypeSubmit(true)}
                    >
                      Save & Submit
                    </ButtonComponent>
                  </Form.Item>
                </>
              )}
            </div>
          </div>
        </Form>

        {/* ✅ Modal Confirmation — menggunakan ModalCustom seperti prabilling */}
        <ModalCustom
          isOpen={modalConfirm}
          handleCancel={() => setModalConfirm(false)}
          header={"CONFIRMATION"}
          width={900}
          type={"confirmation"}
          loading={isLoading}
          footer={
            <div className={"flex w-full justify-end gap-2 mb-5"}>
              <ButtonComponent
                onClick={() => setModalConfirm(false)}
                disabled={isLoading}
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent
                type={"submit"}
                onClick={handleConfirm}
                isLoading={isLoading}
                disabled={isLoading}
              >
                Confirm
              </ButtonComponent>
            </div>
          }
        >
          <ConfirmationLayout
            data={bodyData}                          // ✅ bodyData = data form yang sudah diisi
            listDataAppHierDetail={appHierDataDetail} // ✅ state yang sudah ada
            listDataAttachment={listDataAttachment}   // ✅ state yang sudah ada
            listDataDetail={listDataDetail}           // ✅ state yang sudah ada
            selectedHierarchy={selectedHierarchy}     // ✅ state yang sudah ada
            dataOption={appHierOptions}               // ✅ state yang sudah ada
          />
        </ModalCustom>

        {/* Modal Back */}
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

        {/* Modal Error */}
        <ModalError
          isOpen={modalError}
          handleOk={handleRetry}
          handleCancel={handleCloseModalError}
          customText={"Try Again"}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{`Your data was not created. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </LayoutMenu>
  );
};

export default EFakturForm;