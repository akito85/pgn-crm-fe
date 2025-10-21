import React, { useState, useEffect } from "react";
import { Form, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import DateComponent from "../../../../../../components/DateComponent";
import SelectComponent from "../../../../../../components/SelectComponent";
import InputComponent from "../../../../../../components/InputComponent";
import BaseContainer from "../../../../../../components/BaseContainer";
import FunctionalCriteriaInvoiceTemplate from "./FunctionalCriteriaInvoiceTemplate";
import {
  getCriteria,
  getInvoiceType,
  getMeterai,
  getSignature,
  getTemplate,
} from "../../../../../../redux/slices/rating_billing_invoice/MasterData/invoiceTemplate";

const InvoiceTemplateSectionForm = ({
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
  status,
  statusApproval,
  handleStartDate = () => {},
  handleEndDate = () => {},
  disableDateProps = false,
}) => {
  // Selector
  const {
    data_invoiceType,
    data_meterai,
    data_signature,
    data_template,
    data_criteria,
  } = useSelector((state) => state.invoice_template);

  // Declaration
  const dispatch = useDispatch();

  // State
  const [description, setDescription] = useState("");

  // Use Effect
  useEffect(() => {
    dispatch(getCriteria());
    dispatch(getInvoiceType());
    dispatch(getMeterai());
    dispatch(getSignature());
    dispatch(getTemplate());
  }, [dispatch]);

  // Validation Handle End Date
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
    <div>
      <BaseContainer header={"Invoice Template Information"}>
        <div className="w-full grid grid-cols-4 gap-4">
          <Form.Item
            label={"Invoice Name"}
            name={"invoiceName"}
            rules={[
              {
                required: true,
                message: "Please input your Invoice Name!",
              },
            ]}
          >
            <InputComponent
              disabled={type !== "create" && status !== "DRAFT" ? true : false}
              maxLength={100}
            />
          </Form.Item>

          <Form.Item
            label={"Invoice Type"}
            name={"invoiceType"}
            rules={[
              { required: true, message: "Please input your Invoice Type!" },
            ]}
          >
            <SelectComponent
              disabled={type !== "create" && status !== "DRAFT" ? true : false}
            >
              {data_invoiceType &&
                data_invoiceType?.map((data, index) => (
                  <Select.Option value={data.id} key={index}>
                    {data.name}
                  </Select.Option>
                ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Meterai"}
            name={"meterai"}
            rules={[{ required: true, message: "Please input your Meterai!" }]}
          >
            <SelectComponent>
              {data_meterai &&
                data_meterai?.map((data, index) => (
                  <Select.Option value={data.id} key={index}>
                    {data.name}
                  </Select.Option>
                ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Signature"}
            name={"signature"}
            rules={[
              { required: true, message: "Please input your Signature!" },
            ]}
          >
            <SelectComponent>
              {data_signature &&
                data_signature?.map((data, index) => (
                  <Select.Option value={data.id} key={index}>
                    {data.name}
                  </Select.Option>
                ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Template"}
            name={"template"}
            rules={[{ required: true, message: "Please input your Template!" }]}
          >
            <SelectComponent>
              {data_template &&
                data_template?.map((data, index) => (
                  <Select.Option value={data.id} key={index}>
                    {data.name}
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
          >
            <DateComponent
              dateDisable={disabledDate}
              onChange={(e) => handleStartDate(e)}
              disabled={
                (status !== "DRAFT" && type !== "create") || disableDateProps
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
                        new Error("End date must before Start date"),
                      ),
              },
            ]}
          >
            <DateComponent
              disabled={disableDateProps}
              dateDisable={handleDisableEndDate}
              onChange={(e) => handleEndDate(e)}
            />
          </Form.Item>

          <div className="col-span-4">
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

      <BaseContainer header={"CRITERIA INFORMATION"}>
        <div className="w-full">
          <FunctionalCriteriaInvoiceTemplate
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
        </div>
      </BaseContainer>
    </div>
  );
};

export default InvoiceTemplateSectionForm;
