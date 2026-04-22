import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Select } from "antd";
import moment from "moment";
import CardContainer from "../../../../../../components/CardContainer";
import InputComponent from "../../../../../../components/InputComponent";
import SelectComponent from "../../../../../../components/SelectComponent";
import DateComponent from "../../../../../../components/DateComponent";
import { showModalError } from "../../../../../../redux/slices/general_slice";
import RadioTabs from "../../../../../../components/RadioTabs";
import ConditionForm from "./ConditionForm";
import FunctionalCriteriaTaxCode from "./FunctionalCriteriaTaxCode";

const TaxCodeSectionForm = ({
  type,
  form,
  listDataDetail,
  setListDataDetail,
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
  handleEndDate = () => { },
  disabledDate = false,
  data_gl_account_list = [],
}) => {
  // Selector
  const { data_category, data_criteria } = useSelector(
    (state) => state.tax_code
  );

  // Declaration
  const dispatch = useDispatch();

  // State
  const [description, setDescription] = useState("");
  const [valuePage, setValuePage] = useState("Criteria");
  const [tabPagesTaxCode, setTabPagesTaxCode] = useState([
    { value: "Criteria" },
    { value: "Condition" },
  ]);

  const changeTab = (e) => {
    if (!storedDataInline) {
      setValuePage(e.target.value);
    } else {
      const errorBody = {
        title: "Failed",
        description: `Please save data table inline before submit. Please try again.`,
      };
      dispatch(showModalError(errorBody));
    }
  };

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

  const handleDisableEndDate = (current) => {
    if (startDate !== null) {
      return moment(startDate) > current;
    }
    return moment().add(-1, "days") >= current;
  };

  const validateInputNumber = (_, value) => {
    if (!value || (value && value.length >= 1 && value.length <= 10)) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error("Length must be between 1 and 10 characters")
    );
  };

  const disabledStartDate = (current) => {
    return false;
  };

  return (
    <div>
      <CardContainer header={"Tax Code Information"}>
        <div className="w-full grid grid-cols-4 gap-4">
          <Form.Item
            label={"Tax Code"}
            name={"taxCode"}
            rules={[
              {
                required: true,
                message: "Please input your Tax Code!",
              },
              { validator: validateInputNumber },
            ]}
          >
            <InputComponent
              disabled={type !== "create" && status !== "DRAFT" ? true : false}
              // maxLength={10}
            />
          </Form.Item>

          <Form.Item
            label={"Name"}
            name={"taxCodeName"}
            rules={[
              {
                required: true,
                message: "Please input your Name!",
              },
            ]}
          >
            <InputComponent
              disabled={type !== "create" && status !== "DRAFT" ? true : false}
            />
          </Form.Item>

          <Form.Item
            label={"Tax Rate (%)"}
            name={"taxRate"}
            rules={[
              {
                required: true,
                message: "Please input your Tax Rate!",
              },
              {
                validator: (_, value) => {
                  if (value !== undefined && value !== null && value > 100) {
                    return Promise.reject("Tax Rate must not exceed 100%.");
                  }
                  return Promise.resolve();
                },
              },
            ]}
            getValueFromEvent={(e) => {
              return e.floatValue;
            }}
          >
            <InputComponent
              disabled={type !== "create" && status !== "DRAFT" ? true : false}
              suffix={"%"}
              type="numeric"
              numericFormatType={"text"}
              thousandSeparator={false}
              decimalSeparator={"."}
              maxLength={3}
              isAllowed={(values) => {
                const { value } = values;
                if (!value) return true;
                // Allow max 3 digits (integer part only)
                const integerPart = value.split(".")[0];
                return integerPart.length <= 3;
              }}
            />
          </Form.Item>

          <Form.Item
            label={"Category"}
            name={"category"}
            rules={[
              {
                required: true,
                message: "Please input your Category!",
              },
            ]}
          >
            <SelectComponent>
              {data_category &&
                data_category?.map((data, index) => (
                  <Select.Option value={data.id} key={index}>
                    {data.text}
                  </Select.Option>
                ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"GL Account"}
            name={"glAccount"}
            rules={[
              {
                required: true,
                message: "Please input your GL Account!",
              },
            ]}
          >
            <SelectComponent showSearch optionFilterProp="children">
              {data_gl_account_list?.map((item) => (
                <Select.Option value={item.id} key={item.id}>
                  {item.glAccount}
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
              dateDisable={disabledStartDate}
              onChange={(e) => handleStartDate(e)}
              disabled={status === "ACTIVE" || disabledDate}
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
                        new Error("End Date must be after Start date")
                      ),
              },
            ]}
          >
            <DateComponent
              disabled={disabledDate}
              onChange={(e) => handleEndDate(e)}
              dateDisable={handleDisableEndDate}
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
                disabled={storedDataInline}
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
      </CardContainer>

      <CardContainer
        header={"CRITERIA INFORMATION"}
        type={"tabs"}
        element={
          <RadioTabs
            disabled={storedDataInline}
            data={tabPagesTaxCode}
            onChange={changeTab}
            currentPosition={valuePage}
          />
        }
      >
        <div className="w-full">
          {valuePage === "Criteria" ? (
            <FunctionalCriteriaTaxCode
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
          ) : (
            <ConditionForm
              type={type}
              data={listDataDetail}
              updateData={setListDataDetail}
              status={status}
              statusApproval={statusApproval}
              validStartDate={startDate}
              validEndDate={endDate}
            />
          )}
        </div>
      </CardContainer>
    </div>
  );
};

export default TaxCodeSectionForm;
