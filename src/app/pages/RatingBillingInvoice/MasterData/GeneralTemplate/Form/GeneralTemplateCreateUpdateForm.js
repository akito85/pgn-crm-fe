import { Form, Select } from "antd";
import React from "react";
import { Fragment } from "react";
import SelectComponent from "../../../../../../components/SelectComponent";
import InputComponent from "../../../../../../components/InputComponent";
import BaseContainer from "../../../../../../components/BaseContainer";
import { requiredMessage } from "../../../../../../utils";
import DateComponent from "../../../../../../components/DateComponent";
import moment from "moment";
import UploadTemplate from "../Component/UploadTemplate";
import { configApp } from "../../../../../../constants/configApp";
import { getConfigFileRBIDataGeneralTemplate } from "../../../../../../redux/slices/rating_billing_invoice/MasterData/general_template";

const GeneralTempalteCreateUpdateForm = ({
  type = {},
  statusType = "",
  dispatch = () => {},
  optionTemplateType = [],
  fileList = [],
  handleStartDate = () => {},
  startDate,
  // setValidateFile = () => {},
  setBase64Image = () => {},
  setFileList = () => {},
}) => {
  
  const handleDisableEndDate = (current) => {
    if (startDate !== null) {
      return moment(startDate) > current;
    }
    return moment().add(-1, "days") >= current;
  };

  const disabledDate = (current) => {
    return false;
  };

  return (
    <Fragment>
      <BaseContainer header={"GENERAL TEMPLATE INFORMATION"}>
        <div className="w-full grid grid-cols-4 gap-3">
          <Form.Item
            name={"name"}
            label={"Name"}
            rules={[{ message: requiredMessage("Name"), required: true }]}
          >
            <InputComponent
              maxLength={100}
              disabled={type === "update" && statusType !== "DRAFT" ? true : false}
              // onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name={"templateType"}
            label={"Template Type"}
            rules={[
              { message: requiredMessage("Template Type"), required: true },
            ]}
          >
            <SelectComponent
              mandatory
              disabled={type === "update" && statusType !== "DRAFT" ? true : false}
              // onChange={(e) => handleProduct(e)}
            >
              {(optionTemplateType || [])?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.value}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
          <Form.Item
            name={"startDate"}
            label="Start Date"
            rules={[{ message: requiredMessage("Start Date"), required: true }]}
            // className="no-margin-form"
          >
            <DateComponent
              mandatory
              dateDisable={disabledDate}
              disabled={type === "update" && statusType !== "DRAFT" ? true : false}
              onChange={(e) => handleStartDate(e)}
            />
          </Form.Item>
          <Form.Item
            name={"endDate"}
            label="End Date"
            rules={[
              {
                validator: (_, value) =>
                  (value && moment(startDate) <= moment(value)) || !value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("The end date must be later than the start date")
                      ),
              },
              // { message: requiredMessage("End Date"), required: true },
            ]}
            // className="no-margin-form"
          >
            <DateComponent
              mandatory
              dateDisable={handleDisableEndDate}
              // disabled={!hasValue(startDate)}
            />
          </Form.Item>
        </div>

        <div className="w-full mt-2">
          <Form.Item
            name={"description"}
            label={"Description"}
            // rules={[
            //   { message: requiredMessage("Description"), required: true },
            // ]}
          >
            <InputComponent
              type="textarea"
              // onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Item>
        </div>
        <div className="w-full">
          <Form.Item
            name={"uploadTemplate"}
            label={
              <>
                Upload Template{" "}
                <span className={"pl-1"} style={{ color: "red" }}>
                  *
                </span>
              </>
            }
            // rules={[
            //   { message: requiredMessage("Template File"), required: true },
            // ]}
          >
            <UploadTemplate
              dispatch={dispatch}
              fileList={fileList}
              setFileList={setFileList}
              setBase64Image={setBase64Image}
              allowedFile={"rtf,docx"}
              accept={".rtf, .docx"}
              configApplication={configApp.RATING_BILLING_SERVICE}
              getAPIGuard={getConfigFileRBIDataGeneralTemplate}
              typeRBI={"data"}
              // setValidateFile={setValidateFile}
            />
          </Form.Item>
        </div>
      </BaseContainer>
    </Fragment>
  );
};

export default GeneralTempalteCreateUpdateForm;
