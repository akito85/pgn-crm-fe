import React, { useEffect, useRef, useState } from "react";
import DateComponent from "../../../../../../../../components/DateComponent";
import { Fragment } from "react";
import InputComponent from "../../../../../../../../components/InputComponent";
import { Button, Form, Input, Select } from "antd";
import { requiredMessage } from "../../../../../../../../utils";
import ButtonComponent from "../../../../../../../../components/ButtonComponent";

const TaxRelationCreate = ({
  handleChooseAccount = {},
  accountNumber = {},
  setAccountNumber = () => {},
}) => {
  const disabledDate = (current) => {
    return false;
  };
  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase mb-5">
        TAX RELATION
      </div>

      <div className="w-full grid grid-cols-3 gap-3">
        {/* <div className="flex flex-row"> */}
        {/* line 1 */}
        <Form.Item
          name={"accountNumber"}
          label={"Account Number"}
          rules={[
            { message: requiredMessage("Account Number"), required: true },
          ]}
        >
          <div className="flex flex-row">
            <Input.Group compact>
              <InputComponent
                disabled
                onChange={(e) => {
                  setAccountNumber(e.target.value);
                }}
                value={accountNumber}
              />
              <Button
                type="primary"
                onClick={() => {
                  handleChooseAccount({
                    data: {},
                    isOpen: true,
                  });
                }}
              >
                Choose
              </Button>
            </Input.Group>
          </div>
        </Form.Item>

        {/* <div className="pt-7">
            <Button
              type={"primary"}
              onClick={() => {
                handleChooseAccount({
                  data: {},
                  isOpen: true,
                });
              }}
            >
              Choose
            </Button>
          </div> */}
        {/* </div> */}

        <Form.Item
          name={"customerName"}
          label={"Customer Name"}
          rules={[
            {
              message: requiredMessage("Customer Name"),
              required: true,
            },
          ]}
        >
          <InputComponent
            mandatory
            disabled
            // onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name={"accountName"}
          label={"Account Name"}
          rules={[
            {
              message: requiredMessage("Account Name"),
              required: true,
            },
          ]}
        >
          <InputComponent
            mandatory
            disabled
            // onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name={"taxIdentifierTypeValue"}
          label={"Related Account Tax Identifier Type"}
          rules={[
            {
              message: requiredMessage("Related Account Tax Identifier Type"),
              required: true,
            },
          ]}
          className="no-margin-form"
        >
          <InputComponent
            mandatory
            disabled
            // onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name={"taxIdentifierNumber"}
          label={"Related Account Tax Identifier Number"}
          rules={[
            {
              message: requiredMessage("Related Account Tax Identifier Number"),
              required: true,
            },
          ]}
          className="no-margin-form"
        >
          <InputComponent
            mandatory
            disabled
            // onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name={"taxIdentifierName"}
          label={"Related Account Tax Identifier Name"}
          rules={[
            {
              message: requiredMessage("Related Account Tax Identifier Name"),
              required: true,
            },
          ]}
          className="no-margin-form"
        >
          <InputComponent
            mandatory
            disabled
            // onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>

        <div className="col-span-3 mt-5">
          <Form.Item
            name={"taxIdentifierAddressValue"}
            label={"Related Account Tax Identifier Address"}
            rules={[
              {
                message: requiredMessage(
                  "Related Account Tax Identifier Address",
                ),
                required: true,
              },
            ]}
          >
            <InputComponent
              mandatory
              disabled
              // onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name={"startDate"}
            label={"Start Date"}
            rules={[{ message: requiredMessage("Start Date"), required: true }]}
            className="no-margin-form"
          >
            <DateComponent
              mandatory
              dateDisable={disabledDate}
              // dateDisable={handleDisableEndDate}
              // disabledd={startDate === null}
            />
          </Form.Item>
        </div>
        <div className="col-span-3 mt-5">
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

export default TaxRelationCreate;
