import { Checkbox, Form, Input, Select } from "antd";
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
  isVA,
  data_select_criteria,
  setIsVA,
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
}) => {
  const [categoryCollapsed, setCategoryCollapsed] = useState(false);
  const [glAccountCollapsed, setGLAccountCollapsed] = useState(false);
  const [criteriaCollapsed, setCriteriaCollapsed] = useState(false);

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
                    <Select.Option value={data.id} key={index}>
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

      {/* Category Information */}
      <div className="drop-shadow-md bg-white rounded-lg w-full mt-[30px] p-[20px]">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setCategoryCollapsed(!categoryCollapsed)}>
          <div className="text-primary text-xs font-bold uppercase">CATEGORY INFORMATION</div>
          <div className="text-primary">
            {categoryCollapsed ? <DownOutlined /> : <UpOutlined />}
          </div>
        </div>
        {!categoryCollapsed && (
          <div className="mt-4">
            <FunctionalTableCategoryInformation
              type={type}
              data={listDataCategoryInfo}
              updateData={setListDataCategoryInfo}
              storedData={storedData}
              setStoredData={setStoredData}
              status={status}
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
          <div className="mt-4">
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
          <div className="mt-4">
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
