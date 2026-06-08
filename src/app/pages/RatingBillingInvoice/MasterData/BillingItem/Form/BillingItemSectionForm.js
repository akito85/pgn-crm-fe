import { Checkbox, Form, Select } from "antd";
import moment from "moment";
import { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";

// Components
import SelectComponent from "../../../../../../components/SelectComponent";
import InputComponent from "../../../../../../components/InputComponent";
import DateComponent from "../../../../../../components/DateComponent";
import CardContainer from "../../../../../../components/CardContainer";

// Redux
import {
  getBillType,
  getBillingItemCategoryList,
  getBillingItemCriteriaList,
  getBillingItemTypeList,
} from "../../../../../../redux/slices/rating_billing_invoice/billingItem";

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
  checkedBank,
  isReceiptMethodType = false,
  onChangeLateCharge = () => {},
  onChangePayment = () => {},
  onChangeInstallmentRestructure = () => {},
  onChangeBank = () => {},
  startDate,
  endDate,
  handleStartDate = () => {},
  handleEndDate = () => {},
  mappingData = 0,
  criteriaData = 0,
  isCriteriaDisabled = false,
  data_bankList = [],
  data_bankAccountList = [],
  onChangeBankValue = () => {},
}) => {
  const dispatch = useDispatch();

  // Lazy loading state per-dropdown
  const [dropdownLoading, setDropdownLoading] = useState({
    category: false,
    type: false,
    billType: false,
    criteria: false,
  });
  const fetchedRef = useRef({
    category: false,
    type: false,
    billType: false,
    criteria: false,
  });

  const runLazyFetch = useCallback(
    async (key, thunk) => {
      if (fetchedRef.current[key] || dropdownLoading[key]) return;
      setDropdownLoading((prev) => ({ ...prev, [key]: true }));
      try {
        await dispatch(thunk()).unwrap();
        fetchedRef.current[key] = true;
      } catch (_err) {
        // Keep retryable — don't set fetchedRef on failure
      } finally {
        setDropdownLoading((prev) => ({ ...prev, [key]: false }));
      }
    },
    [dispatch, dropdownLoading],
  );

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

  const isDisabledForUpdate = type === "update" && statusDetail;
  const isDateDisabled =
    isDisabledForUpdate || mappingData > 0 || criteriaData > 0;
  const dateDisabledTooltip =
    isDateDisabled && !isDisabledForUpdate
      ? "Please delete all data in Mapping Detail and Criteria Detail tables first before changing the date."
      : undefined;

  return (
    <CardContainer header="TRANSACTION MAPPING INFORMATION">
      <div className="w-full grid grid-cols-5 gap-x-2 gap-y-0">
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
            loading={dropdownLoading.category}
            onDropdownVisibleChange={(open) => {
              if (open) runLazyFetch("category", getBillingItemCategoryList);
            }}
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
          <SelectComponent
            disabled={isDisabledForUpdate}
            placeholder="Select"
            loading={dropdownLoading.type}
            onDropdownVisibleChange={(open) => {
              if (open) runLazyFetch("type", getBillingItemTypeList);
            }}
          >
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
          <SelectComponent
            disabled={isDisabledForUpdate}
            placeholder="Select"
            loading={dropdownLoading.billType}
            onDropdownVisibleChange={(open) => {
              if (open) runLazyFetch("billType", getBillType);
            }}
          >
            {data_billType?.map((data, index) => (
              <Select.Option value={data.id} key={index}>
                {data.name}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

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
            loading={dropdownLoading.criteria}
            onDropdownVisibleChange={(open) => {
              if (open) runLazyFetch("criteria", getBillingItemCriteriaList);
            }}
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
          tooltip={dateDisabledTooltip}
        >
          <DateComponent
            dateDisable={disabledStartDate}
            onChange={handleStartDate}
            disabled={isDateDisabled}
            placeholder="Select Start Date"
          />
        </Form.Item>

        {/* End Date */}
        <Form.Item
          label="End Date"
          name="endDate"
          rules={[{ validator: validateEndDate }]}
          tooltip={dateDisabledTooltip}
        >
          <DateComponent
            disabled={isDateDisabled}
            dateDisable={disabledEndDate}
            onChange={handleEndDate}
            placeholder="Select End Date"
          />
        </Form.Item>

        {checkedBank ? (
          <>
            <Form.Item
              label="Bank"
              name="bankValue"
              rules={formMessageRequired("Bank")}
            >
              <SelectComponent
                placeholder="Select"
                onChange={onChangeBankValue}
              >
                {data_bankList?.map((bank) => (
                  <Select.Option value={bank.bankId} key={bank.bankId}>
                    {bank.bankName}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>

            <Form.Item
              label="Bank Account Number"
              name="bankAccountNumber"
              rules={formMessageRequired("Bank Account Number")}
            >
              <SelectComponent placeholder="Select">
                {data_bankAccountList?.map((account) => (
                  <Select.Option value={account.accountNumber} key={account.id}>
                    {account.accountNumber}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>
          </>
        ) : null}

        {/* Description */}
        <div className="col-span-5">
          <Form.Item
            label="Description"
            name="description"
            rules={formMessageRequired("Description")}
          >
            <InputComponent type="textarea" rows={4} />
          </Form.Item>
        </div>
      </div>

      <div className="flex gap-3 w-full">
        {/* Late Charge Checkbox */}
        <Form.Item name="lateCharge" valuePropName="checked" noStyle>
          <div className="col-span-1 flex flex-col gap-1 pt-1 pb-2 px-3 border border-gray-200 rounded-md bg-gray-50">
            <Checkbox
              checked={checkedLateCharge}
              onChange={onChangeLateCharge}
              disabled={isReceiptMethodType}
              className="font-medium"
            >
              Late Charge Object
            </Checkbox>
            <span className="text-xs text-[#92979D] leading-tight">
              Click or tap this checkbox if late charge applied to this item
            </span>
          </div>
        </Form.Item>

        {/* Payment Warranty Checkbox */}
        <Form.Item name="paymentWarranty" valuePropName="checked" noStyle>
          <div className="col-span-1 flex flex-col gap-1 pt-1 pb-2 px-3 border border-gray-200 rounded-md bg-gray-50">
            <Checkbox
              checked={checkedPaymentWarranty}
              onChange={onChangePayment}
              disabled={isReceiptMethodType}
              className="font-medium"
            >
              Payment Warranty Deduction Object
            </Checkbox>
            <span className="text-xs text-[#92979D] leading-tight">
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
          <div className="col-span-1 flex flex-col gap-1 pt-1 pb-2 px-3 border border-gray-200 rounded-md bg-gray-50">
            <Checkbox
              checked={checkedInstallmentRestructure}
              onChange={onChangeInstallmentRestructure}
              disabled={isReceiptMethodType}
              className="font-medium"
            >
              Installment / Restructure
            </Checkbox>
            <span className="text-xs text-[#92979D] leading-tight">
              Click or tap this checkbox to apply installment or restructuring
              terms to this item
            </span>
          </div>
        </Form.Item>

        <Form.Item name="bank" valuePropName="checked" noStyle>
          <div className="col-span-1 flex flex-col gap-1 pt-1 pb-2 px-3 border border-gray-200 rounded-md bg-gray-50">
            <Checkbox
              checked={checkedBank}
              onChange={onChangeBank}
              className="font-medium"
            >
              Bank
            </Checkbox>
            <span className="text-xs text-[#92979D] leading-tight">
              Click or tap this checkbox to apply bank to this item
            </span>
          </div>
        </Form.Item>
      </div>
    </CardContainer>
  );
};

export default BillingItemSectionForm;
