import React, { useEffect, useState, useRef } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Table,
  Tooltip,
  DatePicker,
} from "antd";
import Highlighter from "react-highlight-words";
import { FilterOutlined } from "@ant-design/icons";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../../assets/Icon/index";
import { showModalError } from "../../../../../../../redux/slices/general_slice";
import { useDispatch, useSelector } from "react-redux";
import { getCountryRMS } from "../../../../../../../redux/slices/account_management/detailAccount/RawMaterialDistributionSlice";
import InputComponent from "../../../../../../../components/InputComponent";

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
  validateBoolean,
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
            filterOption={(input, option) =>
              (option?.children ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {options?.map((option) => (
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
            validateBoolean && inputType === "number" ? "error" : undefined
          }
          help={
            validateBoolean && inputType === "number"
              ? "Please adjust value. Total Percentage must be 100%"
              : undefined
          }
          rules={
            inputType !== "number"
              ? rules()
              : [
                  ...rules(),
                  {
                    validator: (_, value) => {
                      const percentage = formRMS.getFieldValue().percentage;
                      if (percentage >= 0 && percentage <= 100) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject(
                          new Error(
                            "Please adjust value. Total Percentage must be 100%"
                          )
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
  typeFilter = "input"
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
}) => {
  // Selector
  const { data_country } = useSelector((state) => state.rawMaterialSource);

  // Declaration
  const searchInput = useRef(null);
  const [formRMS] = Form.useForm();
  const dispatch = useDispatch();
  const isEditing = (record) => record.key === editingKey;
  const dataItem = data?.length > 0 ? data?.map((item) => item?.country) : [];

  const filterItem = () => {
    return dataItem?.length > 0
      ? data_country?.filter((a) => !dataItem?.some((b) => b?.value === a?.value))
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

  const [validateBoolean, setValidateBoolean] = useState(false);

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

        // Check if the total percentage exceeds 100%
        if (totalPercentage > 100) {
          return setValidateBoolean(true);
        }

        newData.splice(index, 1, updatedRow);
        updateData(newData);
        setEditingKey("");
        setValidateBoolean(false);
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
    if (totalPercentage === 100) {
      errorBody = {
        title: "Failed",
        description: "Total percentage is 100%, you cannot add data again.",
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
      prevState.filter((item) => item.key !== record.key)
    );
    setStoredData(false);
  };

  // Filter Table
  const onFilter = (dataIndex, value, record) => {
    const fixSearchText = value.toLowerCase();
    switch (dataIndex) {
      case "percentage":
        const temp = record[dataIndex]?.toString();
        return temp.toLowerCase().includes(fixSearchText);
      default:
        return record[dataIndex]?.label?.toLowerCase().includes(fixSearchText);
    }
  };

  // Sorter Table
  const sorter = (fieldSort, a, b) => {
    const handleDataSort = (obj) => {
      switch (fieldSort) {
        case "percentage":
          const temp = obj[fieldSort]?.toString();
          return temp.toLowerCase();
        default:
          return obj[fieldSort].label?.toLowerCase();
      }
    };
    let fa = handleDataSort(a);
    let fb = handleDataSort(b);
    return fa.localeCompare(fb);
  };

  // Columns Table
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
        required: true,
        title: "COUNTRY",
        width: 240,
        onFilter: (value, record) => onFilter("country", value, record),
        sorter: (a, b) => sorter("country", a, b),
        dataIndex: "country",
        inputType: "select",
        option: listOption,
        ...getColumnSearchProps(
          "country",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
      {
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
          handleSearch
        ),
      },
      {
        title: "ACTION",
        dataIndex: "operation",
        width: 240,
        fixed: "right",
        align: "center",
        render: (_, record) => {
          const editable = record.key === editingKey;

          return (
            <Space className="my-3 gap-2">
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
                <div className="flex w-full justify-center gap-4">
                  <Tooltip title="Edit">
                    <div>
                      <SVGIcon
                        name="IconEdit"
                        color={editingKey ? "#8D91A0" : "#ACC424"}
                        className={
                          editingKey ? "cursor-not-allowed" : undefined
                        }
                        width={24}
                        onClick={!editingKey ? () => edit(record) : undefined}
                      />
                    </div>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <div>
                      <SVGIcon
                        name="IconDelete"
                        color={!editingKey ? "#D90000" : "#8D91A0"}
                        width={24}
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
      {type !== "detail" && type !== "preview" ? (
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
        <div
          className={`${
            totalData !== 0 ? "z-[1] absolute mt-4" : "my-4"
          } w-1/4 flex`}
        >
          <Select
            mode="multiple"
            placeholder="Show All Column"
            className={"w-full"}
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
        </div>

        <Form form={formRMS} component={false}>
          <Table
            bordered
            className="w-full"
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
                  options: col.option,
                  dataEditRecord: editDataRecord,
                  handleEditDataRecord: handleEditDataRecord,
                  required: col.required,
                  validateBoolean: validateBoolean,
                  formRMS: formRMS,
                }),
              }))
            )}
            pagination={{
              position: ["topRight"],
              current: page,
              pageSize: pageSize,
              onChange: handleChange,
              className: "pr-1 w-3/4",
              style: { marginLeft: "auto", marginRight: 0 },
              showSizeChanger: true,
              showTotal: (total, range) =>
                `Showing ${range[0]} to ${range[1]} of ${total} records`,
            }}
            rowClassName={(record) => (isEditing(record) ? "editable-row" : "")}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            // scroll={scroll}
            onChange={onChange}
          />
        </Form>

        {type !== "detail" && type !== "preview" ? (
          <div className={"w-full flex flex-col mt-5 gap-2 justify-start"}>
            <span className="font-bold">Total Percentage</span>
            <span>{`${totalPercentage} / 100 %`}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default FunctionalRMSDetail;
