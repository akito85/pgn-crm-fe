import { Fragment, useState } from "react";
import { FilterOutlined } from "@ant-design/icons";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import ModalQueryCustom from "./ModalQueryCustom";

const FilterButton = ({ onApplyFilter, columnType = "promo", activeFilters }) => {
  const [open, setOpen] = useState(false);

  const handleFilterClick = () => {
    setOpen(true);
  };

  const handleSaveQuery = (values) => {
    console.log('FilterButton - handleSaveQuery called');
    console.log('FilterButton - Query values:', values);
    console.log('FilterButton - onApplyFilter function exists?', !!onApplyFilter);

    if (onApplyFilter && values.query) {
      console.log('FilterButton - Calling onApplyFilter with:', values.query);
      onApplyFilter(values.query);
    } else {
      console.warn('FilterButton - onApplyFilter not called. Reasons:', {
        hasOnApplyFilter: !!onApplyFilter,
        hasQuery: !!values.query,
        query: values.query
      });
    }
    setOpen(false);
  };

  return (
    <Fragment>
      <ButtonComponent
        type="submit"
        onClick={handleFilterClick}
        icon={
          <FilterOutlined
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
          width: "128px",
          height: "48px",
          borderRadius: "5px"
        }}
      >
        Filters
      </ButtonComponent>
      <ModalQueryCustom
        isOpen={open}
        setIsOpen={setOpen}
        onSaveQuery={handleSaveQuery}
        columnType={columnType}
        activeFilters={activeFilters}
      />
    </Fragment>
  );
};

export default FilterButton;
