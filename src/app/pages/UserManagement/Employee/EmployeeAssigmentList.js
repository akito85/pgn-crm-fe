import { Checkbox } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import StatusComponent from "../../../../components/StatusComponent";
import DynamicTableInline from "../../../../components/Table/DynamicTableInline";

const EmployeeAssigmentList = ({
  dataAss,
  dataJob,
  dataPosition,
  onChangeData = () => {},
}) => {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch;
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);

  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const column = [
    {
      title: "NO",
      width: 60,
      align: "center",
      editable: true,
      dataIndex: "no",
      render: (text, object, index) => index + 1,
    },
    {
      title: "JOB",
      dataIndex: "jobId",
      key: "jobId",
      align: "left",
      inputType: "select",
      options: dataJob,
      editable: true,
      render: (job) => (
        <span>
          <span>
            {
              dataJob?.filter((a) => a?.value === job).find((b) => b?.label)
                ?.label
            }
          </span>
        </span>
      ),
    },
    {
      title: "POSITION",
      dataIndex: "positionId",
      key: "positionId",
      align: "left",
      inputType: "select",
      options: dataPosition,
      editable: true,
      render: (position) => (
        <span>
          <span>
            {
              dataPosition
                ?.filter((a) => a?.value === position)
                .find((b) => b.label)?.label
            }
          </span>
        </span>
      ),
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      align: "left",
      editable: true,
      sorter: true,
      inputType: "date",
      // ...getColumnSearchProps('startDate', 'date'),
      render: (endDate) => moment(endDate).format("YYYY-MM-DD"),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      align: "left",
      editable: true,
      sorter: true,
      inputType: "date",
      // ...getColumnSearchProps('endDate', 'date'),
      render: (endDate) => moment(endDate).format("YYYY-MM-DD"),
    },
    {
      title: "isMain",
      dataIndex: "isMain",
      editable: true,
      align: "center",
      inputType: "checkbox",
      render: (isMain) => <Checkbox checked={isMain === "Y"} />,
    },
    {
      title: "EMPLOYEE NUMBER",
      dataIndex: "empNumber",
      key: "empNumber",
      align: "left",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text) => (
        <div className={" flex justify-center"}>
          <StatusComponent colour={text}>{text}</StatusComponent>
        </div>
      ),
    },
  ];

  const handleChangePage = (page, pageSize) => {
    setPage(page);
    setPage(pageSize);
  };

  return (
    <div className={"w-full"}>
      <DynamicTableInline
        // header={"UPLOAD EMPLOYEE ASSIGNMENT LIST"}
        tableData={dataAss}
        totalData={dataAss?.length}
        cols={column}
        mode={"update"}
        onDataChange={onChangeData}
        showCreateButton={false}
        scrollTable={{ y: 525, x: 2300 }}
        actionButton={["update", "delete"]}
        usePagination={true}
        pageSize={pageSize}
        current={page}
        onChangePage={handleChangePage}
        onSizeChanger={handleChangePage}
        useSelect={true}
        useContainer={false}
      />
    </div>
  );
};
export default EmployeeAssigmentList;
