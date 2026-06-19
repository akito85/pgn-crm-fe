import React from "react";
import { Form, Select } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import DateComponent from "../../../../../../components/DateComponent";
import InputComponent from "../../../../../../components/InputComponent";
import SelectComponent from "../../../../../../components/SelectComponent";
import CardContainer from "../../../../../../components/CardContainer";
import FunctionalActivitiesCollectionTemplate from "./FunctionalActivitiesCollectionTemplate";
import FunctionalCriteriaCollectionTemplate from "./FunctionalCriteriaCollectionTemplate";
import {
  getCriteria,
} from "../../../../../../redux/slices/rating_billing_invoice/MasterData/billingBucket";

const CollectionTemplateSectionForm = ({
  type,
  form,
  listDataActivities,
  setListDataActivities,
  listDataCriteria,
  setListDataCriteria,
  storedDataActivities,
  setStoredDataActivities,
  storedDataCriteria,
  setStoredDataCriteria,
  criteriaValues,
  setCriteriaValues,
  startDate,
  endDate,
  handleStartDate,
  handleEndDate,
  status,
  statusApproval,
}) => {
  const dispatch = useDispatch();
  const { data_criteria } = useSelector((state) => state.billing_bucket);

  useEffect(() => {
    dispatch(getCriteria());
  }, [dispatch]);

  const handleDisableEndDate = (current) => {
    if (startDate) {
      return moment(startDate) > current;
    }
    return moment().add(-1, "days") >= current;
  };

  const handleDisableStartDate = (current) => {
    return moment().add(-1, "days") >= current;
  };

  const handleSelectCriteria = (value) => {
    let res = [...criteriaValues, value];
    if (res.includes(13)) res.push(14);
    if (res.includes(14)) res.push(39);
    if (res.includes(39)) res.push(15);
    if (res.includes(20)) res.push(19);
    let outputArray = res.filter((item, index) => res.indexOf(item) === index);
    outputArray = outputArray.includes(24) ? [24] : outputArray;
    setCriteriaValues(outputArray);
    form.setFieldsValue({ criteria: outputArray });
  };

  const handleDeselectCriteria = (value) => {
    let res = criteriaValues.filter((item) => item !== value);
    if (!res.includes(15)) res = res.filter((item) => item !== 39);
    if (!res.includes(39)) res = res.filter((item) => item !== 14);
    if (!res.includes(14)) res = res.filter((item) => item !== 13);
    if (!res.includes(19)) res = res.filter((item) => item !== 20);
    let outputArray = res.filter((item, index) => res.indexOf(item) === index);
    outputArray = outputArray.includes(24) ? [24] : outputArray;
    setCriteriaValues(outputArray);
    form.setFieldsValue({ criteria: outputArray });
  };

  const handleClearCriteria = () => {
    setCriteriaValues([]);
  };

  return (
    <div className="flex flex-col gap-y-4">
      <CardContainer header="Template Collection Information">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <Form.Item
            label="Template Name"
            name="templateName"
            rules={[{ required: true, message: "Please input template name!" }]}
          >
            <InputComponent placeholder="Input template name" />
          </Form.Item>

          <Form.Item
            label="Start Date"
            name="startDate"
            rules={[{ required: true, message: "Please select start date!" }]}
          >
            <DateComponent
              dateDisable={handleDisableStartDate}
              onChange={handleStartDate}
            />
          </Form.Item>

          <Form.Item label="End Date" name="endDate">
            <DateComponent
              dateDisable={handleDisableEndDate}
              disabled={!startDate}
              onChange={handleEndDate}
            />
          </Form.Item>

          <Form.Item
            label="Criteria"
            name="criteria"
            rules={[{ required: true, message: "Please select criteria!" }]}
          >
            <SelectComponent
              mode="multiple"
              onSelect={handleSelectCriteria}
              onDeselect={handleDeselectCriteria}
              onClear={handleClearCriteria}
              disabled={storedDataCriteria}
            >
              {(data_criteria || []).map((data, index) => (
                <Select.Option value={data.id} key={index}>
                  {data.text}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input description!" }]}
            className="col-span-2"
          >
            <InputComponent
              componentType="textarea"
              rows={3}
              placeholder="Input description"
            />
          </Form.Item>
        </div>
      </CardContainer>

      <CardContainer header="Criteria Information">
        <FunctionalCriteriaCollectionTemplate
          type={type}
          data={listDataCriteria}
          updateData={setListDataCriteria}
          storedData={storedDataCriteria}
          setStoredData={setStoredDataCriteria}
          dataCriteria={criteriaValues}
          validStartDate={startDate}
          validEndDate={endDate}
          status={status}
          statusApproval={statusApproval}
        />
      </CardContainer>

      <CardContainer header="Activities Information">
        <FunctionalActivitiesCollectionTemplate
          type={type}
          data={listDataActivities}
          updateData={setListDataActivities}
          storedData={storedDataActivities}
          setStoredData={setStoredDataActivities}
          validStartDate={startDate}
          validEndDate={endDate}
          status={status}
          statusApproval={statusApproval}
        />
      </CardContainer>
    </div>
  );
};

export default CollectionTemplateSectionForm;
