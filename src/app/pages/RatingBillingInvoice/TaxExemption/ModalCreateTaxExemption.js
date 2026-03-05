import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Form, Select, Table, Button } from "antd";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import {
  PlusOutlined,
  LeftOutlined,
  RightOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  getDistributeMedia,
  getContactByAccount,
  getApprovalHierarchyList,
  getApprovalHierarchyDetail,
  createTaxExemption,
  uploadTaxExemptionAttachment,
  getCategoryListTaxExemption,
} from "../../../../redux/slices/rating_billing_invoice/taxExemption";
import { validateCreateUpdate } from "../../../../redux/slices/general_slice";
import ratingBillingHttpService from "../../../../redux/services/ratingBillingHttpService";
import { Steps } from "antd";
import InputComponent from "../../../../components/InputComponent";
import DateComponent from "../../../../components/DateComponent";
import SelectComponent from "../../../../components/SelectComponent";
import BaseContainer from "../../../../components/BaseContainer";
import ButtonComponent from "../../../../components/ButtonComponent";
import ApprovalComponentGeneral from "../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import SVGIcon from "../../../../assets/Icon/index";
import { configApp } from "../../../../constants/configApp";
import { getConfigFileRBIData } from "../../../../redux/slices/attachmentSlice";
import { ModalError } from "../../../../components/Modal/ModalPopUp";

// ─── Step 1: Tax Exemption Form ──────────────────────────────────────────────

