import { Tooltip, Select } from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import SelectComponent from "../../../../../../components/SelectComponent";
import StatusComponent from "../../../../../../components/StatusComponent";
import { getCustomerInfo } from "../../../../../../redux/slices/receipt_collection/electrionicBank";
import { dateFormatting } from "../../../../../../utils";
import {
  getColumnSearchPropsPaging,
} from "../../../../../../utils/getColumnSearchProps";
import TableRBI from "../../../../../../components/TableRBI";
const { Option } = Select;

const columnSundry = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  selectCustomer,
  handleSelectCustomer = () => {},
  type,
  dataCustomer,
  typeModal
) => {
  const column = [
    {
      key: "no",
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      key: "receiptCode",
      title: "RECEIPT CODE",
      dataIndex: "receiptCode",
      sorter: (a, b) => a?.receiptCode?.localeCompare(b?.receiptCode),
      ...getColumnSearchPropsPaging(
        "receiptCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      onFilter: (value, record) =>
        record["receiptCode"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      render: (text) =>
        searchedColumn === "receiptCode" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      key: "sor",
      title: "SOR",
      dataIndex: "sor",
      align: "left",
      sorter: (a, b) => a?.sor?.localeCompare(b?.sor),
      ...getColumnSearchPropsPaging(
        "sor",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      onFilter: (value, record) =>
        record["sor"]?.toString().toLowerCase().includes(value.toLowerCase()),
      render: (text) =>
        searchedColumn === "sor" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      key: "costCenter",
      title: "COST CENTER",
      dataIndex: "costCenter",
      align: "left",
      sorter: (a, b) => a?.costCenter?.localeCompare(b?.costCenter),
      ...getColumnSearchPropsPaging(
        "costCenter",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      onFilter: (value, record) =>
        record["costCenter"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      ellipsis: { showTitle: false },
      render: (text) =>
        searchedColumn === "costCenter" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      key: "customerName",
      title: "CUSTOMER",
      dataIndex: "customerName",
      align: "left",
      sorter: (a, b) => a?.customer?.localeCompare(b?.customer),
      ...getColumnSearchPropsPaging(
        "customerName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      onFilter: (value, record) =>
        record["customerName"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      ellipsis: { showTitle: false },
      render: (text) =>
        searchedColumn === "customerName" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      key: "accountNumber",
      title: "ACCOUNT",
      dataIndex: "accountNumber",
      align: "left",
      sorter: (a, b) => a?.account?.localeCompare(b?.account),
      ...getColumnSearchPropsPaging(
        "accountNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      onFilter: (value, record) =>
        record["accountNumber"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      ellipsis: { showTitle: false },
      render: (text) =>
        searchedColumn === "accountNumber" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      key: "receiptNumber",
      title: "RECEIPT NUMBER",
      dataIndex: "receiptNumber",
      align: "right",
      sorter: (a, b) => a?.receiptNumber?.localeCompare(b?.receiptNumber),
      ...getColumnSearchPropsPaging(
        "receiptNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      onFilter: (value, record) =>
        record["receiptNumber"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      ellipsis: { showTitle: false },
      render: (text) =>
        searchedColumn === "receiptNumber" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      key: "receiptDate",
      title: "RECEIPT DATE",
      dataIndex: "receiptDate",
      align: "center",
      sorter: (a, b) => a?.receiptDate?.localeCompare(b?.receiptDate),
      ...getColumnSearchPropsPaging(
        "receiptDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      onFilter: (value, record) =>
        record["receiptDate"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      render: (text) =>
        searchedColumn === "receiptDate" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[
              searchText
                ? moment(searchText, "YYYY-MM-DD").format("DD MMM YYYY")
                : "",
            ]}
            autoEscape
            textToHighlight={
              text ? moment(text).format(dateFormatting.dateCapital) : ""
            }
          />
        ) : (
          moment(text).format(dateFormatting.dateCapital) || ""
        ),
    },
    {
      key: "cusinfo",
      title: "CUSTOMER INFORMATION",
      dataIndex: "cusinfo",
      width: 300,
      sorter: (a, b) => a.cusinfo - b.cusinfo,
      ...getColumnSearchPropsPaging(
        "cusinfo",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      onFilter: (value, record) =>
        record["cusinfo"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      render: (dataCus, record) => {
        if (type === 4) {
          return dataCustomer
            ?.filter(
              (item) =>
                item?.value === selectCustomer[record.receiptReconcileId]
            )
            .find((b) => b.label)?.label;
        } else {
          return (
            <div className="w-full">
              <SelectComponent
                value={
                  selectCustomer[`${record.receiptReconcileId}`] || undefined
                }
                onChange={(e) =>
                  handleSelectCustomer(e, `${record.receiptReconcileId}`)
                }
                disabled={type === 4}
              >
                {dataCustomer?.map((item) => (
                  <Option value={item?.value}>{item?.label}</Option>
                ))}
              </SelectComponent>
            </div>
          );
        }
      },
    },
    {
      key: "currency",
      title: "CURRENCY",
      dataIndex: "currency",
      align: "center",
      sorter: (a, b) => a?.currency?.localeCompare(b?.currency),
      ...getColumnSearchPropsPaging(
        "currency",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      onFilter: (value, record) =>
        record["currency"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      ellipsis: { showTitle: false },
      render: (text) =>
        searchedColumn === "currency" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      key: "amount",
      title: "RECEIPT AMOUNT",
      dataIndex: "amount",
      align: "right",
      sorter: (a, b) => a?.amount?.localeCompare(b?.amount),
      ...getColumnSearchPropsPaging(
        "amount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      onFilter: (value, record) =>
        record["amount"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      ellipsis: { showTitle: false },
      render: (text) =>
        searchedColumn === "amount" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      key: "statusApproval",
      title: "STATUS APPROVAL",
      dataIndex: "statusApproval",
      align: "center",
      fixed: "right",
      width: 220,
      sorter: (a, b) => a?.statusApproval?.localeCompare(b?.statusApproval),
      ...getColumnSearchPropsPaging(
        "statusApproval",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      onFilter: (value, record) =>
        record["statusApproval"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      render: (approvalStatus) => {
        let text;
        switch (approvalStatus) {
          case "WAITING APPROVAL":
            text = "Waiting Approval";
            break;
          case "APPROVED":
            text = "Approved";
            break;
          default:
            text = approvalStatus
              ? approvalStatus.charAt(0).toUpperCase() +
                approvalStatus.slice(1).toLowerCase()
              : approvalStatus;
            break;
        }

        if (searchedColumn === "statusApproval") {
          return (
            <Highlighter
              highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ""}
            />
          );
        }

        return text ? (
          <div className="flex justify-center">
            <StatusComponent colour={text}>{text}</StatusComponent>
          </div>
        ) : (
          text
        );
      },
    },
  ];

  return typeModal === "Request"
    ? column
    : column.filter((item) => item?.dataIndex !== "cusinfo");
};

const TableSundryFE = ({
  data = [],
  type = 1,
  totalData = 0,
  rowSelection = {},
  columnsSundry,
  selectCustomer = {},
  setSelectCustomer = () => {},
  typeModal = "Request",
}) => {
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const dispatch = useDispatch();

  const [fixedColumns, setFixedColumns] = useState(() => ({
        left: ["no"],
        right: ["statusApproval"],
      }));
  //   const [selectCustomer, setSelectCustomer] = useState({});

  const { data_customer } = useSelector((state) => state.electronic);

  const dataCustomer = data_customer?.data?.result?.map((item) => {
    return {
      value: item?.accountNumber,
      label: item?.accountName,
    };
  });

  useEffect(() => {
    dispatch(getCustomerInfo({ page, pageSize, search }));
  }, [page, pageSize, search]);

  const handleChangeSize = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };

  const handleSelectCustomer = (e, key) => {
    setSelectCustomer((prevState) => ({
      ...prevState,
      [key]: e,
    }));
  };

  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
  };

  const paginationTable = (typeData = "data") => {
    let result = [...data];
    if (searchedColumn) {
      const fixSearchText = searchText.toLowerCase();
      result = result.filter((item) => {
        if (searchedColumn === "cusinfo") {
          const data = selectCustomer[item?.receiptReconcileId] || 0;
          const cusName = dataCustomer
            ?.filter((a) => a.value === data)
            .find((b) => b.label)?.label;
          return (cusName || "").toLowerCase().includes(fixSearchText);
        } else {
          switch (searchedColumn) {
            case "startDate":
            case "endDate":
            case "receiptDate":
              const date = item[searchedColumn]
                ? moment(item[searchedColumn]).format("DD MMM YYYY")
                : "";
              return date?.toLowerCase().includes(fixSearchText);
            default:
              return item[searchedColumn]
                ?.toLowerCase()
                .includes(fixSearchText);
          }
        }
      });
    }
    if (fieldSort) {
      const handleDataSort = (obj) => {
        return obj[fieldSort]?.toLowerCase();
      };
      result.sort((a, b) => {
        let fa = handleDataSort(a);
        let fb = handleDataSort(b);
        if (fa < fb) {
          return orderSort === "asc" ? -1 : 1;
        }
        if (fa > fb) {
          return orderSort === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    const fix = result.slice((page - 1) * pageSize, page * pageSize);
    return typeData === "data" ? fix : result.length;
  };

  return (
    <TableRBI
      type="FE"
      // dataSource={paginationTable("data")}
      dataSource={data}
      // totalData={paginationTable("length")}
      totalData={totalData}
      current={page}
      pageSize={pageSize}
      tableScrolled={{
        x: 3500,
        y: 525,
      }}
      onChange={handleChangeSize}
      onSizeChanger={handleChangeSize}
      columns={columnSundry(
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        selectCustomer,
        handleSelectCustomer,
        type,
        dataCustomer,
        typeModal
      )}
      onSort={onSort}
      rowSelection={type === 1 ? rowSelection : undefined}
      showExport={false}
      fixedColumns={fixedColumns}
      setFixedColumns={setFixedColumns}
    />
  );
};

export default TableSundryFE;
