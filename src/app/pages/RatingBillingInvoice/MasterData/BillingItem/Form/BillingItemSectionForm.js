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
  data_glAccount = [],
  checkedLateCharge,
  checkedPaymentWarranty,
  onChangeLateCharge = () => {},
  onChangePayment = () => {},
  startDate,
  endDate,
  handleStartDate = () => {},
  handleEndDate = () => {},
  mappingData = 0,
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

  return (
    <Fragment>
      <BaseContainer header={"BILLING ITEM INFORMATION"}>
        <div className="w-full grid grid-cols-3 gap-3">
          <Form.Item
            label={"Billing Item Category"}
            name={"billingItemCategory"}
            rules={formMessageRequired("Billing Item Category")}
          >
            <SelectComponent disabled={type === "update" && statusDetail}>
              {(data_billingItemCategory || [])?.map((data, index) => (
                <Select.Option value={data.id} key={index}>
                  {data.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
          <Form.Item
            // className={"w-full"}
            label={"Name"}
            rules={formMessageRequired("name")}
            name={"name"}
          >
            <InputComponent
              type="text"
              disabled={type === "update" && statusDetail}
              maxLength={100}
            />
          </Form.Item>
          <Form.Item
            label={"Bill Type"}
            name={"billType"}
            rules={formMessageRequired("Bill Type")}
          >
            <SelectComponent disabled={type === "update" && statusDetail}>
              {(data_billType || [])?.map((data, index) => (
                <Select.Option value={data.id} key={index}>
                  {data.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
          <Form.Item
            // className={"w-full"}
            label={"Start Date"}
            rules={formMessageRequired("Start Date")}
            name={"startDate"}
          >
            <DateComponent
              dateDisable={disabledDate}
              onChange={(e) => handleStartDate(e)}
              disabled={(type === "update" && statusDetail) || mappingData > 0}
            />
          </Form.Item>
          <Form.Item
            // className={"w-full"}
            label={"End Date"}
            name={"endDate"}
            rules={[
              {
                validator: (_, value) =>
                  (value && moment(startDate) <= moment(value)) || !value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error(
                          "The end date must be greater than or equal to the start date!",
                        ),
                      ),
              },
              // { message: requiredMessage("End Date"), required: true },
            ]}
          >
            <DateComponent
              disabled={mappingData > 0}
              dateDisable={handleDisableEndDate}
              onChange={(e) => handleEndDate(e)}
            />
          </Form.Item>
          <Form.Item
            className="col-span-3"
            label={"GL Account"}
            // rules={formMessageRequired("glaccount")}
            name={"glAccount"}
          >
            <SelectComponent>
              {(data_glAccount || [])?.map((data, index) => (
                <Select.Option value={data.id} key={index}>
                  {data.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
          <div className="col-span-3">
            <Form.Item label={"Description"} name={"description"}>
              <InputComponent type="textarea" />
            </Form.Item>
          </div>
          <Form.Item name="lateCharge" valuePropName="checked" noStyle>
            <div className="flex flex-col pt-[30px]">
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
            <div className="flex flex-col pt-[30px]">
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
        </div>
      </BaseContainer>
    </Fragment>
  );
};

export default BillingItemSectionForm;
