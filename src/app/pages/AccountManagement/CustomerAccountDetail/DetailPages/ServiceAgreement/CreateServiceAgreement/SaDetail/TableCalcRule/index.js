import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getColumnSearchProps } from "../../../../../../../../../utils/getColumnSearchProps";
import {
  Form,
  Input,
  InputNumber,
  Pagination,
  Select,
  Table,
  Tooltip,
} from "antd";
import Highlighter from "react-highlight-words";
import ButtonComponent from "../../../../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../../../../assets/Icon/index";
import SelectComponent from "../../../../../../../../../components/SelectComponent";
import {
  getListCalculationType,
  getListNameCalculationRule,
  getListUnit,
  getListUnitVAT,
  getListUnitWithHoldTax,
} from "../../../../../../../../../redux/slices/product_promo/product";
import { getColumnSearchPropsCriteria } from "../TableCalcRule/columnTableCriteria";
import { hasValue } from "../../../../../../../../../utils";
import InputComponent from "../../../../../../../../../components/InputComponent";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  options = [],
  required,
  dependDataIndex,
  dataEditRecord,
  urlIndex,
  isProduct,
  handleEditDataRecord = () => {},
  ...restProps
}) => {
  const key = record?.key || 0;
  const dataDepend = dependDataIndex
    ? dataEditRecord[key + dependDataIndex]
    : "";

  const rules = () => {
    let rule = [];
    if (required) {
      rule.push({
        ...required,
        message: `${required.message} ${title}!`,
      });
    }
    return rule.length !== 0 ? rule : undefined;
  };

  const filterOption = (input, option) =>
    option.props.children.toLowerCase().includes(input.toLowerCase());

  const dependentData = () => {
    if (options.length === 0) {
      return true;
    }
    return !dataDepend;
  };

  const getInputNode = (inputType) => {
    switch (inputType) {
      case "select":
        return (
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={filterOption}
            labelInValue
            disabled={
              (dataIndex === "name" && isProduct !== 2) ||
              hasValue(dependDataIndex)
                ? dependentData()
                : false
            }
            // disabled={dependDataIndex ? !dataDepend : false}
          >
            {options.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        );
      case "number":
        return (
          <InputNumber
            type={"number"}
            controls={false}
            style={{
              width: "100%",
            }}
          />
        );
      case "description":
        return <Input.TextArea rows={1} maxLength={255} />;
      default:
        return <InputComponent />;
    }
  };
  const inputNode = getInputNode(inputType);

  if (
    dataIndex === "operation" ||
    dataIndex === "no" ||
    dataIndex === "status"
  ) {
    return (
      <td {...restProps}>
        <div>{children}</div>
      </td>
    );
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          valuePropName={"value"}
          rules={rules()}
          getValueFromEvent={(value) =>
            handleEditDataRecord(value, key, dataIndex)
          }
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const excludeOptionName = [687];
const TableCalcRule = ({
  type,
  dispatch = () => {},
  dataTable = [],
  updateTable = () => {},
  isProduct,
  data = [],
  handleSaDetailObj = () => {},
  setSaDetailObj,
  saDetailObj,
}) => {
  const searchInput = useRef(null);
  const [formTable] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);
  const [editingKey, setEditingKey] = useState("");
  const [storedDate, setStoredData] = useState(false);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [editDataRecord, setEditDataRecord] = useState({});
  const [statusAction, setStatusAction] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const {
    dataListCalculationType,
    dataListNameCalculationRule = [],
    dataListUnit = [],
  } = useSelector((state) => state.product);
  const exludeExisting =
    dataTable.length > 0 ? dataTable.map((item) => item?.name?.value) : [];
  const listName = dataListNameCalculationRule.filter(
    (item) => ![...excludeOptionName, ...exludeExisting].includes(item.value),
  );

  useEffect(() => {
    if (isProduct === 2) {
      const selectedCalculationType = dataListCalculationType?.filter(
        (item) => item?.value === saDetailObj?.calculationType,
      )[0];
      setSaDetailObj((prevState) => ({
        ...prevState,
        objCaclucationType: {
          name: 687,
          unit: `${selectedCalculationType?.value}`,
          value: null,
        },
      }));
    }
  }, [saDetailObj.calculationType]);

  // useEffect(() => {
  //   if(data?.length){
  //     updateTable(data)
  //   }
  // }, [])

  // useEffect(() => {
  //   if (dataTable.length > 0) {
  //     setTotalElement(dataTable.length);
  //   }
  // }, [dataTable]);

  useEffect(() => {
    dispatch(getListCalculationType());
    dispatch(getListNameCalculationRule());
  }, [dispatch]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };

  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };
  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
  };
  const filteredData = (typeData = "data") => {
    let result = [...dataTable];
    if (searchedColumn) {
      const tempSearchText = searchText.toLowerCase();
      result = result.filter((item) => {
        switch (searchedColumn) {
          case "name":
          case "unit":
            return item[searchedColumn]?.label
              .toLowerCase()
              .includes(tempSearchText);
          default:
            return item[searchedColumn]?.toLowerCase().includes(tempSearchText);
        }
      });
    }
    const handleSort = (obj) => {
      switch (fieldSort) {
        case "name":
        case "unit":
          return obj[fieldSort]?.label.toString().toLowerCase();
        default:
          return obj[fieldSort].toString().toLowerCase();
      }
    };
    if (fieldSort) {
      result.sort((a, b) => {
        let fa = handleSort(a);
        let fb = handleSort(b);

        if (fa < fb) {
          return orderSort === "asc" ? -1 : 1;
        }
        if (fa > fb) {
          return orderSort === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    const fix = result.slice((page - 1) * pageSize, page * pageSize);
    return typeData === "data" ? fix : result.length;
  };

  const handleEditDataRecord = (data, key, index) => {
    const keyName = key + index;
    const value = index === "description" ? data.target.value : data;
    setEditDataRecord((prevState) => {
      return {
        ...prevState,
        [keyName]: value,
      };
    });
    if (index === `name`) {
      // const temp = listName.filter((item) => item.value === data?.value);
      // if (temp.length > 0) {
      //   dispatch(getListUnit({ id: temp[0].code }));
      //   formTable.resetFields(["unit"]);
      // }
      const temp = dataListNameCalculationRule.filter(
        (item) => item.id === data?.value,
      );
      if (data?.value === 212) {
        dispatch(getListUnitVAT());
        formTable.resetFields(["unit"]);
      } else if (data?.value === 213) {
        dispatch(getListUnitWithHoldTax());
        formTable.resetFields(["unit"]);
      } else if (temp.length > 0) {
        dispatch(getListUnit({ id: temp[0].id }));
        formTable.resetFields(["unit"]);
      }
    }
    return value;
  };
  const edit = (record, field) => {
    setStatusAction("edit");
    formTable.setFieldsValue(record);
    setEditingKey(record.key);
    const { key, ...extraProps } = record || {};
    const tempValue = { ...extraProps };
    for (const attribute in tempValue) {
      if (Object.hasOwnProperty.call(tempValue, attribute)) {
        const tempData = tempValue[attribute];
        setEditDataRecord((prevState) => {
          return {
            ...prevState,
            [`${key}${attribute}`]: tempData,
          };
        });
      }
    }
    if (record?.name && record?.name?.value) {
      // const temp = listName.filter(
      //   (item) => item.value === record?.name?.value
      // );
      // if (temp.length > 0) {
      //   dispatch(getListUnit({ id: temp[0].code }));
      // }
      const temp = dataListNameCalculationRule.filter(
        (item) => item.value === record?.name?.value,
      );
      if (record?.name?.value === 212) {
        dispatch(getListUnitVAT());
      } else if (record?.name?.value === 213) {
        dispatch(getListUnitWithHoldTax());
      } else if (temp.length > 0) {
        dispatch(getListUnit({ id: temp[0].id }));
      }
    }
  };
  const cancel = (record) => {
    setStoredData(false);
    setEditingKey("");
    if (statusAction === "add") {
      deleteRow(record);
    }
    setStatusAction("");
  };

  const save = async (key) => {
    try {
      const row = await formTable.validateFields();
      const newData = [...dataTable];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        const updatedRow = {
          ...item,
          ...row,
        };
        newData.splice(index, 1, updatedRow);
        updateTable(newData);
        setEditingKey("");
      }
      setStoredData(false);
      setStatusAction("");
      formTable.resetFields();
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const addRow = () => {
    formTable.resetFields();
    setStoredData(true);
    setStatusAction("add");
    const newRow = {
      key: dataTable
        .reduce((current, next) => {
          const nextKey = next.key || 0;
          return current > nextKey
            ? parseInt(current) + 1
            : parseInt(nextKey) + 1;
        }, 1)
        .toString(),
    };
    updateTable((prevData) => {
      return [...prevData, newRow];
    });
    setEditingKey(newRow.key);
  };

  const deleteRow = (record) => {
    updateTable((prevState) =>
      prevState.filter((item) => item.key !== record.key),
    );
    setStoredData(false);
  };

  const columns = () => {
    const temp = [
      {
        title: "NO",
        width: 60,
        dataIndex: "no",
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "NAME",
        width: 240,
        sorter: true,
        dataIndex: "name",
        options: listName,
        inputType: "select",
        required: { required: true, message: "Please input your" },
        ...getColumnSearchPropsCriteria(
          "name",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "VALUE",
        width: 240,
        sorter: true,
        dataIndex: "value",
        align: "right",
        inputType: "number",
        ...getColumnSearchProps(
          "value",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "UNIT",
        width: 240,
        sorter: true,
        dataIndex: "unit",
        options: dataListUnit,
        inputType: "select",
        dependDataIndex: "name",
        ...getColumnSearchPropsCriteria(
          "unit",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) => {
          return <span>{text?.label}</span>;
        },
      },
      {
        title: "DESCRIPTION",
        width: 240,
        sorter: true,
        dataIndex: "description",
        inputType: "description",
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchProps(
          "description",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          searchedColumn === "description" ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ""}
            />
          ) : text ? (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          ) : (
            ""
          ),
      },
      {
        title: "ACTION",
        width: 240,
        fixed: "right",
        dataIndex: "operation",
        render: (_, record) => {
          const editable = record.key === editingKey;
          return (
            <div className="flex w-full justify-center my-3 gap-2">
              {editable ? (
                <>
                  <ButtonComponent
                    onClick={() => cancel(record)}
                    type="default"
                  >
                    Cancel
                  </ButtonComponent>
                  <ButtonComponent
                    onClick={() => save(record.key)}
                    type="submit"
                  >
                    Save
                  </ButtonComponent>
                </>
              ) : (
                <>
                  <Tooltip title="Edit">
                    <span
                      className={`flex justify-center${
                        editingKey ? " cursor-not-allowed" : ""
                      }`}
                    >
                      <SVGIcon
                        name="IconEdit"
                        color={editingKey ? "#8D91A0" : "#ACC424"}
                        width={24}
                        onClick={!editingKey ? () => edit(record) : undefined}
                      />
                    </span>
                  </Tooltip>
                  {isProduct === 2 && (
                    <>
                      <Tooltip title="Delete">
                        <span
                          className={`flex justify-center${
                            record.typeData === "exist"
                              ? " cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <SVGIcon
                            name="IconDelete"
                            color={
                              record.typeData !== "exist"
                                ? "#D90000"
                                : "#8D91A0"
                            }
                            width={24}
                            className={
                              record.typeData === "exist"
                                ? "disabled"
                                : undefined
                            }
                            onClick={
                              record.typeData !== "exist"
                                ? () => deleteRow(record)
                                : undefined
                            }
                          />
                        </span>
                      </Tooltip>
                    </>
                  )}
                </>
              )}
            </div>
          );
        },
      },
    ];
    // return temp
    return temp;
    // isProduct === 2
    // ?
    // temp
    // : temp.filter((col) => col.title !== "ACTION");
  };

  const [optionSelectedCol, setOptionSelectedCol] = useState([]);

  const handleDisplayColumn = (value) => {
    setOptionSelectedCol(value);
  };

  const filterColumn = (dataColumn) => {
    return dataColumn.filter((col) => {
      return !optionSelectedCol.includes(col.title);
    });
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="grid gap-4 w-full">
        <Form.Item
          name={"calculationType"}
          rules={[{ message: "This field is required", required: true }]}
          className="no-margin-form w-full"
          getValueFromEvent={(e) => handleSaDetailObj(e, "calculationType")}
          label={"Calculation Type"}
          required
        >
          <SelectComponent>
            {(dataListCalculationType || []).map((data, index) => (
              <Select.Option key={index} value={data.value}>
                {data.label}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>
      </div>

      {isProduct === 2 && (
        <div className="flex w-full justify-end">
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
            onClick={!storedDate ? addRow : undefined}
          >
            Create
          </ButtonComponent>
        </div>
      )}

      <div className={"w-full flex justify-between"}>
        <Select
          mode="multiple"
          placeholder="Show All Column"
          className={"w-2/6"}
          maxTagCount={3}
          onChange={handleDisplayColumn}
        >
          {columns()
            .map((col) => (
              <Select.Option
                key={col.title}
                value={col.title}
                disabled={
                  optionSelectedCol.length > 3
                    ? optionSelectedCol.includes(col.title)
                      ? false
                      : true
                    : false
                }
              >
                {col.title}
              </Select.Option>
            ))
            .splice(1)}
        </Select>

        <Pagination
          total={filteredData("length")}
          className={"pr-1"}
          showSizeChanger
          current={page}
          pageSize={pageSize}
          onChange={handleChangeSize}
          showTotal={(total, range) =>
            `Showing ${range[0]} to ${range[1]} of ${total} records`
          }
        />
      </div>
      <Form form={formTable} component={false}>
        <Table
          dataSource={filteredData("data")}
          columns={filterColumn(
            columns().map((col) => ({
              ...col,
              onCell: (record) => ({
                record,
                inputType: col.inputType,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
                indexValue: col.indexValue,
                dependDataIndex: col.dependDataIndex,
                urlIndex: col.url,
                options: col.options,
                required: col.required,
                dataEditRecord: editDataRecord,
                isProduct: isProduct,
                handleEditDataRecord: handleEditDataRecord,
              }),
            })),
          )}
          rowClassName={(record) => (isEditing(record) ? "editable-row" : "")}
          scroll={{
            x: 1500,
            y: 300,
          }}
          pagination={false}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          onChange={onSort}
        />
      </Form>
    </div>
  );
};

export default TableCalcRule;
