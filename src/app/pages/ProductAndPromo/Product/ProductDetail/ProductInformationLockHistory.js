import React, { useEffect, useRef, useState } from "react";
import { Tooltip } from "antd";
import Highlighter from "react-highlight-words";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import moment from "moment";
import { dateFormatting } from "../../../../../utils";
import TablePaginationNew from "../../../../../components/TablePaginationNew";
import NxTable from "../../../../../components/Nx/NxTable";
import { useSelector } from "react-redux";

const onFilter = (dataIndex, value, record) => {
  const search = value.toLowerCase();
  return record[dataIndex]?.toLowerCase().includes(search);
};

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    return obj[fieldSort]?.toString().toLowerCase();
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);
  return fa.localeCompare(fb);
};
const columns = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch
) => {
  const result = [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "ACTION BY",
      key: "actionBy",
      width: 200,
      align: "left",
      dataIndex: "lockBy",
      onFilter: (value, record) => onFilter("lockBy", value, record),
      sorter: (a, b) => sorter("lockBy", a, b),
      ...getColumnSearchPropsPaging(
        "lockBy",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "ACTION DATE",
      key: "actionDate",
      width: 200,
      align: "center",
      dataIndex: "actionDate",
      onFilter: (value, record) => onFilter("actionDate", value, record),
      sorter: (a, b) => sorter("actionDate", a, b),
      ...getColumnSearchPropsPaging(
        "actionDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "REMARK",
      key: "remark",
      width: 240,
      dataIndex: "description",
      onFilter: (value, record) => onFilter("description", value, record),
      sorter: (a, b) => sorter("description", a, b),
      ...getColumnSearchPropsPaging(
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => {
        if (searchedColumn === "description") {
          return (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          );
        } else {
          if (text) {
            return (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            );
          }
          return "";
        }
      },
    },
    {
      title: "ACTION",
      key: "action",
      width: 200,
      align: "left",
      dataIndex: "lockType",
      onFilter: (value, record) => onFilter("lockType", value, record),
      sorter: (a, b) => sorter("lockType", a, b),
      ...getColumnSearchPropsPaging(
        "lockType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
  ];

  return result;
};
const ProductInformationLockHistory = ({ data = [] }) => {
  const searchInput = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  const { data: dataUser = {} } = useSelector((state) => state.profile);
  
  useEffect(() => {
    let result = data.map((item) => ({
      ...item,
      lockType: item.lockType === "LOCKED" ? "Lock" : "Unlock",
      actionDate: moment(item.createdDate).format(dateFormatting.dateTime),
    }));
    setDataTable(result);
    setTotalElement(result.length);
  }, [data]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };
  const handleChangeSize = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };
  return (
    <div className="flex flex-col w-full mt-4">
      <NxTable
        idTable={"product-information-lock-history"}
        userId={dataUser?.data?.username}
        showAdvanceSearch={false}
        showSearchBar={false}
        usePagination={false}
        type="FE"
        dataSource={dataTable}
        totalData={totalElements}
        current={page}
        pageSize={pageSize}
        tableScrolled={{ y: 300, x: 1500 }}
        onChange={handleChangeSize}
        columns={columns(
          page,
          pageSize,
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        )}
      />
    </div>
  );
};

export default ProductInformationLockHistory;
