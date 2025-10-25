import { Fragment } from "react";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import { DownOutlined } from "@ant-design/icons";

const ExportButton = () => {
  return (
    <Fragment>
      <ButtonComponent
        type="default"
        size="small"
        fullButton
        icon={<DownOutlined />}
      >
        Export
      </ButtonComponent>
    </Fragment>
  );
};
export default ExportButton;
