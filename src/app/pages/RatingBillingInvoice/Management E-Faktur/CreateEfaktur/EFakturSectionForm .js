import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Select, DatePicker } from "antd";
import CardContainer from "../../../../../components/CardContainer";
import SelectComponent from "../../../../../components/SelectComponent";
import InputComponent from "../../../../../components/InputComponent";
import DetailTransactionTable from "./DetailTransactionTable";
import { dateFormatting } from "../../../../../utils";
import {
  getListFakturType,
  getListTaxPeriod,
  getListCountry,
} from "../../../../../redux/slices/rating_billing_invoice/efakturSlice";

const EFakturSectionForm = ({
  type,
  form,
  listDataDetail = [],
  setListDataDetail = () => {},
  efakturId,
}) => {
  // Selector
  const {
    dataListFakturType,
    dataListTaxPeriod,
    dataListCountry,
  } = useSelector((state) => state.efaktur);

  // Declaration
  const dispatch = useDispatch();

  // State
  const [description, setDescription] = useState("");

  // Use Effect
  useEffect(() => {
    dispatch(getListFakturType());
    dispatch(getListTaxPeriod());
    dispatch(getListCountry());
  }, [dispatch]);

  return (
    <div>
      {/* Documentation Transaction */}
      <CardContainer subHeader={"DOCUMENTATION TRANSACTION"}>
        <div className="w-full grid grid-cols-4 gap-3">
          <Form.Item
            label={"Faktur Type"}
            name={"fakturType"}
            rules={[
              {
                required: true,
                message: "Please select Faktur Type!",
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <SelectComponent placeholder="Select Faktur Type">
              {dataListFakturType &&
                dataListFakturType?.map((data, index) => (
                  <Select.Option value={data.id} key={index}>
                    {data.name}
                  </Select.Option>
                ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Faktur Date"}
            name={"fakturDate"}
            style={{ marginBottom: 0 }}
            rules={[
              { required: true, message: "Please select Faktur Date!" },
            ]}
          >
            <DatePicker
              format={dateFormatting?.date}
              style={{
                borderRadius: "6px",
                boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                padding: "4px 12px",
              }}
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            label={"Tax Period"}
            name={"taxPeriod"}
            style={{ marginBottom: 0 }}
            rules={[
              { required: true, message: "Please select Tax Period!" },
            ]}
          >
            <SelectComponent placeholder="Select Tax Period">
              {dataListTaxPeriod &&
                dataListTaxPeriod?.map((data, index) => (
                  <Select.Option value={data.id} key={index}>
                    {data.period}
                  </Select.Option>
                ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Faktur Code"}
            name={"fakturCode"}
            style={{ marginBottom: 0 }}
            rules={[
              { required: true, message: "Please input Faktur Code!" },
            ]}
          >
            <InputComponent placeholder="Select Faktur Code" />
          </Form.Item>

          <Form.Item
            label={"Tax Year"}
            name={"taxYear"}
            style={{ marginBottom: 0 }}
            rules={[
              { required: true, message: "Please select Tax Year!" },
            ]}
          >
            <SelectComponent placeholder="Select Tax Year">
              {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map((year) => (
                <Select.Option value={year} key={year}>
                  {year}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Country"}
            name={"country"}
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: "Please select Country!" }]}
          >
            <SelectComponent placeholder="Select Country">
              {dataListCountry &&
                dataListCountry?.map((data, index) => (
                  <Select.Option value={data.code} key={index}>
                    {data.name}
                  </Select.Option>
                ))}
            </SelectComponent>
          </Form.Item>

          <div className="col-span-4">
            <Form.Item
              label={"Description"}
              name={"description"}
              className={"w-full"}
              style={{ marginBottom: 0 }}
            >
              <InputComponent
                type="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Description"
              />
            </Form.Item>
          </div>
        </div>
      </CardContainer>

      {/* Customer Information */}
      <CardContainer subHeader={"CUSTOMER INFORMATION"}>
        <div className="w-full grid grid-cols-4 gap-3">
          <Form.Item
            label={"Customer Name"}
            name={"customerName"}
            rules={[
              {
                required: true,
                message: "Please input Customer Name!",
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <InputComponent placeholder={"Customer Name"} />
          </Form.Item>

          <Form.Item
            label={"Email"}
            name={"email"}
            rules={[
              {
                required: true,
                message: "Please input Email!",
              },
              {
                type: "email",
                message: "Please input valid Email!",
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <InputComponent placeholder={"customer@company.com"} />
          </Form.Item>

          <Form.Item
            label={"Tax Identification Number"}
            name={"taxIdentificationNumber"}
            style={{ marginBottom: 0 }}
            rules={[
              {
                required: true,
                message: "Please input Tax Identification Number!",
              },
            ]}
          >
            <InputComponent placeholder={"Tax Identification Number"} />
          </Form.Item>

          <Form.Item
            label={"NPWP"}
            name={"npwp"}
            style={{ marginBottom: 0 }}
            rules={[
              {
                required: true,
                message: "Please input NPWP!",
              },
            ]}
          >
            <InputComponent placeholder={"NPWP"} />
          </Form.Item>

          <div className="col-span-4">
            <Form.Item
              label={"Customer Address"}
              name={"customerAddress"}
              className={"w-full"}
              style={{ marginBottom: 0 }}
              rules={[
                {
                  required: true,
                  message: "Please input Customer Address!",
                },
              ]}
            >
              <InputComponent
                type="textarea"
                rows={3}
                placeholder="Customer Address..."
              />
            </Form.Item>
          </div>
        </div>
      </CardContainer>

      {/* Down Payment Information */}
      <CardContainer subHeader={"DOWN PAYMENT INFORMATION"}>
        <div className="w-full grid grid-cols-4 gap-3">
          <Form.Item
            label={"Down Payment"}
            name={"downPayment"}
            style={{ marginBottom: 0 }}
          >
            <InputComponent
              type="number"
              placeholder="Input Down Payment in Rupiah"
            />
          </Form.Item>
        </div>
      </CardContainer>

      {/* Detail Transaction Table */}
      <DetailTransactionTable
        type={type}
        listDataDetail={listDataDetail}
        setListDataDetail={setListDataDetail}
        efakturId={efakturId}
      />
    </div>
  );
};

export default EFakturSectionForm;