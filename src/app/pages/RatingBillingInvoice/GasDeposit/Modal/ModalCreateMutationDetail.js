import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Steps, Form, Select } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../components/ButtonComponent";
import InputComponent from "../../../../../components/InputComponent";
import DateComponent from "../../../../../components/DateComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import BaseContainer from "../../../../../components/BaseContainer";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import { configApp } from "../../../../../constants/configApp";
import { getConfigFileRBIData } from "../../../../../redux/slices/attachmentSlice";
import {
  getAllApprovalList,
  getListApprovalById,
} from "../../../../../redux/slices/rating_billing_invoice/billing";
import {
  getUomOptions,
  getMutationTypeOptions,
  createMutationDetail,
  getCategoryListGasDeposit,
} from "../../../../../redux/slices/rating_billing_invoice/gasDeposit";

const BILLING_PERIOD_OPTIONS = [
  { label: "JAN 26", value: "JAN 26" },
  { label: "JUL 26", value: "JUL 26" },
  { label: "AUG 26", value: "AUG 26" },
  { label: "DEC 26", value: "DEC 26" },
];

const CATEGORY_OPTIONS = [
  { label: "Billing Adjustment", value: "Billing Adjustment" },
  { label: "Expired", value: "Expired" },
  { label: "Cancel Expired", value: "Cancel Expired" },
  { label: "Redeem", value: "Redeem" },
];

