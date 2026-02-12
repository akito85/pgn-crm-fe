import React, { useEffect, useState, useRef } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Tooltip,
  DatePicker,
  Button,
} from "antd";
import Highlighter from "react-highlight-words";
import { FilterOutlined } from "@ant-design/icons";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../../assets/Icon/index";
import { showModalError } from "../../../../../../../redux/slices/general_slice";
import { useDispatch, useSelector } from "react-redux";
import { getCountryRMS } from "../../../../../../../redux/slices/account_management/detailAccount/RawMaterialDistributionSlice";
import InputComponent from "../../../../../../../components/InputComponent";
import { getColumnSearchPropsCriteria } from "../../../../../ProductAndPromo/Product/columnTableCriteria";
import NxTable from "../../../../../../../components/Nx/NxTable";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  options,
  dependDataIndex,
  dataEditRecord,
  required,
  formRMS,
  validationError,
  importVal,
  handleEditDataRecord = () => {},
  ...restProps
}) => {
  const key = record?.key || 0;

  const rules = () => {
    let rules = [];
    if (required) {
      rules.push({
        required: required === undefined || required === false ? false : true,
        message: `Please input your ${title.toLowerCase()}!`,
      });
    }
    return rules.length !== 0 ? rules : undefined;
  };

  const getInputNode = (inputType) => {
    switch (inputType) {
      case "select":
        return (
          <Select
            showSearch
            allowClear
            labelInValue
            size="small"
            style={{
              height: 24,
              fontSize: 11,
            }}
            filterOption={(input, option) =>
              (option?.children ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {options?.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                <div className="text-xs">{option.label}</div>
              </Select.Option>
            ))}
          </Select>
        );
      case "number":
        return (
          <InputNumber
            type={"number"}
            controls={false}
            size="small"
            style={{
              width: "100%",
              fontSize: 11,
              height: 24,
            }}
          />
        );
      default:
        return <InputComponent />;
    }
  };

  const inputNode = getInputNode(inputType);

  if (dataIndex === "operation" || dataIndex === "no") {
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
          getValueFromEvent={(value) =>
            handleEditDataRecord(value, key, dataIndex)
          }
          validateStatus={
            validationError && dataIndex === "percentage" ? "error" : undefined
          }
          help={
            validationError && dataIndex === "percentage"
              ? validationError
              : undefined
          }
          rules={
            inputType !== "number"
              ? rules()
              : [
                  ...rules(),
                  {
                    validator: (_, value) => {
                      const max = importVal !== undefined ? importVal : 100;
                      if (value >= 0 && value <= max) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject(
                          new Error(
                            `Please adjust value. Value must be between 0 and ${max}`,
                          ),
                        );
                      }
                    },
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

const getColumnSearchProps = (
  dataIndex,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  excludeRender = false,
  typeFilter = "input",
) => {
  let obj = {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      const onDataChange = (value, dateString) => {
        setSelectedKeys(dateString ? [dateString] : []);
        handleSearch(dateString ? [dateString] : [], confirm, dataIndex);
      };
      return (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {typeFilter === "date" ? (
            <DatePicker onChange={onDataChange} format={"DD MMM YYYY"} />
          ) : null}
          {typeFilter === "datetime" ? (
            <DatePicker onChange={onDataChange} showTime={true} />
          ) : null}
          {typeFilter === "datePeriod" ? (
            <DatePicker onChange={onDataChange} picker="month" />
          ) : null}
          {typeFilter === "input" ? (
            <Input
              ref={searchInput}
              placeholder={`Search`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() =>
                handleSearch(selectedKeys, confirm, dataIndex)
              }
              style={{
                marginBottom: 8,
                display: "block",
              }}
            />
          ) : null}
        </div>
      );
    },
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    // onFilter: onFilter,
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (data) => {
      const label = data?.label || data || "";
      if (searchedColumn === dataIndex) {
        return (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={label ? label.toString() : ""}
          />
        );
      } else {
        return label || "";
      }
    },
  };
  if (excludeRender) {
    delete obj.render;
  }
  return obj;
};

const FunctionalRMSDetail = ({
  type,
  data = [],
  updateData = [],
  storedData = false,
  setStoredData = () => {},
  localVal,
  importVal,
}) => {
  // Selector
  const { data_country } = useSelector((state) => state.rawMaterialSource);

  // Declaration
  const searchInput = useRef(null);
  const [formRMS] = Form.useForm();
  const dispatch = useDispatch();
  const isEditing = (record) => record.key === editingKey;
  const dataItem = data?.length > 0 ? data?.map((item) => item?.country) : [];

  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["action"],
    left: [],
  }));

  const filterItem = () => {
    return dataItem?.length > 0
      ? data_country?.filter(
          (a) => !dataItem?.some((b) => b?.value === a?.value),
        )
      : data_country;
  };

  const totalPercentage = data.reduce((sum, item) => {
    const percentage = Number(item.percentage);
    if (isNaN(percentage)) {
      return sum;
    }
    return sum + percentage;
  }, 0);

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [editingKey, setEditingKey] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [statusAction, setStatusAction] = useState("");
  const [editDataRecord, setEditDataRecord] = useState({});

  const [validationError, setValidationError] = useState("");

  // Use Effect
  useEffect(() => {
    setTotalData(data.length);
  }, [data]);

  useEffect(() => {
    if (type !== "detail" && type !== "preview") {
      dispatch(getCountryRMS());
    }
  }, [type]);

  // Declare data list option
  const listOption = filterItem();

  // Handle Edit Data Record
  const handleEditDataRecord = (data, key, index) => {
    const keyName = key + index;
    setEditDataRecord((prevState) => {
      return {
        ...prevState,
        [keyName]: data,
      };
    });
    return data;
  };

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };

  // Handle Change page and pageSize
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const edit = (record, field) => {
    setStoredData(true);
    setStatusAction("edit");
    formRMS.setFieldsValue(record);
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
    setEditingKey(record.key);
  };

  // Function Cancel Data
  const cancel = (record) => {
    setEditingKey("");
    if (statusAction === "add") {
      deleteRow(record);
    }
    setStatusAction("");
    setStoredData(false);
  };

  // Function Save Data
  const save = async (key) => {
    try {
      const row = await formRMS.validateFields();

      // Check if the percentage is 0 and return early
      if (row.percentage === 0) {
        return;
      }

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        const updatedRow = { ...item, ...row };

        const totalPercentage = newData.reduce((sum, currentItem, idx) => {
          if (idx === index) {
            return sum + (updatedRow.percentage || 0);
          }
          return sum + (currentItem.percentage || 0);
        }, 0);

        // Check if the total percentage exceeds allowed importVal
        if (totalPercentage > importVal) {
          setValidationError(`Total Percentage must be ${importVal}%`);
          return;
        }

        setValidationError("");

        newData.splice(index, 1, updatedRow);
        updateData(newData);
        setEditingKey("");
        
      }

      setStoredData(false);
      setStatusAction("");
      formRMS.resetFields();
    } catch (errInfo) {
      // Handle any errors if necessary
    }
  };

  // Function Add Row Data
  const addRow = () => {
    let errorBody = {};
    if (totalPercentage === importVal) {
      errorBody = {
        title: "Failed",
        description: `Total percentage is ${importVal}%, you cannot add data again.`,
      };
      dispatch(showModalError(errorBody));
    } else {
      formRMS.resetFields();
      setStoredData(true);
      setStatusAction("add");
      const newRow = {
        key: data
          .reduce((current, next) => {
            const nextKey = next.key || 0;
            return current > nextKey
              ? parseInt(current) + 1
              : parseInt(nextKey) + 1;
          }, 1)
          .toString(),
      };
      updateData((prevData) => [...prevData, newRow]);
      setEditingKey(newRow.key);
    }
  };

  // Function Delete Row
  const deleteRow = (record) => {
    updateData((prevState) =>
      prevState.filter((item) => item.key !== record.key),
    );
    setStoredData(false);
  };

  // Filter Table (robust: handles primitive values, objects with label, and nulls)
  const onFilter = (dataIndex, value, record) => {
    const fixSearchText = String(value || "").toLowerCase().trim();
    const cell = record[dataIndex];

    if (dataIndex === "percentage") {
      const temp = cell !== undefined && cell !== null ? String(cell) : "";
      return temp.toLowerCase().includes(fixSearchText);
    }

    // Special handling for country: support label (string or React element) and value
    if (dataIndex === "country") {
      if (cell === undefined || cell === null) return false;

      // rawLabel may be cell.label or the cell itself
      const rawLabel = cell?.label ?? cell ?? "";

      // If label is a React element, try to extract text children
      if (React.isValidElement(rawLabel)) {
        const child = rawLabel.props?.children;
        const childStr =
          child !== undefined && child !== null && (typeof child === "string" || typeof child === "number")
            ? String(child).toLowerCase().trim()
            : "";
        if (childStr.includes(fixSearchText)) return true;
      } else {
        const labelStr = rawLabel !== undefined && rawLabel !== null ? String(rawLabel).toLowerCase().trim() : "";
        if (labelStr.includes(fixSearchText)) return true;
      }

      // also check cell.value if present
      const valStr = cell?.value !== undefined && cell?.value !== null ? String(cell.value).toLowerCase().trim() : "";
      if (valStr.includes(fixSearchText)) return true;

      return false;
    }

    // Generic handling for other columns
    if (cell === undefined || cell === null) return false;

    if (typeof cell === "string" || typeof cell === "number") {
      return String(cell).toLowerCase().trim().includes(fixSearchText);
    }

    if (typeof cell === "object") {
      const label = cell.label !== undefined && cell.label !== null ? String(cell.label).toLowerCase().trim() : "";
      const val = cell.value !== undefined && cell.value !== null ? String(cell.value).toLowerCase().trim() : "";
      const combined = `${label} ${val}`.trim();
      return combined.includes(fixSearchText);
    }

    try {
      return String(cell).toLowerCase().trim().includes(fixSearchText);
    } catch (e) {
      return false;
    }
  };

  // Sorter Table (robust)
  const sorter = (fieldSort, a, b) => {
    const extractSortable = (obj) => {
      const cell = obj ? obj[fieldSort] : undefined;
      if (cell === undefined || cell === null) return "";

      // For percentage: prefer numeric comparison
      if (fieldSort === "percentage") {
        const n = Number(cell);
        return isNaN(n) ? String(cell).toLowerCase() : n;
      }

      // Primitive types
      if (typeof cell === "string" || typeof cell === "number") {
        return String(cell).toLowerCase();
      }

      // Object: attempt to extract label or value; support React element in label
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
              // continue
            }
          }

          if (typeof lbl === "string" || typeof lbl === "number") {
            return String(lbl).toLowerCase();
          }
        }

        if (val !== undefined && (typeof val === "string" || typeof val === "number")) {
          return String(val).toLowerCase();
        }

        // fallback to JSON string
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

  // Columns Table
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
        key: "country",
        required: true,
        title: "COUNTRY",
        width: 240,
        onFilter: (value, record) => onFilter("country", value, record),
        sorter: (a, b) => sorter("country", a, b),
        dataIndex: "country",
        inputType: "select",
        options: listOption,
        ...getColumnSearchPropsCriteria(
          "country",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
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

            if (searchedColumn === "country" && searchText && childStr) {
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
          if (searchedColumn === "country" && searchText) {
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
        required: true,
        title: "PERCENTAGE (%)",
        width: 240,
        align: "right",
        onFilter: (value, record) => onFilter("percentage", value, record),
        sorter: (a, b) => sorter("percentage", a, b),
        dataIndex: "percentage",
        inputType: "number",
        ...getColumnSearchProps(
          "percentage",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        key: "operation",
        title: "ACTION",
        dataIndex: "operation",
        width: 240,
        fixed: "right",
        align: "center",
        render: (_, record) => {
          const editable = record.key === editingKey;

          return (
            <Space className="fleex w-full justify-center my-1 gap-2">
              {editable ? (
                <>
                  <Button
                    onClick={() => cancel(record)}
                    className="flex w-full justify-center"
                    type="default"
                    size="small"
                    style={{
                      borderColor: "var(--primary)",
                      height: "22px",
                      fontSize: "11px",
                      cursor: "pointer",
                      padding: "0px 6px",
                      lineHeight: "20px",
                    }}
                  >
                    <div className="py-0.5 px-1 text-center">Cancel</div>
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
                    <div className="py-0.5 px-1 text-center">Save</div>
                  </Button>
                </>
              ) : (
                <div className="flex w-full justify-center gap-4">
                  <Tooltip title="Edit">
                    <div>
                      <SVGIcon
                        name="IconEdit"
                        color={editingKey ? "#8D91A0" : "#ACC424"}
                        className={
                          editingKey ? "cursor-not-allowed" : undefined
                        }
                        width={20}
                        onClick={!editingKey ? () => edit(record) : undefined}
                      />
                    </div>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <div>
                      <SVGIcon
                        name="IconDelete"
                        color={!editingKey ? "#D90000" : "#8D91A0"}
                        width={20}
                        className={
                          !editingKey
                            ? undefined
                            : "disabled cursor-not-allowed"
                        }
                        onClick={
                          !editingKey ? () => deleteRow(record) : undefined
                        }
                      />
                    </div>
                  </Tooltip>
                </div>
              )}
            </Space>
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

  // Function Show/Hide Column
  const [optionSelectedCol, setOptionSelectedCol] = useState([]);

  const handleDisplayColumn = (value) => {
    setOptionSelectedCol(value);
  };

  // Function Change Total Data Table
  const onChange = (_, __, ___, extra) => {
    setTotalData(extra?.currentDataSource?.length || 0);
  };

  const filterColumn = (dataColumn) => {
    return dataColumn.filter((col) => {
      return !optionSelectedCol.includes(col.title);
    });
  };

  return (
    <div className="flex flex-col w-full gap-4">
      {type !== "detail" &&
      type !== "preview" &&
      localVal + importVal === 100 ? (
        <div className="flex w-full justify-end">
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
            onClick={!storedData ? addRow : undefined}
          >
            Create
          </ButtonComponent>
        </div>
      ) : null}

      <div className="relative flex flex-col w-full">
        <Form form={formRMS} component={false}>
          <NxTable
            idTable="rmd-functional-rms-detail-table"
            dataSource={data}
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
                  dataEditRecord: editDataRecord,
                  handleEditDataRecord: handleEditDataRecord,
                  required: col.required,
                  validationError: validationError,
                  formRMS: formRMS,
                  importVal: importVal,
                }),
              })),
            )}
            usePagination={false}
            useInfiniteScroll={false}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            rowClassName={(record) => (isEditing(record) ? "editable-row" : "")}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            onChange={onChange}
            showAdvanceSearch={false}
          />
        </Form>

        {type !== "detail" && type !== "preview" ? (
          <div className={"w-full flex flex-col mt-5 gap-2 justify-start"}>
            <span className="font-bold">Total Percentage</span>
            <span>{`${totalPercentage} / ${importVal} %`}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default FunctionalRMSDetail;
