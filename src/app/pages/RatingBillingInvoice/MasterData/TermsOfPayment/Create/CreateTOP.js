import { Checkbox, Col, DatePicker, Form, Row, Select } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BaseContainer from "../../../../../../components/BaseContainer";
import InputComponent from "../../../../../../components/InputComponent";
import SelectComponent from "../../../../../../components/SelectComponent";
import { getListCriteriaTOP } from "../../../../../../redux/slices/rating_billing_invoice/MasterData/termsofPayment";
import { formMessageRequired, requiredMessage } from "../../../../../../utils";
import FunctionalTableCriteriaTOP from "../TableCriteria/FunctionalTableCriteriaTOP";
import DateComponent from "../../../../../../components/DateComponent";
// import FunctionalTableCriteriaTOP from "../TableCriteria/FunctionalTableCriteriaTOP";

const CreateTOP = ({
  type,
  form,
  dataType,
  listDataCriteria,
  setListDataCriteria,
  criteriaValues,
  setCriteriaValues,
  formValue,
  storedData = false,
  isC,
  isSun,
  isSat,
  setIsC,
  setIsSun,
  setIsSat,
  setStoredData = () => {},
  data_select_criteria,
  status,
  statusApproval,
  startDate,
  endDate,
  handleStartDate = () => {},
  handleEndDate = () => { },
  disbaledDate
}) => {
  // Dependency Data Criteria
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

  const handleSat = (e) => {
    setIsSat(e.target.checked);
  };
  const handleC = (e) => {
    setIsC(e.target.checked);
  };
  const handleSun = (e) => {
    setIsSun(e.target.checked);
  };

  const disabledDate = (current) => {
    return false;
  };

  // Validation Handle End Date
  const handleDisableEndDate = (current) => {
    if (startDate !== null) {
      return moment(startDate) > current;
    }
    return moment().add(-1, "days") >= current;
  };
  return (
    <div>
      <BaseContainer header={"TERMS OF PAYMENT INFORMATION"}>
        <div className="w-full grid grid-cols-3 gap-2">
          <Form.Item
            label={"Name"}
            name={"name"}
            rules={formMessageRequired("Name")}
          >
            <InputComponent disabled={status === "Active" ? true : false} maxLength={100}/>
          </Form.Item>

          <Form.Item
            label={"Start Date"}
            name={"startDate"}
            rules={formMessageRequired("Start Date")}
            required
          >
            <DateComponent
              dateDisable={disabledDate}
              onChange={(e) => handleStartDate(e)}
              disabled={status === "ACTIVE" || disbaledDate}
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
                        new Error("End date must before Start date")
                      ),
              },
            ]}
          >
            <DateComponent
              disabled={disbaledDate}
              dateDisable={handleDisableEndDate}
              onChange={(e) => handleEndDate(e)}
            />
          </Form.Item>

          <Form.Item
            label={"Type"}
            name={"type"}
            rules={formMessageRequired("Type")}
          >
            <SelectComponent>
              {dataType?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Terms"}
            name={"terms"}
            rules={formMessageRequired("terms")}
          >
            <InputComponent
              onInput={(e) =>
                (e.target.value = e.target.value.replace(/\D/g, ""))
              }
              maxLength={2}
            />
          </Form.Item>
          <div>
            <label>Exclude</label>
            <div className="w-full grid grid-cols-3 gap-2 pt-4">
              <Form name={"calendar"} valuePropName="checked">
                <div>
                  <Checkbox
                    // value="calendar"
                    checked={isC}
                    onChange={handleC}
                  >
                    Calendar
                  </Checkbox>
                </div>
              </Form>
              <Form name={"saturday"} valuePropName="checked">
                <div>
                  <Checkbox checked={isSat} onChange={handleSat}>
                    Saturday
                  </Checkbox>
                </div>
              </Form>
              <Form name={"sunday"} valuePropName="checked">
                <div>
                  <Checkbox checked={isSun} onChange={handleSun}>
                    Sunday
                  </Checkbox>
                </div>
              </Form>
            </div>
          </div>

          <div className="w-full col-span-3">
            <Form.Item
              label={"Criteria"}
              name={"criteria"}
              rules={[{ message: requiredMessage("Criteria"), required: true }]}
            >
              <SelectComponent
                disabled={storedData}
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
        </div>
        <div className="w-full grid grid-cols-1 gap-2 pt-[24px]">
          <Form.Item label={"Description"} name={"description"}>
            <InputComponent type="textarea" cols={4} />
          </Form.Item>
        </div>
      </BaseContainer>

      <BaseContainer header={"CRITERIA INFORMATION"}>
        <FunctionalTableCriteriaTOP
          type={type}
          data={listDataCriteria}
          dataCriteria={criteriaValues}
          updateData={setListDataCriteria}
          endDateHeader={form.getFieldValue("endDate")}
          storedData={storedData}
          setStoredData={setStoredData}
          required={{ required: true, message: "Please input your" }}
          status={status}
          statusApproval={statusApproval}
          validStartDate={startDate}
          validEndDate={endDate}
        />
      </BaseContainer>
    </div>
  );
};

export default CreateTOP;
