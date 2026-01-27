import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FilterOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Input } from "antd";
import CardContainer from "../../../../../components/CardContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import DetailText from "../../../../../components/DetailText";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import TableRBI from "../../../../../components/TableRBI";
import moment from "moment";
import { NumericFormat } from "react-number-format";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { LeftOutlined } from "@ant-design/icons";
import { dateFormat } from "../../../../../utils";

const data_detail = {
  syncId: "SYNCRL13",
  syncDateTime: "2021-12-21T04:01:40.892Z",
  totalReceipt: 10,
  currency: "IDR",
  totalAmount: 9139241,
  createdDate: "2023-08-30T04:01:40.892Z",
  createdBy: "Annisa",
  updatedDate: "2023-08-30T04:01:40.892Z",
  updatedBy: "jason.suted",
};

const data_receipt = [];
for (let i = 0; i < 100; i++) {
  const randomAccount = Math.floor(Math.random() * (999999 - 10000 + 1)) + 10000;
  const randomAmountEquivalent = Math.floor(Math.random() * (2000000 - 5000 + 1)) + 5000;

  data_receipt.push({
    receiptCode: `RCT00${i}`,
    customerNumber: `CST${i}`,
    customerName: "ANUGRAH ARTACITRA SEMESTA (RESTORAN MUTIARA) PT",
    accountNumber: `0000${randomAccount}`,
    accountName: `0000${randomAccount}`,
    syncDateTime: "2023-01-06T04:01:40.892Z",
    accountSegment: `RT`,
    accountGroupType: `GOLD`,
    meterReadingCode: `41-Jakarta`,
    accountType: `JRG`,
    accountStatus: `REGISTERED`,
    customerManagement: `Analyst City Gas CM and TS Area Bogor 1`,
    corporateCustomer: `N`,
    amount: 90000000,
    amountEquivalent: randomAmountEquivalent
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
      selectedKeys.length === 0 ? "" : `${dataIndex}~${selectedKeys[0]}`
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
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      sorter: true,
      ...getColumnSearchProps("customerName"),
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      sorter: true,
      ...getColumnSearchProps("accountNumber"),
    },
    {
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      sorter: true,
      ...getColumnSearchProps("accountName"),
    },
    {
      title: "RECEIPT DATE",
      dataIndex: "syncDateTime",
      align: "center",
      sorter: true,
      ...getColumnSearchProps("syncDateTime"),
      render: (syncDateTime) => moment(syncDateTime).format("DD MMM YYYY"),
    },
    {
      title: "ACCOUNT SEGMENT",
      dataIndex: "accountSegment",
      sorter: true,
      ...getColumnSearchProps("accountSegment"),
    },
    {
      title: "ACCOUNT GROUP TYPE",
      dataIndex: "accountGroupType",
      sorter: true,
      ...getColumnSearchProps("accountGroupType"),
    },
    {
      title: "METER READING CODE",
      dataIndex: "meterReadingCode",
      sorter: true,
      ...getColumnSearchProps("meterReadingCode"),
    },
    {
      title: "ACCOUNT TYPE",
      dataIndex: "accountType",
      sorter: true,
      ...getColumnSearchProps("accountType"),
    },
    {
      title: "ACCOUNT STATUS",
      dataIndex: "accountStatus",
      sorter: true,
      ...getColumnSearchProps("accountStatus"),
    },
    {
      title: "CUSTOMER MANAGEMENT",
      dataIndex: "customerManagement",
      sorter: true,
      ...getColumnSearchProps("customerManagement"),
    },
    {
      title: "CORPORATE CUSTOMER",
      dataIndex: "corporateCustomer",
      sorter: true,
      ...getColumnSearchProps("corporateCustomer"),
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
          // thousandSeparator={true}
          decimalScale={2}
          decimalSeparator=","
          thousandSeparator="."
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
          // thousandSeparator={true}
          decimalScale={2}
          decimalSeparator=","
          thousandSeparator="."
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
      path: "",
      breadcrumbName: "Receipt Reconciliation",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_SYNCHRONIZE_RECEIPT,
      breadcrumbName: "Synchronize Receipt",
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

      <CardContainer header={"SYNCHRONIZE INFORMATION"}>
        <div className="w-full grid grid-cols-3 gap-3">
          <DetailText label="SYNC ID">{data_detail?.syncId}</DetailText>
          <DetailText label="Sync Date Time">{data_detail?.syncDateTime
            ? moment(data_detail.syncDateTime).format(dateFormat)
            : "-"}</DetailText>
          <DetailText label="Total Receipt">{data_detail?.totalReceipt}</DetailText>
          <DetailText label="Currency">{data_detail?.currency}</DetailText>
          <DetailText label="Total Amount">
            <NumericFormat
              displayType="text"
              value={data_detail?.totalAmount}
              className="text-right"
              // thousandSeparator={true}
              decimalScale={2}
              decimalSeparator=","
              thousandSeparator="."
              fixedDecimalScale
            />
          </DetailText>
        </div>
      </CardContainer>

      <CardContainer header={"RECEIPT INFORMATION"}>
        <div className="w-full">
          <TableRBI
            dataSource={data_receipt}
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
          />
        </div>
      </CardContainer>

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
