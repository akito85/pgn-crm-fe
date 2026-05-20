import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Spin, Form } from "antd";
import moment from "moment";
import { INVOICE_ROUTES } from "../../../../../routes/invoice/invoice_routes";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { FormStepper, FormFooter } from "../../../../../components/FormStepNavigation";
import SVGIcon from "../../../../../assets/Icon/index";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import ModalBack from "../../../../../components/Modal/ModalBack";
import BaseContainer from "../../../../../components/BaseContainer";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import { configApp } from "../../../../../constants/configApp";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AdjustmentInvoiceSectionForm from "./Form/AdjustmentInvoiceSectionForm";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import { getListCategoryInvoiceAdjustment } from "../../../../../redux/slices/rating_billing_invoice/adjustmentInvoice";
import { getConfigFileRBIData } from "../../../../../redux/slices/attachmentSlice";
import {
  getApprovalHierarchiesInvoiceAdjustment,
  getApprovalHierarchyDetailsInvoiceAdjustment,
  getDetailInvoiceAdjustment,
  getAccountDetailInvoiceAdjustment,
  getBillingPeriodInvoiceAdjustment,
  getInvoiceListInvoiceAdjustment,
  getInvoiceDetailInvoiceAdjustment,
  getListAttachmentInvoiceAdjustment,
  createInvoiceAdjustment,
  updateInvoiceAdjustment,
  uploadAttachmentInvoiceAdjustment,
  clearInvoiceAdjustmentDetail,
  clearAccountDetail,
  clearBillingPeriod,
  clearInvoiceList,
  clearInvoiceDetail,
} from "../../../../../redux/slices/rating_billing_invoice/adjustmentInvoice";

