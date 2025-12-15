import { Fragment } from "react";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import { DownloadOutlined } from "@ant-design/icons";

const ExportButton = ({ onClick, loading = false }) => {
  return (
    <Fragment>
      <ButtonComponent
        type="submit"
        size="small"
        fullButton
        onClick={onClick}
        loading={loading}
      >
        <DownloadOutlined className="mr-0 sm:mr-2" />
        <span className="hidden sm:inline text-xs sm:text-sm truncate">Download List</span>
      </ButtonComponent>
    </Fragment>
  );
};
export default ExportButton;
