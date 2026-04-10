import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Select, Space, Table, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Highlighter from "react-highlight-words";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import InputComponent from "../../../../../../components/InputComponent";
import { columnsTableGLAccountInformation } from "./TableGLAccountInformation";
import { getAllGLAccount, getAllGLType } from "../../../../../../redux/slices/receipt_collection/bankSlice";
import { getColumnSearchProps } from "../../../../../../utils/getColumnSearchProps";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  children,
  options,
  required,
  handleEditDataRecord = () => {},
  formTableGL,
  allGLAccounts,
  ...restProps
}) => {
  const key = record?.key || 0;

  const rules = () => {
    if (required) {
      return [{ required: true, message: `Please input your ${title?.toLowerCase()}!` }];
    }
    return undefined;
  };

  const getInputNode = () => {
    switch (inputType) {
      case "select":
        return (
          <Select
            showSearch
            optionFilterProp="children"
            labelInValue
            filterOption={(input, option) =>
              (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
            }
          >
            {options?.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        );
      case "readonly":
        return <Input disabled />;
      case "text":
      default:
        return <InputComponent />;
    }
  };

  if (dataIndex === "operation" || dataIndex === "no") {
    return <td {...restProps}><div>{children}</div></td>;
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={inputType !== "readonly" ? rules() : undefined}
          getValueFromEvent={(e) => {
            const value = e?.target ? e.target.value : e;
            return handleEditDataRecord(value, key, dataIndex);
          }}
        >
          {getInputNode()}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const FunctionalTableGLAccountInformation = ({
  type,
  data = [],
  updateData = () => {},
  storedData = false,
  setStoredData = () => {},
  status,
  statusApproval,
}) => {
  const searchInput = useRef(null);
  const [formTableGL] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingKey, setEditingKey] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [statusAction, setStatusAction] = useState("");
  const [search, setSearch] = useState("");
  const [totalData, setTotalData] = useState(0);

  const isEditing = (record) => record.key === editingKey;

  const { dataGLAccount, dataGLType } = useSelector((state) => state.bank);
  const dispatch = useDispatch();

  useEffect(() => {
    if (type !== "detail") {
      dispatch(getAllGLAccount());
      dispatch(getAllGLType());
    }
  }, [type, dispatch]);

  const glAccountOptions = (dataGLAccount || []).map((item) => ({
    value: item?.id ?? item?.Id,
    label: item?.accountNumber ?? item?.name ?? item?.text ?? "",
    description: item?.description ?? item?.accountDescription ?? item?.desc ?? "",
  }));

  const glTypeOptions = (dataGLType || []).map((item) => ({
    value: item?.id ?? item?.Id,
    label: item?.name ?? item?.text ?? "",
  }));

  const listOption = {
    glAccount: glAccountOptions,
    glType: glTypeOptions,
  };

  const handleEditDataRecord = (value, key, dataIndex) => {
    if (dataIndex === "glAccountNumber") {
      const found = glAccountOptions.find((o) => o.value === (value?.value ?? value));
      const desc = found?.description || "";
      formTableGL.setFieldsValue({ glAccountDescription: desc });
    }
    return value;
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) setPage(1);
    setSearchedColumn(tempSearchColumn);
    setSearch(selectedKeys.length === 0 ? "" : `${dataIndex}~${selectedKeys[0]}`);
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
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

  const filterDataByPage = () => {
    let result = [...data];
    if (searchedColumn) {
      const tempSearchText = searchText.toLowerCase();
      result = result.filter((item) => {
        const val = item[searchedColumn];
        if (typeof val === "object" && val?.label) {
          return val.label.toLowerCase().includes(tempSearchText);
        }
        return (val ?? "").toString().toLowerCase().includes(tempSearchText);
      });
    }
    if (fieldSort) {
      result.sort((a, b) => {
        const fa = (a[fieldSort]?.label ?? a[fieldSort] ?? "").toString().toLowerCase();
        const fb = (b[fieldSort]?.label ?? b[fieldSort] ?? "").toString().toLowerCase();
        if (fa < fb) return orderSort === "asc" ? -1 : 1;
        if (fa > fb) return orderSort === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result.slice((page - 1) * pageSize, page * pageSize);
  };

  const edit = (record) => {
    setStoredData(true);
    setStatusAction("edit");
    formTableGL.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = (record) => {
    setEditingKey("");
    if (statusAction === "add") deleteRow(record);
    setStatusAction("");
    setStoredData(false);
  };

  const save = async (key) => {
    try {
      const row = await formTableGL.validateFields();
      const glAccountDescription = formTableGL.getFieldValue('glAccountDescription');
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        const flag =
          item?.type !== "exist" && type === "update" ? 1 :
          item?.type === "exist" && type === "update" ? 2 : undefined;
        newData.splice(index, 1, { ...item, ...row, glAccountDescription, flag });
        updateData(newData);
        setEditingKey("");
      }
      setStoredData(false);
      setStatusAction("");
      formTableGL.resetFields();
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const addRow = () => {
    formTableGL.resetFields();
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
    updateData((prev) => [...prev, newRow]);
    setEditingKey(newRow.key);
  };

  const deleteRow = (record) => {
    updateData((prev) => prev.filter((item) => item.key !== record.key));
    setStoredData(false);
  };

  const [optionSelectedCol, setOptionSelectedCol] = useState([]);
  const handleDisplayColumn = (value) => setOptionSelectedCol(value);
  const filterColumn = (dataColumn) =>
    dataColumn.filter((col) => !optionSelectedCol.includes(col.title));

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
      ...columnsTableGLAccountInformation(
        listOption,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      {
        key: "operation",
        title: "ACTION",
        dataIndex: "operation",
        width: 160,
        align: "center",
        fixed: "right",
        render: (_, record) => {
          const editable = record.key === editingKey;
          const isDelete =
            (status === "DRAFT" && statusApproval === "DRAFT") ||
            record.type !== "exist";
          return (
            <Space className="gap-2">
              {editable ? (
                <>
                  <ButtonComponent onClick={() => cancel(record)} type="default">
                    Cancel
                  </ButtonComponent>
                  <ButtonComponent onClick={() => save(record.key)} type="submit">
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
                        className={editingKey ? "cursor-not-allowed" : undefined}
                        width={24}
                        onClick={!editingKey ? () => edit(record) : undefined}
                      />
                    </div>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <div>
                      <SVGIcon
                        name="IconDelete"
                        color={isDelete && !editingKey ? "#D90000" : "#8D91A0"}
                        width={24}
                        className={
                          isDelete && !editingKey ? undefined : "disabled cursor-not-allowed"
                        }
                        onClick={
                          isDelete && !editingKey ? () => deleteRow(record) : undefined
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
    return type !== "detail" ? temp : temp.filter((col) => col.title !== "ACTION");
  };

  const onChange = (_, __, ___, extra) => {
    setTotalData(extra?.currentDataSource?.length || 0);
  };

  const numCols = columns().length;
  const scrollX = Math.min(numCols * 240, 10000);

  return (
    <div className="flex flex-col w-full gap-4">
      {type !== "detail" && (
        <div className="flex w-full justify-end">
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
            onClick={!storedData ? addRow : undefined}
            disabled={editingKey !== ""}
          >
            Create
          </ButtonComponent>
        </div>
      )}
      <div className="relative flex flex-col w-full">
        <div className={`${totalData !== 0 ? "z-[1] absolute mt-4" : "my-4"} w-1/4 flex`}>
          <Select
            mode="multiple"
            placeholder="Column Settings"
            className="w-full"
            maxTagCount={3}
            onChange={handleDisplayColumn}
          >
            {columns()
              .map((col) => (
                <Select.Option key={col.title} value={col.title}>
                  {col.title}
                </Select.Option>
              ))
              .splice(1)}
          </Select>
        </div>
        <Form form={formTableGL} component={false}>
          <Table
            bordered
            size="small"
            className="w-full"
            components={{ body: { cell: EditableCell } }}
            dataSource={filterDataByPage()}
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
                  required: col.required,
                  handleEditDataRecord,
                  formTableGL,
                  allGLAccounts: glAccountOptions,
                }),
              }))
            )}
            pagination={{
              position: ["topRight"],
              current: page,
              pageSize,
              onChange: handleChange,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `Showing ${range[0]} to ${range[1]} of ${total} records`,
            }}
            onChange={(_, __, sorter, extra) => {
              onSort(_, __, sorter);
              onChange(_, __, sorter, extra);
            }}
            scroll={{ x: scrollX }}
            rowKey="key"
            footer={() => (
              <div className="flex justify-end text-sm text-gray-500">
                Showing {data.length} of {data.length} entries &nbsp;
                <span className="text-green-600 font-medium">All data showed</span>
              </div>
            )}
          />
        </Form>
      </div>
    </div>
  );
};

export default FunctionalTableGLAccountInformation;
