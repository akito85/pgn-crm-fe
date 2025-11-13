import React from "react";
import DateComponent from "../../../../../../../../components/DateComponent";
import { Fragment } from "react";
import InputComponent from "../../../../../../../../components/InputComponent";
import { Form, Select } from "antd";
import { requiredMessage } from "../../../../../../../../utils";
import SelectComponent from "../../../../../../../../components/SelectComponent";
import { onInputUpperCase } from "../../../../../Utils";

//npwp
const numberPattern = /^\d+$/;

const TaxIdentifierCreate = ({
  optionTypeTax = [],
  handleBtnIsEnable = {},
  warning = "",
  textTax = "",
  typeTax = 0,
  setTextTax = () => {},
  setTypeTax = () => {},
  setWarning = () => {},
  onChangedTypeTax = () => {},
  dataTaxIdentifier = [],
  dataTaxAddress = [],
}) => {
  // useEffect(() => {
  //   handleBtnIsEnable(true);
  // }, []);

  //handle
  const onChangeCheckedNpwp = (e) => {
    setTextTax(e);
    const temp = numberPattern.test(e) ? "" : "please input only number";

    const temp2 = e.match(/\d/g)?.length === 16 ? true : false;
    // handleBtnIsEnable(
    //   numberPattern.test(e) && e.match(/\d/g)?.length === 16 ? false : true
    // );
    setWarning(
      `${temp}${
        temp2
          ? ""
          : ` ${temp.length > 0 ? "and" : ""} Input number must be 16 digits`
      }`
    );
  };

  const onChangeCheckedKtp = (e) => {
    setTextTax(e);
    const temp = numberPattern.test(e) ? "" : "please input only number";
    const temp2 = e.match(/\d/g)?.length === 16 ? true : false;
    // handleBtnIsEnable(
    //   numberPattern.test(e) && e.match(/\d/g)?.length === 16 ? false : true
    // );
    setWarning(
      `${temp}${
        temp2
          ? ""
          : ` ${temp.length > 0 ? "and" : ""} Input number must be 16 digits`
      }`
    );
  };

  const onChangeCheckedTaxNumber = (e) => {
    if (typeTax === 921) {
      onChangeCheckedNpwp(e);
    } else if (typeTax === 922) {
      onChangeCheckedKtp(e);
    }
  };

  const disableDate = (current) => {
    return false;
  };

  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase mb-5">
        TAX IDENTIFIER INFORMATION
      </div>

      <div className="w-full grid grid-cols-3 gap-3">
        <Form.Item
          name={"taxIdentifierType"}
          label={"Tax Identifier Type"}
          rules={[
            { message: requiredMessage("Tax Identifier Type"), required: true },
          ]}
          className="no-margin-form"
        >
          <SelectComponent mandatory onChange={(e) => onChangedTypeTax(e)}>
            {dataTaxIdentifier?.map((data) => (
              <Select.Option key={data.id} value={data.id}>
                {data.text}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        <div className="flex flex-col gap-1">
          <Form.Item
            name={"taxIdentifierNumber"}
            label={"Tax Idenfitier Number"}
            rules={[
              {
                message: requiredMessage("Tax Identifier Number"),
                required: true,
              },
            ]}
            validateStatus={
              typeTax === 0 || textTax.length <= 0 || warning.length === 0
                ? null
                : "error"
            }
            hasFeedback
            help={
              typeTax === 0 ||
              textTax.length <= 0 ||
              warning.length === 0 ? null : (
                <span className="text-xs mt-1 text-[#f34949]">{`* ${warning}`}</span>
              )
            }
          >
            <InputComponent
              mandatory
              maxLength={typeTax === 921 ? 16 : 16}
              disabled={typeTax === 0 ? true : false}
              onChange={(e) => onChangeCheckedTaxNumber(e.target.value)}
              onInput={(e) =>
                (e.target.value = e.target.value.replace(/\D/g, ""))
              }
            />
          </Form.Item>
          {/* {typeTax === 0 ||
          textTax.length <= 0 ||
          warning.length === 0 ? null : (
            <span className="text-xs mt-1 text-[#f34949]">{`* ${warning}`}</span>
          )} */}
        </div>

        <Form.Item
          name={"taxIdentifierName"}
          label={"Tax Idenfitier Name"}
          rules={[
            {
              message: requiredMessage("Tax Identifier Name"),
              required: true,
            },
          ]}
        >
          <InputComponent
            onInput={onInputUpperCase}
            // onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>
      </div>

      <div className="w-full flex flex-col gap-5">
        <Form.Item
          name={"taxIdentifierAddress"}
          label={"Tax Identifier Address"}
          rules={[
            {
              message: requiredMessage("Tax Identifier Address"),
              required: true,
            },
          ]}
          className="no-margin-form"
        >
          <SelectComponent>
            {dataTaxAddress?.map((data) => (
              <Select.Option key={data.addressId} value={data.addressId}>
                {data.fullAddress}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        <Form.Item
          name={"startDate"}
          label={"Start Date"}
          rules={[{ message: requiredMessage("Start Date"), required: true }]}
          className="no-margin-form"
        >
          <DateComponent
            mandatory
            dateDisable={disableDate}
            // disabled={startDate === null}
          />
        </Form.Item>

        <Form.Item name={"description"} label={"Description"}>
          <InputComponent
            type="textarea"
            // onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>
      </div>
    </Fragment>
  );
};

export default TaxIdentifierCreate;
