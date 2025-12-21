import { useEffect } from "react";
import ModalCustomPromo from "./ModalCustomPromo";
import { Form, Tooltip } from "antd";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../../assets/Icon/index";
import QueryParams from "../../../../Customer/Component/QueryParams";
import { usePromo } from "../hooks/usePromo";

const ModalQueryCustom = ({
  isOpen,
  setIsOpen,
  onSaveQuery = () => {},
  columnType = "promo", // "promo" | "criteria" | "condition" | "history"
  activeFilters,
}) => {
  const [form] = Form.useForm();
  const { advancedSearchMetadata, loadAdvancedSearchMetadata } = usePromo();

  useEffect(() => {
    // Load advanced search metadata (conditions, operators, columns)
    loadAdvancedSearchMetadata();
  }, [loadAdvancedSearchMetadata]);

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({ query: activeFilters || [] });
    }
  }, [isOpen, activeFilters, form]);

  // Select columns based on type
  const getColumns = () => {
    switch (columnType) {
      case "criteria":
        return advancedSearchMetadata?.criteriaColumns || [];
      case "condition":
        return advancedSearchMetadata?.conditionColumns || [];
      case "history":
        return advancedSearchMetadata?.historyColumns || [];
      default:
        return advancedSearchMetadata?.promoColumns || [];
    }
  };

  const handleFirstQuery = () => {
    console.log('First query triggered');
  };

  const handleCancelQuery = () => {
    form.resetFields();
    setIsOpen(false);
  };

  const handleFinish = (values) => {
    console.log('ModalQueryCustom - Form submitted with values:', values);
    onSaveQuery(values);
  };

  return (
    <ModalCustomPromo
      title="Query"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      width={1200}
    >
      <Form
        form={form}
        name="formQuery"
        onFinish={handleFinish}
        initialValues={{ query: activeFilters || [] }}
      >
        <div>
          <Form.List name="query">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <div key={key} className="flex flex-row">
                  <div className="w-full">
                    <QueryParams
                      name={name}
                      index={index}
                      restField={restField}
                      optionColumns={getColumns()}
                      optionOperator={advancedSearchMetadata?.operators || []}
                      optionsConditions={advancedSearchMetadata?.conditions || []}
                    />
                  </div>
                  <div className="pt-8 pl-5">
                    <Tooltip title="Delete">
                      <SVGIcon
                        name="IconDelete"
                        color={"#D90000"}
                        width={24}
                        onClick={() => {
                          remove(name);
                          handleFirstQuery();
                        }}
                      />
                    </Tooltip>
                  </div>
                </div>
              ))}
              <div className={"w-full flex justify-between mt-5"}>
                <div>
                  <ButtonComponent
                    type={"submit"}
                    onClick={() => {
                      add();
                      handleFirstQuery();
                    }}
                    disabled={fields.length > 4}
                  >
                    Add
                  </ButtonComponent>
                </div>
                <div className={"flex gap-3"}>
                  <Form.Item>
                    <ButtonComponent
                      type="default"
                      onClick={() => {
                        handleCancelQuery();
                      }}
                    >
                      Cancel
                    </ButtonComponent>
                  </Form.Item>
                  <Form.Item>
                    <ButtonComponent
                      type="submit"
                      htmlType={"submit"}
                    >
                      Save
                    </ButtonComponent>
                  </Form.Item>
                </div>
              </div>
            </>
          )}
        </Form.List>
        </div>
      </Form>
    </ModalCustomPromo>
  );
};
export default ModalQueryCustom;