const TaxExemptionStep = ({
  form,
  record,
  dispatch,
  contactRows,
  setContactRows,
  contactRowErrors,
  setContactRowErrors,
}) => {
  const { distributeMediaList, contactList } = useSelector(
    (state) => state.taxExemption || {},
  );

  // Fetch distribute media on mount
  useEffect(() => {
    dispatch(getDistributeMedia());
  }, [dispatch]);

  // Fetch contacts when accountNumber changes
  useEffect(() => {
    if (record?.accountNumber) {
      dispatch(getContactByAccount({ accountNumber: record.accountNumber }));
    }
  }, [dispatch, record?.accountNumber]);

  // Collect all contact names already selected in other rows
  const usedContactIds = useMemo(
    () => contactRows.map((r) => r.contactName).filter(Boolean),
    [contactRows],
  );

  const handleRowChange = (key, field, value) => {
    setContactRows((prev) =>
      prev.map((row) => {
        if (row.key !== key) return row;
        if (field === "distributionMedia") {
          return {
            ...row,
            distributionMedia: value,
            contactName: undefined,
            value: "",
            job: "",
            position: "",
            contactAddress: "",
            contactAddressNote: "",
            description: "",
          };
        }
        if (field === "contactName") {
          const contact = contactList.find((c) => c.id === value);
          return {
            ...row,
            contactName: value,
            contactNameLabel: contact?.contactName || "",
            value: contact?.value || "",
            job: contact?.job || "",
            position: contact?.position || "",
            contactAddress: contact?.contactAddress || "",
            contactAddressNote: contact?.contactAddressAdditionalNotes || "",
            description: contact?.description || "",
          };
        }
        return { ...row, [field]: value };
      }),
    );
    // Clear error for this row/field when user fills it
    if (contactRowErrors[key]?.[field]) {
      setContactRowErrors((prev) => {
        const updated = { ...prev[key] };
        delete updated[field];
        if (Object.keys(updated).length === 0) {
          const next = { ...prev };
          delete next[key];
          return next;
        }
        return { ...prev, [key]: updated };
      });
    }
  };

  const handleAddRow = () => {
    setContactRows((prev) => [
      ...prev,
      {
        key: String(Date.now()),
        distributionMedia: undefined,
        contactName: undefined,
        contactNameLabel: "",
        value: "",
        job: "",
        position: "",
        contactAddress: "",
        contactAddressNote: "",
        description: "",
      },
    ]);
  };

  const contactColumns = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: (
        <span>
          DISTRIBUTION MEDIA <span style={{ color: "red" }}>*</span>
        </span>
      ),
      dataIndex: "distributionMedia",
      key: "distributionMedia",
      width: 160,
      render: (val, row) => (
        <div>
          <SelectComponent
            value={val}
            size="small"
            style={{
              width: "100%",
              borderColor: contactRowErrors[row.key]?.distributionMedia
                ? "red"
                : undefined,
            }}
            status={
              contactRowErrors[row.key]?.distributionMedia ? "error" : undefined
            }
            placeholder="Select"
            onChange={(v) => handleRowChange(row.key, "distributionMedia", v)}
          >
            {distributeMediaList.map((opt) => (
              <Select.Option key={opt.code} value={opt.code}>
                {opt.text}
              </Select.Option>
            ))}
          </SelectComponent>
          {contactRowErrors[row.key]?.distributionMedia && (
            <p style={{ color: "red", fontSize: 10, margin: 0 }}>Required</p>
          )}
        </div>
      ),
    },
    {
      title: (
        <span>
          CONTACT NAME <span style={{ color: "red" }}>*</span>
        </span>
      ),
      dataIndex: "contactName",
      key: "contactName",
      width: 180,
      render: (val, row) => {
        const filtered = contactList.filter(
          (c) =>
            c.type === row.distributionMedia &&
            (!usedContactIds.includes(c.id) || c.id === val),
        );
        return (
          <div>
            <SelectComponent
              value={val}
              size="small"
              style={{ width: "100%" }}
              status={
                contactRowErrors[row.key]?.contactName ? "error" : undefined
              }
              placeholder="Select"
              showSearch
              disabled={!row.distributionMedia}
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
              onChange={(v) => handleRowChange(row.key, "contactName", v)}
            >
              {filtered.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.contactName}
                </Select.Option>
              ))}
            </SelectComponent>
            {contactRowErrors[row.key]?.contactName && (
              <p style={{ color: "red", fontSize: 10, margin: 0 }}>Required</p>
            )}
          </div>
        );
      },
    },
    {
      title: "VALUE",
      dataIndex: "value",
      key: "value",
      width: 150,
      render: (val) => (
        <InputComponent value={val} size="small" placeholder="-" disabled />
      ),
    },
    {
      title: "JOB",
      dataIndex: "job",
      key: "job",
      width: 120,
      render: (val) => (
        <InputComponent value={val} size="small" placeholder="-" disabled />
      ),
    },
    {
      title: "POSITION",
      dataIndex: "position",
      key: "position",
      width: 160,
      render: (val) => (
        <InputComponent value={val} size="small" placeholder="-" disabled />
      ),
    },
    {
      title: "CONTACT ADDRESS",
      dataIndex: "contactAddress",
      key: "contactAddress",
      width: 200,
      render: (val) => (
        <InputComponent value={val} size="small" placeholder="-" disabled />
      ),
    },
    {
      title: "CONTACT ADDRESS ADDITIONAL NOTE",
      dataIndex: "contactAddressNote",
      key: "contactAddressNote",
      width: 220,
      render: (val) => (
        <InputComponent value={val} size="small" placeholder="-" disabled />
      ),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
      width: 180,
      render: (val) => (
        <InputComponent value={val} size="small" placeholder="-" disabled />
      ),
    },
  ];

  // Customer info fields from record
  const customerInfo = [
    { label: "Customer Number", value: record?.customerNumber },
    { label: "Customer Name", value: record?.customerName },
    { label: "Account Number", value: record?.accountNumber },
    { label: "Account Name", value: record?.accountName },
    { label: "Service Agreement Class", value: record?.serviceType },
    { label: "Account Segment", value: record?.accountSegment },
    { label: "SOR", value: record?.sor },
    { label: "Cost Center", value: record?.costCenter },
    // { label: "Cost Center Name", value: record?.costCenterName },
    { label: "Meter Reading Code", value: record?.meterReadingCode },
  ];

  return (
    <div className="flex flex-col gap-3 p-3">
      {/* Document Number & Document Date */}
      <BaseContainer border>
        <div className="grid grid-cols-2 gap-x-4 py-2">
          <Form.Item
            label="Document Number"
            name="documentNumber"
            rules={[
              { required: true, message: "Please input Document Number!" },
            ]}
          >
            <InputComponent placeholder="Type here.." />
          </Form.Item>
          <Form.Item
            label="Document Date"
            name="documentDate"
            rules={[
              { required: true, message: "Please select Document Date!" },
            ]}
          >
            <DateComponent
              placeholder="Select Date"
              dateDisable={() => false}
            />
          </Form.Item>
        </div>
      </BaseContainer>

      {/* Proforma Invoice */}
      <BaseContainer
        border
        header={
          <p className="text-xs text-black capitalize font-semibold">
            Proforma Invoice
          </p>
        }
      >
        <div className="pb-2">
          <a
            href={record?.pathFile}
            className="text-primary text-xs"
            style={{ color: "#0075BF" }}
          >
            {record?.pathFile}
          </a>
        </div>
      </BaseContainer>

      {/* Customer Information */}
      <BaseContainer border header="CUSTOMER INFORMATION">
        <div className="grid grid-cols-4 gap-x-4 gap-y-2 py-3">
          {customerInfo.map((item) => (
            <div key={item.label}>
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="text-sm font-medium">{item.value || "-"}</p>
            </div>
          ))}
        </div>
      </BaseContainer>

      {/* Contact Information */}
      <BaseContainer border header="CONTACT INFORMATION">
        <div className="py-2">
          <div className="flex justify-end mb-2">
            <ButtonComponent
              type="submit"
              border={false}
              icon={<PlusOutlined />}
              onClick={handleAddRow}
            >
              Create
            </ButtonComponent>
          </div>
          <Table
            dataSource={contactRows}
            columns={contactColumns}
            pagination={false}
            size="small"
            scroll={{ x: "max-content" }}
            rowKey="key"
            summary={() => (
              <Table.Summary>
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={contactColumns.length}>
                    <div className="flex justify-end text-xs text-gray-500 pr-2">
                      Showing {contactRows.length} of {contactRows.length}{" "}
                      entries{" "}
                      <span
                        className="text-primary ml-2"
                        style={{ color: "#0075BF" }}
                      >
                        All data showed
                      </span>
                    </div>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </div>
      </BaseContainer>
    </div>
  );
};

// ─── Step 2: Approval ─────────────────────────────────────────────────────────

const ApprovalStep = ({
  appHierOptions,
  appHierDataDetail,
  selectedHierarchy,
  setSelectedHierarchy,
  dispatch,
  form,
}) => {
  // Fetch approval hierarchy list on mount
  useEffect(() => {
    dispatch(getApprovalHierarchyList());
  }, [dispatch]);

  // Fetch detail when selection changes
  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getApprovalHierarchyDetail({ id: selectedHierarchy }));
    }
  }, [dispatch, selectedHierarchy]);

  return (
    <BaseContainer border header="Approval Information">
      <div className="pb-3">
        <ApprovalComponentGeneral
          type="create"
          dataTable={appHierDataDetail}
          dataOption={appHierOptions}
          selectedHierarchy={selectedHierarchy}
          updateSelectedHierarchy={setSelectedHierarchy}
          form={form}
          fieldName="apphierId"
        />
      </div>
    </BaseContainer>
  );
};

