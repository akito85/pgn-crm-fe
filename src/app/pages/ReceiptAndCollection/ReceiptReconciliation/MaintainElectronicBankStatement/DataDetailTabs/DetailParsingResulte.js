import { FilterOutlined } from "@ant-design/icons";
import { DatePicker, Input, Tooltip } from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import StatusComponent from "../../../../../../components/StatusComponent";
import { dateFormatting } from "../../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";
import TableRBI from "../../../../../../components/TableRBI";
import { getTableParsing } from "../../../../../../redux/slices/receipt_collection/electrionicBank";

const DetailParsingResulte = (props) => {

  const { id } = props;

  const {
    data_parsing,
  } = useSelector((state) => state.electronic);

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

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["statusApproval"],
  }));

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

    dispatch(getTableParsing({ id, page, pageSize, sort, search: tempSearch }));
  }, [search, page, pageSize, sort, dispatch]);

  // filter
  const getColumnSearchProps = (dataIndex, type) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      const onDataChange = (value, dateString) => {
        setSelectedKeys(dateString ? [dateString] : []);
        handleSearch(dateString ? [dateString] : [], confirm, dataIndex);
      };
      return (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {type === "date" ? (
            <DatePicker onChange={onDataChange} />
          ) : (
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
          )}
        </div>
      );
    },
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
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
          searchWords={
            type === "date"
              ? moment([searchText]).format(dateFormatting.date)
              : [searchText]
          }
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = (
    page = 1,
    pageSize = 10,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch = () => { }
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
        ellipsis: { showTitle: false },
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
        align: "",
        sorter: true,
        ellipsis: { showTitle: false },
        ...getColumnSearchPropsPaging(
          "customerName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
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
        align: "right",
        sorter: true,
        ellipsis: { showTitle: false },
        ...getColumnSearchPropsPaging(
          "accountNumber",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
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
        align: "right",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "receiptCode",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
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
        align: "right",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "receiptNumber",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
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
        key: "currency",
        title: "CURRENCY",
        dataIndex: "currency",
        align: "right",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "currency",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
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
        render: (text) =>
          searchedColumn === "statusApproval" ? (
            <Highlighter
              highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ""}
            />
          ) : text ? (
            <div className="flex justify-center">
              <StatusComponent colour={text}>{text}</StatusComponent>
            </div>
          ) : (
            ""
          ),
      },
    ];


  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
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

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  return (
    <div className="my-5">
      <div className="w-full flex justify-end my-5">
        {/* <ButtonComponent
          //   icon={<SVGIcon name="IconButtonDownload" width={24} />}
          type="submit"
          // onClick={handleDownload}
        >
          Request
        </ButtonComponent> */}
      </div>
      <TableRBI
        dataSource={data_parsing?.result}
        totalData={data_parsing?.page?.totalElements || 0}
        columns={columns(
          page,
          pageSize,
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        )}
        current={page}
        pageSize={pageSize}
        onChange={handleChange}
        // onShowSizeChange={handleChange}
        onSizeChanger={handleChange}
        onSort={onSort}
        tableScrolled={{
          x: "max-content",
          y: 300,
        }}
        showExport={false}
        fixedColumns={fixedColumns}
        setFixedColumns={setFixedColumns}
      />
    </div>
  );
};

export default DetailParsingResulte;
