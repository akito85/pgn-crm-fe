import { Form, Select } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import moment from "moment";
import React, { useState } from "react";
import BaseContainer from "../../../../../components/BaseContainer";
import DateComponent from "../../../../../components/DateComponent";
import InputComponent from "../../../../../components/InputComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import { formMessageRequired, requiredMessage } from "../../../../../utils";
import FunctionalTableCriteriaPayment from "./Table/FunctionalTableCriteriaPayment";
import FunctionalTableGLAccountInformation from "./Table/FunctionalTableGLAccountInformation";
import FunctionalTableCategoryInformation from "./Table/FunctionalTableCategoryInformation";

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
  data_select_criteria,
  formValue,
  form,
  storedData,
  setStoredData,
  listDataGLAccountInfo,
  setListDataGLAccountInfo,
  listDataCategoryInfo,
  setListDataCategoryInfo,
  handleSelectCriteria = () => {},
  handleDeselectCriteria = () => {},
  handleClearCriteria = () => {},
  parentRequired = false,
  headerCategory,
  parentOptions = [],
}) => {
  const [categoryCollapsed, setCategoryCollapsed] = useState(false);
  const [glAccountCollapsed, setGLAccountCollapsed] = useState(false);
  const [criteriaCollapsed, setCriteriaCollapsed] = useState(false);

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
        <div className="rc-bank-small">
          {/* Row 1: Account Number, Account Name, Currency, Entity, Type */}
          <div className="w-full grid grid-cols-5 gap-3">
            <Form.Item
              label={"Account Number"}
              name={"accountNumber"}
              rules={formMessageRequired("Account Number")}
            >
              <InputComponent />
            </Form.Item>
            <Form.Item
              label={"Account Name"}
              name={"accountName"}
              rules={formMessageRequired("Account Name")}
            >
              <InputComponent />
            </Form.Item>
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
          {/* Row 2: Category, Start Date, End Date, Parent (conditional), Criteria */}
          <div className="w-full grid grid-cols-5 gap-3">
            <Form.Item
              label={"Category"}
              name={"category"}
              rules={formMessageRequired("Category")}
            >
              <SelectComponent>
                <Select.Option value="Virtual Account">Virtual Account</Select.Option>
                <Select.Option value="Online Payment">Online Payment</Select.Option>
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
            {parentRequired && (
              <Form.Item
                label={"Parent"}
                name={"parent"}
                rules={formMessageRequired("Parent")}
              >
                <SelectComponent
                  allowClear
                  options={parentOptions.map((p) => ({ value: p.id, label: p.label }))}
                />
              </Form.Item>
            )}
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
                    <Select.Option value={data.id} key={index}>
                      {data.text}
                    </Select.Option>
                  ))}
              </SelectComponent>
            </Form.Item>
          </div>
          {/* Row 3: Description full width */}
          <div className="w-full">
            <Form.Item label={"Description"} name={"description"}>
              <InputComponent rows={5} type="textarea" />
            </Form.Item>
          </div>
        </div>
      </BaseContainer>

      {/* Category Information */}
      <div className="drop-shadow-md bg-white rounded-lg w-full mt-[30px] p-[20px]">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setCategoryCollapsed(!categoryCollapsed)}>
          <div className="text-primary text-xs font-bold uppercase">CATEGORY INFORMATION</div>
          <div className="text-primary">
            {categoryCollapsed ? <DownOutlined /> : <UpOutlined />}
          </div>
        </div>
        {!categoryCollapsed && (
          <div className="mt-4 rc-bank-small">
            <FunctionalTableCategoryInformation
              type={type}
              data={listDataCategoryInfo}
              updateData={setListDataCategoryInfo}
              storedData={storedData}
              setStoredData={setStoredData}
              status={status}
              headerCategory={headerCategory}
            />
          </div>
        )}
      </div>

      {/* GL Account Information */}
      <div className="drop-shadow-md bg-white rounded-lg w-full mt-[30px] p-[20px]">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setGLAccountCollapsed(!glAccountCollapsed)}>
          <div className="text-primary text-xs font-bold uppercase">GL ACCOUNT INFORMATION</div>
          <div className="text-primary">
            {glAccountCollapsed ? <DownOutlined /> : <UpOutlined />}
          </div>
        </div>
        {!glAccountCollapsed && (
          <div className="mt-4 rc-bank-small">
            <FunctionalTableGLAccountInformation
              type={type}
              data={listDataGLAccountInfo}
              updateData={setListDataGLAccountInfo}
              storedData={storedData}
              setStoredData={setStoredData}
              status={status}
            />
          </div>
        )}
      </div>

      {/* Criteria Information */}
      <div className="drop-shadow-md bg-white rounded-lg w-full mt-[30px] p-[20px]">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setCriteriaCollapsed(!criteriaCollapsed)}>
          <div className="text-primary text-xs font-bold uppercase">CRITERIA INFORMATION</div>
          <div className="text-primary">
            {criteriaCollapsed ? <DownOutlined /> : <UpOutlined />}
          </div>
        </div>
        {!criteriaCollapsed && (
          <div className="mt-4 rc-bank-small">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountForm;