// ─── Step 3: Attachment ───────────────────────────────────────────────────────

const AttachmentStep = ({
  listDataAttachment,
  setListDataAttachment,
  dispatch,
}) => {
  return (
    <BaseContainer border header="Attachment Information">
      <div className="pb-3">
        <AttachmentComponent
          type="create"
          data={listDataAttachment}
          updateData={setListDataAttachment}
          dispatch={dispatch}
          getAPICategory={getCategoryListTaxExemption}
          typeSelector="taxExemption"
          service={ratingBillingHttpService}
          configApplication={configApp.RATING_BILLING_SERVICE}
          getAPIGuard={getConfigFileRBIData}
          typeRBI="data"
          mandatory={true}
        />
      </div>
    </BaseContainer>
  );
};

// ─── Stepper Header (inside modal) ───────────────────────────────────────────

const ModalStepper = ({ steps, current, onPrev, onNext }) => {
  return (
    <div className="flex flex-row items-center justify-between w-full py-2 px-2">
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          backgroundColor: current > 0 ? "transparent" : "#E0E0E0",
          border: current > 0 ? "1px solid #0075BF" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: current > 0 ? "pointer" : "not-allowed",
          flexShrink: 0,
        }}
        onClick={() => current > 0 && onPrev && onPrev()}
      >
        <LeftOutlined
          style={{
            fontSize: 12,
            color: current > 0 ? "#0075BF" : "#BDBDBD",
          }}
        />
      </div>

      <div className="flex-1 px-4">
        <Steps
          current={current}
          labelPlacement="vertical"
          size="small"
          style={{ width: `${steps.length * 180}px`, margin: "0 auto" }}
          items={steps.map((s, i) => ({
            title: (
              <span style={{ whiteSpace: "nowrap", fontSize: 12 }}>
                {s.title}
              </span>
            ),
            icon: (
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: i <= current ? "#0075BF" : "#9E9E9E",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  fontSize: 11,
                }}
              >
                {i + 1}
              </div>
            ),
          }))}
        />
      </div>

      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          backgroundColor:
            current < steps.length - 1 ? "transparent" : "#E0E0E0",
          border: current < steps.length - 1 ? "1px solid #0075BF" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: current < steps.length - 1 ? "pointer" : "not-allowed",
          flexShrink: 0,
        }}
        onClick={() => current < steps.length - 1 && onNext && onNext()}
      >
        <RightOutlined
          style={{
            fontSize: 12,
            color: current < steps.length - 1 ? "#0075BF" : "#BDBDBD",
          }}
        />
      </div>
    </div>
  );
};

