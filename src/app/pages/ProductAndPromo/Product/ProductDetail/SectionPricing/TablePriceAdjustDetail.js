import React, { useEffect, useRef, useState } from "react";
import TablePagination from "../../../../../../components/TablePagination";
import { getColumnSearchProps } from "../../../../../../utils/getColumnSearchProps";
import Highlighter from "react-highlight-words";
import moment from "moment";
import { columnsTableCriteria } from "../../../Pricing/columnTableCriteria";

const columns = ({
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
}) => {
  const result = [
    {
      title: "NO",
      width: 50,
      dataIndex: "no",
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "CRITERIA",
      children: [
        ...columnsTableCriteria(
          {},
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      ],
    },
    {
      title: "ADJUSTMENT TYPE",
      width: 160,
      dataIndex: "adjustmentType",
      inputType: "select",
      options: [],
      ...getColumnSearchProps(
        "adjustmentType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "ADJUSTMENT VALUE",
      width: 160,
      dataIndex: "adjustmentValue",
      inputType: "number",
      ...getColumnSearchProps(
        "adjustmentValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "START DATE",
      width: 160,
      align: "center",
      dataIndex: "startDate",
      inputType: "date",
      ...getColumnSearchProps(
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (index) => {
        const text = index ? moment(index).format("DD MMM YYYY") : "";
        if (searchedColumn === "startDate") {
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
          return text;
        }
      },
    },
    {
      title: "END DATE",
      width: 160,
      align: "center",
      dataIndex: "endDate",
      inputType: "date",
      ...getColumnSearchProps(
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (index) => {
        const text = index ? moment(index).format("DD MMM YYYY") : "";
        if (searchedColumn === "startDate") {
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
          return text;
        }
      },
    },
    {
      title: "DESCRIPTIONS",
      width: 180,
      dataIndex: "description",
      inputType: "textarea",
      ...getColumnSearchProps(
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
  ];
};

const TablePriceAdjustDetail = ({ data = [], dataObj = {} }) => {
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
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
        {"PRICE ADJUSTMENT DETAIL"}
      </div>
      <div className="flex align-middle gap-2">
        <p className="text-[15px] font-semibold text-text-color-semibold">
          Name:
        </p>
        <p className="text-[15px] font-semibold text-primary">
          {dataObj.adjustmentName || "-"}
        </p>
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
        )}
      />
    </div>
  );
};

export default TablePriceAdjustDetail;
