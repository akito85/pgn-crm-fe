import React, { useEffect } from "react";
import { Form, Select } from "antd";
import moment from "moment";
import DateComponent from "../../../../../../components/DateComponent";
import SelectComponent from "../../../../../../components/SelectComponent";
import InputComponent from "../../../../../../components/InputComponent";
import { useDispatch, useSelector } from "react-redux";
import FunctionalCriteriaCollectionActivities from "./FunctionalCriteriaCollectionActivities";
import {
  getMedia,
  getCategory,
  getCriteria,
} from "../../../../../../redux/slices/debt_and_collection/collectionActivities";
import CardContainer from "../../../../../../components/CardContainer";

const normalizeCollectionCriteriaIds = (values = []) => {
  const normalizedValues = (Array.isArray(values) ? values : [values]).map(
    (value) => {
      const rawValue =
        value && typeof value === "object"
          ? value.criteriaValueId ??
            value.criteriaId ??
            value.value ??
            value.id ??
            value.Id ??
            value.glbTypeValId ??
            null
          : value;
      const normalizedValue = Number(rawValue);
      return Number.isNaN(normalizedValue) ? rawValue : normalizedValue;
    }
  );

  const filteredValues = normalizedValues.filter(
    (value) => value !== undefined && value !== null && value !== ""
  );

  const uniqueValues = filteredValues.filter(
    (value, index) => filteredValues.indexOf(value) === index
  );

  return uniqueValues.includes(24) ? [24] : uniqueValues;
};

const CollectionActivitiesSectionForm = ({
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
}) => {
  // Selector
  const { data_media, data_category, data_criteria } = useSelector(
    (state) => state.collectionActivities
  );
  const normalizedStatus = (status || "").toString().trim().toUpperCase();
  const isDraftStatus = normalizedStatus === "DRAFT";

  // Declaration
  const dispatch = useDispatch();

  // Use Effect
  useEffect(() => {
    dispatch(getMedia());
    dispatch(getCategory());
    dispatch(getCriteria());
  }, [dispatch]);

  // Validation Handle End Date
  const handleDisableEndDate = (current) => {
    if (startDate !== null) {
      return moment(startDate) > current;
    }
    return moment().add(-1, "days") >= current;
  };

  const handleSelectCriteria = (value) => {
    let res = normalizeCollectionCriteriaIds([...criteriaValues, value]);
    // Dependency chain: selecting a child forces its parents to be included
    if (res.includes(13)) res.push(14);   // sub-district requires district
    if (res.includes(14)) res.push(39);   // district requires city
    if (res.includes(39)) res.push(15);   // city requires province
    if (res.includes(20)) res.push(19);   // account group requires customer segment
    const outputArray = normalizeCollectionCriteriaIds(res);
    setCriteriaValues(outputArray);
    form.setFieldsValue({
      criteria: outputArray,
    });
  };

  const handleDeselectCriteria = (value) => {
    const normalizedValue = normalizeCollectionCriteriaIds([value])[0];
    let res = normalizeCollectionCriteriaIds(criteriaValues).filter(
      (item) => item !== normalizedValue
    );
    // Dependency chain: removing a parent also removes its children
    if (!res.includes(15)) res = res.filter((item) => item !== 39);  // no province → no city
    if (!res.includes(39)) res = res.filter((item) => item !== 14);  // no city → no district
    if (!res.includes(14)) res = res.filter((item) => item !== 13);  // no district → no sub-district
    if (!res.includes(19)) res = res.filter((item) => item !== 20);  // no customer segment → no account group
    const outputArray = normalizeCollectionCriteriaIds(res);
    setCriteriaValues(outputArray);
    form.setFieldsValue({
      criteria: outputArray,
    });
  };

  const handleClearCriteria = () => {
    setCriteriaValues([]);
    form.setFieldsValue({
      criteria: [],
    });
  };

  const disabledStartDate = (current) => {
    return false;
  };

  return (
    <div>
      <CardContainer header={"ACTIVITIES INFORMATION"}>
        <div className="w-full grid grid-cols-5 gap-3">
          <Form.Item
            label={"Activities Name"}
            name={"activitiesName"}
            rules={[
              {
                required: true,
                message: "Please input Activities Name!",
              },
            ]}
          >
            <InputComponent
              disabled={!isDraftStatus && type === "update" ? true : false}
              maxLength={100}
              placeholder="Input Activities Name"
            />
          </Form.Item>

          <Form.Item
            label={"Media"}
            name={"media"}
            rules={[{ required: true, message: "Please select Media!" }]}
          >
            <SelectComponent placeholder="Select Media" allowClear>
              {data_media?.map((item) => (
                <Select.Option key={item.value || item.id} value={item.value || item.id}>
                  {item.label || item.text || item.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Category"}
            name={"category"}
            rules={[{ required: true, message: "Please select Category!" }]}
          >
            <SelectComponent placeholder="Select Category" allowClear>
              {data_category?.map((item) => (
                <Select.Option key={item.value || item.id} value={item.value || item.id}>
                  {item.label || item.text || item.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Start Date"}
            name={"startDate"}
            rules={[{ required: true, message: "Please input Start Date!" }]}
          >
            <DateComponent
              onChange={(e) => handleStartDate(e)}
              dateDisable={disabledStartDate}
              disabled={
                (!isDraftStatus && type === "update") ||
                disabledDate ||
                listDataCriteria?.some((item) => item.startDate)
              }
              placeholder="Select Date"
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
              disabled={
                disabledDate ||
                listDataCriteria?.some((item) => item.endDate)
              }
              placeholder="Select Date"
            />
          </Form.Item>

          <div className="col-span-5">
            <Form.Item
              label={"Criteria"}
              name={"criteria"}
              rules={[
                { required: true, message: "Please select Criteria!" },
              ]}
            >
              <SelectComponent
                mode="multiple"
                onSelect={handleSelectCriteria}
                onDeselect={handleDeselectCriteria}
                onClear={handleClearCriteria}
                disabled={storedDataInline}
                placeholder="Choose Multiple Criteria"
              >
                {/* Criteria options come from CRITERIA_NAME global type via API */}
                {data_criteria?.map((data, index) => (
                  <Select.Option
                    value={normalizeCollectionCriteriaIds([
                      data.id ?? data.value ?? data.Id ?? data.glbTypeValId,
                    ])[0]}
                    key={index}
                  >
                    {data.text || data.label || data.name || data.code}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>
          </div>

          <div className="col-span-5">
            <Form.Item
              label={"Description"}
              name={"description"}
              className={"w-full"}
              rules={[
                { required: true, message: "Please input Description!" },
              ]}
            >
              <InputComponent
                type="textarea"
                placeholder="Text Input"
                maxLength={255}
                showCount
              />
            </Form.Item>
          </div>
        </div>
      </CardContainer>

      <CardContainer header="CRITERIA INFORMATION">
        <FunctionalCriteriaCollectionActivities
          type={type}
          data={listDataCriteria}
          dataCriteria={criteriaValues}
          updateData={setListDataCriteria}
          setStoredData={setStoredDataInline}
          storedData={storedDataInline}
          required={{ required: true, message: "Please input your data" }}
          disableDate={true}
          status={status}
          statusApproval={statusApproval}
          validStartDate={startDate}
          validEndDate={endDate}
        />
      </CardContainer>
    </div>
  );
};

export default CollectionActivitiesSectionForm;
