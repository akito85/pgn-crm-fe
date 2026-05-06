import React, { useState, useEffect } from "react";
import { Form, Select } from "antd";
import moment from "moment";
import DateComponent from "../../../../../../components/DateComponent";
import SelectComponent from "../../../../../../components/SelectComponent";
import InputComponent from "../../../../../../components/InputComponent";
import RadioTabs from "../../../../../../components/RadioTabs";
import { useDispatch, useSelector } from "react-redux";
import BillingBucketDetailSectionForm from "../Modal/BillingBucketDetailSectionForm";
import FunctionalCriteriaBillingBucket from "./FunctionalCriteriaBillingBucket";
import {
  getListPriorityPeriod,
  getCriteria,
  getBillingBucketCurrency,
  getBillingBucketCategory,
} from "../../../../../../redux/slices/rating_billing_invoice/MasterData/billingBucket";
import CardContainer from "../../../../../../components/CardContainer";

const BillingBucketSectionForm = ({
  type,
  form,
  listDataCriteria,
  setListDataCriteria,
  criteriaValues,
  setCriteriaValues,
  storedDataInline,
  setStoredDataInline,
  startDate,
  endDate,
  listDataBI = [],
  setListDataBI = () => {},
  handleStartDate = () => {},
  handleEndDate = () => {},
  priority,
  setPriority,
  status,
  statusApproval,
  disabledDate = false,
}) => {
  // Selector
  const { data_priority_period, data_criteria, data_bucket_currency, data_bucket_category } = useSelector(
    (state) => state.billing_bucket,
  );

  // Declaration
  const dispatch = useDispatch();

  // State
  const [description, setDescription] = useState("");
  const [tabPagesEmployee, setTabPagesEmployee] = useState([
    { value: "Detail" },
    { value: "Criteria" },
  ]);
  const [valuePage, setValuePage] = useState("Detail");

  // Use Effect
  useEffect(() => {
    dispatch(getListPriorityPeriod());
    dispatch(getCriteria());
    dispatch(getBillingBucketCurrency());
    dispatch(getBillingBucketCategory());
  }, [dispatch]);

  // Validation Handle End Date
  const handleDisableEndDate = (current) => {
    if (startDate !== null) {
      return moment(startDate) > current;
    }
    return moment().add(-1, "days") >= current;
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

  const onChange = (e) => {
    setValuePage(e.target.value);
  };

  const disabledStartDate = (current) => {
    return false;
  };

  return (
    <div>
      <CardContainer header={"Billing Bucket Information"}>
        <div className="w-full grid grid-cols-5 gap-3">
          <Form.Item
            label={"Billing Bucket Code"}
            name={"billingBucketCode"}
            rules={[
              {
                required: true,
                message: "Please input your Billing Bucket Code!",
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
                <Select.Option
                  key={priorityPeriod.id}
                  value={priorityPeriod.id}
                >
                  {priorityPeriod.text}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Currency"}
            name={"currency"}
            rules={[
              { required: true, message: "Please select Currency!" },
            ]}
          >
            <SelectComponent allowClear>
              {data_bucket_currency?.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Category"}
            name={"category"}
            rules={[
              { required: true, message: "Please select Category!" },
            ]}
          >
            <SelectComponent allowClear>
              {data_bucket_category?.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Start Date"}
            name={"startDate"}
            rules={[
              { required: true, message: "Please input your Start Date!" },
            ]}
            // getValueFromEvent={handleStartDate}
          >
            <DateComponent
              onChange={(e) => handleStartDate(e)}
              dateDisable={disabledStartDate}
              disabled={
                (status !== "DRAFT" && type === "update") ||
                disabledDate ||
                listDataBI?.some((item) => item.startDate) ||
                listDataCriteria?.some((item) => item.startDate)
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
                        new Error("End date must before Start date"),
                      ),
              },
            ]}
          >
            <DateComponent
              onChange={(e) => handleEndDate(e)}
              dateDisable={handleDisableEndDate}
              disabled={
                disabledDate ||
                listDataBI?.some((item) => item.endDate) ||
                listDataCriteria?.some((item) => item.endDate)
              }
            />
          </Form.Item>

          <div className="col-span-2">
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
      </CardContainer>

      <CardContainer
        header="BILLING BUCKET DETAIL INFORMATION"
        type={"tabs"}
        element={
          <RadioTabs
            disabled={storedDataInline}
            data={tabPagesEmployee}
            onChange={onChange}
            currentPosition={valuePage}
          />
        }
      >
        {valuePage === "Detail" ? (
          <BillingBucketDetailSectionForm
            listDataBI={listDataBI}
            setListDataBI={setListDataBI}
            type={type}
            priority={priority}
            setPriority={setPriority}
            status={status}
            statusApproval={statusApproval}
            validStartDate={startDate}
            validEndDate={endDate}
            setStoredData={setStoredDataInline}
          />
        ) : (
          <FunctionalCriteriaBillingBucket
            type={type}
            data={listDataCriteria}
            dataCriteria={criteriaValues}
            updateData={setListDataCriteria}
            setStoredData={setStoredDataInline}
            storedData={storedDataInline}
            required={{ required: true, message: "Please input your" }}
            disableDate={true}
            status={status}
            statusApproval={statusApproval}
            validStartDate={startDate}
            validEndDate={endDate}
          />
        )}
      </CardContainer>
    </div>
  );
};

export default BillingBucketSectionForm;
