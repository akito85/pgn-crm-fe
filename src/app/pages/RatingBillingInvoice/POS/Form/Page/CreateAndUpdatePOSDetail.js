import React, { Fragment, useRef, useState, useMemo, useEffect } from "react";
import InputComponent from "../../../../../../components/InputComponent";
import { Form, Select, Spin } from "antd";
import { requiredMessage } from "../../../../../../utils";
import SelectComponent from "../../../../../../components/SelectComponent";
import { columnsTablePOSDetailInfo } from "../../Table/TablePOSDetailInfo";
import BaseContainer from "../../../../../../components/BaseContainer";
import TableRBI from "../../../../../../components/TableRBI";

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
  loading = false,
  dataUomCodes = [],
  data_globalCurrency = [],
  headerCurrency,
  onCurrencyChange = () => {},
  form,
  isOpen = false,
  onResetState = () => {},
}) => {
  const searchInput = useRef(null);
  const [fixedColumns, setFixedColumns] = useState({ left: [], right: [] });

  // State untuk infinite scroll
  const [displayedRowCount, setDisplayedRowCount] = useState(20);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});

  useEffect(() => {
    if (isOpen) {
      setDisplayedRowCount(20);
      setSearchedColumn("");
      setSearchText("");
      setSearch({});
      setFixedColumns({ left: [], right: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && form) {
      form.resetFields([
        "type",
        "item",
        "quantity",
        "price",
        "amount",
        "uom",
        "currency",
        "convertedCurrency",
        "discount",
        "total",
        "totalAmountEqv",
        "remark",
      ]);
      setType(undefined);
      setItem(undefined);
      onResetState();
    }
  }, [isOpen]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => ({
      ...prevState,
      [dataIndex]: selectedKeys[0],
    }));
    setDisplayedRowCount(20);
  };

  const handleLoadMore = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setDisplayedRowCount((prev) => prev + 20);
        resolve();
      }, 300);
    });
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
          return obj[fieldSort]
            ? (obj[fieldSort] || 0)?.toString()?.toLowerCase()
            : "0";
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
          return Math.sign(parseInt(a) - parseInt(b));
        default:
          return a.localeCompare(b);
      }
    };

    return handleCompare(fa, fb);
  };

  const displayedData = useMemo(() => {
    return data.slice(0, displayedRowCount);
  }, [data, displayedRowCount]);
  const hasMore = displayedRowCount < data.length;

  // Columns definition
  const columns = useMemo(() => {
    return columnsTablePOSDetailInfo(
      search,
      1,
      displayedRowCount,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      onFilter,
      sorter,
    ).filter((item) => item.title !== "ACTION");
  }, [search, searchedColumn, searchText, displayedRowCount]);

  // Column definitions untuk Column Settings
  const columnDefinitions = useMemo(() => {
    return columns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [columns]);

  return (
    <Fragment>
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 rounded-lg">
          <Spin size="medium" tip="Calculating..." />
        </div>
      )}

      <BaseContainer
        subHeader={<p className="-mt-[10px] text-primary">POS INFORMATION</p>}
        border
        className="mb-3"
      >
        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            name={"type"}
            label={"Type"}
            rules={[{ message: requiredMessage("Type"), required: true }]}
          >
            <SelectComponent onChange={(e) => setType(e)} disabled={loading}>
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
            <SelectComponent onChange={(e) => setItem(e)} disabled={loading}>
              {(dataItem || [])?.map((data) => (
                <Select.Option key={data?.id} value={data?.id}>
                  {data?.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
        </div>
      </BaseContainer>

      <BaseContainer
        subHeader={
          <p className="-mt-[10px] text-primary">POS DETAIL INFORMATION</p>
        }
        border
        className="mb-3"
      >
        <div className="grid grid-cols-5 gap-3">
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
                disabled={type === 2144 ? loading : true}
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
            getValueFromEvent={(e) => e.floatValue}
          >
            <InputComponent
              disabled={type === 2145 ? loading : true}
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
            getValueFromEvent={(e) => e.floatValue}
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

          <Form.Item name={"uom"} label={"UOM"}>
            <InputComponent disabled />
          </Form.Item>

          <Form.Item
            name={"currency"}
            label={"Currency"}
            rules={[
              {
                message: requiredMessage("Currency"),
                required: type === 2145 ? true : false,
              },
            ]}
          >
            <SelectComponent
              disabled={type === 2144 ? true : loading}
              onChange={(val) => onCurrencyChange(val)}
            >
              {(data_globalCurrency || [])?.map((item) => (
                <Select.Option key={item.Id} value={item.Id}>
                  {item.text}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item name={"convertedCurrency"} label={"Converted Currency"}>
            <InputComponent disabled />
          </Form.Item>

          <Form.Item
            name={"discount"}
            label={"Discount"}
            getValueFromEvent={(e) => e.floatValue}
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
            label={"Total Amount"}
            getValueFromEvent={(e) => e.floatValue}
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
            name={"totalAmountEqv"}
            label={"Total Amount EQV"}
            getValueFromEvent={(e) => e.floatValue}
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
      </BaseContainer>

      {type === 2144 && quantity && item && quantity > 0 ? (
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
              <Spin />
            </div>
          )}
          <BaseContainer
            subHeader={
              <p className="-mt-[10px] text-primary">TAX INFORMATION</p>
            }
            border
            className="mb-3"
          >
            <div className="w-full">
              <TableRBI
                idTable="table-pos-detail-info"
                dataSource={displayedData}
                totalData={data?.length}
                tableScrolled={{
                  x: 2500,
                  y: 300,
                }}
                columns={columns}
                columnDefinitions={columnDefinitions}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                loading={loading}
                useSelect={true}
                usePagination={false}
                useInfiniteScroll={true}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                loadMoreThreshold={20}
                showExport={false}
                showAdvanceSearch={false}
                showSearchBar={false}
                showRefresh={false}
              />
            </div>
          </BaseContainer>
        </div>
      ) : null}

      <BaseContainer
        subHeader={<p className="-mt-[10px] text-primary">REMARK</p>}
        border
        className="mb-3"
      >
        <div className="my-3">
          <Form.Item
            name={"remark"}
            label={"Remark"}
            rules={[{ message: requiredMessage("Remark"), required: true }]}
          >
            <InputComponent type="textarea" disabled={loading} />
          </Form.Item>
        </div>
      </BaseContainer>
    </Fragment>
  );
};

export default CreateAndUpdatePOSDetail;