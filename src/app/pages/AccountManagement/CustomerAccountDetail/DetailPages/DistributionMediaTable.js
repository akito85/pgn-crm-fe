import { Form, Input, Pagination, Select, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import SVGIcon from "../../../../../assets/Icon/index";
import { useRef } from "react";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { DistributionMediaTableColumn } from "./DistributionMediaTableColumn";
import InputComponent from "../../../../../components/InputComponent";

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
  handleEditDataRecord = () => {},
  ...restProps
}) => {
  const key = record?.key || 0;
  const optionFilter = () => {
    const dataDependent = dataEditRecord[key + dependDataIndex];
    return dataDependent
      ? options.filter((item) => item.value === dataDependent.value)
      : [];
  };
  const optionsFix = dependDataIndex ? optionFilter() : options;

  const getInputNode = (inputType, options) => {
    switch (inputType) {
      case "select":
        return (
          <Select labelInValue>
            {options.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        );

      default:
        return <InputComponent />;
    }
  };
  const inputNode = getInputNode(inputType, optionsFix);

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

const DistributionMediaTable = ({
  type,
  data = [],
  dataCriteria = [],
  updateData = () => {},
}) => {
  const searchInput = useRef(null);
  const [formTableCriteria] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);
  const [editingKey, setEditingKey] = useState("");
  const [storedDate, setStoredData] = useState(false);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [editDataRecord, setEditDataRecord] = useState({});
  const isEditing = (record) => record.key === editingKey;

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

  useEffect(() => {
    if (data.length > 0) {
      setTotalElement(data.length);
    }
  }, [data]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleChange = (page) => {
    setPage(page);
  };

  const handleChangeSize = (page = 1, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const edit = (record, field) => {
    formTableCriteria.setFieldsValue(record);
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await formTableCriteria.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        const updatedRow = { ...item, ...row };
        newData.splice(index, 1, updatedRow);
        updateData(newData);
        setEditingKey("");
      }
      // else {
      //   newData.push(row);
      //   updateData(newData);
      //   setEditingKey("");
      // }
      setStoredData(false);
      formTableCriteria.resetFields();
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const addRow = () => {
    formTableCriteria.resetFields();
    setStoredData(true);
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
  };

  const deleteRow = (record) => {
    updateData((prevState) =>
      prevState.filter((item) => item.key !== record.key),
    );
    setStoredData(false);
  };

  const columns = () => {
    const temp = [
      {
        title: "NO",
        width: 100,
        dataIndex: "no",
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      ...DistributionMediaTableColumn(
        {},
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      {
        title: "ACTIONS",
        dataIndex: "operation",
        render: (_, record) => {
          const editable = record.key === editingKey;
          return (
            <div className="flex w-full justify-center my-3 gap-2">
              {editable ? (
                <>
                  <ButtonComponent onClick={cancel} type="default">
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
                    <span className="flex justify-center">
                      <SVGIcon
                        name="IconEdit"
                        width={24}
                        onClick={() => edit(record)}
                      />
                    </span>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <span
                      className={`flex justify-center${
                        record.typeData === "exist" ? " cursor-not-allowed" : ""
                      }`}
                    >
                      <SVGIcon
                        name="IconDelete"
                        width={24}
                        className={
                          record.typeData === "exist" ? "disabled" : undefined
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
            </div>
          );
        },
      },
    ];
    const filterCol =
      type !== "detail" ? temp : temp.filter((col) => col.title !== "ACTIONS");
    return filterCol.filter((col) =>
      col.title !== "NO" && col.title !== "ACTIONS"
        ? dataCriteria.includes(col.indexValue)
        : true,
    );
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
  return dataCriteria && dataCriteria.length > 0 && dataCriteria[0] !== 24 ? (
    <div className="flex flex-col w-full gap-4">
      {type !== "detail" ? (
        <div className="flex w-full justify-end">
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
            onClick={!storedDate ? addRow : undefined}
          >
            Create
          </ButtonComponent>
        </div>
      ) : null}
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
          total={totalElements}
          className={"pr-1"}
          showSizeChanger
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          onShowSizeChange={handleChangeSize}
          showTotal={(total, range) =>
            `Showing ${range[0]} to ${range[1]} of ${total} records`
          }
        />
      </div>
      <Form form={formTableCriteria} component={false}>
        <Table
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
                options: col.options,
                indexValue: col.indexValue,
                dependDataIndex: col.dependDataIndex,
                dataEditRecord: editDataRecord,
                handleEditDataRecord: handleEditDataRecord,
              }),
            })),
          )}
          rowClassName={(record) => (isEditing(record) ? "editable-row" : "")}
          scroll={{ y: 525, x: true }}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
        />
      </Form>
    </div>
  ) : null;
};

export default DistributionMediaTable;
