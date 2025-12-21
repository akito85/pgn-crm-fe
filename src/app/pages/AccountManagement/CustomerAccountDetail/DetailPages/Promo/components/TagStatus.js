import { Col } from "antd";

const TagStatus = ({ status }) => {
  return (
    <Col span={24} className="text-center">
      {status === "Active" ? (
        <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full ">
          {status}
        </span>
      ) : (
        <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
          {status}
        </span>
      )}
    </Col>
  );
};
export default TagStatus;
