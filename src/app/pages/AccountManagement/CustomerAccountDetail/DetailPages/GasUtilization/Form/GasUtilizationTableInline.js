import React, {useState, useRef, useEffect, Fragment} from "react";
import { Button, Form, Input, InputNumber, Pagination, Select, Tooltip } from "antd";

import SVGIcon from "../../../../../../../assets/Icon/index";
import { getColumnSearchProps } from "../../../../../../../utils/getColumnSearchProps";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import { getColumnSearchPropsCriteria } from "../../../../../ProductAndPromo/Product/columnTableCriteria";
import { showModalError } from "../../../../../../../redux/slices/general_slice";
import InputComponent from "../../../../../../../components/InputComponent";
import NxTable from "../../../../../../../components/Nx/NxTable";
import Highlighter from "react-highlight-words";
import { nxGetAccountActions } from "../../../../../../../components/Nx/NxGetAccountActions";

const onFilter = (dataIndex, value, record) => {
  const fixSearchText = String(value || "").toLowerCase().trim();
  const cell = record ? record[dataIndex] : undefined;

  if (cell === undefined || cell === null) return false;

  if (dataIndex === "percentage") {
    const temp = cell !== undefined && cell !== null ? String(cell) : "";
    return temp.toLowerCase().includes(fixSearchText);
  }

  // handle React element as label or nested label/value objects
  const rawLabel = cell?.label ?? cell;

  // If rawLabel is a React element, try to read its children
  if (React.isValidElement(rawLabel)) {
    const child = rawLabel.props?.children;
    const childStr =
      child !== undefined && child !== null && (typeof child === "string" || typeof child === "number")
        ? String(child).toLowerCase().trim()
        : "";
    if (childStr.includes(fixSearchText)) return true;
  } else if (typeof rawLabel === "string" || typeof rawLabel === "number") {
    if (String(rawLabel).toLowerCase().trim().includes(fixSearchText)) return true;
  }

  // also check cell.value if present
  const valStr = cell?.value !== undefined && cell?.value !== null ? String(cell.value).toLowerCase().trim() : "";
  if (valStr.includes(fixSearchText)) return true;

  return false;
};

const sorter = (fieldSort, a, b) => {
  const extractSortable = (obj) => {
    const cell = obj ? obj[fieldSort] : undefined;
    if (cell === undefined || cell === null) return "";

    if (fieldSort === "percentage") {
      const n = Number(cell);
      return isNaN(n) ? String(cell).toLowerCase() : n;
    }

    if (typeof cell === "string" || typeof cell === "number") {
      return String(cell).toLowerCase();
    }

    if (typeof cell === "object") {
      const lbl = cell.label !== undefined ? cell.label : undefined;
      const val = cell.value !== undefined ? cell.value : undefined;

      if (lbl !== undefined) {
        if (React.isValidElement(lbl)) {
          const child = lbl.props?.children;
          if (child !== undefined && child !== null && (typeof child === "string" || typeof child === "number")) {
            return String(child).toLowerCase();
          }
          try {
            return String(lbl).toLowerCase();
          } catch (e) {
            // fallthrough
          }
        }

        if (typeof lbl === "string" || typeof lbl === "number") {
          return String(lbl).toLowerCase();
        }
      }

      if (val !== undefined && (typeof val === "string" || typeof val === "number")) {
        return String(val).toLowerCase();
      }

      try {
        return JSON.stringify(cell).toLowerCase();
      } catch (e) {
        return "";
      }
    }

    return String(cell).toLowerCase();
  };

  const aVal = extractSortable(a);
  const bVal = extractSortable(b);

  if (typeof aVal === "number" && typeof bVal === "number") {
    return aVal - bVal;
  }

  return String(aVal).localeCompare(String(bVal));
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
              lineHeight: "32px",
            }}
          >
            {options.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                <span className="text-xs">{option.label}</span>
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
              height: "34px",
              lineHeight: "32px",
            }}
          />
        );
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
        padding: "0 8px",
        height: "34",
        lineHeight: "32px",
        fontSize: 12,
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

  const itemActions = nxGetAccountActions({
    handleUpdate: (record) => edit(record.key),
    handleDelete: (record) => deleteRow(record.key),
  }).filter(action => action.action === "Delete" || action.action === "Update");
  
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
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

    // filtering using the robust onFilter
    if (searchedColumn) {
      result = result.filter((item) => onFilter(searchedColumn, searchText, item));
    }

    // sorting using the robust sorter
    if (fieldSort) {
      result.sort((a, b) => {
        const res = sorter(fieldSort, a, b);
        return orderSort === "asc" ? res : -res;
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
    const dataEdit = dataTableGasUtilization[record - 1];
    setStatusAction("edit");
    setIsEdit(true)
    formTable.setFieldsValue(dataEdit);
    const { key, ...extraProps } = dataEdit || {};
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
    setEditingKey(record);
   
  };

  const cancel = (record) => {
    setStoredData(false);
    setEditingKey("");
    setIsEdit(false)
    if (statusAction === "add") {
      deleteRow(record.key);
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
      prevState.filter((item) => item.key !== record)
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
        render: (data) => {
          // support label as string, number, React element, or fallback
          const rawLabel = data?.label ?? data ?? "";

          // If it's a React element, try to extract children text or return element
          if (React.isValidElement(rawLabel)) {
            const child = rawLabel.props?.children;
            const childStr =
              child !== undefined && child !== null && (typeof child === "string" || typeof child === "number")
                ? String(child)
                : null;

            if (searchedColumn === "name" && searchText && childStr) {
              return (
                <Highlighter
                  highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                  searchWords={[searchText]}
                  autoEscape
                  textToHighlight={childStr}
                />
              );
            }

            // fallback to rendering the element itself
            return rawLabel;
          }

          const label = rawLabel !== undefined && rawLabel !== null ? String(rawLabel) : "";
          if (searchedColumn === "name" && searchText) {
            return (
              <Highlighter
                highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={label}
              />
            );
          }

          return label || "";
        },
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
          record.id = record.key;
          record.statusApproval = "DRAFT";
          return (
            <div className="flex w-full justify-center my-1 gap-2">
              {editable ? (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => cancel(record)}
                    type="default"
                    size="small"
                    style={{
                      borderRadius: "20px",
                      border: "1px solid var(--primary, #0075BF)",
                      color: "var(--primary, #0075BF)",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => save(record.key)}
                    type="default"
                    size="small"
                    style={{
                      borderRadius: "20px",
                      border: "1px solid var(--primary, #0075BF)",
                      backgroundColor: "var(--primary, #0075BF)",
                      color: "#fff",
                    }}
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <>
                  {itemActions.map((action, index) => (
                    <Fragment key={`table-action-${index}`}>
                      {action.render(record, itemActions.length, index)}
                    </Fragment>
                  ))}
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
            showAdvanceSearch={false}
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
