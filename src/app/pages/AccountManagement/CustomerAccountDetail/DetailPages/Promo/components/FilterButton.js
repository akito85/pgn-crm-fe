import { Fragment, useState } from "react";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import ModalQueryCustom from "./ModalQueryCustom";


const FilterButton = () => {
  const [open, setOpen] = useState(false);
  const handleFilterClick = () => {
    setOpen(true);
  };
  return (
    <Fragment>
      <ButtonComponent
        type="submit"
        size="small"
        fullButton
        onClick={handleFilterClick}
      >
        Filters
      </ButtonComponent>
      <ModalQueryCustom isOpen={open} setIsOpen={setOpen} />
    </Fragment>
  );
};

export default FilterButton;
