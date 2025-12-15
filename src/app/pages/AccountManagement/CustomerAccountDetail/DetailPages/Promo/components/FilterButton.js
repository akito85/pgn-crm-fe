import { Fragment, useState } from "react";
import { Form } from "antd";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import ModalQueryCustom from "./ModalQueryCustom";

const FilterButton = ({ onApplyFilter, columnType = "promo" }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const handleFilterClick = () => {
    setOpen(true);
  };

  const handleFirstQuery = () => {
    console.log('First query triggered');
  };

  const handleCancelQuery = () => {
    form.resetFields();
    setOpen(false);
  };

  const handleSaveQuery = (values) => {
    console.log('Query values:', values);
    if (onApplyFilter && values.query) {
      onApplyFilter(values.query);
    }
    setOpen(false);
  };

  return (
    <Fragment>
      <ButtonComponent
        type="submit"
        size="small"
        fullButton
        onClick={handleFilterClick}
      >
        <span className="text-xs sm:text-sm truncate">Filters</span>
      </ButtonComponent>
      <Form
        form={form}
        name="formQuery"
        onFinish={handleSaveQuery}
        initialValues={{ query: [] }}
      >
        <ModalQueryCustom 
          isOpen={open} 
          setIsOpen={setOpen}
          handleFirstQuery={handleFirstQuery}
          handleCancelQuery={handleCancelQuery}
          columnType={columnType}
        />
      </Form>
    </Fragment>
  );
};

export default FilterButton;
