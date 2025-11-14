import { Checkbox, Form, Input, Select } from "antd";
import moment from "moment";
import React from "react";
import BaseContainer from "../../../../../components/BaseContainer";
import DateComponent from "../../../../../components/DateComponent";
import InputComponent from "../../../../../components/InputComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import { formMessageRequired, requiredMessage } from "../../../../../utils";
import FunctionalTableCriteriaPayment from "./Table/FunctionalTableCriteriaPayment";

const AccountForm = ({
  listDataCriteria,
  setListDataCriteria,
  criteriaValues,
  setCriteriaValues,
  type,
  status,
  dataCurrency,
  dataEntity,
  typeData,
  isVA,
  data_select_criteria,
  setIsVA,
  formValue,
  form,
  storedData,
  setStoredData,
  // handleSelectCriteria = () => {},
  // handleDeselectCriteria = () => {},
  // handleClearCriteria = () => {},
}) => {
  //dependensi kriteria
  const handleSelectCriteria = (value) => {
    let res = [...criteriaValues, value];
    if (res.includes(13)) {
      res.push(14);
    }
    if (res.includes(14)) {
      res.push(39);
    }
    if (res.includes(39)) {
      res.push(15);
    }
    if (res.includes(20)) {
      res.push(19);
    }
    let outputArray = res.filter((item, index) => res.indexOf(item) === index);
    outputArray = outputArray.includes(24) ? [24] : outputArray;
    setCriteriaValues(outputArray);
    form.setFieldsValue({
      criteria: outputArray,
    });
  };

  const handleDeselectCriteria = (value) => {
    let res = criteriaValues.filter((item) => item !== value);
    if (!res.includes(15)) {
      res = res.filter((item) => item !== 39);
    }
    if (!res.includes(39)) {
      res = res.filter((item) => item !== 14);
    }
    if (!res.includes(14)) {
      res = res.filter((item) => item !== 13);
    }
    if (!res.includes(19)) {
      res = res.filter((item) => item !== 20);
    }
    let outputArray = res.filter((item, index) => res.indexOf(item) === index);
    outputArray = outputArray.includes(24) ? [24] : outputArray;
    setCriteriaValues(outputArray);
    form.setFieldsValue({
      criteria: outputArray,
    });
  };

  const handleClearCriteria = () => {
    setCriteriaValues([]);
  };

  const handlePage = (e) => {
    setIsVA(e.target.checked);
  };

  const disabledDate = (current) => {
    if (
      form.getFieldValue("startDate") === undefined ||
      form.getFieldValue("startDate") === null
    ) {
      return current && current < moment().add(-1, "days");
    } else {
      return current && current < moment(form.getFieldValue("startDate"));
    }
  };

  return (
    <div className="w-full">
      <BaseContainer header={"BANK ACCOUNT INFORMATION"}>
        <div>
          <div className="w-full grid grid-cols-3 gap-3">
            <Form.Item
              label={"Bank Account Number"}
              name={"accountNumber"}
              rules={formMessageRequired("Bank Account Number")}
            >
              <InputComponent />
            </Form.Item>
            <Form.Item
              label={"Bank Account Name"}
              name={"accountName"}
              rules={formMessageRequired("Bank Account Name")}
            >
              <InputComponent />
            </Form.Item>
            <Form.Item
              label={"Branch"}
              name={"branch"}
              rules={formMessageRequired("branch")}
            >
              <InputComponent />
            </Form.Item>
          </div>
          <div className="w-full grid grid-cols-3 gap-3">
            <Form.Item
              label={"Currency"}
              name={"currency"}
              rules={formMessageRequired("Currency")}
            >
              <SelectComponent>
                {dataCurrency?.map((data) => (
                  <Select.Option key={data.id} value={data.id}>
                    {data.name}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>
            <Form.Item
              label={"Entity"}
              name={"entity"}
              rules={formMessageRequired("entity")}
            >
              <SelectComponent>
                {dataEntity?.map((data) => (
                  <Select.Option key={data.id} value={data.id}>
                    {data.name}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>
            <Form.Item
              label={"Type"}
              name={"type"}
              rules={formMessageRequired("type")}
            >
              <SelectComponent>
                {typeData?.map((data) => (
                  <Select.Option key={data.id} value={data.id}>
                    {data.name}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>
          </div>
          <div className="w-full grid grid-cols-3 gap-3">
            <Form.Item
              name={"criteria"}
              rules={[{ message: requiredMessage("Criteria"), required: true }]}
              className={"w-full no-margin-form"}
              label={"Criteria"}
            >
              <SelectComponent
                mode="multiple"
                onSelect={handleSelectCriteria}
                onDeselect={handleDeselectCriteria}
                onClear={handleClearCriteria}
              >
                {data_select_criteria &&
                  data_select_criteria?.map((data, index) => (
                    <Select.Option value={data.Id} key={index}>
                      {data.text}
                    </Select.Option>
                  ))}
              </SelectComponent>
            </Form.Item>

            <Form.Item
              label={"Start Date"}
              name={"startDate"}
              rules={formMessageRequired("Start Date")}
              required
            >
              <DateComponent
                disabledDate={(current) => {
                  return current && current < moment().add(-1, "days");
                }}
              />
            </Form.Item>
            <Form.Item label={"End Date"} name={"endDate"}>
              <DateComponent dateDisable={disabledDate} />
            </Form.Item>
          </div>
          <div className="w-full grid grid-cols-1">
            <Form.Item label={"Description"} name={"description"}>
              <InputComponent rows={5} type="textarea" />
            </Form.Item>
          </div>
          <div>
            <div className="w-full flex justify-end gap-5">
              <div className="w-full grid grid-cols-3 gap-5">
                <Form.Item name={"isVA"}>
                  <div className="flex flex-col pt-[12px]">
                    <Checkbox onChange={handlePage} checked={isVA}>
                      Is VA
                    </Checkbox>
                    <span className="text-[10px]">
                      Click or tap this checkbox if data can be VA.
                    </span>
                  </div>
                </Form.Item>
                {isVA === true ? (
                  <>
                    <Form.Item
                      label={"Total Digit"}
                      name={"totalDigit"}
                      rules={formMessageRequired("Total Digit")}
                    >
                      <Input
                        allowClear
                        maxLength={2}
                        onInput={(e) =>
                          (e.target.value = e.target.value.replace(/\D/g, ""))
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      label={"First Static Code"}
                      name={"fsCode"}
                      rules={formMessageRequired("Fist Static Code")}
                    >
                      <Input
                        allowClear
                        maxLength={8}
                        onInput={(e) =>
                          (e.target.value = e.target.value.replace(/\D/g, ""))
                        }
                      />
                    </Form.Item>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </BaseContainer>
      {/* GL Account section */}

      <BaseContainer header={"GL Accounts"}>
        <div className="w-full grid grid-cols-3 gap-2">
          <Form.Item label={"Cash"} name={"cash"}>
            <SelectComponent
            // mode="multiple"
            // disabled={!addressTable?.map((a) => a.overview)[0] ? true : false}
            >
              {/* {dataBusinessPurpose &&
              dataBusinessPurpose?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))} */}
            </SelectComponent>
          </Form.Item>
          <Form.Item
            label={"Receipt Confirmation"}
            name={"receiptConfirmation"}
          >
            <SelectComponent
            // mode="multiple"
            // disabled={!addressTable?.map((a) => a.overview)[0] ? true : false}
            >
              {/* {dataBusinessPurpose &&
              dataBusinessPurpose?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))} */}
            </SelectComponent>
          </Form.Item>
          <Form.Item label={"Remittance"} name={"remittance"}>
            <SelectComponent
            // mode="multiple"
            // disabled={!addressTable?.map((a) => a.overview)[0] ? true : false}
            >
              {/* {dataBusinessPurpose &&
              dataBusinessPurpose?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))} */}
            </SelectComponent>
          </Form.Item>
        </div>
        <div className="w-full grid grid-cols-3 gap-2">
          <Form.Item label={"Factoring"} name={"factoring"}>
            <SelectComponent
            // mode="multiple"
            // disabled={!addressTable?.map((a) => a.overview)[0] ? true : false}
            >
              {/* {dataBusinessPurpose &&
              dataBusinessPurpose?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))} */}
            </SelectComponent>
          </Form.Item>
          <Form.Item label={"Short Term Debt"} name={"shortTermDebt"}>
            <SelectComponent
            // mode="multiple"
            // disabled={!addressTable?.map((a) => a.overview)[0] ? true : false}
            >
              {/* {dataBusinessPurpose &&
              dataBusinessPurpose?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))} */}
            </SelectComponent>
          </Form.Item>
          <Form.Item label={"Bank Charges"} name={"bankCharges"}>
            <SelectComponent
            // mode="multiple"
            // disabled={!addressTable?.map((a) => a.overview)[0] ? true : false}
            >
              {/* {dataBusinessPurpose &&
              dataBusinessPurpose?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))} */}
            </SelectComponent>
          </Form.Item>
        </div>
        <div className="w-full grid grid-cols-3 gap-2">
          <Form.Item label={"Unapplied Receipt"} name={"unappliedReceipt"}>
            <SelectComponent
            // mode="multiple"
            // disabled={!addressTable?.map((a) => a.overview)[0] ? true : false}
            >
              {/* {dataBusinessPurpose &&
              dataBusinessPurpose?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))} */}
            </SelectComponent>
          </Form.Item>
          <Form.Item
            label={"Unidentified Receipt"}
            name={"unidentifiedReceipt"}
          >
            <SelectComponent
            // mode="multiple"
            // disabled={!addressTable?.map((a) => a.overview)[0] ? true : false}
            >
              {/* {dataBusinessPurpose &&
              dataBusinessPurpose?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))} */}
            </SelectComponent>
          </Form.Item>
          <Form.Item label={"On Account Receipt"} name={"onAccountReceipt"}>
            <SelectComponent
            // mode="multiple"
            // disabled={!addressTable?.map((a) => a.overview)[0] ? true : false}
            >
              {/* {dataBusinessPurpose &&
              dataBusinessPurpose?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))} */}
            </SelectComponent>
          </Form.Item>
        </div>
        <div className="w-full grid grid-cols-3 gap-2">
          <Form.Item label={"Unearned Discount"} name={"unearnedDiscount"}>
            <SelectComponent
            // mode="multiple"
            // disabled={!addressTable?.map((a) => a.overview)[0] ? true : false}
            >
              {/* {dataBusinessPurpose &&
              dataBusinessPurpose?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))} */}
            </SelectComponent>
          </Form.Item>
          <Form.Item label={"Earned Discount"} name={"earnedDiscount"}>
            <SelectComponent
            // mode="multiple"
            // disabled={!addressTable?.map((a) => a.overview)[0] ? true : false}
            >
              {/* {dataBusinessPurpose &&
              dataBusinessPurpose?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))} */}
            </SelectComponent>
          </Form.Item>
        </div>
        <Form.Item label={"Description"} name={"description"}>
          <InputComponent type={"textarea"} />
        </Form.Item>
      </BaseContainer>

      {/* criteria information */}
      <BaseContainer header={"CRITERIA INFORMATION"}>
        <FunctionalTableCriteriaPayment
          type={type}
          data={listDataCriteria}
          dataCriteria={criteriaValues}
          updateData={setListDataCriteria}
          endDateHeader={form.getFieldValue("endDate")}
          storedData={storedData}
          setStoredData={setStoredData}
          disableDate={true}
          required={{ required: true, message: "Please input your" }}
        />
      </BaseContainer>
    </div>
  );
};

export default AccountForm;
