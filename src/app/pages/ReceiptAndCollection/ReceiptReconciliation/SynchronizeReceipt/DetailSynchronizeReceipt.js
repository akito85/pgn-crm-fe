import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FilterOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Spin, Input } from "antd";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import DetailText from "../../../../../components/DetailText";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import TablePagination from "../../../../../components/TablePagination";
import moment from "moment";
import { NumericFormat } from "react-number-format";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { LeftOutlined } from "@ant-design/icons";
import { dateFormat } from "../../../../../utils";

const data_detail = {
  syncId: "SYNCRL1",
  syncDateTime: "2023-08-30T04:01:40.892Z",
  totalReceipt: 1,
  currency: "IDR",
  totalAmount: 1000000,
  createdDate: "2023-08-30T04:01:40.892Z",
  createdBy: "Annisa",
  updatedDate: "2023-08-30T04:01:40.892Z",
  updatedBy: "jason.suted",
};

const data_receipt = [];
for (let i = 0; i < 100; i++) {
  data_receipt.push({
    receiptCode: `RCT00${i}`,
    customerNumber: `CST${i}`,
    accountNumber: 5787531,
    customerName: "ANUGRAH ARTACITRA SEMESTA (RESTORAN MUTIARA) PT",
    receiptDate: "2023-08-30T04:01:40.892Z",
    amount: 15000000000,
    amountEquivalent: 690467,
  });
}

const DetailSynchronizeReceipt = () => {
  // Selector

  // Declaration
  const navigate = useNavigate();
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

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
      selectedKeys.length === 0 ? "" : `${dataIndex}~${selectedKeys[0]}`,
    );
  };

  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "RECEIPT CODE",
      dataIndex: "receiptCode",
      sorter: true,
      ...getColumnSearchProps("receiptCode"),
    },
    {
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
      sorter: true,
      ...getColumnSearchProps("customerNumber"),
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      sorter: true,
      ...getColumnSearchProps("accountNumber"),
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      sorter: true,
      ...getColumnSearchProps("customerName"),
    },
    {
      title: "RECEIPT DATE",
      dataIndex: "syncDateTime",
      align: "center",
      sorter: true,
      render: (syncDateTime) => moment(syncDateTime).format("DD MMM YYYY"),
    },
    {
      title: "AMOUNT",
      dataIndex: "amount",
      align: "right",
      sorter: true,
      ...getColumnSearchProps("amount"),
      render: (amount) => (
        <NumericFormat
          displayType="text"
          value={amount}
          className="text-right"
          thousandSeparator={true}
          decimalScale={2}
          fixedDecimalScale
        />
      ),
    },
    {
      title: "AMOUNT EQUIVALENT",
      dataIndex: "amountEquivalent",
      align: "right",
      sorter: true,
      ...getColumnSearchProps("amountEquivalent"),
      render: (amountEquivalent) => (
        <NumericFormat
          displayType="text"
          value={amountEquivalent}
          className="text-right"
          thousandSeparator={true}
          decimalScale={2}
          fixedDecimalScale
        />
      ),
    },
  ];

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Receipt & Collection",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_RECEIPT,
      breadcrumbName: "Receipt",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.DETAIL_RECEIPT,
      breadcrumbName: "Detail Receipt",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.DETAIL_SYNCHRONIZE_RECEIPT,
      breadcrumbName: "Detail Synchronize Receipt",
    },
  ];

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

      <BaseContainer header={"SYNCHRONIZE INFORMATION"}>
        <div className="w-full grid grid-cols-3 gap-3">
          <DetailText label="Sync Id">{data_detail?.syncId}</DetailText>
          <DetailText label="Sync Date Time">
            {data_detail?.syncDateTime
              ? moment(data_detail.syncDateTime).format(dateFormat)
              : "-"}
          </DetailText>
          <DetailText label="Total Receipt">
            {data_detail?.totalReceipt}
          </DetailText>
          <DetailText label="Currency">{data_detail?.currency}</DetailText>
          <DetailText label="Total Amount">
            <NumericFormat
              displayType="text"
              value={data_detail?.totalAmount}
              className="text-right"
              thousandSeparator={true}
              decimalScale={2}
              fixedDecimalScale
            />
          </DetailText>
        </div>
      </BaseContainer>

      <BaseContainer header={"RECEIPT INFORMATION"}>
        <div className="w-full">
          <TablePagination
            dataSource={data_receipt}
            columns={columns}
            current={page}
            pageSize={pageSize}
            onChange={handleChange}
            onShowSizeChange={handleChange}
            // totalData={data?.page?.totalElements}
            onSort={onSort}
            tableScrolled={{
              x: 2000,
              y: 300,
            }}
          />
        </div>
      </BaseContainer>

      <div className="flex mt-[30px]">
        <ButtonComponent
          type={"submit"}
          onClick={() => navigate(-1)}
          icon={
            <LeftOutlined
              style={{
                color: "#fff",
                fontSize: 24,
                justifyItems: "center",
              }}
            />
          }
        >
          Back
        </ButtonComponent>
      </div>

      {/* </Spin> */}
    </LayoutMenu>
  );
};

export default DetailSynchronizeReceipt;
