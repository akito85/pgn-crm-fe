import React, {useState, useRef, useEffect} from "react";
import { Button, Form, Input, InputNumber, Pagination, Select, Tooltip } from "antd";

import SVGIcon from "../../../../../../../assets/Icon/index";
import { getColumnSearchProps } from "../../../../../../../utils/getColumnSearchProps";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import { getColumnSearchPropsCriteria } from "../../../../../ProductAndPromo/Product/columnTableCriteria";
import { showModalError } from "../../../../../../../redux/slices/general_slice";
import InputComponent from "../../../../../../../components/InputComponent";
import NxTable from "../../../../../../../components/Nx/NxTable";

const onFilter = (dataIndex, value, record) => {
  const tempSearchText = value.toLowerCase();
  switch (dataIndex) {
    case "name":
    case "unit":
      return record[dataIndex]?.label.toLowerCase().includes(tempSearchText);
    default:
      return record[dataIndex]
        ?.toString()
        ?.toLowerCase()
        .includes(tempSearchText);
  }
};

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "name":
      case "unit":
        return obj[fieldSort]?.label?.toLowerCase();
      default:
        return obj[fieldSort]?.toString()?.toLowerCase();
    }
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);
  return fa.localeCompare(fb);
};


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
  handleEditDataRecord = () => {},
  dataTableGasUtilization,
  totalPercentage,
  formTable,
  validationError,
  ...restProps
}) => {
  const key = record?.key || 0;

  const rules = () => {
    let rule = [];
    if (required) {
      rule.push({
        required: required === undefined || required === false ? false : true,
        message: `Please input your ${title.toLowerCase()}!`,
      });
    }
    return rule.length !== 0 ? rule : undefined;
  };

  const filterOption = (input, option) =>
    option.props.children.toLowerCase().includes(input.toLowerCase());

  const getInputNode = (inputType) => {
    switch (inputType) {
      case "select":
        return (
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={filterOption}
            labelInValue
            size="small"
            style={{
              height: 24,
              fontSize: 11,
            }}
          >
            {options.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                <div className="text-xs">
                  {option.label}
                </div>
              </Select.Option>
            ))}
          </Select>
        );
      case "number":
        return (
          <InputNumber
            size="small"
            type={"number"}
            controls={false}
            style={{
              width: "100%",
              fontSize: 11,
              height: 24
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

  const fulFilValidator = () => (_, value) => {
    if (value >= 0 && value <= 100) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error("Total percentage must be 100 (%)"));
    }
  };

  return (
    <td
      {...restProps}
      style={{
        fontSize: 11,
        lineHeight: "18px",
      }}
    >
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          valuePropName={"value"}
          getValueFromEvent={(value) =>
            handleEditDataRecord(value, key, dataIndex)
          }
          validateStatus={validationError && dataIndex === 'percentage' ? 'error' : undefined}
          help={validationError && dataIndex === 'percentage' ? validationError : undefined}
          rules={
            inputType !== "number"
              ? rules()
              : [
                  ...rules(),
                  {
                    validator: (_, value) =>
                      fulFilValidator()(_, value),
                  },
                ]
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

const GasUtilizationTableInline = ({
  dispatch,
  dataTableGasUtilization = [], //data product detail from setDataTableGasUtilization
  setDataTableGasUtilization = () => {}, // for set data product
  ddlUtilizationName,
  type = "create",
  setIsEdit = () => {},

}) => {
  const searchInput = useRef(null);
  const [formTable] = Form.useForm();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // const [totalElements, setTotalElement] = useState(0);
  const [editingKey, setEditingKey] = useState("");
  const [storedDate, setStoredData] = useState(false);
  
  const isEditing = (record) => record.key === editingKey;
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [editDataRecord, setEditDataRecord] = useState({});
  const [statusAction, setStatusAction] = useState("");

  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["action"],
    left: [],
  }));

  // const [fulfilPercentage, setFulfilPercentage] = useState(0);
  const [validationError, setValidationError] = useState('');
  const [filterDdlUtilName, setFilterDdlUtilName] = useState([]);

  useEffect(() => {
    const filteredListName = ddlUtilizationName?.filter(item => {
      return !dataTableGasUtilization?.some(fix => fix?.name?.label === item?.label);
    });
    setFilterDdlUtilName(filteredListName)
  }, [dataTableGasUtilization, ddlUtilizationName])

  
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
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
    let result = [...dataTableGasUtilization];
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
        [keyName]: index === "name" ? {
          ...value,
        }: value,
      };
    });
    return value;
  };

  const edit = (record, field) => {
    setStatusAction("edit");
    setIsEdit(true)
    formTable.setFieldsValue(record);
    const { key, ...extraProps } = record || {};
    const tempValue = { ...extraProps };
    for (const attribute in tempValue) {
      if (Object.hasOwnProperty.call(tempValue, attribute)) {
        const tempData = tempValue[attribute];
        setEditDataRecord((prevState) => {
          return {
            ...prevState,
            [`${key}${attribute}`]:
              attribute === "name"
                ? {
                    ...tempData,
                  }
                : tempData,
          };
        });
      }
    }
    setEditingKey(record.key);
   
  };

  const cancel = (record) => {
    setStoredData(false);
    setEditingKey("");
    setIsEdit(false)
    if (statusAction === "add") {
      deleteRow(record);
    }
    setStatusAction("");
  };


  const addRow = () => {
    const totalPercentage = dataTableGasUtilization.reduce((accumulator, currentValue) => {
      return accumulator + (currentValue.percentage || 0);
    }, 0);
    let errorBody = {};
    if (totalPercentage === 100) {
      errorBody = {
        title: "Failed",
        description: "Total percentage is 100%, you cannot add data again.",
      };
      dispatch(showModalError(errorBody));
    } else{
      formTable.resetFields();
      setStoredData(true);
      setStatusAction("add");
      setIsEdit(true)
      const newRow = {
        key: dataTableGasUtilization
          .reduce((current, next) => {
            const nextKey = next.key || 0;
            return current > nextKey
              ? parseInt(current) + 1
              : parseInt(nextKey) + 1;
          }, 1)
          .toString(),
      };
      setDataTableGasUtilization((prevData) => [...prevData, newRow]);
      setEditingKey(newRow.key);
    }
  };

  const save = async (key) => {
    try {
      // Validate the form fields
      const row = await formTable.validateFields();

      const newData = [...dataTableGasUtilization];
      const index = newData.findIndex((item) => key === item.key);
  
      if (index > -1) {
        // Update existing row
        const item = newData[index];
        const updatedRow = {
          ...item,
          ...row,
        };
        newData.splice(index, 1, updatedRow);
      } else {
        // Add new row
        newData.push({
          key,
          ...row,
        });
      }
  
      // Calculate the total percentage
      const totalPercentage = newData.reduce((accumulator, currentValue) => {
        return accumulator + (currentValue.percentage || 0); // Ensure currentValue.percentage is a number
      }, 0);
  
      // Check if the total percentage is exactly 100%
      if (totalPercentage > 100) {
        setValidationError('Total percentage must be exactly 100%')
        return; 
      }

      setValidationError('');
      
      // Update the table with the new or updated data
      setDataTableGasUtilization(newData);
      setEditingKey("");
  
      setStoredData(false);
      setIsEdit(false)
      setStatusAction("");
      formTable.resetFields();
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  
  const deleteRow = (record) => {
    setDataTableGasUtilization((prevState) =>
      prevState.filter((item) => item.key !== record.key)
    );
    setStoredData(false);
  };

  const columns = () => {
    const temp = [
      {
        key: "no",
        title: "NO",
        width: 60,
        dataIndex: "no",
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        key: "name",
        title: "UTILIZATION NAME",
        width: 240,
        dataIndex: "name",
        onFilter: (value, record) => onFilter("name", value, record),
        sorter: (a, b) => sorter("name", a, b),
        options: filterDdlUtilName,
        inputType: "select",
        require: true,
        ...getColumnSearchPropsCriteria(
          "name",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
      {
        key: "percentage",
        title: "PERCENTAGE",
        width: 240,
        dataIndex: "percentage",
        require: true,
        onFilter: (value, record) => onFilter("percentage", value, record),
        sorter: (a, b) => sorter("percentage", a, b),
        align: "right",
        inputType: "number",
        dependDataIndex: "name",
        ...getColumnSearchProps(
          "percentage",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
      {
        key: "operation",
        title: "ACTION",
        width: 240,
        fixed: "right",
        dataIndex: "operation",
        render: (_, record) => {
          const editable = record.key === editingKey;
          return (
            <div className="flex w-full justify-center my-1 gap-2">
              {editable ? (
                <>
                  <Button
                    onClick={() => cancel(record)}
                    className={"flex w-full justify-center"}
                    type={"default"}
                    size={"small"}
                    style={{
                      borderColor: "var(--primary)",
                      height: "22px",
                      fontSize: "11px",
                      cursor: "pointer",
                      padding: "0 6px",
                      lineHeight: "20px",
                    }}
                  >
                    <div
                      className="py-0.5 px-1 text-center"
                    >
                      Cancel
                    </div>
                  </Button>
                  <Button
                    onClick={() => save(record.key)}
                    className={"flex w-full justify-center"}
                    type={"submit"}
                    size={"small"}
                    style={{
                      borderColor: "#0075bf00",
                      backgroundColor: "var(--primary)",
                      color: "#fff",
                      height: "22px",
                      fontSize: "11px",
                      cursor: "pointer",
                      padding: "0 6px",
                      lineHeight: "20px",
                    }}
                  >
                    <div
                      className="py-0.5 px-1 text-center"
                    >
                      Save
                    </div>
                  </Button>
                </>
              ) : (
                <>
                  <Tooltip title="Edit">
                    <span 
                      className={`flex items-center h-full ${
                        editingKey ? " cursor-not-allowed" : ""
                      }`}
                    >
                      <SVGIcon
                        name="IconEdit"
                        color={editingKey ? "#8D91A0" : "#ACC424"}
                        width={20}
                        onClick={!editingKey ? () => edit(record) : undefined}
                      />
                    </span>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <span
                      className={`flex items-center h-full ${
                        editingKey ? " cursor-not-allowed" : ""
                      }`}
                    >
                      <SVGIcon
                        name="IconDelete"
                        width={20}
                        className={
                          editingKey ? "disabled" : undefined
                        }
                        color={editingKey ? "#8D91A0" : "#ff2e2e"}
                        onClick={
                          !editingKey
                            ? () => deleteRow(record)
                            : undefined
                        }
                      />
                    </span>
                  </Tooltip>
                </>
              )}
            </div>
          );
        },
      },
    ];
    const filterCol =
      type !== "detail" && type !== "preview"
        ? temp
        : temp.filter((col) => col.title !== "ACTION");
    return filterCol;
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

  const totalPercentage = dataTableGasUtilization.reduce((accumulator, currentValue) => {
    return accumulator + (currentValue.percentage || 0); // Ensure currentValue.percentage is a number
  }, 0);

  return (
      <div className="flex flex-col gap-4">
        {type === "create" && (
          <div className="flex w-full justify-end">
            <ButtonComponent
              icon={<SVGIcon name="IconButtonCreate" width={24} />}
              type="submit"
              onClick={!storedDate ? addRow : undefined}
              disabled={editingKey && true}
            >
              Create
            </ButtonComponent>
          </div>
        )}
        {/* Table */}
        <Form form={formTable} component={false}>
          <NxTable
            idTable="gas-utilization-table"
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
                  dependDataIndex: col.dependDataIndex,
                  urlIndex: col.url,
                  options: col.options,
                  required: col.require,
                  dataEditRecord: editDataRecord,
                  handleEditDataRecord: handleEditDataRecord,
                  dataTableGasUtilization:dataTableGasUtilization,
                  rules: col.rules,
                  totalPercentage:totalPercentage,
                  formTable: formTable,
                  validationError: validationError,
                }),
              }))
            )}
            totalData={filteredData("length")}
            tableScrolled={{ x: 800, y: 300 }}
            usePagination={false}
            useInfiniteScroll={false}
            onSort={onSort}
            components={{ body: { cell: EditableCell } }}
            rowClassName={(record) => (isEditing(record) ? "editable-row" : "")}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
          />

          {type === 'create' && (
            <div className="pt-4">
              <p className="font-bold">Total Percentage</p>
              <span>{totalPercentage} / 100 (%)</span>
            </div>
          )}
        </Form>
        
      </div>
  );
};

export default GasUtilizationTableInline;
