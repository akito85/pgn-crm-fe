import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin, Checkbox } from "antd";
import BreadCrumb from "../../../../../components/BreadCrumb";
import {
  FormStepper,
  FormFooter,
} from "../../../../../components/FormStepNavigation";
import CardContainer from "../../../../../components/CardContainer";
import CardContainerNoBorder from "../../../../../components/CardContainerNoBorder";
import ModalBack from "../../../../../components/Modal/ModalBack";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import SVGIcon from "../../../../../assets/Icon/index";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import { configApp } from "../../../../../constants/configApp";
import { getConfigFileRBIData } from "../../../../../redux/slices/attachmentSlice";
import { getListCategory } from "../../../../../redux/slices/rating_billing_invoice/adjustmentBilling";
import {
  getAccountingFromBilling,
  createAccountingJournal,
} from "../../../../../redux/slices/rating_billing_invoice/accounting";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import {
  columnsAccounting,
  computeRowSpans,
  ACCOUNTING_MERGED_FIELDS,
} from "../Table/TableAccounting";
import TableRBI from "../../../../../components/TableRBI";
import { showModalError } from "../../../../../redux/slices/general_slice";

const STEPS = [
  { title: "Create Accounting" },
  { title: "Attachment" },
];

const ReadOnlyField = ({ label, value }) => (
  <div className="flex flex-col mb-3">
    <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wide mb-0.5">
      {label}
    </span>
    <span className="text-[13px] text-gray-800 font-semibold border-b border-gray-200 pb-1">
      {value || "-"}
    </span>
  </div>
);

const SectionLabel = ({ label }) => (
  <div className="mb-3 mt-1">
    <span className="text-[12px] font-bold text-[#0075BF] uppercase tracking-widest">
      {label}
    </span>
    <div className="border-b border-[#D6E1F0] mt-1" />
  </div>
);

const BillingCreateAccountingForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchInput = useRef(null);

  const { billingData } = location?.state || {};
  const fromBilling = !!billingData;
  const backPath = fromBilling ? RBI_ROUTES.BILLING_VIEW : "/accounting";

  const { accounting_from_billing, loading_form } = useSelector(
    (state) => state.rbiAccounting
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [modalBack, setModalBack] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [search, setSearch] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prev) => ({ ...prev, [dataIndex]: selectedKeys[0] }));
  }, []);

  const handleReset = useCallback((clearFilters, dataIndex) => {
    clearFilters?.();
    setSearch((prev) => {
      const next = { ...prev };
      delete next[dataIndex];
      return next;
    });
    setSearchText("");
  }, []);

  useEffect(() => {
    if (billingData?.billCode) {
      dispatch(getAccountingFromBilling(billingData.billCode));
    }
  }, [dispatch, billingData]);

  const formData = useMemo(
    () => accounting_from_billing || {},
    [accounting_from_billing]
  );

  const journalData = useMemo(
    () => (formData?.details || []).map((item, idx) => ({ ...item, key: idx })),
    [formData]
  );

  const [postingToSAP, setPostingToSAP] = useState({});

  const groupedJournals = useMemo(() => {
    const groups = {};
    journalData.forEach((item) => {
      const key = item.transactionNumber || `_row_${item.key}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return Object.values(groups);
  }, [journalData]);

  // Per-group filtered rows + columns. Always derived from groupedJournals so
  // tables never disappear (keeping filter dropdowns accessible) even when a
  // filter yields zero matches.
  const groupedJournalData = useMemo(() => {
    const activeFilters = Object.entries(search).filter(([, v]) => v != null && v !== "");
    return groupedJournals.map((groupRows, idx) => {
      const filteredRows =
        activeFilters.length === 0
          ? groupRows
          : groupRows.filter((item) =>
              activeFilters.every(([key, val]) =>
                String(item[key] ?? "").toLowerCase().includes(String(val).toLowerCase())
              )
            );
      const groupRowSpans = computeRowSpans(filteredRows, ACCOUNTING_MERGED_FIELDS);
      const cols = columnsAccounting(
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        search,
        groupRowSpans,
        idx + 1,
        filteredRows.length,
        handleReset
      ).map((col) => ({
        ...col,
        filteredValue:
          col.dataIndex && search[col.dataIndex] != null && search[col.dataIndex] !== ""
            ? [search[col.dataIndex]]
            : null,
      }));
      return { rows: filteredRows, columns: cols };
    });
  }, [groupedJournals, search, searchText, searchedColumn, handleSearch, handleReset]);

  const routes = fromBilling
    ? [
        { path: RBI_ROUTES.BILLING_VIEW, breadcrumbName: "Billing" },
        { path: RBI_ROUTES.ACCOUNTING_CREATE, breadcrumbName: "Create Accounting" },
      ]
    : [
        { path: "/accounting", breadcrumbName: "Accounting" },
        { path: RBI_ROUTES.ACCOUNTING_CREATE, breadcrumbName: "Create Accounting" },
      ];

  const handlePrevStep = () =>
    setCurrentStep((prev) => Math.max(0, prev - 1));

  const handleNextStep = () =>
    setCurrentStep((prev) => Math.min(STEPS.length - 1, prev + 1));

  const handleClear = () => {
    setListDataAttachment([]);
  };

  const handleSubmit = (isSubmit) => {
    if (isSubmit && listDataAttachment.length === 0) {
      setCurrentStep(1); // navigate to Attachment step
      dispatch(
        showModalError({
          title: "Failed",
          description: "Please upload at least one attachment before submitting.",
        })
      );
      return;
    }

    const body = {
      billCode: formData.billCode || billingData?.billCode,
      accountNumber: formData.accountNumber || billingData?.accountNumber,
      accountName: formData.accountName || billingData?.accountName,
      customerNumber: formData.customerNumber || billingData?.customerNumber,
      customerName: formData.customerName || billingData?.customerName,
      costCenter: formData.costCenter || billingData?.costCenter,
      customerSegment: formData.customerSegment || billingData?.accountSegment,
      customerGroup:
        formData.customerGroup || billingData?.accountGroupType,
      accountType: formData.accountType || billingData?.accountGroupType,
      classificationType:
        formData.classificationType || billingData?.serviceType,
      billingCode: formData.billingCode || billingData?.billCode,
      billingPeriod: formData.billingPeriod || billingData?.billingPeriod,
      billingCycle: formData.billingCycle || billingData?.billingCycle,
      transactionDate:
        formData.transactionDate || billingData?.transactionDate,
      journals: groupedJournals.map((rows, idx) => ({
        transactionNumber: rows[0]?.transactionNumber || null,
        postingSap: postingToSAP[idx] || false,
        details: rows,
      })),
      submit: isSubmit,
    };

    dispatch(createAccountingJournal(body))
      .unwrap()
      .then(async (savedData) => {
        const journalList = Array.isArray(savedData) ? savedData : savedData?.data;
        const refId = journalList?.[0]?.entryId;
        if (refId && listDataAttachment.length > 0) {
          for (const element of listDataAttachment) {
            const attachBody = {
              files: element.file,
              category: element.fileCategoryId,
            };
            await ratingBillingHttpService.uploadAttachment(
              `/v1/dbs/api/rbi/accounting/uploadAttachment/${refId}`,
              attachBody
            );
          }
        }
        navigate(backPath);
      })
      .catch((error) => {
        if (Math.floor((error?.response?.status || 0) / 100) === 5) {
          setBodyError({ message: error?.message || "An error occurred." });
          setModalError(true);
        }
      });
  };

  return (
    <Spin spinning={loading_form || false}>
        <style>{`
          .accounting-counterpart-row > td {
            background-color: #f5f5f5 !important;
          }
        `}</style>
        <BreadCrumb routes={routes} />

        <FormStepper
          steps={STEPS}
          current={currentStep}
          onPrev={handlePrevStep}
          onNext={handleNextStep}
        />

        {/* ── Step 0: Create Accounting ── */}
        <div className={currentStep !== 0 ? "hidden" : ""}>
          <CardContainer subHeader="Accounting Information">
            <CardContainerNoBorder header="Customer Information" collapsible={true} defaultExpanded={true}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6">
                <ReadOnlyField
                  label="Account Number"
                  value={formData.accountNumber || billingData?.accountNumber}
                />
                <ReadOnlyField
                  label="Account Name"
                  value={formData.accountName || billingData?.accountName}
                />
                <ReadOnlyField
                  label="Customer Number"
                  value={formData.customerNumber || billingData?.customerNumber}
                />
                <ReadOnlyField
                  label="Customer Name"
                  value={formData.customerName || billingData?.customerName}
                />
                <ReadOnlyField
                  label="Cost Center"
                  value={formData.costCenter || billingData?.costCenter}
                />
                <ReadOnlyField
                  label="Customer Segment"
                  value={
                    formData.customerSegment || billingData?.accountSegment
                  }
                />
                <ReadOnlyField
                  label="Customer Group"
                  value={
                    formData.customerGroup || billingData?.accountGroupType
                  }
                />
                <ReadOnlyField
                  label="Account Type"
                  value={formData.accountType || billingData?.accountGroupType}
                />
                <ReadOnlyField
                  label="Classification Type"
                  value={
                    formData.classificationType || billingData?.serviceType
                  }
                />
              </div>
            </CardContainerNoBorder>

            <CardContainerNoBorder header="Billing Information" collapsible={true} defaultExpanded={true}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6">
                <ReadOnlyField
                  label="Billing Code"
                  value={formData.billingCode || billingData?.billCode}
                />
                <ReadOnlyField
                  label="Billing Period"
                  value={
                    formData.billingPeriod
                      ? new Date(formData.billingPeriod).toLocaleDateString(
                          "id-ID"
                        )
                      : billingData?.billingPeriod
                      ? new Date(billingData.billingPeriod).toLocaleDateString(
                          "id-ID"
                        )
                      : "-"
                  }
                />
                <ReadOnlyField
                  label="Billing Cycle"
                  value={formData.billingCycle || billingData?.billingCycle}
                />
                <ReadOnlyField
                  label="Transaction Date"
                  value={
                    formData.transactionDate
                      ? new Date(formData.transactionDate).toLocaleDateString(
                          "id-ID"
                        )
                      : billingData?.transactionDate
                      ? new Date(
                          billingData.transactionDate
                        ).toLocaleDateString("id-ID")
                      : "-"
                  }
                />
              </div>
            </CardContainerNoBorder>
          </CardContainer>

          <CardContainer subHeader="Journal Information">
            {groupedJournalData.map(({ rows, columns }, idx) => (
              <CardContainerNoBorder
                key={idx}
                header={`Journal ${idx + 1}`}
                collapsible={true}
                defaultExpanded={true}
              >
                <TableRBI
                  idTable={`billing-accounting-journal-table-${idx}`}
                  dataSource={rows}
                  columns={columns}
                  totalData={rows.length}
                  tableScrolled={{ x: 11000, y: 400 }}
                  loading={loading_form}
                  showExport={false}
                  usePagination={false}
                  useInfiniteScroll={false}
                  showRefresh={false}
                  tableSize="small"
                  rowClassName={(record) =>
                    record.counterpart ? "accounting-counterpart-row" : ""
                  }
                />
                <div className="mt-3">
                  <Checkbox
                    checked={postingToSAP[idx] || false}
                    onChange={(e) =>
                      setPostingToSAP((prev) => ({
                        ...prev,
                        [idx]: e.target.checked,
                      }))
                    }
                  >
                    Posting to SAP
                  </Checkbox>
                </div>
              </CardContainerNoBorder>
            ))}
          </CardContainer>
        </div>

        {/* ── Step 1: Attachment ── */}
        <div className={currentStep !== 1 ? "hidden" : ""}>
          <CardContainer subHeader="Attachment Information">
            <AttachmentComponent
              type="create"
              data={listDataAttachment}
              updateData={setListDataAttachment}
              dispatch={dispatch}
              getAPICategory={getListCategory}
              typeSelector="adjustmentBilling"
              service={ratingBillingHttpService}
              configApplication={configApp.RATING_BILLING_SERVICE}
              getAPIGuard={getConfigFileRBIData}
              typeRBI="data"
              mandatory={false}
            />
          </CardContainer>
        </div>

        <FormFooter
          current={currentStep}
          totalSteps={STEPS.length}
          onPrev={handlePrevStep}
          onNext={handleNextStep}
          onCancel={() => setModalBack(true)}
          onClear={handleClear}
          onSaveDraft={() => handleSubmit(false)}
          onSubmit={() => handleSubmit(true)}
          type="create"
          useClearData={true}
          useSaveDraft={true}
        />

        <ModalBack
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(backPath)}
        />

        <ModalError
          isOpen={modalError}
          handleOk={() => {
            setModalError(false);
            handleSubmit(true); // retry submit
          }}
          handleCancel={() => {
            setModalError(false);
            setBodyError({});
          }}
          customText="Try Again"
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">Failed</p>
            </div>
            <p className="pl-[70px]">{`Your accounting was not saved. ${bodyError.message || ""}`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
    </Spin>
  );
};

export default BillingCreateAccountingForm;
