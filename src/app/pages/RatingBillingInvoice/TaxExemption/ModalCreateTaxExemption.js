import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Form, Select, Table, Button } from "antd";
import { PlusOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
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

// ─── Step 1: Tax Exemption Form ──────────────────────────────────────────────

const TaxExemptionStep = ({ form, record }) => {
  const [contactRows, setContactRows] = useState([
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

  const distributionMediaOptions = [
    { value: "Email", label: "Email" },
    { value: "Fax", label: "Fax" },
    { value: "Phone", label: "Phone" },
    { value: "WhatsApp", label: "WhatsApp" },
  ];

  const handleAddRow = () => {
    const newRow = {
      key: String(Date.now()),
      distributionMedia: undefined,
      contactName: undefined,
      value: "",
      job: "",
      position: "",
      contactAddress: "",
      contactAddressNote: "",
      description: "",
    };
    setContactRows((prev) => [...prev, newRow]);
  };

  const handleRowChange = (key, field, value) => {
    setContactRows((prev) =>
      prev.map((row) => (row.key === key ? { ...row, [field]: value } : row))
    );
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
      title: "DISTRIBUTION MEDIA",
      dataIndex: "distributionMedia",
      key: "distributionMedia",
      width: 160,
      render: (val, row) => (
        <SelectComponent
          value={val}
          size="small"
          style={{ width: "100%" }}
          placeholder="Select"
          onChange={(v) => handleRowChange(row.key, "distributionMedia", v)}
        >
          {distributionMediaOptions.map((opt) => (
            <Select.Option key={opt.value} value={opt.value}>
              {opt.label}
            </Select.Option>
          ))}
        </SelectComponent>
      ),
    },
    {
      title: "CONTACT NAME",
      dataIndex: "contactName",
      key: "contactName",
      width: 160,
      render: (val, row) => (
        <SelectComponent
          value={val}
          size="small"
          style={{ width: "100%" }}
          placeholder="Select"
          showSearch
          onChange={(v) => handleRowChange(row.key, "contactName", v)}
        >
          {/* TODO: populate from API */}
        </SelectComponent>
      ),
    },
    {
      title: "VALUE",
      dataIndex: "value",
      key: "value",
      width: 150,
      render: (val, row) => (
        <InputComponent
          value={val}
          size="small"
          placeholder="{value}"
          onChange={(e) => handleRowChange(row.key, "value", e.target.value)}
        />
      ),
    },
    {
      title: "JOB",
      dataIndex: "job",
      key: "job",
      width: 120,
      render: (val, row) => (
        <InputComponent
          value={val}
          size="small"
          placeholder="Job"
          onChange={(e) => handleRowChange(row.key, "job", e.target.value)}
        />
      ),
    },
    {
      title: "POSITION",
      dataIndex: "position",
      key: "position",
      width: 160,
      render: (val, row) => (
        <InputComponent
          value={val}
          size="small"
          placeholder="Position"
          onChange={(e) => handleRowChange(row.key, "position", e.target.value)}
        />
      ),
    },
    {
      title: "CONTACT ADDRESS",
      dataIndex: "contactAddress",
      key: "contactAddress",
      width: 200,
      render: (val, row) => (
        <InputComponent
          value={val}
          size="small"
          placeholder="Contact Address"
          onChange={(e) =>
            handleRowChange(row.key, "contactAddress", e.target.value)
          }
        />
      ),
    },
    {
      title: "CONTACT ADDRESS ADDITIONAL NOTE",
      dataIndex: "contactAddressNote",
      key: "contactAddressNote",
      width: 220,
      render: (val, row) => (
        <InputComponent
          value={val}
          size="small"
          placeholder="Additional Note"
          onChange={(e) =>
            handleRowChange(row.key, "contactAddressNote", e.target.value)
          }
        />
      ),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
      width: 180,
      render: (val, row) => (
        <InputComponent
          value={val}
          size="small"
          placeholder="Description"
          onChange={(e) =>
            handleRowChange(row.key, "description", e.target.value)
          }
        />
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
    { label: "Cost Center Code", value: record?.costCenter },
    { label: "Cost Center Name", value: record?.costCenterName },
    { label: "Meter Reading Code", value: record?.meterReadingCode },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Document Number & Document Date */}
      <BaseContainer border>
        <div className="grid grid-cols-2 gap-x-4 py-2">
          <Form.Item
            label="Document Number"
            name="documentNumber"
            rules={[{ required: true, message: "Please input Document Number!" }]}
          >
            <InputComponent placeholder="Type here.." />
          </Form.Item>
          <Form.Item
            label="Document Date"
            name="documentDate"
            rules={[{ required: true, message: "Please select Document Date!" }]}
          >
            <DateComponent placeholder="Select Date" />
          </Form.Item>
        </div>
      </BaseContainer>

      {/* Proforma Invoice */}
      <BaseContainer border>
        <div className="py-2">
          <p className="text-xs text-gray-500 mb-1">Proforma Invoice</p>
          <a
            href="#"
            className="text-primary text-xs"
            style={{ color: "#0075BF" }}
          >
            {record?.proformaInvoice ||
              "proforma-invoice-{customer}-{year}.pdf"}
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
                      <span className="text-primary ml-2" style={{ color: "#0075BF" }}>
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
  form,
}) => {
  return (
    <BaseContainer header="Approval Information">
      <ApprovalComponentGeneral
        type="create"
        dataTable={appHierDataDetail}
        dataOption={appHierOptions}
        selectedHierarchy={selectedHierarchy}
        updateSelectedHierarchy={setSelectedHierarchy}
        form={form}
        fieldName="apphierId"
      />
    </BaseContainer>
  );
};

// ─── Step 3: Attachment ───────────────────────────────────────────────────────

const AttachmentStep = ({
  listDataAttachment,
  setListDataAttachment,
  dispatch,
  getAPICategory,
  typeSelector,
}) => {
  return (
    <BaseContainer header="Attachment Information">
      <AttachmentComponent
        type="create"
        data={listDataAttachment}
        updateData={setListDataAttachment}
        dispatch={dispatch}
        getAPICategory={getAPICategory}
        typeSelector={typeSelector}
        service={null}
        configApplication={configApp.RATING_BILLING_SERVICE}
        getAPIGuard={getConfigFileRBIData}
        typeRBI="data"
        mandatory={true}
      />
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
          border:
            current < steps.length - 1 ? "1px solid #0075BF" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: current < steps.length - 1 ? "pointer" : "not-allowed",
          flexShrink: 0,
        }}
        onClick={() =>
          current < steps.length - 1 && onNext && onNext()
        }
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
  // approval props - pass from parent when redux slice ready
  appHierOptions = [],
  appHierDataDetail = [],
  selectedHierarchy,
  setSelectedHierarchy = () => {},
  // attachment props
  listDataAttachment = [],
  setListDataAttachment = () => {},
  dispatch,
  getAPICategory,
  typeSelector = "taxExemption",
  onSubmit = () => {},
}) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: "TAX EXEMPTION" },
    { title: "APPROVAL" },
    { title: "ATTACHMENT" },
  ];

  const handlePrev = () => setCurrentStep((prev) => Math.max(0, prev - 1));
  const handleNext = () =>
    setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));

  const handleCancel = () => {
    form.resetFields();
    setCurrentStep(0);
    onClose();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (e) {
      // validation failed, stay on current step
    }
  };

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
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
    <Modal
      open={isOpen}
      onCancel={handleCancel}
      className="modal-custom"
      centered
      width={1200}
      maskClosable={false}
      destroyOnClose
      title={
        <div>
          <p
            className="text-primary font-bold text-sm uppercase"
            style={{ color: "#0075BF" }}
          >
            CREATE TAX EXEMPTION
          </p>
          <ModalStepper
            steps={steps}
            current={currentStep}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </div>
      }
      footer={footerButtons}
    >
      <Form form={form} layout="vertical">
        <div
          style={{
            maxHeight: "65vh",
            overflowY: "auto",
            paddingRight: 4,
          }}
        >
          {/* Step 1: Tax Exemption */}
          <div className={currentStep !== 0 ? "hidden" : ""}>
            <TaxExemptionStep form={form} record={record} />
          </div>

          {/* Step 2: Approval */}
          <div className={currentStep !== 1 ? "hidden" : ""}>
            <ApprovalStep
              appHierOptions={appHierOptions}
              appHierDataDetail={appHierDataDetail}
              selectedHierarchy={selectedHierarchy}
              setSelectedHierarchy={setSelectedHierarchy}
              form={form}
            />
          </div>

          {/* Step 3: Attachment */}
          <div className={currentStep !== 2 ? "hidden" : ""}>
            <AttachmentStep
              listDataAttachment={listDataAttachment}
              setListDataAttachment={setListDataAttachment}
              dispatch={dispatch}
              getAPICategory={getAPICategory}
              typeSelector={typeSelector}
            />
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalCreateTaxExemption;
