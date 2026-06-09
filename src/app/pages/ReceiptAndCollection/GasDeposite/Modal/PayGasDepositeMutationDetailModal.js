import React, { useEffect } from "react";
import { Form } from "antd";
import PropTypes from "prop-types";
import moment from "moment";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../components/ButtonComponent";
import InputComponent from "../../../../../components/InputComponent";
import DateComponent from "../../../../../components/DateComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import BaseContainer from "../../../../../components/BaseContainer";

const MUTATION_TYPE_OPTIONS = [
  { label: "Earn", value: "EARN" },
  { label: "Redeem", value: "REDEEM" },
];

const MUTATION_CATEGORY_OPTIONS = [
  { label: "Pemakaian diatas min kontrak", value: "Pemakaian diatas min kontrak" },
  { label: "Koreksi Earn", value: "Koreksi Earn" },
  { label: "Koreksi Redeem", value: "Koreksi Redeem" },
  { label: "Expired", value: "Expired" },
];

const formatDecimal = (value) => {
  if (value === null || value === undefined || value === "") return undefined;
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return undefined;

  // Use more decimal places for small numbers (e.g. IDR→USD rate ~5.8E-5)
  if (numericValue !== 0 && Math.abs(numericValue) < 0.01) {
    return numericValue.toLocaleString("en-US", {
      minimumFractionDigits: 8,
      maximumFractionDigits: 8,
    });
  }

  return numericValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const parseNumericValue = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return value;

  const normalizedValue = String(value)
    .replaceAll(" ", "")
    .replaceAll(",", "");
  const parsedValue = Number(normalizedValue);

  return Number.isNaN(parsedValue) ? 0 : parsedValue;
};

const getEditingValue = (value, fallback = undefined) => (
  value && value !== "-" ? value : fallback
);

const toMomentValue = (value) => {
  if (!value) return undefined;
  if (moment.isMoment(value)) return value;

  const parsed = moment(value);
  return parsed.isValid() ? parsed : undefined;
};

const buildEditingFields = (editingRow, mutationContext, billingPeriodOptions) => ({
  documentNumber: getEditingValue(editingRow.documentNumber),
  type: getEditingValue(editingRow.type),
  category: getEditingValue(editingRow.category),
  mutationDate: toMomentValue(getEditingValue(editingRow.mutationDate)),
  rateType: getEditingValue(editingRow.rateType, mutationContext.rateType),
  rateDate: toMomentValue(getEditingValue(editingRow.rateDate, mutationContext.rateDate)),
  rate: getEditingValue(editingRow.rate, mutationContext.rate),
  amount: editingRow.amount > 0 ? String(editingRow.amount) : undefined,
  eqvBalance: getEditingValue(editingRow.eqvBalance),
  source: getEditingValue(editingRow.source, mutationContext.source),
  period: getEditingValue(
    billingPeriodOptions.find((option) => option.label === editingRow.billingPeriod)?.value ?? editingRow.billingPeriod,
    mutationContext.billingPeriod,
  ),
  description: getEditingValue(editingRow.description),
});

const selectRule = (label) => ([{ required: true, message: `Please select ${label}.` }]);
const inputRule = (label) => ([{ required: true, message: `Please enter ${label}.` }]);

