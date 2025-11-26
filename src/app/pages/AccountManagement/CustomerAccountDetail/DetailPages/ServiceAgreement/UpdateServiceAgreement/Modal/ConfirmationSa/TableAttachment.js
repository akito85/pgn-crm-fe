import React, {useState, useEffect} from 'react'
import { bytesConverter } from "../../../../../../../.././../utils/bytesConverter";
import TablePagination from '../../../../../../../../../components/TablePagination';

const TableAttachment = ({data, saRecordData}) => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [columnFilter, setColumnFilter] = useState([])

  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      width: 150,
      sorter: true,
      // ...getColumnSearchProps("name"),
    },
    {
      title: "FILE NAME",
      dataIndex: "fileName",
      width: 150,
      sorter: true,
      align: 'right'
      // ...getColumnSearchProps("value"),
    },
    {
      title: "UPLOAD BY",
      dataIndex: "createdBy",
      width: 150,
      sorter: true,
      // ...getColumnSearchProps("unit"),
    },
    {
      title: "UPLOADED DATE",
      dataIndex: "createdDate",
      width: 150,
      sorter: true,
      // ...getColumnSearchProps("unit"),
    },
    {
      title: "FILE SIZE",
      dataIndex: "fileSize",
      width: 150,
      sorter: true,
      // ...getColumnSearchProps("unit"),
      render: (fileSize, r, i) => (
        <span>{typeof fileSize == 'string' ? fileSize : bytesConverter(fileSize)}</span>
      ),
    },
  ];
  
  useEffect(() => {
    if(saRecordData.status == "DRAFT"){
      const columnFilter = columns.filter(item => item.title !== "UPLOAD BY" && item.title !== "UPLOADED DATE")
      setColumnFilter(columnFilter)
    }else{
      setColumnFilter(columns)
    }
  }, [])
  
  return (
    <div className={"w-full"}>
      <TablePagination
        pageSize={pageSize}
        current={page}
        dataSource={data}
        tableScrolled={{y: 525, x: 1300 }}
        columns={columnFilter}
        totalData={data?.length}
      />
    </div>
  )
}
export default TableAttachment