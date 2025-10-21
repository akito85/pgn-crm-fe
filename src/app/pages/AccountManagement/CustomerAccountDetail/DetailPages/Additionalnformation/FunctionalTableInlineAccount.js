import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import { Form, Input, Select, Table } from "antd";
import { dateFormatting, hasValue } from "../../../../../../utils";
import DateComponent from "../../../../../../components/DateComponent";
import { NumericFormat } from "react-number-format";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import DetailText from "../../../../../../components/DetailText";
import CardComponent from "../../../../../../components/Card/CardComponent";
import { dataDependAdvanced } from "../../../Utils";
import { useColumnActionPermissionAccountInline } from "../../../ComponentAccount/useColumnActionPermissionAccountInline";
import ToolbarAcountInline from "../../../ComponentAccount/ToolbarAcountInline";

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
  formTable,
  startDate,
  handleEditDataRecord = () => {},
  ...restProps
}) => {
  const key = record?.key || 0;

  const disabledCondition = (dependDataIndex, dataIndex, record) => {
    return dataDependAdvanced(dependDataIndex, key, dataEditRecord);
  };

  const rules = (dataIndex) => {
    let rules = [];
    if (required) {
      rules.push({
        required: required === undefined || required === false ? false : true,
        message: `Please input your ${title.toLowerCase()}!`,
      });
    }
    return rules.length !== 0 ? rules : undefined;
  };

  const endDateValidator = (startDate) => (_, value) => {
    const momentStartDate = moment(startDate);
    const momentEndDate = moment(value);

    if ((value && momentStartDate <= momentEndDate) || !value) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error("End Date must be after Start Date"));
    }
  };

  const handleDisableDate = (current) => {
    if (dataIndex === "endDate") {
      if (formTable.getFieldValue().startDate !== null) {
        return moment(formTable.getFieldValue().startDate) > current;
      }
    } else if (dataIndex === "startDate") {
      return moment(startDate) > current;
    } else {
      return moment().add(-1, "days") >= current;
    }
  };

  const getInputNode = (inputType) => {
    switch (inputType) {
      case "select":
        return (
          <Select
            showSearch
            allowClear
            optionFilterProp="children"
            labelInValue
            disabled={disabledCondition(dependDataIndex, dataIndex, record)}
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
      case "dynamic":
        return dataEditRecord[key + dependDataIndex]?.isAnyChild ? (
          <Select
            showSearch
            allowClear
            optionFilterProp="children"
            labelInValue
            disabled={disabledCondition(dependDataIndex, dataIndex, record)}
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
        ) : (
          <Input
            disabled={disabledCondition(dependDataIndex, dataIndex, record)}
          />
        );
      case "startDate":
        return (
          <DateComponent
            onChange={(e) => {
              formTable.resetFields(["endDate"]);
            }}
            dateDisable={handleDisableDate}
          />
        );

      case "endDate":
        return (
          <DateComponent
            disabled={formTable.getFieldValue()?.startDate === null}
            dateDisable={handleDisableDate}
          />
        );
      case "number":
        return (
          <NumericFormat
            allowNegative={false}
            className={"text-right custom-focus w-full"}
            decimalScale={2}
            fixedDecimalScale={true}
            thousandSeparator={","}
            decimalSeparator={"."}
            disabled={disabledCondition(dependDataIndex, dataIndex, record)}
            style={{
              borderRadius: "6px",
              boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
              padding: "4px 12px",
              border: "1px solid  #d9d9d9",
              height: "32px",
            }}
          />
        );
      default:
        return (
          <Input
            disabled={disabledCondition(dependDataIndex, dataIndex, record)}
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
          rules={
            inputType !== "endDate"
              ? rules(dataIndex)
              : [
                  {
                    validator: (_, value) =>
                      endDateValidator(formTable.getFieldValue().startDate)(
                        _,
                        value,
                      ),
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

const FunctionalTableInlineAccount = ({
  path,
  data = [],
  updateData = () => {},
  columnsTable = [], //columns for criteria
  columnsActionTable = [],
  selectorColumn = "accountManagement",
  formTable,
  editDataRecord,
  save = () => {},
  edit = () => {},
  deleted = () => {},
  handleEditDataRecord = () => {},
  listOption = {},
  setEditingKey,
  editingKey,
  setStoredData = () => {},
  storedData = () => {},
  setStatusAction = () => {},
  statusAction = "",
  startDate,
  checkStartDate = false,
  headerInformation = "",
  detailView,
}) => {
  // Declaration
  const dispatch = useDispatch();

  const searchInput = useRef(null);
  const isEditing = (record) => record.key === editingKey;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  const [modalHistory, setModalHistory] = useState(false);
  const [modalRequired, setModalRequired] = useState(false);
  const [dataHistory, setDataHistory] = useState(false);

  // Use Effect
  useEffect(() => {
    setTotalData(data.length || 0);
  }, [data]);

  useEffect(() => {
    if (editingKey !== "") {
      const dispatchedUrls = new Set();
      [...columnsTable()]?.forEach((element) => {
        if (
          hasValue(element?.url) &&
          !hasValue(element?.dependDataIndex) &&
          (!hasValue(element?.option) || element?.option?.length < 1)
        ) {
          if (dispatchedUrls.has(element?.url)) {
            dispatchedUrls.add(element?.url);
          } else {
            dispatch(element?.url);
          }
        }
      });
    }
  }, [columnsTable, dispatch, editingKey]);

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
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
    // })
  };

  // Handle Change page and pageSize
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  // Function Delete Row
  const deleteRow = (record) => {
    updateData((prevState) =>
      prevState.filter((item) => item.key !== record.key),
    );
    setStoredData(false);
  };

  // Function Cancel Data
  const cancel = useCallback(
    (record) => {
      setEditingKey("");
      if (statusAction === "add") {
        deleteRow(record);
      }
      setStatusAction("");
      setStoredData(false);
    },
    [deleteRow, setStoredData, statusAction],
  );

  // Function Add Row Data
  const addRow = () => {
    setSearch({});
    formTable.resetFields();
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
  };

  const handleDetailHistory = (record) => {
    setModalHistory(true);
    setDataHistory(record);
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
      ...columnsTable(
        listOption,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        search,
        storedData,
      ),
    ];
    return temp;
  };

  // Function Show/Hide Column
  const [optionSelectedCol, setOptionSelectedCol] = useState([]);

  const handleDisplayColumn = (value) => {
    setOptionSelectedCol(value);
  };

  const filterColumn = (dataColumn) => {
    return dataColumn.filter((col) => {
      return !optionSelectedCol.includes(col.title);
    });
  };

  // Function length column
  const numColumns = 16;
  const numRows = columns()?.length;

  const maxWidth = 10000;
  const maxHeight = 300;

  const x = numColumns * 10;
  const y = numRows * 150;

  const validatedX = Math.min(x, maxWidth);
  const validatedY = Math.min(y, maxHeight);

  const scroll = {
    x: validatedX,
    y: validatedY,
  };

  // Function Change Total Data Table
  const onChange = (_, __, ___, extra) => {
    setTotalData(extra?.currentDataSource?.length || 0);
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <ToolbarAcountInline
        items={columnsActionTable({
          editingKey: editingKey,
          handleDetailHistory: () => {},
          addRow: addRow,
          edit: () => {},
          deleteRow: () => {},
          storedData,
          startDate,
          setModalRequired,
          checkStartDate: checkStartDate,
        })}
        selector={selectorColumn}
        url={path}
      />
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
        <Form form={formTable} component={false}>
          <Table
            bordered
            className="w-full"
            dataSource={data}
            columns={[
              ...filterColumn(
                columns().map((col) => ({
                  ...col,
                  onCell: (record) => ({
                    record,
                    inputType: col.inputType,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: isEditing(record),
                    options: col.option,
                    indexValue: col.indexValue,
                    dependDataIndex: col.dependDataIndex,
                    dataEditRecord: editDataRecord,
                    startDate: startDate,
                    handleEditDataRecord: handleEditDataRecord,
                    required: col.required,
                  }),
                })),
              ),
              ...useColumnActionPermissionAccountInline(
                editingKey,
                path,
                selectorColumn,
                ["view", "Update", "Delete"],
                columnsActionTable({
                  editingKey: editingKey,
                  handleDetailHistory: handleDetailHistory,
                  addRow: addRow,
                  edit: edit,
                  deleteRow: deleted,
                  storedData,
                  startDate,
                  setModalRequired,
                  checkStartDate: checkStartDate,
                }),
                save,
                cancel,
                "delete",
              ),
            ]}
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
            scroll={scroll}
            onChange={onChange}
          />
        </Form>
      </div>
      {/* Modal History Log */}
      {modalHistory ? (
        <ModalCustom
          isOpen={modalHistory}
          handleCancel={() => {
            setEditingKey("");
            setModalHistory(false);
          }}
          type="detail"
          header={headerInformation}
          width={800}
          footer={
            <ButtonComponent
              type={"default"}
              onClick={() => {
                setModalHistory(false);
              }}
            >
              Back
            </ButtonComponent>
          }
        >
          {detailView(dataHistory)}
          <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
            <DetailText label="Record ID">{dataHistory.id}</DetailText>
            <DetailText label="Created Date">
              {dataHistory?.createdDate
                ? moment(dataHistory.createdDate).format(
                    dateFormatting.dateTime,
                  )
                : ""}
            </DetailText>
            <DetailText label="Created By">{dataHistory?.createdBy}</DetailText>
            <DetailText label="Updated Date">
              {dataHistory?.updatedDate
                ? moment(dataHistory.updatedDate).format(
                    dateFormatting.dateTime,
                  )
                : ""}
            </DetailText>
            <DetailText label="Updated By">{dataHistory?.updatedBy}</DetailText>
          </CardComponent>
        </ModalCustom>
      ) : null}
    </div>
  );
};

export default FunctionalTableInlineAccount;
