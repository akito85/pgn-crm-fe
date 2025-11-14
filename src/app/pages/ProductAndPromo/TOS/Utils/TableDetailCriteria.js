import React, { useEffect, useState, useRef } from "react";
import { columnsTableCriteriaTOS } from "./TableCriteriaTos";
import { Select, Table } from "antd";

const TableDetailCriteria = ({
  type,
  dataCriteria = [],
  listCriteria = [],
}) => {
  // Declaration
  const searchInput = useRef(null);
  const dataSource = listCriteria;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [totalData, setTotalData] = useState(0);
  useEffect(() => {
    setTotalData(dataSource.length);
  }, [dataSource]);

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const onFilter = (dataIndex, value, record) =>
    record[dataIndex]?.label.toLowerCase().includes(value.toLowerCase());
  const sorter = (fieldSort, a, b) => {
    const handleDataSort = (obj) => {
      return obj[fieldSort].label.toString().toLowerCase();
    };
    let fa = handleDataSort(a);
    let fb = handleDataSort(b);
    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  };

  const columns = () => {
    const temp = [
      {
        title: "NO",
        width: 80,
        dataIndex: "no",
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      ...columnsTableCriteriaTOS(
        {},
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    ];
    const filterCol =
      type !== "detail" ? temp : temp.filter((col) => col.title !== "ACTION");
    return filterCol.filter((col) =>
      col.title !== "NO" && col.title !== "ACTION"
        ? dataCriteria.includes(col.indexValue)
        : true
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

  const numColumns = 15;
  const numRows = columns()?.length;

  const maxWidth = 10000;
  const maxHeight = 300;

  const x = numColumns * 10;
  const y = numRows * 150;

  const validatedX = Math.min(x, maxWidth);
  const validatedY = Math.min(y, maxHeight);

  const scroll = {
    x: validatedX,
    y: validatedY,
  };

  const onChange = (_, __, ___, extra) => {
    setTotalData(extra?.currentDataSource?.length);
  };

  return dataCriteria && dataCriteria.length > 0 && dataCriteria[0] !== 24 ? (
    <div className="relative flex flex-col w-full">
      <div
        className={`${
          totalData !== 0 ? "z-[1] absolute mt-4" : "my-4"
        } w-1/4 flex`}
      >
        <Select
          mode="multiple"
          placeholder="Show All Column"
          className={"w-full"}
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
      </div>
      <Table
        bordered
        className="w-full"
        dataSource={dataSource}
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
          }))
        )}
        pagination={{
          position: ["topRight"],
          current: page,
          pageSize: pageSize,
          onChange: handleChange,
          className: "pr-1 w-3/4",
          style: { marginLeft: "auto", marginRight: 0 },
          showSizeChanger: true,
          showTotal: (total, range) =>
            `Showing ${range[0]} to ${range[1]} of ${total} records`,
        }}
        scroll={scroll}
        onChange={onChange}
      />
    </div>
  ) : null;
};

export default TableDetailCriteria;
