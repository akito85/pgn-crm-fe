import { Form, Input, InputNumber, Select, Tooltip } from "antd";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

import ButtonComponent from "../../../../../../components/ButtonComponent";
import InputComponent from "../../../../../../components/InputComponent";
import NxTable from "../../../../../../components/Nx/NxTable";
import SVGIcon from "../../../../../../assets/Icon/index";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../../utils/getColumnSearchProps";

const getComparableText = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "object") {
    return (value.label || value.value || "").toString().toLowerCase();
  }

  return value.toString().toLowerCase();
};

const getDefaultFixedColumns = () => ({ right: [], left: [] });

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  children,
  options = [],
  required,
  disabled,
  dependDataIndex,
  dataEditRecord,
  handleEditDataRecord = () => {},
  ...restProps
}) => {
  const key = record?.key || 0;
  const dataDepend = dependDataIndex ? dataEditRecord[key + dependDataIndex] : "";

  const rules = () => {
    const rule = [];
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

  const getInputNode = () => {
    switch (inputType) {
      case "select":
        return (
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={filterOption}
            labelInValue
            disabled={dependDataIndex ? !dataDepend : disabled}
          >
            {options.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        );
      case "number":
        return <InputNumber type="number" controls={false} style={{ width: "100%" }} />;
      case "description":
        return <Input.TextArea rows={1} maxLength={255} />;
      default:
        return <InputComponent />;
    }
  };

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
          style={{ margin: 0 }}
          valuePropName="value"
          rules={rules()}
          getValueFromEvent={(value) => handleEditDataRecord(value, key, dataIndex)}
        >
          {getInputNode()}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const TableDetailTos = ({
  type,
  dataTable = [],
  updateTable = () => {},
  storedData = false,
  setStoredData = () => {},
  editDetail = true,
}) => {
  const searchInput = useRef(null);
  const [formTable] = Form.useForm();
  const [loadedCount, setLoadedCount] = useState(20);
  const [displayData, setDisplayData] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [statusAction, setStatusAction] = useState("");
  const [editDataRecord, setEditDataRecord] = useState({});
  const [fixedColumns, setFixedColumns] = useState(getDefaultFixedColumns);

  const { dataListTosAttribute = [], dataListUnitTos = [], dataListFromItem = [] } = useSelector(
    (state) => state.product
  );

  const { data: dataUser = {} } = useSelector((state) => state.profile);

  const isEditing = useCallback((record) => record.key === editingKey, [editingKey]);

  const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    const nextValue = selectedKeys[0];
    setSearchText(nextValue);
    setSearchedColumn(nextValue ? dataIndex : "");
    setSearch((prevState) => ({
      ...prevState,
      [dataIndex]: nextValue,
    }));
    setLoadedCount(20);
  }, []);

  const handleSort = useCallback((_, __, sorter) => {
    if (!sorter?.order) {
      setFieldSort("");
      setOrderSort("");
      setLoadedCount(20);
      return;
    }

    setFieldSort(sorter.field);
    setOrderSort(sorter.order);
    setLoadedCount(20);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!hasMore) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      setLoadedCount((prevValue) => prevValue + 20);
      resolve();
    });
  }, [hasMore]);

  const handleEditDataRecord = (data, key, index) => {
    const keyName = key + index;
    const value = index === "description" ? data.target.value : data;

    setEditDataRecord((prevState) => ({
      ...prevState,
      [keyName]: value,
    }));

    return value;
  };

  const edit = useCallback((record) => {
    setStoredData(true);
    setStatusAction("edit");
    formTable.setFieldsValue(record);
    setEditingKey(record.key);
  }, [formTable, setStoredData]);

  const deleteRow = useCallback((record) => {
    updateTable((prevState) => prevState.filter((item) => item.key !== record.key));
  }, [updateTable]);

  const cancel = useCallback((record) => {
    setStoredData(false);
    setEditingKey("");
    if (statusAction === "add") {
      deleteRow(record);
    }
    setStatusAction("");
  }, [deleteRow, setStoredData, statusAction]);

  const save = useCallback(async (key) => {
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
      setStatusAction("");
      setStoredData(false);
      formTable.resetFields();
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  }, [dataTable, formTable, setStoredData, updateTable]);

  const processedData = useMemo(() => {
    let tempData = [...dataTable];

    Object.entries(search).forEach(([searchKey, searchValue]) => {
      if (!searchValue && searchValue !== 0) {
        return;
      }

      const normalizedValue = searchValue.toString().toLowerCase();
      tempData = tempData.filter((item) => {
        const recordValue = getComparableText(item[searchKey]);
        return recordValue.includes(normalizedValue);
      });
    });

    if (fieldSort && orderSort) {
      tempData.sort((a, b) => {
        const valueA = getComparableText(a[fieldSort]);
        const valueB = getComparableText(b[fieldSort]);
        if (orderSort === "ascend") {
          return valueA.localeCompare(valueB, undefined, { numeric: true });
        }
        return valueB.localeCompare(valueA, undefined, { numeric: true });
      });
    }

    return tempData;
  }, [dataTable, fieldSort, orderSort, search]);

  useEffect(() => {
    setDisplayData(processedData.slice(0, loadedCount));
    setHasMore(loadedCount < processedData.length);
  }, [loadedCount, processedData]);

  const baseColumns = useMemo(() => {
    const isPreview = type === "preview";

    const columns = [
      {
        title: "NO",
        width: 60,
        dataIndex: "no",
        key: "no",
        align: "center",
        render: (text, object, index) => index + 1,
      },
      {
        title: "ATTRIBUTE",
        width: 240,
        dataIndex: "attribute",
        key: "attribute",
        sorter: true,
        options: dataListTosAttribute,
        inputType: "select",
        disabled: true,
        required: { required: true, message: "Please input your" },
        ...getColumnSearchPropsUseFilteredValueFE(
          search,
          "attribute",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "input"
        ),
        render: (value) => value?.label || "-",
      },
      {
        title: "VALUE",
        width: 240,
        dataIndex: "value",
        key: "value",
        sorter: true,
        inputType: "number",
        align: "right",
        ...getColumnSearchPropsUseFilteredValueFE(
          search,
          "value",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "input"
        ),
      },
      {
        title: "UNIT",
        width: 240,
        dataIndex: "unit",
        key: "unit",
        sorter: true,
        options: dataListUnitTos,
        inputType: "select",
        dependDataIndex: "attribute",
        ...getColumnSearchPropsUseFilteredValueFE(
          search,
          "unit",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "input"
        ),
        render: (value) => value?.label || "-",
      },
      {
        title: "FROM ITEM",
        width: 240,
        dataIndex: "fromItem",
        key: "fromItem",
        sorter: true,
        options: dataListFromItem,
        inputType: "select",
        ...getColumnSearchPropsUseFilteredValueFE(
          search,
          "fromItem",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "input"
        ),
        render: (value) => value?.label || "-",
      },
      {
        title: "ACTION",
        width: 180,
        key: "operation",
        dataIndex: "operation",
        fixed: "right",
        render: (_, record) => {
          const editable = isEditing(record);
          const isConfigurable = record?.attribute?.label === "Configurable";
          const disableEdit = !editDetail || isConfigurable || !!editingKey;

          if (editable) {
            return (
              <div className="flex w-full justify-center my-1 gap-2">
                <ButtonComponent onClick={() => cancel(record)} type="default">
                  Cancel
                </ButtonComponent>
                <ButtonComponent onClick={() => save(record.key)} type="submit">
                  Save
                </ButtonComponent>
              </div>
            );
          }

          return (
            <div className="flex w-full justify-center my-1 gap-2">
              <Tooltip title="Edit">
                <div className={`flex justify-center${disableEdit ? " cursor-not-allowed" : ""}`}>
                  <SVGIcon
                    name="IconEdit"
                    color={disableEdit ? "#8D91A0" : "#ACC424"}
                    width={24}
                    onClick={!disableEdit ? () => edit(record) : undefined}
                  />
                </div>
              </Tooltip>
            </div>
          );
        },
      },
    ];

    return isPreview ? columns.filter((column) => column.key !== "operation") : columns;
  }, [
    dataListFromItem,
    dataListTosAttribute,
    dataListUnitTos,
    editDetail,
    editingKey,
    handleSearch,
    isEditing,
    search,
    searchedColumn,
    searchText,
    type,
    cancel,
    edit,
    save,
  ]);

  const mappedColumns = useMemo(
    () =>
      baseColumns.map((column) => ({
      ...column,
      key: column.key || column.dataIndex || column.title,
      })),
    [baseColumns]
  );

  const columnDefinitions = useMemo(
    () =>
      mappedColumns.map((column) => ({
        key: column.key,
        title: column.title,
      })),
    [mappedColumns]
  );

  return (
    <Form form={formTable} component={false}>
      <NxTable
        idTable="tos-detail-table"
        userId={dataUser?.data?.username}
        dataSource={displayData}
        totalData={processedData.length}
        columns={mappedColumns.map((column) => ({
          ...column,
          onCell: (record) => ({
            record,
            inputType: column.inputType,
            dataIndex: column.dataIndex,
            title: column.title,
            editing: isEditing(record),
            dependDataIndex: column.dependDataIndex,
            options: column.options,
            required: column.required,
            dataEditRecord: editDataRecord,
            disabled: column.disabled,
            handleEditDataRecord,
          }),
          shouldCellUpdate: (record, prevRecord) => record !== prevRecord,
        }))}
        columnDefinitions={columnDefinitions}
        fixedColumns={fixedColumns}
        setFixedColumns={setFixedColumns}
        onClearPreferences={() => setFixedColumns(getDefaultFixedColumns())}
        onSort={handleSort}
        usePagination={false}
        useInfiniteScroll={true}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        loadMoreThreshold={2}
        tableScrolled={{ x: "max-content", y: 300 }}
        showAdvanceSearch={false}
        showSearchBar={false}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
      />
    </Form>
  );
};

export default TableDetailTos;
