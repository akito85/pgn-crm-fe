import React, { useEffect, useRef, useState } from "react";
import { Form, Select, Space, Table, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import InputComponent from "../../../../../../components/InputComponent";
import { columnsTableCategoryInformation } from "./TableCategoryInformation";
import FunctionalTableDetailBillingItem from "./FunctionalTableDetailBillingItem";
import {
  getBillingItemOptionsByCategory,
  getDisplayOptions,
  getNomenklatur1Options,
  getNomenklatur2Options,
  getVACategoryOptions,
} from "../../../../../../redux/slices/receipt_collection/bankSlice";
import Highlighter from "react-highlight-words";

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
          rules={rules()}
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

const FunctionalTableCategoryInformation = ({
  type,
  data = [],
  updateData = () => {},
  storedData = false,
  setStoredData = () => {},
  status,
  statusApproval,
  headerCategory = "",
}) => {
  const searchInput = useRef(null);
  const [formTableCat] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingKey, setEditingKey] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [statusAction, setStatusAction] = useState("");
  const [totalData, setTotalData] = useState(0);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [optionSelectedCol, setOptionSelectedCol] = useState([]);

  const isEditing = (record) => record.key === editingKey;

  const { data_va_category, data_nomenklatur1, data_nomenklatur2, data_display } =
    useSelector((state) => state.bank);
  const dispatch = useDispatch();

  useEffect(() => {
    if (type !== "detail") {
      dispatch(getVACategoryOptions());
      dispatch(getNomenklatur1Options());
      dispatch(getNomenklatur2Options());
      dispatch(getDisplayOptions());
    }
  }, [type, dispatch]);

  const vaCategoryOptions = (data_va_category || []).map((item) => ({
    value: item?.id ?? item?.Id,
    label: item?.name ?? item?.text ?? "",
  }));

  // Filter category options based on header category selection
  const filteredCategoryOptions = vaCategoryOptions.filter((opt) => {
    if (headerCategory === "Virtual Account") return opt.label.toUpperCase().startsWith("VA");
    if (headerCategory === "Online Payment") return opt.label.toUpperCase().startsWith("OP");
    return true;
  });

  // Collect category values already used across all existing rows
  const usedCategoryValues = data.map((row) => {
    const cat = row.category;
    return cat?.value ?? cat;
  }).filter(Boolean);

  // For new rows: exclude ALL already-used category types
  const categoryOptionsForNewRow = filteredCategoryOptions.filter(
    (opt) => !usedCategoryValues.includes(opt.value)
  );

  // Disable Create button when every category type already has a row
  const allCategoriesUsed = filteredCategoryOptions.length > 0 && categoryOptionsForNewRow.length === 0;

  const nomenklatur1Options = (data_nomenklatur1 || []).map((item) => ({
    value: item?.id ?? item?.Id,
    label: item?.name ?? item?.text ?? "",
  }));
  const nomenklatur2Options = (data_nomenklatur2 || []).map((item) => ({
    value: item?.id ?? item?.Id,
    label: item?.name ?? item?.text ?? "",
  }));
  const displayOptions = (data_display || []).map((item) => ({
    value: item?.id ?? item?.Id,
    label: item?.name ?? item?.text ?? "",
  }));

  const listOption = {
    vaCategory: filteredCategoryOptions,
    nomenklatur1: nomenklatur1Options,
    nomenklatur2: nomenklatur2Options,
    display: displayOptions,
  };

  const handleEditDataRecord = (value, key, dataIndex) => value;

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) setPage(1);
    setSearchedColumn(tempSearchColumn);
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
    formTableCat.setFieldsValue({ ...record });
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
      const row = await formTableCat.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        const flag =
          item?.type !== "exist" && type === "update" ? 1 :
          item?.type === "exist" && type === "update" ? 2 : undefined;
        newData.splice(index, 1, { ...item, ...row, flag });
        updateData(newData);
        setEditingKey("");
      }
      setStoredData(false);
      setStatusAction("");
      formTableCat.resetFields();
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const addRow = () => {
    formTableCat.resetFields();
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
      details: [],
    };
    updateData((prev) => [...prev, newRow]);
    setEditingKey(newRow.key);
  };

  const deleteRow = (record) => {
    updateData((prev) => prev.filter((item) => item.key !== record.key));
    setStoredData(false);
  };

  const updateRowDetails = (rowKey, newDetails) => {
    updateData((prev) =>
      prev.map((item) =>
        item.key === rowKey ? { ...item, details: newDetails } : item
      )
    );
  };

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
      ...columnsTableCategoryInformation(
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
  const scrollX = Math.min(numCols * 200, 10000);

  return (
    <div className="flex flex-col w-full gap-4">
      {type !== "detail" && (
        <div className="flex w-full justify-end">
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
            onClick={!storedData && !allCategoriesUsed ? addRow : undefined}
            disabled={editingKey !== "" || allCategoriesUsed}
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
        <Form form={formTableCat} component={false}>
          <Table
            bordered
            size="small"
            className="w-full"
            components={{ body: { cell: EditableCell } }}
            dataSource={filterDataByPage()}
            rowKey="key"
            expandable={{
              expandedRowKeys,
              onExpandedRowsChange: setExpandedRowKeys,
              expandIcon: ({ expanded, onExpand, record }) => (
                <button
                  type="button"
                  onClick={(e) => onExpand(record, e)}
                  className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded text-gray-600 hover:text-blue-500 hover:border-blue-400 bg-white"
                  style={{ fontSize: "14px", fontWeight: "bold" }}
                >
                  {expanded ? "−" : "+"}
                </button>
              ),
              expandedRowRender: (record) => (
                <FunctionalTableDetailBillingItem
                  data={record.details || []}
                  updateData={(newDetails) => {
                    const resolved =
                      typeof newDetails === "function"
                        ? newDetails(record.details || [])
                        : newDetails;
                    updateRowDetails(record.key, resolved);
                  }}
                  type={type}
                  status={status}
                  statusApproval={statusApproval}
                />
              ),
            }}
            columns={filterColumn(
              columns().map((col) => ({
                ...col,
                onCell: (record) => {
                  let options = col.option;
                  if (col.dataIndex === "category" && record.key === editingKey) {
                    if (statusAction === "add") {
                      // New row: hide all already-used category types
                      options = categoryOptionsForNewRow;
                    } else if (statusAction === "edit") {
                      // Editing row: hide categories used by OTHER rows only
                      const otherUsedValues = data
                        .filter((row) => row.key !== record.key)
                        .map((row) => {
                          const cat = row.category;
                          return cat?.value ?? cat;
                        })
                        .filter(Boolean);
                      options = filteredCategoryOptions.filter(
                        (opt) => !otherUsedValues.includes(opt.value)
                      );
                    }
                  }
                  return {
                    record,
                    inputType: col.inputType,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: isEditing(record),
                    options,
                    required: col.required,
                    handleEditDataRecord,
                  };
                },
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
            onChange={(p, f, sorter, extra) => {
              onSort(p, f, sorter);
              onChange(p, f, sorter, extra);
            }}
            scroll={{ x: scrollX }}
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

export default FunctionalTableCategoryInformation;
