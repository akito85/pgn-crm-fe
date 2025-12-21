import { Fragment } from "react";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import { DownloadOutlined } from "@ant-design/icons";

const ExportButton = ({ onClick, loading = false }) => {
  return (
    <Fragment>
      <ButtonComponent
        type="submit"
        onClick={onClick}
        loading={loading}
        icon={
          <DownloadOutlined
            style={{
              color: "#fff",
              fontSize: 20,
            }}
          />
        }
        style={{
          backgroundColor: "#0075bf",
          color: "#fff",
          borderColor: "#0075bf",
          border: "1px solid #0075bf",
          borderRadius: "5px",
          height: "48px"
        }}
      >
        Download List
      </ButtonComponent>
    </Fragment>
  );
};
export default ExportButton;
