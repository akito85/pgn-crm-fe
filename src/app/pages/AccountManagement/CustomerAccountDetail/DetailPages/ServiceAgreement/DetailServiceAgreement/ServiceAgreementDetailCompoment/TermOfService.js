import React,{useState, useEffect, useRef} from 'react'
import TablePagination from '../../../../../../../../components/TablePagination'

const expandedRowRender = (record) => {
  const columns = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: 'ATTRIBUTE',
      dataIndex: 'attribute',
    },
    {
      title: 'VALUE',
      align: 'right',
      dataIndex: 'value',
    },
    // {
    //   title: 'UNIT',
    //   dataIndex: 'unit',
    // },
    // {
    //   title: 'FROM ITEM',
    //   dataIndex: 'fromItem',
    // }
  ];
 
  return (
    <div>
      <p className="text-primary text-xs font-bold uppercase">
        TOS DETAIL
      </p>
      <TablePagination
        useSelect={false}
        usePagination={false}
        dataSource={record?.tosDetail}
        columns={columns}
      />
    </div>
  )
};

const TermOfService = ({data}) => {
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElement, setTotalElement] = useState(0);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [dataTable, setDataTable] = useState([]);

  // mapping for push key data
  useEffect(() => {
    if (data?.saTOS && data?.saTOS?.length > 0) {
      const dataTos = data?.saTOS?.map((a, index) => ({
        ...a,
        key: index + 1,
        tosDetail: a.tosDetail?.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setDataTable(dataTos)
    }
  }, [data?.saTOS]);

  useEffect(() => {
    setTotalElement(dataTable?.length);
  }, [dataTable])
  
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
    let result = [...dataTable];
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
        title: 'TERM OF SERVICE',
        dataIndex: 'tosName',
      },
      {
        title: 'DESCRIPTION',
        dataIndex: 'description',
      },
    ];
    return result
  }

  return (
    <div className='w-full py-6'>
      <TablePagination
        pageSize={pageSize}
        current={page}
        dataSource={filterDataByPage()}
        tableScrolled={{y: 525, x: 900 }}
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
        expandable={{expandedRowRender}}
      />
    </div>
  )
}

export default TermOfService