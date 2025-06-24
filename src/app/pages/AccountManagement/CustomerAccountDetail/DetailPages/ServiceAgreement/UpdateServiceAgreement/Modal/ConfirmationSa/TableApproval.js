import React, {useState, useEffect, useRef} from 'react'
import TablePagination from "../../../../../../../../../components/TablePagination";

const expandedRowRender = (record) => {
  const dataExpand = record?.employeeDetail

  const columns = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: 'EMPLOYEE',
      dataIndex: 'employeeName',
    }
  ];
  return (
    <div>
      <TablePagination
        useSelect={false}
        usePagination={false}
        dataSource={dataExpand}
        columns={columns}
      />
    </div>
  )
};

const TableApproval = ({data}) => {
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [dataTable, setDataTable] = useState([])

  useEffect(() => {
    if (data && data?.length > 0) {
      const dataModif = data?.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a.employeeDetail?.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setDataTable(dataModif);
    }
  }, [data]);
  

  const columns = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: 'HIERARCHY',
      dataIndex: 'approvalLevel',
    },
    {
      title: 'POSITION',
      dataIndex: 'position',
    }
  ];
  return (
    <div>
      <TablePagination 
        dataSource={
          dataTable && dataTable?.length === 0 ? null : dataTable
        }
        columns={columns}
        pageSize={pageSize}
        current={page}
        expandable={{expandedRowRender}}
        totalData={dataTable?.length}
        // onChange={handleChange}
        // onSizeChanger={handleChangeSize}
        // onSort={onSort}
      />
    </div>
  )
}

export default TableApproval