const AdjustmentInvoiceForm = ({ type }) => {
  // Selector
  const {
    loading,
    dataDetail,
    dataListApprovalHierarchy,
    dataListApprovalHierarchyDetail,
    dataListBillingCycle,
    dataListTermOfPayment,
    dataListAttachment,
  } = useSelector((state) => state.adjustmentInvoice);

  // Declaration
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const location = useLocation();
  const { id } = location?.state || {};

  // State
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [bodyData, setBodyData] = useState({});
  const [flag, setFlag] = useState(1);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    {
      title: "Adjustment Invoice",
      paramValue: [
        "accountNumber",
        "billingCycleId",
        "billingPeriod",
        "invoiceNumber",
        "transactionDate",
        "documentDate",
        "typeDueDate",
        "adjustmentReason",
      ],
    },
    { title: "Approval", paramValue: ["apphierId"] },
    { title: "Attachment" },
  ];
  const [loadingForm, setLoadingForm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  const isLoading = loading || loadingForm;

  // Use Effect - Fetch initial data and reset form for create mode
  useEffect(() => {
    dispatch(getApprovalHierarchiesInvoiceAdjustment());

    // Reset form if type is create
    if (type === "create") {
      form.resetFields();
      setSelectedHierarchy(undefined);
      setListDataAttachment([]);
      // Clear all Redux state data
      dispatch(clearAccountDetail());
      dispatch(clearBillingPeriod());
      dispatch(clearInvoiceList());
      dispatch(clearInvoiceDetail());
    }

    return () => {
      dispatch(clearInvoiceAdjustmentDetail());
    };
  }, [dispatch, type, form]);

  // Load data for update
  useEffect(() => {
    const loadUpdateData = async () => {
      if (id && type === "update") {
        setLoadingForm(true);
        try {
          const result = await dispatch(getDetailInvoiceAdjustment(id));

          if (result.payload) {
            const detail = result.payload;

            // Wait for all dependent data to load
            const promises = [];

            // Load account detail
            if (detail.accountNumber) {
              promises.push(
                dispatch(
                  getAccountDetailInvoiceAdjustment(detail.accountNumber),
                ),
              );
            }

            // Load billing period
            if (detail.billingCycleId) {
              promises.push(
                dispatch(
                  getBillingPeriodInvoiceAdjustment(detail.billingCycleId),
                ),
              );
            }

            // Load invoice list
            if (
              detail.accountNumber &&
              detail.billingCycleId &&
              detail.billingPeriode
            ) {
              // Find billing cycle period from id
              const billingCyclePeriod =
                dataListBillingCycle?.find(
                  (cycle) => cycle.id === detail.billingCycleId,
                )?.period || detail.billingCycleId;

              promises.push(
                dispatch(
                  getInvoiceListInvoiceAdjustment({
                    accountNumber: detail.accountNumber,
                    billingCycle: billingCyclePeriod,
                    billingPeriod: detail.billingPeriode,
                  }),
                ),
              );
            }

            // Load invoice detail
            if (detail.invoiceNumber) {
              promises.push(
                dispatch(
                  getInvoiceDetailInvoiceAdjustment(detail.invoiceNumber),
                ),
              );
            }

            // Wait for all data to be loaded
            await Promise.all(promises);

            // Convert typeDueDate from "Fixed" to "Date" for display
            const displayTypeDueDate =
              detail.typeDueDate === "Fixed" ? "Date" : detail.typeDueDate;

            // Set form values after all data is loaded
            form.setFieldsValue({
              accountNumber: detail.accountNumber,
              billingCycleId: detail.billingCycleId,
              billingPeriod: detail.billingPeriode,
              invoiceNumber: detail.invoiceNumber,
              transactionDate: detail.transactionDtm
                ? moment(detail.transactionDtm)
                : null,
              documentDate: detail.documentDate
                ? moment(detail.documentDate)
                : null,
              typeDueDate: displayTypeDueDate,
              dueDate: detail.dueDate ? moment(detail.dueDate) : null,
              termsOfPayment: detail.termsOfPayment,
              adjustmentReason: detail.adjustmentReason,
              remark: detail.remark,
              apphierId: detail.apphierId,
            });

            setSelectedHierarchy(detail.apphierId);
          }
        } catch (error) {
          console.error("Error loading update data:", error);
        } finally {
          setLoadingForm(false);
        }
      }
    };

    loadUpdateData();
  }, [dispatch, id, type, form, dataListBillingCycle]);

  // Load approval hierarchy details
  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getApprovalHierarchyDetailsInvoiceAdjustment(selectedHierarchy));
    }
  }, [dispatch, selectedHierarchy]);

  // Update appHierOptions when dataListApprovalHierarchy changes
  useEffect(() => {
    if (dataListApprovalHierarchy) {
      const options = dataListApprovalHierarchy.map((item) => ({
        value: item.appHierId,
        name: item.approvalName,
      }));
      setAppHierOptions(options);
    }
  }, [dataListApprovalHierarchy]);

  // Update appHierDataDetail when dataListApprovalHierarchyDetail changes
  useEffect(() => {
    if (dataListApprovalHierarchyDetail) {
      setAppHierDataDetail(dataListApprovalHierarchyDetail);
    }
  }, [dataListApprovalHierarchyDetail]);

  // Fetch attachment data when dataDetail is available (for update mode)
  useEffect(() => {
    if (type === "update" && dataDetail?.invAdjustmentId) {
      dispatch(getListAttachmentInvoiceAdjustment(dataDetail.invAdjustmentId));
    }
  }, [dispatch, type, dataDetail?.invAdjustmentId]);

  // Set listDataAttachment from Redux when dataListAttachment changes (for update mode)
  useEffect(() => {
    if (type === "update" && dataListAttachment?.result) {
      const formattedAttachments = dataListAttachment.result.map(
        (attachment) => ({
          ...attachment,
          dataType: "exist",
          urlFile1: `/v1/dbs/api/rbi/invoice-adjustment/download-attachment/${
            attachment.fileId || attachment.id
          }`,
          key: attachment.fileId || attachment.id,
        }),
      );
      setListDataAttachment(formattedAttachments);
    }
  }, [type, dataListAttachment]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Invoice",
    },
    {
      path: INVOICE_ROUTES.ADJUSTMENT_INVOICE_VIEW,
      breadcrumbName: "Adjustment Invoice",
    },
    {
      path:
        type === "create"
          ? INVOICE_ROUTES.ADJUSTMENT_INVOICE_CREATE
          : INVOICE_ROUTES.ADJUSTMENT_INVOICE_UPDATE,
      breadcrumbName:
        type === "create"
          ? "Generate Adjustment Invoice"
          : "Update Adjustment Invoice",
    },
  ];

  // Handle Step Navigation
  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
  };

  // Handle Clear
  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
      setAppHierDataDetail([]);
      setSelectedHierarchy(undefined);
      setListDataAttachment([]);
      setBodyData({});
      // Clear all Redux state data
      dispatch(clearAccountDetail());
      dispatch(clearBillingPeriod());
      dispatch(clearInvoiceList());
      dispatch(clearInvoiceDetail());
    } else {
      // Reset to original values for update
      if (dataDetail) {
        // Convert typeDueDate from "Fixed" to "Date" for display
        const displayTypeDueDate =
          dataDetail.typeDueDate === "Fixed" ? "Date" : dataDetail.typeDueDate;

        form.setFieldsValue({
          accountNumber: dataDetail.accountNumber,
          billingCycleId: dataDetail.billingCycleId,
          billingPeriod: dataDetail.billingPeriode,
          invoiceNumber: dataDetail.invoiceNumber,
          transactionDate: dataDetail.transactionDtm
            ? moment(dataDetail.transactionDtm)
            : null,
          documentDate: dataDetail.documentDate
            ? moment(dataDetail.documentDate)
            : null,
          typeDueDate: displayTypeDueDate,
          dueDate: dataDetail.dueDate ? moment(dataDetail.dueDate) : null,
          termsOfPayment: dataDetail.termsOfPayment,
          adjustmentReason: dataDetail.adjustmentReason,
          remark: dataDetail.remark,
          apphierId: dataDetail.apphierId,
        });
        setSelectedHierarchy(dataDetail.apphierId);
      }
    }
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  const handleRetry = () => {
    handleSave(bodyData);
    setModalError(false);
    setBodyError({});
  };

  // Handle Save Form
  const handleSave = async (formValue) => {
    if (listDataAttachment.length === 0) {
      setCurrentStep(2); // Go to Attachment step
      return;
    }

    // Get all form values directly from form instance (like EFakturCode pattern)
    // This ensures we capture all fields even if not passed in formValue param
    const allFormValues = form.getFieldsValue();

    // Use allFormValues as primary source, formValue as fallback
    const finalValues = { ...allFormValues, ...formValue };

    // Build body based on payload structure
    const body = {
      accountNumber: finalValues.accountNumber,
      billingCycleId: finalValues.billingCycleId?.toString(),
      billingPeriod: finalValues.billingPeriod,
      invoiceNumber: finalValues.invoiceNumber,
      transactionDate: finalValues.transactionDate
        ? moment(finalValues.transactionDate).format("YYYY-MM-DD")
        : null,
      documentDate: finalValues.documentDate
        ? moment(finalValues.documentDate).format("YYYY-MM-DD")
        : null,
      typeDueDate:
        finalValues.typeDueDate === "Date" ? "Fixed" : finalValues.typeDueDate,
      adjustmentReason: finalValues.adjustmentReason,
      remarks: finalValues.remark,
      apphierId: finalValues.apphierId?.toString(),
      isSubmit: flag === 2 ? "Y" : "N",
    };

    // Add dueDate and termsOfPayment based on typeDueDate
    if (finalValues.typeDueDate === "Date") {
      // When type is Date, only send dueDate
      body.dueDate = finalValues.dueDate
        ? moment(finalValues.dueDate).format("YYYY-MM-DD")
        : null;
    } else {
      // When type is Terms of Payment, send both termsOfPayment and calculated dueDate
      body.termsOfPayment = finalValues.termsOfPayment;

      // Priority 1: Use dueDate from form if already calculated (from handleTermsOfPaymentChange)
      if (finalValues.dueDate) {
        body.dueDate = moment(finalValues.dueDate).format("YYYY-MM-DD");
      }
      // Priority 2: Calculate manually if dueDate not in form
      else if (finalValues.documentDate && finalValues.termsOfPayment) {
        // Find the selected terms of payment object to get additionalDays
        const selectedTerms = dataListTermOfPayment?.find(
          (term) => term.description === finalValues.termsOfPayment,
        );

        if (selectedTerms && selectedTerms.additionalDays) {
          // Calculate: documentDate + additionalDays
          const days = parseInt(selectedTerms.additionalDays, 10);
          const calculatedDueDate = moment(finalValues.documentDate).add(
            days,
            "days",
          );
          body.dueDate = calculatedDueDate.format("YYYY-MM-DD");
        } else {
          // Fallback: Extract days from termsOfPayment string
          const daysMatch = finalValues.termsOfPayment.match(/\d+/);
          if (daysMatch) {
            const days = parseInt(daysMatch[0], 10);
            const calculatedDueDate = moment(finalValues.documentDate).add(
              days,
              "days",
            );
            body.dueDate = calculatedDueDate.format("YYYY-MM-DD");
          } else {
            body.dueDate = null;
          }
        }
      } else {
        body.dueDate = null;
      }
    }

    setBodyData(body);

    try {
      setLoadingForm(true);
      let result;
      let invAdjustmentId;

      if (type === "update" && id) {
        result = await dispatch(updateInvoiceAdjustment({ id, body })).unwrap();
        invAdjustmentId = id;
      } else {
        result = await dispatch(createInvoiceAdjustment({ body })).unwrap();
        invAdjustmentId = result?.invAdjustmentId || result?.id;
      }

      // Upload attachments if any
      if (listDataAttachment.length > 0 && invAdjustmentId) {
        await uploadAttachments(invAdjustmentId);
      }

      // Success - modal success will be shown by Redux action
      // User can navigate back manually via modal or back button
    } catch (error) {
      setModalError(true);
      setBodyError({
        message: error?.message || "An error occurred",
      });
    } finally {
      setLoadingForm(false);
    }
  };

  // Upload attachments function
  const uploadAttachments = async (refId) => {
    try {
      // Filter only new attachments that need to be uploaded
      const newAttachments = listDataAttachment.filter(
        (att) => att.dataType === "new",
      );

      // Upload each attachment
      for (const attachment of newAttachments) {
        const formData = new FormData();
        formData.append("category", attachment.fileCategoryId);
        formData.append("files", attachment.file);
        formData.append("refId", refId);

        await dispatch(
          uploadAttachmentInvoiceAdjustment({ formData }),
        ).unwrap();
      }
    } catch (error) {
      console.error("Attachment upload error:", error);
      throw error;
    }
  };

  // Handle Error Tab Form - navigate to first step with error
  const handleError = ({ errorFields }) => {
    if (errorFields && errorFields.length > 0) {
      // Find which step has the first error
      for (let i = 0; i < steps.length; i++) {
        const stepParamValues = steps[i].paramValue || [];
        const hasError = errorFields.some((field) =>
          stepParamValues.includes(field.name[0])
        );
        if (hasError) {
          setCurrentStep(i);
          break;
        }
      }
    }
  };

  return (
    <>
      <Spin spinning={isLoading}>
        <BreadCrumb routes={routes} />
        <FormStepper
          steps={steps}
          current={currentStep}
          onPrev={handlePrevStep}
          onNext={handleNextStep}
        />

        <Form
          layout="vertical"
          form={form}
          onFinish={handleSave}
          onFinishFailed={handleError}
        >
          <div className={`${currentStep !== 0 ? "hidden" : ""}`}>
            <AdjustmentInvoiceSectionForm type={type} form={form} />
          </div>

          <div className={`${currentStep !== 1 ? "hidden" : ""}`}>
            <BaseContainer header={"Approval Information"}>
              <ApprovalComponentGeneral
                type={type}
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
                form={form}
                fieldName="apphierId"
              />
            </BaseContainer>
          </div>

          <div className={`${currentStep !== 2 ? "hidden" : ""}`}>
            <BaseContainer header={"Attachment Information"}>
              <AttachmentComponent
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                dispatch={dispatch}
                getAPICategory={getListCategoryInvoiceAdjustment}
                typeSelector="adjustmentInvoice"
                service={ratingBillingHttpService}
                configApplication={configApp.RATING_BILLING_SERVICE}
                getAPIGuard={getConfigFileRBIData}
                typeRBI={"data"}
                mandatory={true}
                refId={id}
              />
            </BaseContainer>
          </div>

          <FormFooter
            current={currentStep}
            totalSteps={steps.length}
            onPrev={handlePrevStep}
            onNext={handleNextStep}
            onCancel={() => setModalBack(true)}
            onClear={handleClear}
            onSaveDraft={() => {
              setFlag(1);
              form.submit();
            }}
            type={type}
            onSubmit={() => {
              setFlag(2);
              form.submit();
            }}
          />
        </Form>

        {/* Modal Back */}
        <ModalBack
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(INVOICE_ROUTES.ADJUSTMENT_INVOICE_VIEW)}
        />

        {/* Modal Retry */}
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
            <p className="pl-[70px]">{`Your data was not ${
              type === "update"
                ? flag === 1
                  ? "updated"
                  : "submitted"
                : flag === 1
                  ? "created"
                  : "submitted"
            }. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </>
  );
};

export default AdjustmentInvoiceForm;
