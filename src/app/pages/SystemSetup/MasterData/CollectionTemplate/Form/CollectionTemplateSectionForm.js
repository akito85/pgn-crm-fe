import React from "react";
import { Form } from "antd";
import moment from "moment";
import DateComponent from "../../../../../../components/DateComponent";
import InputComponent from "../../../../../../components/InputComponent";
import CardContainer from "../../../../../../components/CardContainer";
import FunctionalActivitiesCollectionTemplate from "./FunctionalActivitiesCollectionTemplate";
import FunctionalCriteriaCollectionTemplate from "./FunctionalCriteriaCollectionTemplate";

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
  startDate,
  endDate,
  handleStartDate,
  handleEndDate,
  status,
  statusApproval,
}) => {
  const handleDisableEndDate = (current) => {
    if (startDate) {
      return moment(startDate) > current;
    }
    return moment().add(-1, "days") >= current;
  };

  const handleDisableStartDate = (current) => {
    return moment().add(-1, "days") >= current;
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

      <CardContainer header="Criteria Information">
        <FunctionalCriteriaCollectionTemplate
          type={type}
          data={listDataCriteria}
          updateData={setListDataCriteria}
          storedData={storedDataCriteria}
          setStoredData={setStoredDataCriteria}
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
