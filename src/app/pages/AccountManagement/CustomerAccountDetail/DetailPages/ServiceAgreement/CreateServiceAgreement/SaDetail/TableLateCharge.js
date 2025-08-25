import React,{useState, useEffect, useRef} from 'react'
import TablePagination from '../../../../../../../../components/TablePagination'

const TableLateCharge = ({
  dataTableLateCharge,
  setDataTableLateCharge
}) => {
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElement, setTotalElement] = useState(0);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setTotalElement(dataTableLateCharge?.length)
  }, [])
  
  
  // const columns =[
  //   {
  //     title: "NO",
  //     align: "center",
  //     width: "5%",
  //     render: (text, object, index) => (page - 1) * pageSize + index + 1,
  //   },
  //   {
  //     sorter: true,
  //     title: "LATE CHARGE NAME",
  //     dataIndex: "lateChargeName",
  //     // ...getColumnSearchProps("accountNumber"),
  //   },
  //   {
  //     sorter: true,
  //     title: "CURRENCY",
  //     dataIndex: "currency",
  //     // ...getColumnSearchProps("accountNumber"),
  //   },
  //   {
  //     sorter: true,
  //     title: "LATE CHARGE MAXIMUM AMOUNT",
  //     align: "right",
  //     dataIndex: "maxAmount",
  //     width: "300px",
  //     // ...getColumnSearchProps("segment"),
  //   },
  //   {
  //     sorter: true,
  //     title: "LATE CHARGE RULE FORMULA",
  //     dataIndex: "formula",
  //     width: "400px",
  //     // ...getColumnSearchProps("segment"),
  //   },
  //   {
  //     sorter: true,
  //     title: "DESCRIPTION",
  //     dataIndex: "description",
  //     // ...getColumnSearchProps("segment"),
  //   },
  // ]

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
    const result =[
      {
        title: "NO",
        align: "center",
        width: "5%",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        sorter: true,
        title: "LATE CHARGE NAME",
        dataIndex: "lateChargeName",
        // ...getColumnSearchProps("accountNumber"),
      },
      {
        sorter: true,
        title: "CURRENCY",
        dataIndex: "currency",
        // ...getColumnSearchProps("accountNumber"),
      },
      {
        sorter: true,
        title: "LATE CHARGE MAXIMUM AMOUNT",
        align: "right",
        dataIndex: "maxAmount",
        width: "300px",
        // ...getColumnSearchProps("segment"),
      },
      {
        sorter: true,
        title: "LATE CHARGE RULE FORMULA",
        dataIndex: "formula",
        width: "400px",
        // ...getColumnSearchProps("segment"),
      },
      {
        sorter: true,
        title: "DESCRIPTION",
        dataIndex: "description",
        // ...getColumnSearchProps("segment"),
      },
    ]
    return result
  }

  return (
    <div>
      <TablePagination 
        pageSize={pageSize}
        current={page}
        dataSource={filterDataByPage()}
        tableScrolled={{y: 525, x: 1500 }}
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
  )
}

export default TableLateCharge