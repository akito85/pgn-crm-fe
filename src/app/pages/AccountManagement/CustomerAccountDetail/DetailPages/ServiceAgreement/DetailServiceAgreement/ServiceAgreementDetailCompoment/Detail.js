import React,{ useState } from 'react'
import TablePagination from '../../../../../../../../components/TablePagination';

const Detail = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const dataSource = [];
  for (let i = 0; i < 10; ++i) {
    dataSource.push({
      key: i.toString(),
      name: "minimum Usage",
      value: 200,
      unit: "M3",
    });
  }

  const columns = [
    {
      title: "NO",
      width: 25,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "NAME",
      dataIndex: "name",
      width: 150,
      sorter: true,
      // ...getColumnSearchProps("name"),
    },
    {
      title: "VALUE",
      dataIndex: "value",
      width: 150,
      sorter: true,
      align: 'right'
      // ...getColumnSearchProps("value"),
    },
    {
      title: "UNIT",
      dataIndex: "unit",
      width: 150,
      sorter: true,
      // ...getColumnSearchProps("unit"),
    }
  ];
  return (
    <div>
      <div className={"w-full py-6"}>
        <TablePagination
          pageSize={pageSize}
          current={page}
          dataSource={dataSource}
          tableScrolled={{y: 525, x: 1500 }}
          columns={columns}
        />
      </div>
    </div>
  )
}

export default Detail