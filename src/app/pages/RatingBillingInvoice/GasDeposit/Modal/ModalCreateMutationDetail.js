import React, { useState, useEffect, useRef } from "react";
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
  getPeriodOptions,
  getUomOptions,
  getMutationTypeOptions,
  getTypeOptions,
  createMutationDetail,
  getCategoryListGasDeposit,
} from "../../../../../redux/slices/rating_billing_invoice/gasDeposit";

const ModalCreateMutationDetail = ({
  isOpen,
  handleCancel = () => {},
  handleRefresh = () => {},
  selectedData = {},
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { data_approval, data_approval_list, loading } = useSelector(
    (state) => state.billing,
  );

  const {
    data_period_options: periodOptions,
    data_uom_options: uomOptions,
    data_mutation_type_options: mutationTypeOptions,
    data_type_options: typeOptions,
  } = useSelector((state) => state.gasDeposit);

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
      dispatch(getPeriodOptions());
      dispatch(getUomOptions());
      dispatch(getMutationTypeOptions());
      dispatch(getTypeOptions());
      dispatch(getAllApprovalList());
    }
  }, [dispatch, isOpen]);

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
    { title: "MUTATION DETAIL" },
    { title: "APPROVAL" },
    { title: "ATTACHMENT" },
  ];

  const handleNext = async () => {
    if (currentStep === 0) {
      try {
        await form.validateFields([
          "period",
          "mutationDate",
          "mutationType",
          "uom",
          "volume",
          "price",
          "amount",
          "type",
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

    dispatch(createMutationDetail(body)).then((res) => {
      if (!res.error) {
        handleCancelForm();
        handleRefresh();
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
          <BaseContainer
            subHeader={
              <p className="-mt-[10px] text-primary">MUTATION DETAIL INFORMATION</p>
            }
            border
            className="mb-3"
          >
            <div className="grid grid-cols-5 gap-3">
            <Form.Item
              label="Period"
              name="period"
              rules={[{ required: true, message: "Please select Period!" }]}
            >
              <SelectComponent
                placeholder="Select Period"
                showSearch
                filterOption={(input, option) =>
                  (option?.children ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {periodOptions.map((opt) => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>

            <Form.Item
              label="Mutation Date"
              name="mutationDate"
              rules={[
                { required: true, message: "Please select Mutation Date!" },
              ]}
            >
              <DateComponent placeholder="Select Mutation Date" />
            </Form.Item>

            <Form.Item
              label="Mutation Type"
              name="mutationType"
              rules={[
                { required: true, message: "Please select Mutation Type!" },
              ]}
            >
              <SelectComponent
                placeholder="Select Mutation Type"
                showSearch
                filterOption={(input, option) =>
                  (option?.children ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {mutationTypeOptions.map((opt) => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>

            <Form.Item
              label="UOM"
              name="uom"
              rules={[{ required: true, message: "Please select UOM!" }]}
            >
              <SelectComponent
                placeholder="Select UOM"
                showSearch
                filterOption={(input, option) =>
                  (option?.children ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {uomOptions.map((opt) => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>

            <Form.Item
              label="Volume"
              name="volume"
              rules={[{ required: true, message: "Please input Volume!" }]}
              getValueFromEvent={(e) => e.floatValue}
            >
              <InputComponent
                type="numeric"
                placeholder="Enter Volume"
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
              />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please input Price!" }]}
              getValueFromEvent={(e) => e.floatValue}
            >
              <InputComponent
                type="numeric"
                placeholder="Enter Price"
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
              />
            </Form.Item>

            <Form.Item
              label="Amount"
              name="amount"
              rules={[{ required: true, message: "Please input Amount!" }]}
              getValueFromEvent={(e) => e.floatValue}
            >
              <InputComponent
                type="numeric"
                placeholder="Enter Amount"
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
              />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: "Please select Type!" }]}
            >
              <SelectComponent
                placeholder="Select Type"
                showSearch
                filterOption={(input, option) =>
                  (option?.children ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {typeOptions.map((opt) => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>

            <Form.Item label="Description" name="description" className="col-span-5">
              <InputComponent
                type="textarea"
                rows={3}
                placeholder="Type description..."
              />
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
