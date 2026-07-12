import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../../utils/getColumnSearchProps";
import { Form, Input, InputNumber, Select, Table, Tooltip } from "antd";
import {
  getListChargingMethod,
  getListNameProductDetail,
  getListPaymentType,
  getListUnit,
} from "../../../../../../redux/slices/product_promo/product";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import SelectComponent from "../../../../../../components/SelectComponent";
import { hasValue, renderColumn, requiredMessage } from "../../../../../../utils";
import InputComponent from "../../../../../../components/InputComponent";
import NxTable from "../../../../../../components/Nx/NxTable";

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
    } else if (dataIndex === "unit") {
      rule.push({
        required: dataEditRecord[key + dependDataIndex]?.isParent,
        message: `Please input your ${title.toLowerCase()}!`,
      });
    } else if (dataIndex === "value") {
      rule.push({
        required: !dataEditRecord[key + dependDataIndex]?.isParent,
        message: `Please input your ${title.toLowerCase()}!`,
      });
    }
    return rule.length !== 0 ? rule : undefined;
  };

  const filterOption = (input, option) =>
    option.props.children.toLowerCase().includes(input.toLowerCase());

  const dependentData = () => {
    if (!dataEditRecord[key + dependDataIndex]?.isParent) { //options.length === 0
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
            disabled={dependDataIndex ? dependentData() : false}
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

const excludeOptionName = [214, 210];
const PDIProductDetailForm = ({
  type,
  dispatch = () => {},
  dataTable = [],
  updateTable = () => {},
  updateBody = () => {},
  storedData = false,
  setStoredData = () => {},
}) => {
  const searchInput = useRef(null);
  const [formTable] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingKey, setEditingKey] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [editDataRecord, setEditDataRecord] = useState({});
  const [statusAction, setStatusAction] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const [totalData, setTotalData] = useState(0);
  const {
    dataListPaymentType,
    dataListChargeMethod,
    dataListNameProductDetail = [],
    dataListUnit = [],
  } = useSelector((state) => state.product);
  const exludeExisting =
    dataTable.length > 0 ? dataTable.map((item) => item?.name?.value) : [];
  const listName = dataListNameProductDetail.filter(
    (item) => ![...excludeOptionName, ...exludeExisting].includes(item.value)
  );
  const [search, setSearch] = useState({});
  const { data: dataUser = {} } = useSelector((state) => state.profile);

  useEffect(() => {
    setTotalData(dataTable.length);
  }, [dataTable]);
  useEffect(() => {
    dispatch(getListPaymentType());
    dispatch(getListChargingMethod());
    dispatch(getListNameProductDetail());
  }, [dispatch]);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };
  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const handleEditDataRecord = (data, key, index) => {
    const keyName = key + index;
    const value = index === "description" ? data.target.value : data;
    if(index === "name") {
      formTable.resetFields(["unit","value"])
    }
    setEditDataRecord((prevState) => {
      return {
        ...prevState,
        [keyName]: index === "name" ? {
          ...value,
          isParent: dataListNameProductDetail.find(
            (item) => item.value === value?.value
          )?.isParent,
        }: value,
      };
    });
    if (index === `name`) {
      const temp = dataListNameProductDetail.filter(
        (item) => item.value === data?.value
      );
      // console.log(temp);
      if (temp.length > 0) {
        dispatch(getListUnit({ id: temp[0].id }));
        formTable.resetFields(["unit"]);
      }
    }
    return value;
  };
  const edit = (record, field) => {
    setStoredData(true);
    setStatusAction("edit");
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
                    isParent: dataListNameProductDetail.find(
                      (item) => item.value === tempData?.value
                    )?.isParent || false,
                  }
                : tempData,
          };
        });
      }
    }
    setEditingKey(record.key);
    if (record?.name && record?.name?.value) {
      const temp = dataListNameProductDetail.filter(
        (item) => item.value === record?.name?.value
      );
      if (temp.length > 0) {
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
    updateTable((prevData) => [...prevData, newRow]);
    setEditingKey(newRow.key);
  };

  const deleteRow = (record) => {
    updateTable((prevState) =>
      prevState.filter((item) => item.key !== record.key)
    );
    setStoredData(false);
  };

  const columns = () => {
    const temp = [
      {
        title: "NO",
        key: "no",
        width: 60,
        dataIndex: "no",
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "NAME",
        key: "name",
        width: 240,
        dataIndex: "name",
        filteredValue: search?.["name"]
        ? [search?.["name"]]
        : null,
        // onFilter: (value, record) => onFilter("name", value, record),
        sorter: (a, b) => sorter("name", a, b),
        options: listName,
        inputType: "select",
        required: { required: true, message: "Please input your" },
        // ...getColumnSearchPropsCriteria(
        //   "name",
        //   searchInput,
        //   searchedColumn,
        //   searchText,
        //   handleSearch
        // ),
        ...getColumnSearchPropsUseFilteredValueFE(
          search,
          "name",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "input",
          storedData
        ),
        render: (text) =>
          renderColumn(
            "name",
            hasValue(search["name"]),
            searchText,
            text?.label,
            false,
            "input",
            search
          ),
      },
      {
        title: "VALUE",
        key: "value",
        width: 240,
        dataIndex: "value",
        filteredValue: search?.["value"]
        ? [search?.["value"]]
        : null,
        // onFilter: (value, record) => onFilter("value", value, record),
        sorter: (a, b) => sorter("value", a, b),
        align: "right",
        inputType: "number",
        dependDataIndex: "name",
        // ...getColumnSearchPropsPaging(
        //   "value",
        //   searchInput,
        //   searchedColumn,
        //   searchText,
        //   handleSearch
        // ),
        ...getColumnSearchPropsUseFilteredValueFE(
          search,
          "value",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "input",
          storedData
        ),
        render: (text) =>
          renderColumn(
            "value",
            hasValue(search["value"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        title: "UNIT",
        key: "unit",
        width: 240,
        align: "center",
        dataIndex: "unit",
        filteredValue: search?.["unit"]
        ? [search?.["unit"]]
        : null,
        // onFilter: (unit, record) => onFilter("unit", unit, record),
        sorter: (a, b) => sorter("unit", a, b),
        options: dataListUnit,
        inputType: "select",
        dependDataIndex: "name",
        // ...getColumnSearchPropsCriteria(
        //   "unit",
        //   searchInput,
        //   searchedColumn,
        //   searchText,
        //   handleSearch
        // ),
        ...getColumnSearchPropsUseFilteredValueFE(
          search,
          "unit",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "input",
          storedData
        ),
        render: (text) =>
          renderColumn(
            "unit",
            hasValue(search["unit"]),
            searchText,
            text?.label,
            false,
            "input",
            search
          ),
      },
      {
        title: "DESCRIPTION",
        key: "description",
        width: 240,
        dataIndex: "description",
        filteredValue: search?.["description"]
        ? [search?.["description"]]
        : null,
        // onFilter: (value, record) => onFilter("description", value, record),
        sorter: (a, b) => sorter("description", a, b),
        inputType: "description",
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsUseFilteredValueFE(
          search,
          "description",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "input",
          storedData
        ),
        render: (text) =>
          renderColumn(
            "description",
            hasValue(search["description"]),
            searchText,
            text,
            true,
            "input",
            search
          ),
        // ...getColumnSearchPropsPaging(
        //   "description",
        //   searchInput,
        //   searchedColumn,
        //   searchText,
        //   handleSearch,
        //   true
        // ),
        // render: (text) => {
        //   if (searchedColumn === "description") {
        //     return (
        //       <Tooltip placement="topLeft" title={text}>
        //         <Highlighter
        //           highlightStyle={{
        //             backgroundColor: "#ffc069",
        //             padding: 0,
        //           }}
        //           searchWords={[searchText]}
        //           autoEscape
        //           textToHighlight={text ? text.toString() : ""}
        //         />
        //       </Tooltip>
        //     );
        //   } else {
        //     if (text) {
        //       return (
        //         <Tooltip placement="topLeft" title={text}>
        //           {text}
        //         </Tooltip>
        //       );
        //     }
        //     return "";
        //   }
        // },
      },
      {
        title: "ACTION",
        key: "operation",
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
                    <div
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
                    </div>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <div
                      className={`flex justify-center${
                        record.typeData === "exist" || editingKey
                          ? " cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <SVGIcon
                        name="IconDelete"
                        color={
                          record.typeData !== "exist" && !editingKey
                            ? "#D90000"
                            : "#8D91A0"
                        }
                        width={24}
                        className={
                          record.typeData === "exist" || editingKey
                            ? "disabled"
                            : undefined
                        }
                        onClick={
                          record.typeData !== "exist" && !editingKey
                            ? () => deleteRow(record)
                            : undefined
                        }
                      />
                    </div>
                  </Tooltip>
                </>
              )}
            </div>
          );
        },
      },
    ];
    return type !== "preview"
      ? temp
      : temp.filter((col) => col.title !== "ACTION");
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

  const onChange = (_, __, ___, extra) => {
    setTotalData(extra?.currentDataSource?.length || 0);
  };

  return (
    <div className="flex flex-col w-full gap-4">
      {type !== "preview" ? (
        <>
          <div className="flex w-full justify-end">
            <ButtonComponent
              icon={<SVGIcon name="IconButtonCreate" width={24} />}
              type="submit"
              onClick={!storedData ? addRow : undefined}
            >
              Create
            </ButtonComponent>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            <Form.Item
              name={"paymentType"}
              rules={[{ message: requiredMessage("Payment Type"), required: true }]}
              className="no-margin-form w-full"
              getValueFromEvent={(e) => updateBody(e, "paymentType")}
              label={"Payment Type"}
              required
            >
              <SelectComponent>
                {(dataListPaymentType || []).map((data, index) => (
                  <Select.Option key={index} value={data.value}>
                    {data.label}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>
            <Form.Item
              name={"chargingMethod"}
              rules={[{ message: requiredMessage("Charging Method"), required: true }]}
              className="no-margin-form w-full"
              getValueFromEvent={(e) => updateBody(e, "chargingMethod")}
              label={"Charging Method"}
              required
            >
              <SelectComponent>
                {(dataListChargeMethod || []).map((data, index) => (
                  <Select.Option key={index} value={data.value}>
                    {data.label}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>
          </div>
        </>
      ) : null}

      <div className={"relative flex flex-col w-full"}>
        {/* <div
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
        </div> */}
        <Form form={formTable} component={false}>
          <NxTable
            idTable={"product-detail-table"}
            userId={dataUser?.data?.username}
            showAdvanceSearch={false}
            showSearchBar={false}
            usePagination={false}
            dataSource={dataTable}
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
                  required: col.required,
                  dataEditRecord: editDataRecord,
                  handleEditDataRecord: handleEditDataRecord,
                }),
              }))
            )}
            pagination={{
              position: ["topRight"],
              current: page,
              pageSize: pageSize,
              onChange: handleChangeSize,
              className: "pr-1 w-3/4",
              style: { marginLeft: "auto", marginRight: 0 },
              showSizeChanger: true,
              showTotal: (total, range) =>
                `Showing ${range[0]} to ${range[1]} of ${total} records`,
            }}
            rowClassName={(record) => (isEditing(record) ? "editable-row" : "")}
            scroll={{
              x: 1500,
              y: 300,
            }}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            onChange={onChange}
          />
        </Form>
      </div>
    </div>
  );
};

export default PDIProductDetailForm;