const PayGasDepositeMutationDetailModal = ({
  isOpen,
  handleCancel = () => {},
  handleRefresh = () => {},
  sourceOptions = [],
  billingPeriodOptions = [],
  mutationContext = {},
  editingRow = null,
  typeOptions = MUTATION_TYPE_OPTIONS,
}) => {
  const [form] = Form.useForm();
  const selectedType = Form.useWatch("type", form);
  const isRedeemMutation = String(selectedType || "").trim().toUpperCase() === "REDEEM";

  useEffect(() => {
    if (!isOpen) return;

    if (editingRow) {
      form.setFieldsValue(buildEditingFields(editingRow, mutationContext, billingPeriodOptions));
    } else {
      form.setFieldsValue({
        rateType: mutationContext.rateType,
        rateDate: mutationContext.rateDate,
        rate: mutationContext.rate,
        source: "Manual",
        period: mutationContext.billingPeriod,
        eqvBalance: undefined,
      });
    }
  }, [form, isOpen, mutationContext, editingRow, billingPeriodOptions]);

  const handleAmountChange = (event) => {
    const amount = parseNumericValue(event?.target?.value);
    const rate = parseNumericValue(form.getFieldValue("rate"));
    form.setFieldsValue({
      eqvBalance: formatDecimal(amount * rate),
    });
  };

  const handleClose = () => {
    form.resetFields();
    handleCancel();
  };

  const handleNext = async () => {
    const fieldsToValidate = [
      "documentNumber",
      "type",
      "category",
      "mutationDate",
      "rateType",
      "rateDate",
      "rate",
      "amount",
      "eqvBalance",
      "source",
      "period",
      "description",
    ];

    let values;
    try {
      values = await form.validateFields(fieldsToValidate);
    } catch {
      return;
    }

    const shouldClose = await Promise.resolve(handleRefresh(values));
    const shouldRemainOpen = Object.is(shouldClose, false);
    if (shouldRemainOpen) return;
    handleClose();
  };

  return (
    <ModalCustom
      isOpen={isOpen}
      type="confirmation"
      header="CREATE MUTATION DETAIL"
      handleCancel={handleClose}
      width={1100}
      footer={(
        <div className="flex w-full justify-between items-center">
          <ButtonComponent type="default" onClick={handleClose}>
            cancel
          </ButtonComponent>
          <div className="flex gap-x-3">
            <ButtonComponent type="default" disabled>
              Previous
            </ButtonComponent>
            <ButtonComponent type="submit" onClick={handleNext}>
              Next
            </ButtonComponent>
          </div>
        </div>
      )}
    >
      <Form layout="vertical" form={form}>
        <BaseContainer border header="MUTATION INFORMATION" className="mb-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <Form.Item
              label="Document Number"
              name="documentNumber"
              rules={inputRule("a document number")}
              style={{ marginBottom: 0 }}
            >
              <InputComponent placeholder="Input Document Number" />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={selectRule("a type")}
              style={{ marginBottom: 0 }}
            >
              <SelectComponent placeholder="Select Type" options={typeOptions} />
            </Form.Item>

            <Form.Item
              label="Category"
              name="category"
              rules={selectRule("a category")}
              style={{ marginBottom: 0 }}
            >
              <SelectComponent placeholder="Select Category" options={MUTATION_CATEGORY_OPTIONS} />
            </Form.Item>

            <Form.Item
              label="Mutation Date"
              name="mutationDate"
              rules={selectRule("a mutation date")}
              style={{ marginBottom: 0 }}
            >
              <DateComponent placeholder="Select Mutation Date" dateDisable={() => false} />
            </Form.Item>

            <Form.Item
              label="Rate Type"
              name="rateType"
              rules={selectRule("a rate type")}
              style={{ marginBottom: 0 }}
            >
              <InputComponent disabled placeholder="Rate Type" />
            </Form.Item>

            <Form.Item
              label="Rate Date"
              name="rateDate"
              rules={selectRule("a rate date")}
              style={{ marginBottom: 0 }}
            >
              <DateComponent placeholder="Rate Date" dateDisable={() => false} />
            </Form.Item>

            <Form.Item
              label="Rate"
              name="rate"
              rules={inputRule("a rate")}
              style={{ marginBottom: 0 }}
            >
              <InputComponent disabled placeholder="Rate" />
            </Form.Item>

            <Form.Item
              label="Amount"
              name="amount"
              rules={inputRule("an amount")}
              style={{ marginBottom: 0 }}
            >
              <InputComponent
                placeholder="Input Amount"
                prefix={isRedeemMutation ? "-" : undefined}
                onChange={handleAmountChange}
              />
            </Form.Item>

            <Form.Item
              label="EQV Balance"
              name="eqvBalance"
              rules={inputRule("an eqv balance")}
              style={{ marginBottom: 0 }}
            >
              <InputComponent
                disabled
                placeholder="EQV Balance"
                prefix={isRedeemMutation ? "-" : undefined}
              />
            </Form.Item>

            <Form.Item
              label="Source"
              name="source"
              rules={selectRule("a source")}
              style={{ marginBottom: 0 }}
            >
              <SelectComponent placeholder="Select Source" options={sourceOptions} />
            </Form.Item>

            <Form.Item
              label="Period"
              name="period"
              rules={selectRule("a period")}
              style={{ marginBottom: 0 }}
            >
              <SelectComponent placeholder="Select Period" options={billingPeriodOptions} />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={inputRule("a description")}
              className="lg:col-span-5"
              style={{ marginBottom: 0 }}
            >
              <InputComponent type="textarea" rows={3} placeholder="Input Description" />
            </Form.Item>
          </div>
        </BaseContainer>
      </Form>
    </ModalCustom>
  );
};

PayGasDepositeMutationDetailModal.propTypes = {
  isOpen: PropTypes.bool,
  handleCancel: PropTypes.func,
  handleRefresh: PropTypes.func,
  sourceOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
  billingPeriodOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
  mutationContext: PropTypes.shape({
    rateType: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rateDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    source: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    billingPeriod: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  editingRow: PropTypes.shape({
    documentNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string,
    category: PropTypes.string,
    rateType: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    eqvBalance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    source: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    billingPeriod: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
  }),
  typeOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
};

export default PayGasDepositeMutationDetailModal;
