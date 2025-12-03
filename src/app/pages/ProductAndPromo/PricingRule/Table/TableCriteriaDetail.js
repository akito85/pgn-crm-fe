import React, { useEffect, useState, useRef } from "react";
import { Pagination, Select, Table } from "antd";
import { columnsTableCriteria } from "./TableCriteria";

const TableCriteriaDetail = ({
  type,
  dataCriteria = [],
  listCriteria = [],
}) => {
  // Declaration
  const dataSource = listCriteria;
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");

  // Use Effect
  useEffect(() => {
    if (dataSource.length > 0) {
      setTotalElement(dataSource.length);
    }
  }, [dataSource]);

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
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

  const filterDataByPage = () => {
    let result = [...dataSource];
    if (searchedColumn) {
      result = result.filter((item) => {
        return item[searchedColumn]?.label
          .toLowerCase()
          .includes(searchText.toLowerCase());
      });
      console.log(result, "1");
    }
    const handleDataSort = (obj) => {
      return obj[fieldSort].label.toString().toLowerCase();
    };
    if (fieldSort) {
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
      console.log(result, "2");
    }
    return result.slice((page - 1) * pageSize, page * pageSize);
  };

  const columns = () => {
    const temp = [
      {
        title: "NO",
        width: 50,
        dataIndex: "no",
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      ...columnsTableCriteria(
        {},
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    ];
    const filterCol =
      type !== "detail" ? temp : temp.filter((col) => col.title !== "ACTION");
    return filterCol.filter((col) =>
      col.title !== "NO" && col.title !== "ACTION"
        ? dataCriteria.includes(col.indexValue)
        : true,
    );
  };
  const [optionSelectedCol, setOptionSelectedCol] = useState([]);

  const handleDisplayColumn = (value) => {
    setOptionSelectedCol(value);
  };

  const filterColumn = (dataColumn) => {
    return dataColumn.filter((col) => {
      return !optionSelectedCol.includes(col.title);
    });
  };

  return dataCriteria && dataCriteria.length > 0 && dataCriteria[0] !== 24 ? (
    <div className="flex flex-col w-full">
      <div className={"w-full flex mb-5 gap-2 justify-between"}>
        <Select
          mode="multiple"
          placeholder="Show All Column"
          className={"w-2/6"}
          maxTagCount={3}
          onChange={handleDisplayColumn}
        >
          {columns()
            .map((col) => (
              <Select.Option
                key={col.title}
                value={col.title}
                disabled={
                  optionSelectedCol.length > 3
                    ? optionSelectedCol.includes(col.title)
                      ? false
                      : true
                    : false
                }
              >
                {col.title}
              </Select.Option>
            ))
            .splice(1)}
        </Select>

        <Pagination
          total={totalElements}
          className={"pr-1"}
          showSizeChanger
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          onShowSizeChange={handleChange}
          showTotal={(total, range) =>
            `Showing ${range[0]} to ${range[1]} of ${total} records`
          }
        />
      </div>
      <Table
        bordered
        dataSource={filterDataByPage()}
        columns={filterColumn(
          columns().map((col) => ({
            ...col,
            onCell: (record) => ({
              record,
              inputType: col.inputType,
              dataIndex: col.dataIndex,
              title: col.title,
              indexValue: col.indexValue,
              dependDataIndex: col.dependDataIndex,
            }),
          })),
        )}
        scroll={{
          x: 1500,
          y: 300,
        }}
        tableLayout="auto"
        pagination={false}
        onChange={onSort}
      />
    </div>
  ) : null;
};

export default TableCriteriaDetail;
