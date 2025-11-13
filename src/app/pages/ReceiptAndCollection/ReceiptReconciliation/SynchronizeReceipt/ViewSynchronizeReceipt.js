import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Input, Space, Tooltip } from "antd";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import { FilterOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import TablePagination from "../../../../../components/TablePagination";
import moment from "moment";
import SVGIcon from "../../../../../assets/Icon/index";
import { NumericFormat } from "react-number-format";
import ButtonComponent from "../../../../../components/ButtonComponent";

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    syncId: `SYNCRL${i}`,
    syncDateTime: "2023-08-30T04:01:40.892Z",
    totalReceipt: i,
    currency: "IDR",
    totalAmount: 1000000,
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
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "SYNC ID",
      dataIndex: "syncId",
      sorter: true,
      ...getColumnSearchProps("syncId"),
    },
    {
      title: "SYNCH DATE TIME",
      dataIndex: "syncDateTime",
      align: "center",
      sorter: true,
      render: (syncDateTime) => moment(syncDateTime).format("DD MMM YYYY"),
    },
    {
      title: "TOTAL RECEIPT",
      dataIndex: "totalReceipt",
      align: "center",
      sorter: true,
      ...getColumnSearchProps("totalReceipt"),
    },
    {
      title: "CURRENCY",
      dataIndex: "currency",
      align: "center",
      sorter: true,
      ...getColumnSearchProps("currency"),
    },
    {
      title: "TOTAL AMOUNT",
      dataIndex: "totalAmount",
      align: "right",
      sorter: true,
      ...getColumnSearchProps("totalAmount"),
      render: (totalAmount) => (
        <NumericFormat
          displayType="text"
          value={totalAmount}
          className="text-right"
          thousandSeparator={true}
          decimalScale={2}
          fixedDecimalScale
        />
      ),
    },
    {
      title: "ACTION",
      align: "center",
      dataIndex: "syncId",
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
                  icon={<SVGIcon name="IconDetail" width={24} />}
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

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  return (
    <LayoutMenu>
      {/* <Spin spinning={loading}> */}
      <BreadCrumb routes={routes} />

      <BaseContainer header={"SYNCRONIZE RECEIPT LIST"}>
        <div className="w-full">
          <TablePagination
            dataSource={data}
            columns={columns}
            current={page}
            pageSize={pageSize}
            onChange={handleChange}
            onShowSizeChange={handleChange}
            // totalData={data?.page?.totalElements}
            onSort={onSort}
            tableScrolled={{
              x: 1300,
              y: 300,
            }}
          />
        </div>
      </BaseContainer>

      {/* </Spin> */}
    </LayoutMenu>
  );
};

export default ViewSynchronizeReceipt;
