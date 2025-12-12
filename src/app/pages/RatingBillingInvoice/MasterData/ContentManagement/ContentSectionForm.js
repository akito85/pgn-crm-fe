// path: src/pages/RatingBillingInvoice/MasterData/ContentManagement/Form/ContentSectionForm.jsx
import React, { useState, useEffect } from "react";
import { Form, Select } from "antd";
import moment from "moment";
import DateComponent from "../../../../../components/DateComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import InputComponent from "../../../../../components/InputComponent";
import BaseContainer from "../../../../../components/BaseContainer";
import RadioTabs from "../../../../../components/RadioTabs";
import { useDispatch, useSelector } from "react-redux";
import ContentInformationForm from "./ContentInformationForm";
import FunctionalCriteriaBillingBucket from "./Form/FunctionalCriteriaBillingBucket";
import {
  getListFormat,
  getListCategory,
  getListMedia,
  getCriteria,
} from "../../../../../redux/slices/rating_billing_invoice/MasterData/contentManagement";

const ContentSectionForm = ({
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
  handleStartDate = () => {},
  handleEndDate = () => {},
  status,
  statusApproval,
  disabledDate = false,
  // ✅ Tambahkan props ini
  subjectValue,
  setSubjectValue,
  bodyValue,
  setBodyValue
}) => {
  // Selector
  const { data_format, data_category, data_media, data_criteria } = useSelector(
    (state) => state.contentManagement
  );

  // Declaration
  const dispatch = useDispatch();

  // State
  const [description, setDescription] = useState("");
  const [tabPagesEmployee, setTabPagesEmployee] = useState([
    { value: "Content" },
    { value: "Criteria" },
  ]);
  const [valuePage, setValuePage] = useState("Content");

  // Use Effect
  useEffect(() => {
    dispatch(getListFormat());
    dispatch(getListCategory());
    dispatch(getListMedia());
    dispatch(getCriteria());
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
      <BaseContainer header={"Content Information"}>
        <div className="w-full grid grid-cols-3 gap-3">
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
            label={"Format"}
            name={"format"}
            rules={[
              { required: true, message: "Please input your Format!" },
            ]}
          >
            <SelectComponent
              disabled={status !== "DRAFT" && type === "update" ? true : false}
            >
              {data_format?.map((format) => (
                <Select.Option key={format.value} value={format.value}>
                  {format.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Category"}
            name={"category"}
            rules={[
              { required: true, message: "Please input your Category!" },
            ]}
          >
            <SelectComponent
              disabled={status !== "DRAFT" && type === "update" ? true : false}
            >
              {data_category?.map((category) => (
                <Select.Option key={category.value} value={category.value}>
                  {category.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Media"}
            name={"media"}
            rules={[
              { required: true, message: "Please input your Media!" },
            ]}
          >
            <SelectComponent
              disabled={status !== "DRAFT" && type === "update" ? true : false}
            >
              {data_media?.map((media) => (
                <Select.Option key={media.value} value={media.value}>
                  {media.name}
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

      <BaseContainer
        header="CONTENT DETAIL INFORMATION"
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
        {valuePage === "Content" ? (
          <ContentInformationForm
            form={form}
            type={type}
            status={status}
            statusApproval={statusApproval}
            listDataCriteria={listDataCriteria}
            setListDataCriteria={setListDataCriteria}
            criteriaValues={criteriaValues}
            storedDataInline={storedDataInline}
            setStoredDataInline={setStoredDataInline}
            startDate={startDate}
            endDate={endDate}
             subjectValue={subjectValue}
            setSubjectValue={setSubjectValue}
            bodyValue={bodyValue}
            setBodyValue={setBodyValue}
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
      </BaseContainer>
    </div>
  );
};

export default ContentSectionForm;