const ModalCreateMutationDetail = ({
  isOpen,
  handleCancel = () => {},
  handleRefresh = () => {},
  selectedData = {},
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { data_approval, data_approval_list } = useSelector(
    (state) => state.billing,
  );

  const {
    data_uom_options: uomOptions,
    data_mutation_type_options: mutationTypeOptions,
  } = useSelector((state) => state.gasDepositRbi);

  // Step state
  const [currentStep, setCurrentStep] = useState(0);

  // Approval state
  const [selectedHierarchy, setSelectedHierarchy] = useState(undefined);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [boolean, setBoolean] = useState(false);

  // Attachment state
  const [listDataAttachment, setListDataAttachment] = useState([]);

  // Fetch dropdown options & approval list
  useEffect(() => {
    if (isOpen) {
      dispatch(getUomOptions());
      dispatch(getMutationTypeOptions());
      dispatch(getAllApprovalList());
      form.setFieldsValue({
        source: "MANUAL",
        type: "Adjustment",
        price: "{value}",
        amount: "{value}",
      });
    }
  }, [dispatch, isOpen, form]);

  // Map approval hierarchy list to options
  useEffect(() => {
    if (data_approval && data_approval.length > 0) {
      const options = data_approval.map((item) => ({
        name: item.approvalName,
        value: item.appHierId,
      }));
      setAppHierOptions(options);
    } else {
      setAppHierOptions([]);
    }
  }, [data_approval]);

  // Map approval hierarchy detail to table data
  useEffect(() => {
    if (boolean && data_approval_list && data_approval_list.length > 0) {
      const data = data_approval_list.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: (a.employeeDetail || []).map((b, i) => ({
          ...b,
          key: i + 1,
        })),
      }));
      setAppHierDataDetail(data);
    }
  }, [data_approval_list, boolean]);

  const handleSelectHierarchy = (value) => {
    setSelectedHierarchy(value);
    form.setFieldsValue({ apphierId: value });
    dispatch(getListApprovalById(value));
    setBoolean(true);
  };

  // Steps definition
  const steps = [
    { title: "CREATE" },
    { title: "APPROVAL" },
    { title: "ATTACHMENT" },
  ];

  const handleNext = async () => {
    if (currentStep === 0) {
      try {
        await form.validateFields([
          "billingPeriod",
          "mutationDate",
          "mutationType",
          "category",
          "uom",
          "quantity",
          "description",
        ]);
      } catch {
        return;
      }
    }

    if (currentStep === 1) {
      try {
        await form.validateFields(["apphierId"]);
      } catch {
        return;
      }
    }

    setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const handlePrev = () => setCurrentStep((prev) => Math.max(0, prev - 1));

  const handleCancelForm = () => {
    form.resetFields();
    setCurrentStep(0);
    setSelectedHierarchy(undefined);
    setAppHierDataDetail([]);
    setBoolean(false);
    setListDataAttachment([]);
    handleCancel();
  };

  const handleSave = () => {
    const values = form.getFieldsValue();
    const body = {
      ...values,
      gasDepositId: selectedData?.gasDepositId,
      attachments: listDataAttachment,
    };

    // Used in create page slicing before gasDepositId exists
    if (!selectedData?.gasDepositId) {
      handleCancelForm();
      handleRefresh(values);
      return;
    }

    dispatch(createMutationDetail(body)).then((res) => {
      if (!res.error) {
        handleCancelForm();
        handleRefresh(values);
      }
    });
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <ModalCustom
      isOpen={isOpen}
      type="confirmation"
      header="Create Mutation Detail"
      handleCancel={handleCancelForm}
      width={1000}
      footer={
        <div className="flex w-full justify-between items-center">
          <div>
            {currentStep < steps.length - 1 && (
              <ButtonComponent type={"default"} onClick={handleCancelForm}>
                Cancel
              </ButtonComponent>
            )}
          </div>
          <div className="flex gap-x-3">
            {currentStep > 0 && (
              <ButtonComponent onClick={handlePrev} type={"default"}>
                Previous
              </ButtonComponent>
            )}
            {currentStep < steps.length - 1 && (
              <ButtonComponent onClick={handleNext} type={"submit"}>
                Next
              </ButtonComponent>
            )}
            {currentStep === steps.length - 1 && (
              <ButtonComponent type={"submit"} onClick={handleSave}>
                Submit
              </ButtonComponent>
            )}
          </div>
        </div>
      }
    >
      {/* Stepper */}
      <div className="flex flex-row items-center justify-center py-2">
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: currentStep > 0 ? "transparent" : "#E0E0E0",
            border: currentStep > 0 ? "1px solid #0075BF" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: currentStep > 0 ? "pointer" : "not-allowed",
            flexShrink: 0,
          }}
          onClick={() => currentStep > 0 && handlePrev()}
        >
          <LeftOutlined
            style={{
              fontSize: 12,
              color: currentStep > 0 ? "#0075BF" : "#BDBDBD",
            }}
          />
        </div>
        <div className="flex-1 px-4">
          <Steps
            current={currentStep}
            items={items}
            labelPlacement="vertical"
            size="small"
            style={{ width: `${steps.length * 180}px`, margin: "0 auto" }}
          />
        </div>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor:
              currentStep < steps.length - 1 ? "transparent" : "#E0E0E0",
            border:
              currentStep < steps.length - 1 ? "1px solid #0075BF" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor:
              currentStep < steps.length - 1 ? "pointer" : "not-allowed",
            flexShrink: 0,
          }}
          onClick={() => currentStep < steps.length - 1 && handleNext()}
        >
          <RightOutlined
            style={{
              fontSize: 12,
              color:
                currentStep < steps.length - 1 ? "#0075BF" : "#BDBDBD",
            }}
          />
        </div>
      </div>

      <Form layout="vertical" form={form} id="formMutationDetail">
        {/* ========== STEP 1: MUTATION DETAIL FORM ========== */}
        <div
          className={`steps-content my-[20px] ${currentStep !== 0 ? "hidden" : ""}`}
        >
          <BaseContainer border header="MUTATION INFORMATION" className="mb-3">
            <div className="grid grid-cols-5 gap-3">
              <Form.Item
                label="Source"
                name="source"
                rules={[{ required: true, message: "Please input Source!" }]}
                style={{ marginBottom: 0 }}
              >
                <InputComponent disabled placeholder="MANUAL" />
              </Form.Item>

              <Form.Item
                label="Billing Period"
                name="billingPeriod"
                rules={[{ required: true, message: "Please select Billing Period!" }]}
                style={{ marginBottom: 0 }}
              >
                <SelectComponent placeholder="Select Billing Period" options={BILLING_PERIOD_OPTIONS} />
              </Form.Item>

              <Form.Item
                label="Mutation Date"
                name="mutationDate"
                rules={[{ required: true, message: "Please select Mutation Date!" }]}
                style={{ marginBottom: 0 }}
              >
                <DateComponent placeholder="Select Date" />
              </Form.Item>

              <Form.Item
                label="Mutation Type"
                name="mutationType"
                rules={[{ required: true, message: "Please select Mutation Type!" }]}
                style={{ marginBottom: 0 }}
              >
                <SelectComponent placeholder="Select Mutation Type">
                  {mutationTypeOptions.map((opt) => (
                    <Select.Option key={opt.value} value={opt.value}>
                      {opt.label}
                    </Select.Option>
                  ))}
                </SelectComponent>
              </Form.Item>

              <Form.Item
                label="Select Category"
                name="category"
                rules={[{ required: true, message: "Please select Category!" }]}
                style={{ marginBottom: 0 }}
              >
                <SelectComponent placeholder="Select Category" options={CATEGORY_OPTIONS} />
              </Form.Item>

              <Form.Item
                label="UOM"
                name="uom"
                rules={[{ required: true, message: "Please select UOM!" }]}
                style={{ marginBottom: 0 }}
              >
                <SelectComponent placeholder="Select UOM">
                  {uomOptions.map((opt) => (
                    <Select.Option key={opt.value} value={opt.value}>
                      {opt.label}
                    </Select.Option>
                  ))}
                </SelectComponent>
              </Form.Item>

              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[{ required: true, message: "Please input Quantity!" }]}
                style={{ marginBottom: 0 }}
              >
                <InputComponent placeholder="Input.." />
              </Form.Item>

              <Form.Item label="Price" name="price" style={{ marginBottom: 0 }}>
                <InputComponent disabled placeholder="{value}" />
              </Form.Item>

              <Form.Item label="Amount" name="amount" style={{ marginBottom: 0 }}>
                <InputComponent disabled placeholder="{value}" />
              </Form.Item>

              <Form.Item label="Type" name="type" style={{ marginBottom: 0 }}>
                <InputComponent disabled placeholder="Adjustment" />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                className="col-span-5"
                style={{ marginBottom: 0 }}
              >
                <InputComponent type="textarea" rows={3} placeholder="Input.." />
              </Form.Item>
            </div>
          </BaseContainer>
        </div>

        {/* ========== STEP 2: APPROVAL INFORMATION ========== */}
        <div
          className={`steps-content my-[20px] ${currentStep !== 1 ? "hidden" : ""}`}
        >
          <p className="text-primary uppercase font-bold mb-4">
            Approval Information
          </p>

          <ApprovalComponentGeneral
            type="create"
            dataTable={appHierDataDetail}
            dataOption={appHierOptions}
            selectedHierarchy={selectedHierarchy}
            updateSelectedHierarchy={handleSelectHierarchy}
          />
        </div>

        {/* ========== STEP 3: ATTACHMENT ========== */}
        <div
          className={`steps-content my-[20px] ${currentStep !== 2 ? "hidden" : ""}`}
        >
          <p className="text-primary uppercase font-bold mb-4">
            Attachment Information
          </p>

          <AttachmentComponent
            type="create"
            typeSelector="gasDeposit"
            data={listDataAttachment}
            updateData={setListDataAttachment}
            dispatch={dispatch}
            getAPICategory={getCategoryListGasDeposit}
            service={ratingBillingHttpService}
            configApplication={configApp.RATING_BILLING_SERVICE}
            getAPIGuard={getConfigFileRBIData}
            typeRBI="data"
          />
        </div>
      </Form>
    </ModalCustom>
  );
};

export default ModalCreateMutationDetail;