// ─── Main Modal Component ─────────────────────────────────────────────────────

const ModalCreateTaxExemption = ({
  isOpen,
  onClose,
  record,
  listDataAttachment = [],
  setListDataAttachment = () => {},
  dispatch,
  onSubmit = () => {},
}) => {
  const { approvalHierarchyList, approvalHierarchyDetail } = useSelector(
    (state) => state.taxExemption || {},
  );

  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedHierarchy, setSelectedHierarchy] = useState(undefined);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [bodyData, setBodyData] = useState({});
  const [loadingSave, setLoadingSave] = useState(false);
  const [contactRows, setContactRows] = useState([
    {
      key: "1",
      distributionMedia: undefined,
      contactName: undefined,
      contactNameLabel: "",
      value: "",
      job: "",
      position: "",
      contactAddress: "",
      contactAddressNote: "",
      description: "",
    },
  ]);
  const [contactRowErrors, setContactRowErrors] = useState({});

  // Map approval hierarchy list to options
  useEffect(() => {
    if (approvalHierarchyList && approvalHierarchyList.length > 0) {
      const options = approvalHierarchyList.map((item) => ({
        name: item.approvalName,
        value: item.appHierId,
      }));
      setAppHierOptions(options);
    } else {
      setAppHierOptions([]);
    }
  }, [approvalHierarchyList]);

  // Map approval hierarchy detail to table data
  useEffect(() => {
    if (approvalHierarchyDetail && approvalHierarchyDetail.length > 0) {
      const data = approvalHierarchyDetail.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: (a.employeeDetail || []).map((b, i) => ({
          ...b,
          key: i + 1,
        })),
      }));
      setAppHierDataDetail(data);
    } else {
      setAppHierDataDetail([]);
    }
  }, [approvalHierarchyDetail]);

  const steps = [
    { title: "TAX EXEMPTION" },
    { title: "APPROVAL" },
    { title: "ATTACHMENT" },
  ];

  const handlePrev = () => setCurrentStep((prev) => Math.max(0, prev - 1));

  const handleNext = async () => {
    if (currentStep === 0) {
      // Validate form fields (documentNumber, documentDate)
      try {
        await form.validateFields(["documentNumber", "documentDate"]);
      } catch {
        return;
      }

      // Validate contact rows: at least 1 row, every row must have both distributionMedia and contactName
      const errors = {};
      contactRows.forEach((row) => {
        if (!row.distributionMedia) {
          errors[row.key] = errors[row.key] || {};
          errors[row.key].distributionMedia = true;
        }
        if (!row.contactName) {
          errors[row.key] = errors[row.key] || {};
          errors[row.key].contactName = true;
        }
      });

      if (Object.keys(errors).length > 0) {
        setContactRowErrors(errors);
        return;
      }
      setContactRowErrors({});
    }

    if (currentStep === 1) {
      // Validate approval hierarchy selection
      try {
        await form.validateFields(["apphierId"]);
      } catch {
        return;
      }
    }

    setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const resetModal = () => {
    form.resetFields();
    setCurrentStep(0);
    setSelectedHierarchy(undefined);
    setAppHierDataDetail([]);
    setBodyData({});
    setListDataAttachment([]);
    setContactRowErrors({});
    setContactRows([
      {
        key: "1",
        distributionMedia: undefined,
        contactName: undefined,
        value: "",
        job: "",
        position: "",
        contactAddress: "",
        contactAddressNote: "",
        description: "",
      },
    ]);
  };

  const handleCancel = () => {
    resetModal();
    onClose();
  };

  // Build request body from form values + contact rows state
  const buildBody = (values) => ({
    id: record?.taxExemptionId || null,
    documentNumber: values.documentNumber,
    documentDate: values.documentDate,
    apphierId: values.apphierId,
    contactInformation: contactRows
      .filter((r) => r.contactName)
      .map((r) => ({
        distributionMedia: r.distributionMedia,
        contactName: r.contactNameLabel || "",
        value: r.value || "",
        job: r.job || "",
        position: r.position || "",
        contactAddress: r.contactAddress || "",
        contactAddressAdditionalNotes: r.contactAddressNote || "",
        description: r.description || "",
      })),
  });

  const handleSubmit = async () => {
    if (listDataAttachment.length === 0) {
      setCurrentStep(2);
      return;
    }
    try {
      const values = await form.validateFields();

      // Validate with backend before showing confirm modal
      const isValid = await dispatch(
        validateCreateUpdate({
          body: buildBody(values),
          services: ratingBillingHttpService,
          endPoint: "/v1/dbs/api/tax-exemption/validate-create",
          type: "create",
        }),
      )
        .unwrap()
        .then(() => true)
        .catch(() => false);

      if (isValid) {
        setBodyData(values);
        setModalConfirm(true);
      }
    } catch (e) {
      // form validation failed, stay on current step
    }
  };

  const handleConfirm = () => {
    setLoadingSave(true);
    setModalConfirm(false);

    dispatch(createTaxExemption({ body: buildBody(bodyData) }))
      .unwrap()
      .then(async (dataForm) => {
        const referenceId = dataForm?.id;
        for (let i = 0; i < listDataAttachment.length; i++) {
          const element = listDataAttachment[i];
          await dispatch(
            uploadTaxExemptionAttachment({
              referenceId,
              files: element.file,
              categoryId: element.fileCategoryId,
            }),
          );
        }
        setLoadingSave(false);
        resetModal();
        onSubmit(dataForm);
        onClose();
      })
      .catch((error) => {
        setLoadingSave(false);
        const message =
          error?.message || error?.toString() || "Something went wrong";
        setBodyError({ message });
        setModalError(true);
      });
  };

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setSelectedHierarchy(undefined);
      setAppHierDataDetail([]);
      form.resetFields();
    }
  }, [isOpen, form]);

  const footerButtons = (
    <div className="flex w-full justify-between items-center">
      <ButtonComponent
        onClick={handleCancel}
        className="!border-[#0075BF] !text-[#0075BF]"
      >
        Cancel
      </ButtonComponent>
      <div className="flex gap-2">
        <Button
          disabled={currentStep === 0}
          onClick={handlePrev}
          style={{
            backgroundColor: currentStep === 0 ? "#E0E3E9" : "#fff",
            borderColor: currentStep === 0 ? "#E0E3E9" : "#DADDE5",
            color: currentStep === 0 ? "#BFC4D0" : "#4B465C",
            borderRadius: 6,
            height: 32,
            fontSize: 12,
            border: "1px solid #DADDE5",
          }}
        >
          Previous
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button
            onClick={handleNext}
            type="primary"
            style={{
              backgroundColor: "#0075BF",
              borderColor: "#0075BF",
              borderRadius: 6,
              height: 32,
              fontSize: 12,
            }}
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            type="primary"
            loading={loadingSave}
            style={{
              backgroundColor: "#388E3C",
              borderColor: "#388E3C",
              borderRadius: 6,
              height: 32,
              fontSize: 12,
            }}
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <ModalCustom
        isOpen={isOpen}
        handleCancel={handleCancel}
        width={1200}
        footer={footerButtons}
        header="Create Tax Exemption"
        hidePadding={true}
      >
        <div style={{ padding: "4px 8px 0" }}>
          <ModalStepper
            steps={steps}
            current={currentStep}
            onPrev={handlePrev}
            onNext={() => {
              if (currentStep < steps.length - 1) handleNext();
            }}
          />
        </div>
        <Form form={form} layout="vertical">
          <div
            style={{
              maxHeight: "60vh",
              overflowY: "auto",
              paddingRight: 4,
            }}
          >
            {/* Step 1: Tax Exemption */}
            <div className={currentStep !== 0 ? "hidden" : ""}>
              <TaxExemptionStep
                form={form}
                record={record}
                dispatch={dispatch}
                contactRows={contactRows}
                setContactRows={setContactRows}
                contactRowErrors={contactRowErrors}
                setContactRowErrors={setContactRowErrors}
              />
            </div>

            {/* Step 2: Approval */}
            <div className={currentStep !== 1 ? "hidden" : "p-3"}>
              <ApprovalStep
                appHierOptions={appHierOptions}
                appHierDataDetail={appHierDataDetail}
                selectedHierarchy={selectedHierarchy}
                setSelectedHierarchy={setSelectedHierarchy}
                dispatch={dispatch}
                form={form}
              />
            </div>

            {/* Step 3: Attachment */}
            <div className={currentStep !== 2 ? "hidden" : "p-3"}>
              <AttachmentStep
                listDataAttachment={listDataAttachment}
                setListDataAttachment={setListDataAttachment}
                dispatch={dispatch}
              />
            </div>
          </div>
        </Form>
      </ModalCustom>

      {/* Confirmation Modal */}
      <ModalCustom
        isOpen={modalConfirm}
        handleCancel={() => setModalConfirm(false)}
        header="CONFIRMATION"
        width={500}
        type="confirmation"
        footer={
          <div className="w-full flex justify-end gap-3 p-4">
            <ButtonComponent
              onClick={() => setModalConfirm(false)}
              type="default"
            >
              Cancel
            </ButtonComponent>
            <ButtonComponent
              className="!bg-[#28a745] !border-[#28a745] hover:!bg-[#218838]"
              isPrimary
              onClick={handleConfirm}
              loading={loadingSave}
            >
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-center gap-2">
            <WarningOutlined style={{ color: "#FF9800", fontSize: 20 }} />
            <span className="font-semibold text-sm">
              Are you sure you want to submit this Tax Exemption?
            </span>
          </div>
          <div className="text-sm text-gray-600">
            <p>
              <span className="font-medium">Document Number:</span>{" "}
              {bodyData?.documentNumber || "-"}
            </p>
            <p>
              <span className="font-medium">Document Date:</span>{" "}
              {bodyData?.documentDate
                ? typeof bodyData.documentDate === "string"
                  ? bodyData.documentDate
                  : bodyData.documentDate.format?.("DD MMM YYYY") || "-"
                : "-"}
            </p>
          </div>
        </div>
      </ModalCustom>

      {/* Error Modal */}
      <ModalError
        isOpen={modalError}
        handleOk={() => {
          setModalError(false);
          handleConfirm();
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
          <p className="pl-[70px]">
            Your data was not created. {bodyError.message}.
          </p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </>
  );
};

export default ModalCreateTaxExemption;
