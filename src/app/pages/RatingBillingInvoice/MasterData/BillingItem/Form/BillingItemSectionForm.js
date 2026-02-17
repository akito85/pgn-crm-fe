import React, { Fragment } from "react";
import { Checkbox, Form, Select } from "antd";
import SelectComponent from "../../../../../../components/SelectComponent";
import InputComponent from "../../../../../../components/InputComponent";
import DateComponent from "../../../../../../components/DateComponent";
import { formMessageRequired } from "../../../../../../utils";
import BaseContainer from "../../../../../../components/BaseContainer";
import moment from "moment";

const BillingItemSectionForm = ({
  type,
  statusDetail = false,
  data_billType = [],
  data_billingItemCategory = [],
  data_typeOptions = [], // Tambahkan ini untuk data Type
  data_criteriaOptions = [], // Tambahkan ini untuk data Criteria
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
  selectedCategory = null, // Tambahkan ini untuk generate transaction mapping code
}) => {
  const handleDisableEndDate = (current) => {
    if (startDate !== null) {
      return moment(startDate) >= current;
    }
    return moment().add(-1, "days") >= current;
  };

  const disabledDate = (current) => {
    return false;
  };

  // Generate Transaction Mapping Code berdasarkan category
  const transactionMappingCode = selectedCategory 
    ? `{category_${selectedCategory}}` 
    : "{category_number}";

  return (
    <Fragment>
      <BaseContainer header={"TRANSACTION MAPPING INFORMATION"}>
        <div className="w-full grid grid-cols-5 gap-3">
          {/* Baris 1: 5 kolom */}
          <Form.Item
            label={"Category"}
            name={"billingItemCategory"}
            rules={formMessageRequired("Category")}
          >
            <SelectComponent 
              disabled={type === "update" && statusDetail}
              placeholder="Select"
            >
              {(data_billingItemCategory || [])?.map((data, index) => (
                <Select.Option value={data.id} key={index}>
                  {data.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Type"}
            name={"type"}
            rules={formMessageRequired("Type")}
          >
            <SelectComponent 
              disabled={type === "update" && statusDetail}
              placeholder="Select"
            >
              {(data_typeOptions || [])?.map((data, index) => (
                <Select.Option value={data.id} key={index}>
                  {data.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Transaction Mapping Code"}
            name={"transactionMappingCode"}
          >
            <InputComponent
              type="text"
              disabled={true}
              value={transactionMappingCode}
              placeholder="{category_number}"
            />
          </Form.Item>

          <Form.Item
            label={"Name"}
            rules={formMessageRequired("Name")}
            name={"name"}
          >
            <InputComponent
              type="text"
              disabled={type === "update" && statusDetail}
              maxLength={100}
              placeholder="Type here.."
            />
          </Form.Item>

          <Form.Item
            label={"Bill Type"}
            name={"billType"}
            rules={formMessageRequired("Bill Type")}
          >
            <SelectComponent 
              disabled={type === "update" && statusDetail}
              placeholder="Select"
            >
              {(data_billType || [])?.map((data, index) => (
                <Select.Option value={data.id} key={index}>
                  {data.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          {/* Baris 2: 3 kolom (dengan 2 kolom kosong di kanan) */}
          <Form.Item
            label={"Criteria"}
            name={"criteria"}
            rules={formMessageRequired("Criteria")}
          >
            <SelectComponent placeholder="Select">
              {(data_criteriaOptions || [])?.map((data, index) => (
                <Select.Option value={data.id} key={index}>
                  {data.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Start Date"}
            rules={formMessageRequired("Start Date")}
            name={"startDate"}
          >
            <DateComponent
              dateDisable={disabledDate}
              onChange={(e) => handleStartDate(e)}
              disabled={(type === "update" && statusDetail) || mappingData > 0}
              placeholder="Select Start Date"
            />
          </Form.Item>

          <Form.Item
            label={"End Date"}
            name={"endDate"}
            rules={[
              {
                validator: (_, value) =>
                  (value && moment(startDate) <= moment(value)) || !value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error(
                          "The end date must be greater than or equal to the start date!"
                        )
                      ),
              },
            ]}
          >
            <DateComponent
              disabled={mappingData > 0}
              dateDisable={handleDisableEndDate}
              onChange={(e) => handleEndDate(e)}
              placeholder="Select End Date"
            />
          </Form.Item>

          {/* 2 kolom kosong untuk menyamakan dengan layout 5 kolom */}
          <div></div>
          <div></div>

          {/* Baris 3: Description full width (span 5 kolom) */}
          <div className="col-span-5">
            <Form.Item 
              label={"Description"} 
              name={"description"}
              rules={formMessageRequired("Description")}
            >
              <InputComponent type="textarea" rows={4} />
            </Form.Item>
          </div>

          {/* Baris 4: 3 Checkboxes (masing-masing 1-2 kolom) */}
          <Form.Item name="lateCharge" valuePropName="checked" noStyle>
            <div className="flex flex-col pt-[30px] col-span-2">
              <Checkbox
                checked={checkedLateCharge}
                onChange={onChangeLateCharge}
              >
                Late Charge Object
              </Checkbox>
              <span className="text-xs text-[#92979D]">
                Click or tap this checkbox if late charge applied to this item
              </span>
            </div>
          </Form.Item>

          <Form.Item name="paymentWarranty" valuePropName="checked" noStyle>
            <div className="flex flex-col pt-[30px] col-span-2">
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

          <Form.Item name="installmentRestructure" valuePropName="checked" noStyle>
            <div className="flex flex-col pt-[30px]">
              <Checkbox
                checked={checkedInstallmentRestructure}
                onChange={onChangeInstallmentRestructure}
              >
                Installment / Restructure
              </Checkbox>
              <span className="text-xs text-[#92979D]">
                Click or tap this checkbox to apply installment or restructuring terms to this item
              </span>
            </div>
          </Form.Item>
        </div>
      </BaseContainer>
    </Fragment>
  );
};

export default BillingItemSectionForm;