import React, {useState, useEffect, useRef} from 'react'
import TablePagination from '../../../../../../../../../../components/TablePagination'
import { Tooltip } from 'antd';

const TableLateCharge = ({
  dataTableLateCharge
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
        align: "center",
        width: 60,
        render: (text, object, index) => index + 1,
      },
      {
        title: 'LATE CHARGE NAME',
        dataIndex: 'lateChargeName',
        sorter: true,
        // render: (name)=>{
        //   return (
        //     <span>{name.label}</span>
        //   )
        // }
      },
      {
        title: 'CURRENCY',
        dataIndex: 'currency',
        sorter: true,
      },
      {
        title: 'LATE CHARGE MAXIMUM AMOUNT',
        dataIndex: 'maxAmount',
        align: "right",
        sorter: true,
      },
      {
        title: 'LATE CHARGE RULE FORMULA',
        dataIndex: 'formula',
        sorter: true,
      },
      {
        title: 'DESCRIPTION',
        dataIndex: 'description',
        sorter: true,
        ellipsis: {
          showTitle: false
        },
        render: (description) => (
          <Tooltip placement="topLeft" title={description}>
            {description}
          </Tooltip>
        ),
      },
    ];
    return result;
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