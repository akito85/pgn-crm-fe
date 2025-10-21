import React, { useState, useEffect, useRef } from "react";
import TablePagination from "../../../../../../../../../../components/TablePagination";

const expandedRowRender = (record) => {
  const dataExpand = record?.tosDetail;

  const columns = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: "ATTRIBUTE",
      dataIndex: "attributeName",
    },
    {
      title: "VALUE",
      dataIndex: "value",
    },
  ];
  return (
    <div>
      <p className="text-primary text-xs font-bold uppercase">TOS DETAIL</p>
      <TablePagination
        useSelect={false}
        usePagination={false}
        dataSource={dataExpand}
        columns={columns}
      />
    </div>
  );
};

const TableTos = ({ dataTermOfService }) => {
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElement, setTotalElement] = useState(0);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [dataTermOfServices, setDataTermOfServices] = useState([]);

  useEffect(() => {
    if (dataTermOfService?.length > 0) {
      const dataModif = dataTermOfService.map((a, index) => ({
        ...a,
        key: index + 1,
        tosDetail: a.tosDetail?.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setDataTermOfServices(dataModif);
    } else {
      setDataTermOfServices([]);
    }
  }, [dataTermOfService]);

  useEffect(() => {
    setTotalElement(dataTermOfService?.length);
  }, []);

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
    let result = [...dataTermOfServices];
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
        title: "TERMS OF SERVICE NAME",
        dataIndex: "tosName",
        sorter: true,
      },
      {
        title: "DESCRIPTION",
        dataIndex: "description",
        sorter: true,
      },
    ];
    return result;
  };
  return (
    <div>
      <TablePagination
        pageSize={pageSize}
        current={page}
        dataSource={filterDataByPage()}
        tableScrolled={{ y: 525 }}
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
        expandable={{ expandedRowRender }}
      />
    </div>
  );
};

export default TableTos;
