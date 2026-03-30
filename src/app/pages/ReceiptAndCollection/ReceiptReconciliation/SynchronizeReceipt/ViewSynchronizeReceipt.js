import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Input, Space, Tooltip } from "antd";
import CardContainer from "../../../../../components/CardContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import {
  EyeOutlined,
  FilterOutlined
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import TableRBI from "../../../../../components/TableRBI";
import moment from "moment";
import SVGIcon from "../../../../../assets/Icon/index";
import { NumericFormat } from "react-number-format";
import ButtonComponent from "../../../../../components/ButtonComponent";

const data = [];
for (let i = 0; i < 100; i++) {
  const randomAmount = Math.floor(Math.random() * (5000000 - 500000 + 1)) + 500000;

  data.push({
    syncId: `SYNCRL${i.toString().padStart(3, '0')}`,
    syncDateTime: `2025-12-21T23:11:09.892Z`,
    totalReceipt: i + 1,
    currency: "IDR",
    totalAmount: randomAmount,
  });
}

const ViewSynchronizeReceipt = () => {
  // Selector

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  // Use Effect

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Receipt & Collection",
    },
    {
      path: "",
      breadcrumbName: "Receipt Reconciliation",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_SYNCHRONIZE_RECEIPT,
      breadcrumbName: "Synchronize Receipt",
    },
  ];

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => {
            handleSearch(selectedKeys, confirm, dataIndex);
          }}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
      </div>
    ),
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 5000);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch(
      selectedKeys.length === 0 ? "" : `${dataIndex}~${selectedKeys[0]}`
    );
  };

  const columns = [
    {
      title: "NO",
      key: "no",
      width: 60,
      isClassification: true,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "SYNC ID",
      dataIndex: "syncId",
      key: "syncId",
      sorter: true,
      ...getColumnSearchProps("syncId"),
    },
    {
      title: "SYNC DATE TIME",
      dataIndex: "syncDateTime",
      key: "syncDateTime",
      align: "center",
      sorter: true,
      ...getColumnSearchProps("syncDateTime"),
      render: (syncDateTime) => moment(syncDateTime).format("DD MMM YYYY HH:MM:SS"),
    },
    {
      title: "TOTAL RECEIPT",
      dataIndex: "totalReceipt",
      key: "totalReceipt",
      align: "center",
      sorter: true,
      ...getColumnSearchProps("totalReceipt"),
    },
    {
      title: "CURRENCY",
      dataIndex: "currency",
      key: "currency",
      align: "center",
      sorter: true,
      ...getColumnSearchProps("currency"),
    },
    {
      title: "TOTAL AMOUNT",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "right",
      sorter: true,
      ...getColumnSearchProps("totalAmount"),
      render: (totalAmount) => (
        <NumericFormat
          displayType="text"
          value={totalAmount}
          className="text-right"
          // thousandSeparator={true}
          decimalScale={2}
          decimalSeparator=","
          thousandSeparator="."
          fixedDecimalScale
        />
      ),
    },
    {
      title: "ACTION",
      align: "center",
      dataIndex: "syncId",
      key: "action",
      fixed: "right",
      width: 100,
      render: (id, record) => {
        return (
          <Space>
            <Tooltip title="Detail">
              <Link
                to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_SYNCHRONIZE_RECEIPT}
                state={{ id: id }}
              >
                <ButtonComponent
                  icon={
                    // <SVGIcon name="IconDetail" width={24} />
                    <EyeOutlined />
                  }
                  border={false}
                />
              </Link>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  return (
    <>
      {/* <Spin spinning={loading}> */}
      <BreadCrumb routes={routes} />

      <CardContainer header={"SYNCRONIZE RECEIPT LIST"}>
        <div className="w-full">
          <TableRBI
            dataSource={data}
            columns={columns}
            current={page}
            pageSize={pageSize}
            onChange={handleChange}
            onShowSizeChange={handleChange}
            // totalData={data?.page?.totalElements}
            onSort={onSort}
            tableScrolled={{
              x: "max-content",
              y: 300,
            }}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
          />
        </div>
      </CardContainer>

      {/* </Spin> */}
    </>
  );
};

export default ViewSynchronizeReceipt;
