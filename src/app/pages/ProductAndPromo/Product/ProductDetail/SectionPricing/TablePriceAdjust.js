import React, { useEffect, useRef, useState } from "react";
import TablePagination from "../../../../../../components/TablePagination";
import SVGIcon from "../../../../../../assets/Icon/index";
import Highlighter from "react-highlight-words";
import { FilterOutlined } from "@ant-design/icons";
import { Input } from "antd";
import StatusComponent from "../../../../../../components/StatusComponent";

const getColumnSearchProps = (
  dataIndex,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  excludeRender = false,
) => {
  let obj = {
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
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
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
        setTimeout(() => searchInput.current?.select(), 100);
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
        text || "-"
      ),
  };
  if (excludeRender) {
    delete obj.render;
  }
  return obj;
};
const columns = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleDetail = () => {},
) => {
  const result = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "PRICE CODE",
      width: 160,
      dataIndex: "priceCode",
      ...getColumnSearchProps(
        "priceCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "PRICE DETAIL VALUE",
      width: 160,
      dataIndex: "priceDetail",
      ...getColumnSearchProps(
        "priceDetail",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "ADJUSTMENT NAME",
      width: 160,
      dataIndex: "adjustmentName",
      ...getColumnSearchProps(
        "adjustmentName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "CRITERIA",
      width: 160,
      dataIndex: "criteria",
      render: (index) => {
        const data = index || [];
        if (data.length > 0) {
          return (
            <div className="flex align-middle">
              {data.map((item) => (
                <p
                  className={
                    "text-white bg-blue-500 my-0 py-1 px-2 rounded-2xl text-center w-auto"
                  }
                >
                  {item.criteria}
                </p>
              ))}
            </div>
          );
        }
        return "";
      },
    },
    {
      title: "STATUS",
      width: 132,
      sorter: true,
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps(
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (index) => {
        let text;
        switch (index) {
          case "WAITING_FOR_APPROVAL":
            text = "Waiting Approval";
            break;
          default:
            text = index
              ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
              : index;
            break;
        }
        if (searchedColumn === "status") {
          return (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ""}
            />
          );
        } else {
          return (
            <div className={" flex justify-center"}>
              <StatusComponent colour={text}>{text}</StatusComponent>
            </div>
          );
        }
      },
    },
    {
      title: "DESCRIPTION",
      width: 180,
      dataIndex: "description",
      ...getColumnSearchProps(
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "ACTION",
      align: "center",
      width: 120,
      fixed: "right",
      render: (r) => (
        <div className="flex justify-center">
          <SVGIcon
            name="IconDetail"
            width={24}
            oncClick={() => handleDetail(r)}
          />
        </div>
      ),
    },
  ];

  return result;
};
const TablePriceAdjust = ({
  data = [],
  handleDetail = () => {},
  selectedPriceDetail,
}) => {
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  console.log(selectedPriceDetail);

  useEffect(() => {
    setTotalElement(data.length);
  }, [data]);
  const filterDataByPage = () => {
    return data.slice((page - 1) * pageSize, page * pageSize);
  };
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleChangeSize = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="text-primary font-semibold uppercase">
        {"PRICE ADJUSTMENT"}
      </div>
      <TablePagination
        dataSource={filterDataByPage()}
        totalData={totalElements}
        current={page}
        pageSize={pageSize}
        tableScrolled={{ y: 525, x: 2300 }}
        onChange={handleChangeSize}
        columns={columns(
          page,
          pageSize,
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          handleDetail,
        )}
      />
    </div>
  );
};

export default TablePriceAdjust;
