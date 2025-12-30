import { Table } from "antd";

const TableExpand = ({ dataMain, dataExpand, columnMain, columnExpand }) => {
  const expandedRowRender = () => {
    const columns = columnExpand;
    return (
      <Table columns={columns} dataSource={dataExpand} pagination={false} />
    );
  };
  const columns = columnMain;
  return (
    <>
      <Table
        columns={columns}
        expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: ["0"],
        }}
        dataSource={dataMain}
        pagination={false}
      />
    </>
  );
};
export default TableExpand;
