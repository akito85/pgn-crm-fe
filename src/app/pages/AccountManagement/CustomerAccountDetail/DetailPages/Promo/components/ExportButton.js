import { Fragment } from "react";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import { DownloadOutlined } from "@ant-design/icons";

const ExportButton = () => {
  return (
    <Fragment>
      <ButtonComponent
        type="submit"
        size="small"
        fullButton
      >
        <DownloadOutlined style={{ marginRight: "8px" }} />
        Download List
      </ButtonComponent>
    </Fragment>
  );
};
export default ExportButton;
