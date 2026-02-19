import React, { useState } from "react";
import { Form } from "antd";
import moment from "moment";
import DateComponent from "../../../../../../components/DateComponent";
import InputComponent from "../../../../../../components/InputComponent";
import BaseContainer from "../../../../../../components/BaseContainer";

const BillingItemCategorySectionForm = ({
  type,
  form,
  status,
  statusApproval,
  startDate,
  endDate,
  handleStartDate = () => {},
  handleEndDate = () => {},
}) => {
  // State
  const [description, setDescription] = useState("");

  // Validation Handle End Date
  const handleDisableEndDate = (current) => {
    if (startDate !== null) {
      return moment(startDate) > current;
    }
    return moment().add(-1, "days") >= current;
  };

  const disabledStartDate = (current) => {
    // Disable dates before today
    return current && current < moment().startOf('day');
  };

  return (
    <div>
      <BaseContainer header={"Billing Item Category Information"}>
        <div className="w-full grid grid-cols-4 gap-3">
          <Form.Item
            label={"Category Code"}
            name={"code"}
            rules={[
              {
                required: true,
                message: "Please input your Category Code!",
              },
            ]}
          >
            <InputComponent
              placeholder={"Input Category Code "}
              disabled={
                type === "update" &&
                statusApproval !== "DRAFT" &&
                statusApproval !== "REJECTED"
              }
              maxLength={100}
            />
          </Form.Item>

          <Form.Item
            label={"Category Name"}
            name={"name"}
            rules={[
              {
                required: true,
                message: "Please input your Category Name!",
              },
            ]}
          >
            <InputComponent
              placeholder={"Input Category Name "}
              disabled={
                type === "update" &&
                statusApproval !== "DRAFT" &&
                statusApproval !== "REJECTED"
              }
              maxLength={100}
            />
          </Form.Item>

          <Form.Item
            label={"Start Date"}
            name={"startDate"}
            rules={[
              { required: true, message: "Please input your Start Date!" },
            ]}
          >
            <DateComponent
              onChange={(e) => handleStartDate(e)}
              dateDisable={disabledStartDate}
              disabled={
                type === "update" &&
                statusApproval !== "DRAFT" &&
                statusApproval !== "REJECTED"
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
                        new Error("End date must be after Start date"),
                      ),
              },
            ]}
          >
            <DateComponent
              onChange={(e) => handleEndDate(e)}
              dateDisable={handleDisableEndDate}
              disabled={false}
            />
          </Form.Item>

          <div className="col-span-4">
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
    </div>
  );
};

export default BillingItemCategorySectionForm;
