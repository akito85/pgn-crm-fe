import { Fragment } from "react";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import { FilterOutlined } from "@ant-design/icons";

const FilterButton = () => {
  return (
    <Fragment>
      <ButtonComponent
        type="default"
        size="small"
        fullButton
        icon={<FilterOutlined />}
      >
        Filters
      </ButtonComponent>
    </Fragment>
  );
};

export default FilterButton;
