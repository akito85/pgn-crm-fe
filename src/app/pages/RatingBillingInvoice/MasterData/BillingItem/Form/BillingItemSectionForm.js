import { Checkbox, Form, Select } from "antd";
import moment from "moment";

// Components
import SelectComponent from "../../../../../../components/SelectComponent";
import InputComponent from "../../../../../../components/InputComponent";
import DateComponent from "../../../../../../components/DateComponent";
import CardContainer from "../../../../../../components/CardContainer";

// Utils
import { formMessageRequired } from "../../../../../../utils";

const BillingItemSectionForm = ({
  type,
  statusDetail = false,
  data_billType = [],
  data_billingItemCategory = [],
  data_typeOptions = [],
  data_criteriaOptions = [],
  onCategoryChange = () => {},
  checkedLateCharge,
  checkedPaymentWarranty,
  checkedInstallmentRestructure,
  onChangeLateCharge = () => {},
  onChangePayment = () => {},
  onChangeInstallmentRestructure = () => {},
  startDate,
  endDate,
  handleStartDate = () => {},
  handleEndDate = () => {},
  mappingData = 0,
  // ✅ Prop baru: disable field Criteria saat ada row yang sedang diedit
  // di tab Criteria Detail, untuk mencegah bug kolom tabel berubah di tengah edit
  isCriteriaDisabled = false,
}) => {
  // ============================================================================
  // DATE VALIDATION HANDLERS
  // ============================================================================

  const disabledStartDate = (current) => {
    return current && current < moment().startOf("day");
  };

  const disabledEndDate = (current) => {
    if (startDate) {
      return moment(startDate) >= current;
    }
    return moment().add(-1, "days") >= current;
  };

  const validateEndDate = (_, value) => {
    if (!value || (value && moment(startDate) <= moment(value))) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error(
        "The end date must be greater than or equal to the start date!",
      ),
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  const isDisabledForUpdate = type === "update" && statusDetail;

  return (
    <CardContainer header="TRANSACTION MAPPING INFORMATION">
      <div className="w-full grid grid-cols-4 gap-x-2 gap-y-0">
        {/* Category */}
        <Form.Item
          label="Category"
          name="billingItemCategory"
          rules={formMessageRequired("Category")}
        >
          <SelectComponent
            disabled={isDisabledForUpdate}
            placeholder="Select"
            onChange={onCategoryChange}
          >
            {data_billingItemCategory?.map((data, index) => (
              <Select.Option value={data.categoryId} key={index}>
                {data.name}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        {/* Type */}
        <Form.Item label="Type" name="type" rules={formMessageRequired("Type")}>
          <SelectComponent disabled={isDisabledForUpdate} placeholder="Select">
            {data_typeOptions?.map((data, index) => (
              <Select.Option value={data.id} key={index}>
                {data.name}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        {/* Transaction Mapping Code */}
        <Form.Item
          label="Transaction Mapping Code"
          name="transactionMappingCode"
        >
          <InputComponent
            type="text"
            disabled={true}
            placeholder="{category_number}"
          />
        </Form.Item>

        {/* Name */}
        <Form.Item label="Name" name="name" rules={formMessageRequired("Name")}>
          <InputComponent
            type="text"
            disabled={isDisabledForUpdate}
            maxLength={100}
            placeholder="Type here.."
          />
        </Form.Item>

        {/* Bill Type */}
        <Form.Item
          label="Bill Type"
          name="billType"
          rules={formMessageRequired("Bill Type")}
        >
          <SelectComponent disabled={isDisabledForUpdate} placeholder="Select">
            {data_billType?.map((data, index) => (
              <Select.Option value={data.id} key={index}>
                {data.name}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        {/* Criteria */}
        {/* ✅ disabled ketika isCriteriaDisabled=true (ada row yang sedang diedit
            di Criteria Detail tab), untuk mencegah kolom tabel berubah di tengah edit */}
        <Form.Item
          label="Criteria"
          name="criteria"
          rules={formMessageRequired("Criteria")}
          tooltip={
            isCriteriaDisabled
              ? "Finish editing the Criteria Detail table first before changing criteria type"
              : undefined
          }
        >
          <SelectComponent
            placeholder="Select"
            disabled={isCriteriaDisabled}
          >
            {data_criteriaOptions?.map((data, index) => (
              <Select.Option value={data.id} key={index}>
                {data.name}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        {/* Start Date */}
        <Form.Item
          label="Start Date"
          name="startDate"
          rules={formMessageRequired("Start Date")}
        >
          <DateComponent
            dateDisable={disabledStartDate}
            onChange={handleStartDate}
            disabled={isDisabledForUpdate || mappingData > 0}
            placeholder="Select Start Date"
          />
        </Form.Item>

        {/* End Date */}
        <Form.Item
          label="End Date"
          name="endDate"
          rules={[{ validator: validateEndDate }]}
        >
          <DateComponent
            disabled={mappingData > 0}
            dateDisable={disabledEndDate}
            onChange={handleEndDate}
            placeholder="Select End Date"
          />
        </Form.Item>

        {/* Description */}
        <div className="col-span-4">
          <Form.Item
            label="Description"
            name="description"
            rules={formMessageRequired("Description")}
          >
            <InputComponent type="textarea" rows={4} />
          </Form.Item>
        </div>

        {/* Late Charge Checkbox */}
        <Form.Item name="lateCharge" valuePropName="checked" noStyle>
          <div className="flex flex-col pt-0 col-span-1">
            <Checkbox checked={checkedLateCharge} onChange={onChangeLateCharge}>
              Late Charge Object
            </Checkbox>
            <span className="text-xs text-[#92979D]">
              Click or tap this checkbox if late charge applied to this item
            </span>
          </div>
        </Form.Item>

        {/* Payment Warranty Checkbox */}
        <Form.Item name="paymentWarranty" valuePropName="checked" noStyle>
          <div className="flex flex-col pt-0 col-span-2">
            <Checkbox
              checked={checkedPaymentWarranty}
              onChange={onChangePayment}
            >
              Payment Warranty Deduction Object
            </Checkbox>
            <span className="text-xs text-[#92979D]">
              Click or tap this checkbox if this item is included in payment
              warranty deduction list
            </span>
          </div>
        </Form.Item>

        {/* Installment/Restructure Checkbox */}
        <Form.Item
          name="installmentRestructure"
          valuePropName="checked"
          noStyle
        >
          <div className="flex flex-col pt-0">
            <Checkbox
              checked={checkedInstallmentRestructure}
              onChange={onChangeInstallmentRestructure}
            >
              Installment / Restructure
            </Checkbox>
            <span className="text-xs text-[#92979D]">
              Click or tap this checkbox to apply installment or restructuring
              terms to this item
            </span>
          </div>
        </Form.Item>
      </div>
    </CardContainer>
  );
};

export default BillingItemSectionForm;