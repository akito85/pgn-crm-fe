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
  getListTaxYears,
  getListFakturCode,
  getListCountry,
  clearTaxYears,
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
    dataListTaxYears,
    dataListFakturCode,
    dataListCountry,
  } = useSelector((state) => state.efaktur);

  // Declaration
  const dispatch = useDispatch();

  // State
  const [description, setDescription] = useState("");
  const [selectedTaxPeriod, setSelectedTaxPeriod] = useState(null);

  // Use Effect
  useEffect(() => {
    dispatch(getListFakturType());
    dispatch(getListTaxPeriod());
    dispatch(getListFakturCode());
    dispatch(getListCountry());
  }, [dispatch]);

  // Handle Tax Period Change
  const handleTaxPeriodChange = (value) => {
    setSelectedTaxPeriod(value);
    // Clear tax year when period changes
    form.setFieldsValue({ taxYear: undefined });
    dispatch(clearTaxYears());

    // Fetch tax years based on selected period
    if (value) {
      dispatch(getListTaxYears(value));
    }
  };

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
                  <Select.Option value={data.value} key={index}>
                    {data.label}
                  </Select.Option>
                ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Faktur Date"}
            name={"fakturDate"}
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: "Please select Faktur Date!" }]}
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
            rules={[{ required: true, message: "Please select Tax Period!" }]}
          >
            <SelectComponent
              placeholder="Select Tax Period"
              onChange={handleTaxPeriodChange}
            >
              {dataListTaxPeriod &&
                dataListTaxPeriod?.map((data, index) => (
                  <Select.Option value={data.value} key={index}>
                    {data.label}
                  </Select.Option>
                ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Faktur Code"}
            name={"fakturCode"}
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: "Please select Faktur Code!" }]}
          >
            <SelectComponent placeholder="Select Faktur Code">
              {dataListFakturCode &&
                dataListFakturCode?.map((data, index) => (
                  <Select.Option value={data.value} key={index}>
                    {data.label}
                  </Select.Option>
                ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Tax Year"}
            name={"taxYear"}
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: "Please select Tax Year!" }]}
          >
            <SelectComponent
              placeholder="Select Tax Year"
              disabled={!selectedTaxPeriod}
            >
              {dataListTaxYears &&
                dataListTaxYears?.map((data, index) => (
                  <Select.Option value={data.value} key={index}>
                    {data.label}
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
                  <Select.Option value={data.value} key={index}>
                    {data.label}
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
              {
                min: 16,
                message:
                  "Tax Identification Number must be at least 16 characters!",
              },
              {
                max: 16,
                message:
                  "Tax Identification Number must not exceed 16 characters!",
              },
            ]}
          >
            <InputComponent placeholder={"Tax Identification Number"}  maxLength={16}/>
          </Form.Item>

          <Form.Item
            label={"NITKU"}
            name={"npwp"}
            style={{ marginBottom: 0 }}
            rules={[
              {
                required: true,
                message: "Please input NPWP!",
              },
              {
                min: 16,
                message: "NITKU must be at least 16 characters!",
              },
              {
                max: 16,
                message: "NITKU must not exceed 16 characters!",
              },
            ]}
          >
            <InputComponent placeholder={"NPWP"}  maxLength={16}/>
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
