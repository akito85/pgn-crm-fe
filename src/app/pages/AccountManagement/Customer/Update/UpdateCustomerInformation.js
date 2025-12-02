import React from "react";
import { Form, Select } from "antd";
import InputComponent from "../../../../../components/InputComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import { Fragment } from "react";
import { requiredMessage } from "../../../../../utils";
import DateComponent from "../../../../../components/DateComponent";
import moment from "moment";
import { onInputUpperCase } from "../../Utils";

const UpdateCustomerInformation = ({
  optionsCustomerType = [],
  optionsIdentificationType = [],
  optionsSex = [],
  optionsMartialStatus = [],
  customerType,
  handleChangeName = () => {},
}) => {
  const handleDisableEndDate = (current) => {
    return moment().endOf("day") < current;
  };

  return (
    <Fragment>
      <div className="w-full grid grid-cols-3 gap-3">
        <Form.Item
          name={"customerType"}
          label={"Customer Type"}
          rules={[
            { message: requiredMessage("Customer Type"), required: true },
          ]}
          className="no-margin-form"
        >
          <SelectComponent disabled>
            {optionsCustomerType?.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.value}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        <Form.Item
          name={"identificationType"}
          label={"Identification Type"}
          rules={[
            { message: requiredMessage("Identification Type"), required: true },
          ]}
          className="no-margin-form"
        >
          <SelectComponent disabled={customerType === 1122}>
            {optionsIdentificationType?.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.value}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        <Form.Item
          name={"customerIdentificationNumber"}
          label={"Customer Identification Number"}
          rules={[
            {
              message: requiredMessage("Customer Identification Number"),
              required: true,
            },
          ]}
          className="no-margin-form"
        >
          <InputComponent disabled={customerType === 1122} />
        </Form.Item>
      </div>

      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"CUSTOMER INFORMATION"}
      </div>

      <div className="w-full grid grid-cols-3 gap-3">
        {customerType !== 58 ? (
          <>
            <Form.Item
              name={"firstName"}
              label={"First Name"}
              rules={[
                { message: requiredMessage("First Name"), required: true },
              ]}
              className="no-margin-form"
            >
              <InputComponent
                onChange={(e) => handleChangeName(e, "firstName")}
                onInput={onInputUpperCase}
              />
            </Form.Item>

            <Form.Item
              name={"middleName"}
              label={"Middle Name"}
              className="no-margin-form"
            >
              <InputComponent
                onChange={(e) => handleChangeName(e, "middleName")}
                onInput={onInputUpperCase}
              />
            </Form.Item>

            <Form.Item
              name={"lastName"}
              label={"Last Name"}
              className="no-margin-form"
            >
              <InputComponent
                onChange={(e) => handleChangeName(e, "lastName")}
                onInput={onInputUpperCase}
              />
            </Form.Item>
          </>
        ) : null}

        <Form.Item
          name={"customerName"}
          label={"Customer Name"}
          rules={[
            { message: requiredMessage("Customer Name"), required: true },
          ]}
          className="no-margin-form"
        >
          <InputComponent
            disabled={customerType !== 58}
            onInput={onInputUpperCase}
          />
        </Form.Item>

        <Form.Item
          name={"foundedBirthDate"}
          label={"Birth/Founded Date"}
          className="no-margin-form"
        >
          <DateComponent mandatory dateDisable={handleDisableEndDate} />
        </Form.Item>

        <Form.Item
          name={"foundedBirthPlace"}
          label={"Birth/Founded Place"}
          className="no-margin-form"
        >
          <InputComponent />
        </Form.Item>
        {customerType !== 58 ? (
          <>
            <Form.Item name={"sex"} label={"Sex"} className="no-margin-form">
              <SelectComponent mandatory>
                {optionsSex?.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.value}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>

            <Form.Item
              name={"maritalStatus"}
              label={"Marital Status"}
              className="no-margin-form"
            >
              <SelectComponent mandatory>
                {optionsMartialStatus?.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.value}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>
          </>
        ) : null}

        <Form.Item
          name={"searchKey"}
          label={"Search Key"}
          className="no-margin-form"
        >
          <InputComponent />
        </Form.Item>

        <div className="col-span-3">
          <Form.Item name={"description"} label={"Description"}>
            <InputComponent
              type="textarea"
              // onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Item>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateCustomerInformation;
