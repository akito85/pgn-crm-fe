import { UnorderedListOutlined } from "@ant-design/icons";
import create from "@ant-design/icons/lib/components/IconFont";
import { Col } from "antd";

const promoCriteriaRepository = {
  getColumns: (handleClickDetail) => [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      width: 60,
      disableFilter: true,
    },
    {
      title: "Adjustment Type",
      dataIndex: "adjustmentType",
      key: "adjustmentType",
    },
    {
      title: "Adjustment Value",
      dataIndex: "adjustmentValue",
      key: "adjustmentValue",
    },
    {
      title: "UOM",
      dataIndex: "uom",
      key: "uom",
    },
    {
      title: "Max Value UOM",
      dataIndex: "maxValueUom",
      key: "maxValueUom",
    },
    {
      title: "From Item",
      dataIndex: "fromItem",
      key: "fromItem",
    },
    {
      title: "Tiering",
      dataIndex: "tiering",
      key: "tiering",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: 'right',
      disableFilter: true,
      disableSorter: true,
      render: (_, record) => (
        <Col span={24} className="text-center">
          <UnorderedListOutlined
            style={{ cursor: "pointer" }}
            onClick={() => handleClickDetail(record)}
          />
        </Col>
      ),
    },
  ],
  getHistoryLog: () => [
    {
      key: "1",
      no: 1,
      createdBy: "Jane Smith",
      createdDate: "2023-08-15 14:30:00",
      modifiedBy: "John Doe",
      modifiedDate: "2023-09-01 10:00:00",
      changeDescription: "Updated adjustment value from 5% to 10%",
    },
  ],
};

export default promoCriteriaRepository;
