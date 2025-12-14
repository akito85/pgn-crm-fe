import { useEffect } from "react";
import ModalCustomPromo from "./ModalCustomPromo";
import { Form, Tooltip } from "antd";
import { useSelector } from "react-redux";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../../assets/Icon/index";
import QueryParams from "../../../../Customer/Component/QueryParams";

const ModalQueryCustom = ({
  isOpen,
  setIsOpen,
  handleFirstQuery = () => {},
  handleCancelQuery = () => {},
  dispatch = () => {},
  typeSelector = "customerAccount",
  getApiColumn = () => {},
  getApiOperator = () => {},
  getApiCondition = () => {},
}) => {
  const {
    data_globalTypeCondition,
    data_globalTypeOperator,
    data_globalTypeColumn,
  } = useSelector((state) => state[typeSelector]);

  useEffect(() => {
    dispatch(getApiColumn());
    dispatch(getApiCondition());
    dispatch(getApiOperator());
  }, [dispatch]);

  return (
    <ModalCustomPromo 
      title="Query"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
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
                    optionColumns={data_globalTypeColumn}
                    optionOperator={data_globalTypeOperator}
                    optionsConditions={data_globalTypeCondition}
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
                    form={"formQuery"}
                  >
                    Save
                  </ButtonComponent>
                </Form.Item>
              </div>
            </div>
          </>
        )}
      </Form.List>
    </ModalCustomPromo>
  );
};
export default ModalQueryCustom;