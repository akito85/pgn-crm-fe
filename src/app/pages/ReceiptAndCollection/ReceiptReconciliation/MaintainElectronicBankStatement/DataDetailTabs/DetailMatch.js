import { Tooltip } from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import DetailText from "../../../../../../components/DetailText";
import StatusComponent from "../../../../../../components/StatusComponent";
import TableRBI from "../../../../../../components/TableRBI";
import { getTableMatch } from "../../../../../../redux/slices/receipt_collection/electrionicBank";
import { dateFormatting } from "../../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";

const columns = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {}
) => [
  {
    key: "no",
    title: "NO",
    width: 60,
    align: "center",
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    key: "sor",
    title: "SOR",
    dataIndex: "sor",
    align: "",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "sor",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
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
    align: "",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "costCenter",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
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
    sorter: true,
    ...getColumnSearchPropsPaging(
      "customerName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
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
    sorter: true,
    ...getColumnSearchPropsPaging(
      "accountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
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
    key: "receiptCode",
    title: "RECEIPT CODE",
    dataIndex: "receiptCode",
    align: "left",
    sorter: true,
    ...getColumnSearchPropsPaging("receiptCode"),
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
    key: "receiptNumber",
    title: "RECEIPT NUMBER",
    dataIndex: "receiptNumber",
    align: "left",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "receiptNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
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
    sorter: true,
    ...getColumnSearchPropsPaging(
      "receiptDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
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
    key: "amount",
    title: "RECEIPT AMOUNT",
    dataIndex: "amount",
    align: "right",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "amount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
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
    sorter: true,
    fixed: "right",
    ...getColumnSearchPropsPaging(
      "statusApproval",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
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


const DetailMatch = ({
  searchTextMatch,
  // data_match,
  setSearchTextMatch,
  setSearchColumnMatch,
  setSearchedColumnMatch,
  searchedColumnMatch,
  id,
}) => {
  const { data_match } = useSelector((state) => state.electronic);
  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");

  const [fixedColumns, setFixedColumns] = useState(() => ({
      left: ["no"],
      right: [],
    }));

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTextMatch(selectedKeys[0]);
    setSearchedColumnMatch(dataIndex);
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

  useEffect(() => {
    let tempSearch = "";
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const tempSearchText = search[dataIndex];
        if (tempSearchText) {
          tempSearch += `${dataIndex}~${tempSearchText},`;
        }
      }
    }
    tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    dispatch(
      getTableMatch({
        id,
        page,
        pageSize,
        search: encodeURIComponent(JSON.stringify(search)),
        // search: tempSearch,
        sort,
      })
    );
  }, [search, page, pageSize, sort, dispatch, id]);

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
    <div className="w-full gap-5">
      <div className="my-5 grid grid-cols-3 gap-10">
        <DetailText label={"Total Transaction"}>
          {data_match?.page?.totalElements}
        </DetailText>
        <DetailText label={"Total Amount"}>
          {data_match?.totalAmount}
        </DetailText>
      </div>
      <div className="my-5">
        <TableRBI
          dataSource={data_match?.result}
          totalData={data_match?.page?.totalElements}
          columns={columns(
            page,
            pageSize,
            searchInput,
            searchedColumnMatch,
            searchTextMatch,
            handleSearch
          )}
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          onShowSizeChange={handleChange}
          onSort={onSort}
          tableScrolled={{
            x: 3500,
            y: 300,
          }}
          showExport={false}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
        />
      </div>
    </div>
  );
};

export default DetailMatch;
