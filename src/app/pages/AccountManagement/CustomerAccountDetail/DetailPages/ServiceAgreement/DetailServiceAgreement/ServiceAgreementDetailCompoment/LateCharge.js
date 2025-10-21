import React, { useState, useEffect, useRef } from "react";
import GridLayout from "../../../../../../../../components/GridLayout";
import DetailText from "../../../../../../../../components/DetailText";
import TablePagination from "../../../../../../../../components/TablePagination";

const LateCharge = ({ data }) => {
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElement, setTotalElement] = useState(0);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [dataTableLateCharge, setDataTableLateCharge] = useState([]);

  useEffect(() => {
    if (data?.saLateCharge || data?.saLateCharge !== null) {
      const dataArrayLateCharge = Object.keys(data?.saLateCharge).map(
        (key) => data?.saLateCharge[key],
      );
      let filteredDataLateCharge = dataArrayLateCharge.filter(
        (item) => item !== null,
      );
      filteredDataLateCharge.map((item) => {
        return {
          ...item,
          maxAmount: item.maxAmount !== null ? item.maxAmount : "",
        };
      });

      setDataTableLateCharge(filteredDataLateCharge);
    } else {
      setDataTableLateCharge([]);
    }
  }, []);

  useEffect(() => {
    setTotalElement(dataTableLateCharge?.length);
  }, [dataTableLateCharge]);

  const handleChangeSize = (pageChange, pageSizeChange) => {
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

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };

  const filterDataByPage = () => {
    let result = [...dataTableLateCharge];
    if (searchedColumn) {
      const fixSearchText = searchText.toLowerCase();
      result = result.filter((item) => {
        return item[searchedColumn]?.toLowerCase().includes(fixSearchText);
      });
    }
    const handleDataSort = (obj) => {
      return obj[fieldSort];
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
    }
    return result.slice((page - 1) * pageSize, page * pageSize);
  };

  const columns = ({
    page = 1,
    pageSize = 10,
    searchInput,
    searchedColumn = "",
    searchText = "",
    handleSearch = () => {},
  }) => {
    const result = [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "LATE CHARGE NAME",
        dataIndex: "lateChargeName",
        width: 150,
        sorter: true,
        // ...getColumnSearchProps("name"),
      },
      {
        title: "CURRENCY",
        dataIndex: "currency",
        width: 150,
        sorter: true,
        // ...getColumnSearchProps("value"),
      },
      {
        title: "LATE CHARGE MAXIMUM AMOUNT",
        dataIndex: "maxAmount",
        width: 150,
        sorter: true,
        align: "right",
        // ...getColumnSearchProps("unit"),
      },
      {
        title: "LATE CHARGE RULE FORMULA",
        dataIndex: "formula",
        width: 150,
        sorter: true,
        // ...getColumnSearchProps("unit"),
      },
    ];
    return result;
  };

  return (
    <div>
      <div className={"w-full py-6"}>
        <TablePagination
          pageSize={pageSize}
          current={page}
          dataSource={filterDataByPage()}
          tableScrolled={{ y: 525, x: 1500 }}
          totalData={totalElement}
          onChange={handleChangeSize}
          onSort={onSort}
          columns={columns({
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
          })}
        />
      </div>
    </div>
  );
};

export default LateCharge;
