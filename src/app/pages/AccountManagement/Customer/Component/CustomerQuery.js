import React, { useEffect } from "react";
import QueryParams from "./QueryParams";
import { Button, Form, Input, Space, Tooltip } from "antd";
import SVGIcon from "../../../../../assets/Icon/index";
import { useSelector } from "react-redux";
import ButtonComponent from "../../../../../components/ButtonComponent";

const CustomerQuery = ({
  // queries,
  // handleDeleteQuery = () => {},
  // handleQueryChange = () => {},
  // handleAddQuery = () => {},
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
    <div>
      <Form.List name="query">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <div className="flex flex-row">
                <div className="w-full">
                  <QueryParams
                    name={name}
                    index={index}
                    restField={restField}
                    // handleQueryChange={handleQueryChange}
                    optionColumns={data_globalTypeColumn}
                    optionOperator={data_globalTypeOperator}
                    optionsConditions={data_globalTypeCondition}
                    // query={queries}
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
                        // handleDeleteQuery(name);
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
                    // disabled={btnQuery || loading}
                  >
                    Save
                  </ButtonComponent>
                </Form.Item>
              </div>
            </div>
          </>
        )}
      </Form.List>
      {/* {queries.map((query, index) => (
        <div className="flex flex-row">
          <div key={index} className="w-full">
            <QueryParams
              query={query}
              index={index}
              handleQueryChange={handleQueryChange}
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
                  handleDeleteQuery(query);
                }}
              />
            </Tooltip>
          </div>
        </div>
      ))} */}

      {/* <div className="w-full">
        <ButtonComponent type={"submit"} onClick={() => handleAddQuery()} disabled={queries.length > 4} fullButton={true}>
          Add
        </ButtonComponent>
      </div> */}
    </div>
  );
};

export default CustomerQuery;
