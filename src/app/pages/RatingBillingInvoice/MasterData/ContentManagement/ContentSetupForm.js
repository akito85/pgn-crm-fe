import React, { useState, useEffect } from "react";
import { Form, Select } from "antd";
import moment from "moment";
import DateComponent from "../../../../../components/DateComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import InputComponent from "../../../../../components/InputComponent";
import BaseContainer from "../../../../../components/BaseContainer";
import { useDispatch, useSelector } from "react-redux";
import {
  getListPriorityPeriod,
  getCriteria,
} from "../../../../../redux/slices/rating_billing_invoice/MasterData/billingBucket";

const ContentSetupForm = ({
  type,
  form,
  status,
  statusApproval,
  startDate,
  endDate,
  handleStartDate = () => {},
  handleEndDate = () => {},
  disabledDate = false,
  storedDataInline = false,
  criteriaValues = [],
  setCriteriaValues = () => {},
}) => {
  // Selector
  const { data_priority_period, data_criteria } = useSelector(
    (state) => state.billing_bucket
  );

  // Declaration
  const dispatch = useDispatch();

  // State
  const [description, setDescription] = useState("");

  // Use Effect
  useEffect(() => {
    dispatch(getListPriorityPeriod());
    dispatch(getCriteria());
  }, [dispatch]);

  // Validation Handle End Date
  const handleDisableEndDate = (current) => {
    if (startDate !== null) {
      return moment(startDate) > current;
    }
    return moment().add(-1, "days") >= current;
  };

  const disabledStartDate = (current) => {
    return false;
  };

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

  return (
    <BaseContainer header={"Content Setup"}>
      <div className="w-full grid grid-cols-3 gap-3">
        <Form.Item
          label={"Content Code"}
          name={"billingBucketCode"}
          rules={[
            {
              required: true,
              message: "Please input your Content Code!",
            },
          ]}
        >
          <InputComponent
            disabled={status !== "DRAFT" && type === "update" ? true : false}
            maxLength={100}
          />
        </Form.Item>

        <Form.Item
          label={"Name"}
          name={"name"}
          rules={[
            {
              required: true,
              message: "Please input your Name!",
            },
          ]}
        >
          <InputComponent
            disabled={status !== "DRAFT" && type === "update" ? true : false}
            maxLength={100}
          />
        </Form.Item>

        <Form.Item
          label={"Priority Period"}
          name={"priorityPeriod"}
          rules={[
            { required: true, message: "Please input your Priority Period!" },
          ]}
        >
          <SelectComponent>
            {data_priority_period?.map((priorityPeriod) => (
              <Select.Option key={priorityPeriod.id} value={priorityPeriod.id}>
                {priorityPeriod.text}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        <Form.Item
          label={"Start Date"}
          name={"startDate"}
          rules={[{ required: true, message: "Please input your Start Date!" }]}
        >
          <DateComponent
            onChange={(e) => handleStartDate(e)}
            dateDisable={disabledStartDate}
            disabled={
              (status !== "DRAFT" && type === "update") || disabledDate
                ? true
                : false
            }
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
                      new Error("End date must be after Start date")
                    ),
            },
          ]}
        >
          <DateComponent
            onChange={(e) => handleEndDate(e)}
            dateDisable={handleDisableEndDate}
            disabled={disabledDate}
          />
        </Form.Item>

        <div className="col-span-3">
          <Form.Item
            label={"Criteria"}
            name={"criteria"}
            rules={[
              { required: true, message: "Please input your Criteria!" },
            ]}
          >
            <SelectComponent
              mode="multiple"
              onSelect={handleSelectCriteria}
              onDeselect={handleDeselectCriteria}
              onClear={handleClearCriteria}
              disabled={storedDataInline}
            >
              {data_criteria &&
                data_criteria?.map((data, index) => (
                  <Select.Option value={data.id} key={index}>
                    {data.text}
                  </Select.Option>
                ))}
            </SelectComponent>
          </Form.Item>
        </div>

        <div className="col-span-3">
          <Form.Item
            label={"Description"}
            name={"description"}
            className={"w-full"}
          >
            <InputComponent
              type="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Item>
        </div>
      </div>
    </BaseContainer>
  );
};

export default ContentSetupForm;