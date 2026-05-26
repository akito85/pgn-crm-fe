import React, { useCallback, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { Form, Spin, message, Modal } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { WarningOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { FormStepper, FormFooter } from "../../../../components/FormStepNavigation";
import CardContainer from "../../../../components/CardContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import { ModalConfirm } from "../../../../components/Modal/ModalPopUp";
import ApprovalComponentGeneral from "../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import receiptCollectionHttpService from "../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../constants/configApp";
import ConfirmationException from "./_components/ConfirmationException";
import {
  showModalError,
  showModalSuccess,
} from "../../../../redux/slices/general_slice";
import {
  getAllApprovalListException,
  getListApprovalByIdException,
  getListCategory,
  getBillingCycleList,
  getBillingPeriodList,
  getActivityList,
  getCriteriaOptionsList,
  searchAccountForException,
  searchAccountByCriteriaForException,
  createValidasiException,
  createException,
  updateException,
  getExceptionDetailByHeaderId,
  resetBillingPeriod,
  checkDuplicateException,
} from "../../../../redux/slices/receipt_collection/exceptionSlice";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../routes/Receipt&Collection/rc_routes";
import ExceptionCreate from "./ExceptionCreate";

const ExceptionForm = ({ type }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const idException = location?.state?.id;

  const {
    loading,
    dataListAppHierId,
    dataListAppHierDetail,
    dataBillingCycle,
    dataBillingPeriod,
    dataActivity,
    dataCriteriaOptions,
    dataAccountSearch,
    data_detail,
  } = useSelector((state) => state.exception);

  const initializedRef = useRef(false);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [modalBack, setModalBack] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);

  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [criteriaData, setCriteriaData] = useState([]);

  const [selectedHierarchy, setSelectedHierarchy] = useState(null);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);

  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState([]);
  const [initialAttachmentIds, setInitialAttachmentIds] = useState([]);

  const [modalConfirm, setModalConfirm] = useState(false);
  const [kirimBody, setKirimBody] = useState({});

  const stepTitleMap = { create: "CREATE", update: "UPDATE" };
  const steps = [
    { title: stepTitleMap[type] || type?.toUpperCase() || "EXCEPTION INFORMATION" },
    { title: "APPROVAL" },
    { title: "ATTACHMENT" },
  ];

  const routes = [
    { path: "", breadcrumbName: "Receipt & Collection" },
    { path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_EXCEPTION, breadcrumbName: "Exception" },
    {
      path:
        type === "create"
          ? RECEIPT_AND_COLLECTION_ROUTES.CREATE_EXCEPTION
          : RECEIPT_AND_COLLECTION_ROUTES.UPDATE_EXCEPTION,
      breadcrumbName: type === "create" ? "Create" : "Update",
    },
  ];

  // ── Initial data load ──────────────────────────────────────────────────────

  useEffect(() => {
    dispatch(getAllApprovalListException());
    dispatch(getBillingCycleList());
    dispatch(getActivityList());
    dispatch(getCriteriaOptionsList());

    if (type === "update" && idException) {
      dispatch(getExceptionDetailByHeaderId(idException));
    }
  }, [dispatch, type, idException]);

  // ── Populate form for update ───────────────────────────────────────────────

  useEffect(() => {
    if (type === "update" && data_detail && Number(data_detail.id) === Number(idException)) {
      if (initializedRef.current) return;
      initializedRef.current = true;

      form.setFieldsValue({
        activity: data_detail.activityIds ?? [],
        billingCycle: data_detail.billingCycleId,
        billingPeriod: data_detail.billingPeriodId,
        criteria: data_detail.criteriaIds ?? [],
        description: data_detail.description,
        apphierId: data_detail.appHierId,
      });

      setSelectedHierarchy(data_detail.appHierId);

      if (!data_detail.criteriaList?.length) {
        setSelectedAccounts(data_detail.accounts ?? []);
      }

      if (data_detail.criteriaList?.length > 0) {
        // Reverse map: field name → glbTypeValId (for converting backend criteriaType back to IDs)
        const fieldToCriteriaId = {
          sor: 11, customer: 12, subDistrict: 13, district: 14,
          province: 15, costCenter: 16, budget: 17, industrialSector: 18,
          customerSegment: 19, accountGroup: 20, serviceType: 21,
          accountCategory: 22, gsizes: 23, city: 39,
        };
        setCriteriaData(
          data_detail.criteriaList.map((c, idx) => {
            const base = {
              key: c.criteriaGroupId || Date.now() + idx,
              criteriaGroupId: c.criteriaGroupId,
              startDate: c.startDate,
              endDate: c.endDate,
              description: c.description,
              // Keep criteriaValues in the format handleSaveSubmit expects: [{glbTypeValId, value, fieldName}]
              criteriaValues: (c.criteriaValues || []).map((cv) => ({
                glbTypeValId: fieldToCriteriaId[cv.criteriaType] ?? null,
                value: cv.criteriaValueId,
                fieldName: cv.criteriaType || "",
              })),
            };
            // Expand into named fields for table cell rendering
            (c.criteriaValues || []).forEach((cv) => {
              if (cv.criteriaType) base[cv.criteriaType] = cv.criteriaValueId;
            });
            return base;
          })
        );
      }

      if (data_detail.attachmentList?.length > 0) {
        const mappedAtt = data_detail.attachmentList.map((att, index) => ({
          key: index + 1,
          id: att.id,
          uid: att.id,
          name: att.fileName,
          fileName: att.fileName,
          fileSize: att.fileSize,
          fileType: att.fileType,
          fileCategoryId: att.fileCategoryId,
          fileCategoryName: att.fileCategoryName,
          pathFile: att.pathFile,
          urlFile1: att.urlFile1,
          urlFile2: att.urlFile2,
          status: "done",
          dataType: "exist",
          file: null,
        }));
        setListDataAttachment(mappedAtt);
        setInitialAttachmentIds(
          mappedAtt
            .filter((item) => item.dataType === "exist" && item.id)
            .map((item) => item.id)
        );
      }

      if (data_detail.billingCycleId) {
        dispatch(getBillingPeriodList(data_detail.billingCycleId));
      }
    }
  }, [data_detail, type, idException, form, dispatch]);

  // ── Approval hierarchy options ─────────────────────────────────────────────

  useEffect(() => {
    if (dataListAppHierId?.length > 0) {
      setAppHierOptions(
        dataListAppHierId.map((appHier) => ({
          name: appHier.approvalName,
          value: appHier.appHierId,
        }))
      );
    }
  }, [dataListAppHierId]);

  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getListApprovalByIdException({ id: selectedHierarchy }));
    }
  }, [dispatch, selectedHierarchy]);

  useEffect(() => {
    if (dataListAppHierDetail?.length > 0) {
      setAppHierDataDetail(
        dataListAppHierDetail.map((a, index) => ({
          ...a,
          key: index + 1,
          employeeDetail: a.employeeDetail.map((b, bIndex) => ({ ...b, key: bIndex + 1 })),
        }))
      );
    } else {
      setAppHierDataDetail([]);
    }
  }, [dataListAppHierDetail]);

  // F5: restore header start/end dates after billing period list loads.
  // ExceptionCreate's useEffect (child) derives dates from the period on the same render;
  // this parent effect runs after it and overwrites with the stored header dates.
  useEffect(() => {
    if (
      type === "update" &&
      data_detail &&
      dataBillingPeriod.length > 0 &&
      Number(data_detail.id) === Number(idException)
    ) {
      if (data_detail.startDate || data_detail.endDate) {
        form.setFieldsValue({
          startDate: data_detail.startDate ? dayjs(data_detail.startDate) : null,
          endDate: data_detail.endDate ? dayjs(data_detail.endDate) : null,
        });
      }
    }
  }, [dataBillingPeriod, data_detail, type, idException, form]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleBillingCycleChange = (value) => {
    dispatch(resetBillingPeriod());
    if (value) dispatch(getBillingPeriodList(value));
  };

  const handleSearchAccount = ({ activityId, billingCycleId, billingPeriodId }) => {
    dispatch(
      searchAccountForException({
        activityId: Array.isArray(activityId) ? activityId.join(",") : activityId,
        billingCycleId,
        billingPeriodId,
      })
    );
  };

  const handleNext = async () => {
    if (currentStepIndex === 0) {
      try {
        await form.validateFields([
          "activity",
          "billingCycle",
          "billingPeriod",
          "startDate",
          "endDate",
          "description",
        ]);

        if (selectedAccounts.length === 0 && criteriaData.length === 0) {
          message.error("Please fill Account Information or Criteria Information before proceeding!");
          return;
        }

        // Criteria mode: preview how many accounts match before advancing
        if (selectedAccounts.length === 0 && criteriaData.length > 0) {
          const criteriaFieldMap = {
            11: "sor", 12: "customer", 13: "subDistrict", 14: "district",
            15: "province", 16: "costCenter", 17: "budget", 18: "industrialSector",
            19: "customerSegment", 20: "accountGroup", 21: "serviceType",
            22: "accountCategory", 23: "gsizes", 39: "city",
          };
          const criteriaRows = criteriaData.map((c) => {
            let values = (c.criteriaValues || []).map((cv) => {
              const id = Number(cv.glbTypeValId);
              return { glbTypeValId: id, value: cv.value, fieldName: criteriaFieldMap[id] || cv.fieldName || "" };
            });
            if (!values.length) {
              values = Object.keys(criteriaFieldMap)
                .map((k) => {
                  const id = Number(k);
                  const fld = criteriaFieldMap[id];
                  return { glbTypeValId: id, value: c[fld] ?? null, fieldName: fld };
                })
                .filter((v) => v.value != null && v.value !== "");
            }
            return { criteriaValues: values };
          });
          try {
            const previewResult = await dispatch(
              searchAccountByCriteriaForException({ criteriaRows, page: 0, size: 1 })
            ).unwrap();
            const totalMatched = previewResult?.page?.totalElements ?? 0;
            if (totalMatched === 0) {
              message.warning("No accounts match the specified criteria. Please adjust your criteria before proceeding.");
              return;
            }
            if (criteriaData.length > 1) {
              Modal.confirm({
                title: "Multiple Criteria Warning",
                icon: <WarningOutlined />,
                content: `${totalMatched} account(s) match at least one of the specified criteria. Do you want to continue?`,
                okText: "Yes, Continue",
                cancelText: "Cancel",
                onOk: () => setCurrentStepIndex(currentStepIndex + 1),
              });
              return;
            }
          } catch {
            // non-blocking — proceed if preview check fails
          }
        }

        if (type === "update") {
          try {
            const billingPeriodId = form.getFieldValue("billingPeriod");
            const activityIds = [...new Set(form.getFieldValue("activity") ?? [])];
            const accountIds = selectedAccounts
              .map((a) => a.id ?? a.accountId)
              .filter(Boolean);
            const result = await dispatch(
              checkDuplicateException({
                currentExceptionId: idException,
                billingPeriodId,
                activityIds,
                accountIds,
              })
            ).unwrap();
            if (result?.isDuplicate) {
              message.error("An exception data already exist");
              return;
            }
          } catch {
            // non-blocking — proceed if check fails
          }
        }

        setCurrentStepIndex(currentStepIndex + 1);
      } catch {
        message.error("Please complete all mandatory fields in Step 1.");
      }
    } else if (currentStepIndex === 1) {
      if (!selectedHierarchy) {
        message.error("Approval Information is required before proceeding!");
        return;
      }
      setCurrentStepIndex(currentStepIndex + 1);
    } else if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
  };

  const handleBack = () => {
    const currentValues = form.getFieldsValue();
    if (!currentValues || Object.keys(currentValues).length === 0) {
      navigate(-1);
    } else {
      setModalBack(true);
    }
  };

  const handleClear = () => {
    form.resetFields();
    setCurrentStepIndex(0);
    setSelectedAccounts([]);
    setCriteriaData([]);
    setSelectedHierarchy(null);
    setListDataAttachment([]);
    setDeletedAttachmentIds([]);
    setInitialAttachmentIds([]);
  };

  const handleSubmit = () => {
    handleSaveSubmit(true);
  };

  const handleSaveDraft = () => {
    handleSaveSubmit(false);
  };

  const handleSaveSubmit = async (isSubmit = true) => {
    try {
      if (listDataAttachment.length === 0) {
        message.error("At least 1 attachment is required!");
        return;
      }

      const formValue = await form.validateFields();

      // Build formattedCriteria including dynamic criteria values for backend
      const criteriaFieldMap = {
        11: "sor",
        12: "customer",
        13: "subDistrict",
        14: "district",
        15: "province",
        16: "costCenter",
        17: "budget",
        18: "industrialSector",
        19: "customerSegment",
        20: "accountGroup",
        21: "serviceType",
        22: "accountCategory",
        23: "gsizes",
        39: "city",
      };

      const formattedCriteria = criteriaData.map((c) => {
        // normalize existing criteriaValues to always include `fieldName`
        let values = (c.criteriaValues || []).map((cv) => {
          const id = Number(cv.glbTypeValId);
          const fld = criteriaFieldMap[id];
          return {
            glbTypeValId: id,
            value: cv.value,
            fieldName: fld || cv.fieldName || "",
          };
        });

        // if there are no explicit values, derive from row fields
        if (!values || values.length === 0) {
          values = Object.keys(criteriaFieldMap)
            .map((k) => {
              const id = Number(k);
              const fld = criteriaFieldMap[id];
              return { glbTypeValId: id, value: c[fld] ?? null, fieldName: fld || "" };
            })
            .filter((v) => v.value !== null && v.value !== undefined && v.value !== "");
        }

        return {
          id: c.id || null,
          startDate: c.startDate,
          endDate: c.endDate,
          description: c.description,
          criteriaValues: values,
        };
      });

      const seenAccounts = new Set();
      const formattedAccounts = selectedAccounts
        .map((a) => ({ accountId: a.id ?? a.accountId, accountNumber: a.accountNumber }))
        .filter((a) => {
          if (seenAccounts.has(a.accountNumber)) return false;
          seenAccounts.add(a.accountNumber);
          return true;
        });

      const dataValue = {
        id: type === "update" ? idException : null,
        activityIds: [...new Set(formValue.activity ?? [])],
        billingCycleId: formValue.billingCycle,
        billingPeriodId: formValue.billingPeriod,
        startDate: formValue.startDate,
        endDate: formValue.endDate,
        criteriaIds: [...new Set(formValue.criteria ?? [])],
        description: formValue.description,
        appHierId: selectedHierarchy,
        accounts: formattedAccounts,
        criteriaList: formattedCriteria,
        exceptionMode: selectedAccounts.length > 0 ? "ACCOUNT" : "CRITERIA",
        isSubmit,
      };

      setKirimBody(dataValue);

      dispatch(createValidasiException(dataValue))
        .unwrap()
        .then((data) => {
          if (data?.success !== false) {
            setModalConfirm(true);
          }
        })
        .catch((error) => {
          const errorMsg = error?.message || "Validation failed from server";
          message.error(errorMsg);
        });
    } catch {
      message.error("Validation error, please check your form data.");
    }
  };

  const rollbackAttachments = async (attachmentIds) => {
    for (const attId of attachmentIds) {
      try {
        await receiptCollectionHttpService.deleteData(`/v1/dbs/api/attachment/delete/${attId}`);
      } catch (err) {
        console.error(`Rollback attachment ${attId} failed:`, err);
      }
    }
  };

  const handleProcessModalConfirm = async () => {
    setLoadingForm(true);
    const uploadedAttachmentIds = [];

    try {
      let savedData;
      if (type === "update") {
        savedData = await dispatch(updateException(kirimBody)).unwrap();
      } else {
        savedData = await dispatch(createException(kirimBody)).unwrap();
      }
      const exceptionId = savedData?.id;

      // Delete removed existing attachments
      const currentExistingIds = listDataAttachment
        .filter((item) => item.dataType === "exist" && item.id)
        .map((item) => item.id);
      const calculatedDeletedIds = initialAttachmentIds.filter(
        (idAtt) => !currentExistingIds.includes(idAtt)
      );
      const fileIdsToDelete = [...new Set([...deletedAttachmentIds, ...calculatedDeletedIds])];
      if (fileIdsToDelete.length > 0) {
        await receiptCollectionHttpService.deleteDataWithBody(
          `/v1/dbs/api/attachment/delete-attachment`,
          { fileId: fileIdsToDelete }
        );
      }

      for (const element of listDataAttachment) {
        if (element.dataType !== "exist") {
          try {
            const formData = new FormData();
            formData.append("files", element.file);
            formData.append("fileCategoryId", element.fileCategoryId);
            formData.append("referensiId", exceptionId);
            formData.append("category", "PAYMENT_EXCEPTION");
            const uploadResult = await receiptCollectionHttpService.uploadImage(
              `/v1/dbs/api/attachment/upload/v1`,
              formData
            );
            if (uploadResult?.data?.id) uploadedAttachmentIds.push(uploadResult.data.id);
          } catch {
            throw new Error(
              "Attachment upload failed. Exception data has been saved, but some attachments were not uploaded."
            );
          }
        }
      }

      setLoadingForm(false);
      setModalConfirm(false);
      handleClear();
      dispatch(
        showModalSuccess({
          title: "Successful",
          description: `Your data has been ${kirimBody.isSubmit ? "submitted" : "saved as draft"}.`,
          return: false,
        })
      );
      navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_EXCEPTION);
    } catch (error) {
      if (uploadedAttachmentIds.length > 0) {
        await rollbackAttachments(uploadedAttachmentIds);
      }
      setLoadingForm(false);
      const errorMsg =
        error?.message || error?.response?.data?.message || error.toString();
      dispatch(showModalError({ title: "Failed", description: errorMsg }));
    }
  };

  const handleUpdateAttachment = useCallback((updater) => {
    setListDataAttachment((prevState) => {
      const newState =
        typeof updater === "function" ? updater(prevState) : updater;
      const removedItems = prevState.filter(
        (item) =>
          !newState.some(
            (newItem) => (newItem.key ?? newItem.id) === (item.key ?? item.id)
          )
      );
      const removedExistingIds = removedItems
        .filter((item) => item.dataType === "exist" && item.id)
        .map((item) => item.id);
      if (removedExistingIds.length > 0) {
        setDeletedAttachmentIds((prev) => [
          ...new Set([...prev, ...removedExistingIds]),
        ]);
      }
      return newState;
    });
  }, []);

  return (
    <>
      <BreadCrumb routes={routes} />

      <div className="w-full mt-4">
        <div className="mb-5">
          <FormStepper
            steps={steps}
            current={currentStepIndex}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </div>

        <Spin spinning={loading || loadingForm}>
          <Form layout="vertical" form={form} preserve={true} size="small">
            {/* Step 0 — Exception Information */}
            <div className={currentStepIndex !== 0 ? "hidden" : ""}>
              <ExceptionCreate
                form={form}
                selectedAccounts={selectedAccounts}
                setSelectedAccounts={setSelectedAccounts}
                criteriaData={criteriaData}
                setCriteriaData={setCriteriaData}
                dataBillingCycle={dataBillingCycle}
                dataBillingPeriod={dataBillingPeriod}
                dataActivity={dataActivity}
                dataCriteriaOptions={dataCriteriaOptions}
                dataAccountSearch={dataAccountSearch}
                onBillingCycleChange={handleBillingCycleChange}
                onSearchAccount={handleSearchAccount}
                loadingAccount={loading}
              />
            </div>

            {/*Step 1 — Approval*/}
            <div className={currentStepIndex !== 1 ? "hidden" : ""}>
              <CardContainer
                header={
                  <p className="text-primary font-bold">APPROVAL INFORMATION</p>
                }
              >
                <ApprovalComponentGeneral
                  dataTable={appHierDataDetail}
                  dataOption={appHierOptions}
                  selectedHierarchy={selectedHierarchy}
                  updateSelectedHierarchy={setSelectedHierarchy}
                />
              </CardContainer>
            </div>

            {/* Step 2 — Attachment */}
            <div className={currentStepIndex !== 2 ? "hidden" : ""}>
              <CardContainer
                header={
                  <p className="text-primary font-bold">ATTACHMENT INFORMATION</p>
                }
              >
                <AttachmentComponent
                  type={type}
                  data={listDataAttachment}
                  updateData={handleUpdateAttachment}
                  dispatch={dispatch}
                  getAPICategory={getListCategory}
                  typeSelector="exception"
                  service={receiptCollectionHttpService}
                  configApplication={configApp.MASTER_MANAGEMENT}
                  typeRBI="data"
                  mandatory={true}
                />
              </CardContainer>
            </div>

            <FormFooter
              current={currentStepIndex}
              totalSteps={steps.length}
              onPrev={handlePrev}
              onNext={handleNext}
              onCancel={handleBack}
              onClear={handleClear}
              onSaveDraft={handleSaveDraft}
              onSubmit={handleSubmit}
              type={type}
            />
          </Form>
        </Spin>

        {/* Confirmation Modal */}
        <ConfirmationException
          isOpen={modalConfirm}
          kirimBody={kirimBody}
          dataBillingCycle={dataBillingCycle}
          dataBillingPeriod={dataBillingPeriod}
          dataActivity={dataActivity}
          dataCriteriaOptions={dataCriteriaOptions}
          selectedAccounts={selectedAccounts}
          criteriaData={criteriaData}
          appHierOptions={appHierOptions}
          appHierDataDetail={appHierDataDetail}
          listDataAttachment={listDataAttachment}
          handleCancel={() => setModalConfirm(false)}
          handleConfirm={handleProcessModalConfirm}
          isLoading={loadingForm}
        />

        {/* Back Confirmation Modal */}
        <ModalConfirm
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
          width={400}
        >
          <div className="flex justify-center mt-5 gap-[20px]">
            <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
            <p className="text-[18px] font-bold">
              Are you sure you want to go back?
            </p>
          </div>
        </ModalConfirm>
      </div>
    </>
  );
};

export default ExceptionForm;
