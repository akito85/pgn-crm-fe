import { UnorderedListOutlined } from "@ant-design/icons";
import { Col } from "antd";

const promoConditionRepository = {
  getPromoConditionList: () => [
    {
      key: "1",
      no: 1,
      name: "Minimum Purchase",
      operator: "lorem",
      dataType: "Number",
      value: "100000",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      description: "Minimum purchase value to qualify",
    },
  ],
  getColumns: (handleClickDetail, setDetailData) => [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      width: 60,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Operator",
      dataIndex: "operator",
      key: "operator",
    },
    {
      title: "Data Type",
      dataIndex: "dataType",
      key: "dataType",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
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
      disableFilter: true,
      disableSorter: true,
      render: (_, record) => (
        <Col span={24} className="text-center">
          <UnorderedListOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleClickDetail();
              setDetailData(record);
            }}
          />
        </Col>
      ),
    },
  ],
  getHistoryLog: () => [
    {
      key: "1",
      no: 1,
      createdBy: "Jane Smith <jane.smith@example.com>",
      createdDate: "2023-08-15 14:30:00",
      modifiedBy: "John Doe <john.doe@example.com>",
      modifiedDate: "2023-09-01 10:00:00",
      changeDescription: "Updated adjustment value from 5% to 10%",
    },
  ],
};

export default promoConditionRepository;
