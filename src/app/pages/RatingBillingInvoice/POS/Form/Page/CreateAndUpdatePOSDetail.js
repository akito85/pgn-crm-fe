import React, { Fragment, useRef } from "react";
import InputComponent from "../../../../../../components/InputComponent";
import { Form, Select } from "antd";
import { requiredMessage } from "../../../../../../utils";
import SelectComponent from "../../../../../../components/SelectComponent";
import { useState } from "react";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import { columnsTablePOSDetailInfo } from "../../Table/TablePOSDetailInfo";

const CreateAndUpdatePOSDetail = ({
  data = [],
  type,
  setType = () => {},
  quantity,
  item,
  setItem = () => {},
  onInputChange = () => {},
  dataItem = [],
  dataType = [],
}) => {
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  // Filter Table
  const onFilter = (dataIndex, value, record) => {
    const fixSearchText = value?.toLowerCase();
    switch (dataIndex) {
      case "price":
      case "quantity":
      case "amount":
      case "amountEqvIdr":
      case "amountEqvUsd":
      case "eqvIdrTaxPurpose":
      case "discount":
      case "total":
      case "totalEqvIdr":
      case "totalEqvUsd":
        const tempValue = record[dataIndex]
          ? (record[dataIndex] + "").split(".")
          : [];
        const thousandSeparator = ",";
        const decimalSeparator = ".";
        const descimal = tempValue[1]
          ? `${decimalSeparator}${tempValue[1]}`
          : `${decimalSeparator}00`;
        const format =
          tempValue.length > 0
            ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
              descimal
            : "";
        return format.toLowerCase().includes(fixSearchText);

      default:
        return record[dataIndex]?.toLowerCase().includes(fixSearchText);
    }
  };

  // Sorting Table
  const sorter = (fieldSort, a, b) => {
    const handleDataSort = (obj) => {
      switch (fieldSort) {
        case "price":
        case "quantity":
        case "amount":
        case "amountEqvIdr":
        case "amountEqvUsd":
        case "eqvIdr":
        case "discount":
        case "total":
        case "totalEqvIdr":
        case "totalEqvUsd":
          // const tempValue = obj[fieldSort]
          //   ? (obj[fieldSort] + "").split(".")
          //   : [];
          // const thousandSeparator = ".";
          // const decimalSeparator = ",";
          // const descimal = tempValue[1]
          //   ? `${decimalSeparator}${tempValue[1]}`
          //   : `${decimalSeparator}00`;
          // const format =
          //   tempValue.length > 0
          //     ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
          //       descimal
          //     : "";
          return obj[fieldSort] ? (obj[fieldSort] || 0)?.toString()?.toLowerCase() : "0" ;
        default:
          return obj[fieldSort]?.toLowerCase();
      }
    };
  
    let fa = handleDataSort(a);
    let fb = handleDataSort(b);
  
    const handleCompare = (a, b) => {
      switch (fieldSort) {
        case "price":
        case "quantity":
        case "amount":
        case "amountEqvIdr":
        case "amountEqvUsd":
        case "eqvIdr":
        case "discount":
        case "total":
        case "totalEqvIdr":
        case "totalEqvUsd":
          return Math.sign(parseInt(a) - parseInt(b))
        default:
          return a.localeCompare(b);
      }
    }
  
    return handleCompare(fa, fb);
  };

  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"POS INFORMATION"}
      </div>

      <div className="grid grid-cols-4 gap-3">
        <Form.Item
          name={"type"}
          label={"Type"}
          rules={[{ message: requiredMessage("Type"), required: true }]}
        >
          <SelectComponent onChange={(e) => setType(e)}>
            {(dataType || [])?.map((data) => (
              <Select.Option key={data.Id} value={data?.Id}>
                {data?.text}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        <Form.Item
          name={"item"}
          label={"Item"}
          rules={[{ message: requiredMessage("Item"), required: true }]}
        >
          <SelectComponent onChange={(e) => setItem(e)}>
            {(dataItem || [])?.map((data) => (
              <Select.Option key={data?.id} value={data?.id}>
                {data?.name}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>
      </div>

      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"POS DETAIL INFORMATION"}
      </div>

      <div className="grid grid-cols-4 gap-3">
        <span className="custom-number-input">
          <Form.Item
            name={"quantity"}
            label={"Quantity"}
            rules={[
              {
                message: requiredMessage("Quantity"),
                required: type === 2144 ? true : false,
              },
            ]}
          >
            <InputComponent
              onInput={(e) =>
                (e.target.value = e.target.value.replace(/\D/g, ""))
              }
              onChange={(e) => onInputChange(e, "quantity")}
              disabled={type === 2144 ? false : true}
            />
          </Form.Item>
        </span>
        <Form.Item
          name={"price"}
          label={"Price"}
          rules={[
            {
              message: requiredMessage("Price"),
              required: type === 2145 ? true : false,
            },
          ]}
          getValueFromEvent={(e) => {
            return e.floatValue;
          }}
        >
          <InputComponent
            disabled={type === 2145 ? false : true}
            decimalScale={2}
            thousandSeparator={","}
            decimalSeparator={"."}
            type="numeric"
            fixedDecimalScale={true}
            onChange={(e) => onInputChange(e, "amount")}
          />
        </Form.Item>
        <Form.Item
          name={"amount"}
          label={"Amount"}
          // rules={[
          //   {
          //     message: requiredMessage("Amount"),
          //     required: type === 2145 ? true : false,
          //   },
          // ]}
          getValueFromEvent={(e) => {
            return e.floatValue;
          }}
        >
          <InputComponent
            disabled
            decimalScale={2}
            thousandSeparator={","}
            decimalSeparator={"."}
            type="numeric"
            fixedDecimalScale={true}
            // onChange={(e) => onInputChange(e, "amount")}
          />
        </Form.Item>
        <Form.Item name={"uom"} label={"UOM"}>
          <InputComponent disabled />
        </Form.Item>
        <Form.Item name={"currency"} label={"Currency"}>
          <InputComponent disabled />
        </Form.Item>
        <Form.Item
          name={"amountEqvIdr"}
          label={"Amount EQV IDR"}
          getValueFromEvent={(e) => {
            return e.floatValue;
          }}
        >
          <InputComponent
            disabled
            decimalScale={2}
            thousandSeparator={","}
            decimalSeparator={"."}
            type="numeric"
            fixedDecimalScale={true}
          />
        </Form.Item>
        <Form.Item
          name={"amountEqvUsd"}
          label={"Amount EQV USD"}
          getValueFromEvent={(e) => {
            return e.floatValue;
          }}
        >
          <InputComponent
            disabled
            decimalScale={2}
            thousandSeparator={","}
            decimalSeparator={"."}
            type="numeric"
            fixedDecimalScale={true}
          />
        </Form.Item>
        <Form.Item
          name={"eqvIdrTaxPurpose"}
          label={"Amount IDR ( Tax Purpose )"}
          getValueFromEvent={(e) => {
            return e.floatValue;
          }}
        >
          <InputComponent
            disabled
            decimalScale={2}
            thousandSeparator={","}
            decimalSeparator={"."}
            type="numeric"
            fixedDecimalScale={true}
          />
        </Form.Item>
        <Form.Item
          name={"discount"}
          label={"Discount"}
          getValueFromEvent={(e) => {
            return e.floatValue;
          }}
        >
          <InputComponent
            disabled
            decimalScale={2}
            thousandSeparator={","}
            decimalSeparator={"."}
            type="numeric"
            fixedDecimalScale={true}
          />
        </Form.Item>
        <Form.Item
          name={"total"}
          label={"Total"}
          getValueFromEvent={(e) => {
            return e.floatValue;
          }}
        >
          <InputComponent
            disabled
            decimalScale={2}
            thousandSeparator={","}
            decimalSeparator={"."}
            type="numeric"
            fixedDecimalScale={true}
          />
        </Form.Item>
        <Form.Item
          name={"totalEqvIdr"}
          label={"Total EQV IDR"}
          getValueFromEvent={(e) => {
            return e.floatValue;
          }}
        >
          <InputComponent
            disabled
            decimalScale={2}
            thousandSeparator={","}
            decimalSeparator={"."}
            type="numeric"
            fixedDecimalScale={true}
          />
        </Form.Item>
        <Form.Item
          name={"totalEqvUsd"}
          label={"Total EQV USD"}
          getValueFromEvent={(e) => {
            return e.floatValue;
          }}
        >
          <InputComponent
            disabled
            decimalScale={2}
            thousandSeparator={","}
            decimalSeparator={"."}
            type="numeric"
            fixedDecimalScale={true}
          />
        </Form.Item>
      </div>

      {type === 2144 && quantity && item && quantity > 0 ? (
        <div>
          <div className="text-primary text-xs font-bold uppercase">
            {"TAX INFORMATION"}
          </div>

          <div className="w-full">
            <TablePaginationNew
              type="FE"
              dataSource={data}
              totalData={data?.length}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              tableScrolled={{
                x: 5000,
                y: 300,
              }}
              columns={columnsTablePOSDetailInfo(
                search,
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                onFilter,
                sorter
              ).filter((item) => item.title !== "ACTION")}
            />
          </div>
        </div>
      ) : null}

      <div className="my-3">
        <Form.Item name={"remark"} label={"Remark"}>
          <InputComponent type="textarea" />
        </Form.Item>
      </div>
    </Fragment>
  );
};

export default CreateAndUpdatePOSDetail;
