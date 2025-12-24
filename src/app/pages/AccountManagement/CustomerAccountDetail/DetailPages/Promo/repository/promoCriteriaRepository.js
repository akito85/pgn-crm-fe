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
      title: "Service Type",
      dataIndex: "serviceType",
      key: "serviceType",
    },
    {
      title: "Customer Segment",
      dataIndex: "customerSegment",
      key: "customerSegment",
    },
    {
      title: "Account Group",
      dataIndex: "accountGroup",
      key: "accountGroup",
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
      title: "Action",
      dataIndex: "action",
      key: "action",
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
