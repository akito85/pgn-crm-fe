import React, { useEffect, useState, useRef, useCallback } from "react";
import moment from "moment";
import { Form, Space, Table, Tooltip } from "antd";
import SVGIcon from "../../../../../assets/Icon/index";
import DateComponent from "../../../../../components/DateComponent";
import InputComponent from "../../../../../components/InputComponent";
import { dateFormatting, hasValue } from "../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import ButtonComponent from "../../../../../components/ButtonComponent";
import CardComponent from "../../../../../components/Card/CardComponent";
import DetailText from "../../../../../components/DetailText";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import ModalCustom from "../../../../../components/Modal/ModalCustom";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  required,
  formTableAdditionalCode,
  ...restProps
}) => {
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

  const endDateValidator = (startDate) => (_, value) => {
    const momentStartDate = moment(startDate);
    const momentEndDate = moment(value);

    if ((value && momentStartDate <= momentEndDate) || !value) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error("End Date must be after Start Date"));
    }
  };

  const handleDisableDateBefore = (current) => {
    return moment().add(-1, "days") >= current;
  };

  const getInputNode = (inputType) => {
    switch (inputType) {
      case "startDate":
        return <DateComponent dateDisable={handleDisableDateBefore} />;

      case "endDate":
        return (
          <DateComponent
            disabled={
              formTableAdditionalCode.getFieldValue().startDate === null ||
              formTableAdditionalCode.getFieldValue().startDate === undefined
            }
            dateDisable={handleDisableDateBefore}
          />
        );

      case "description":
        return <InputComponent type="textarea" />;

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
          rules={
            inputType !== "endDate"
              ? rules()
              : [
                  {
                    validator: (_, value) =>
                      endDateValidator(
                        formTableAdditionalCode.getFieldValue().startDate
                      )(_, value),
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

const FunctionalAdditionalCode = ({
  type,
  data = [],
  updateData = () => {},
  storedData = false,
  setStoredData = () => {},
  status,
  statusApproval,
}) => {
  // Declaration
  const searchInput = useRef(null);
  const [formTableAdditionalCode] = Form.useForm();
  const isEditing = (record) => record.key === editingKey;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [editingKey, setEditingKey] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [statusAction, setStatusAction] = useState("");
  const [dataHistory, setDataHistory] = useState({});
  const [modalHistory, setModalHistory] = useState(false);
  const [modalValidationTable, setModalValidationTable] = useState(false);

  // Use Effect
  useEffect(() => {
    setTotalData(data.length);
  }, [data]);

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

  // Function Edit Data
  const edit = (record) => {
    setStoredData(true);
    setStatusAction("edit");

    // Parse dates properly - check if they're already moment objects or strings
    const startDate = record.startDate
      ? moment.isMoment(record.startDate)
        ? record.startDate
        : moment(record.startDate, dateFormatting.dateFormal)
      : null;

    const endDate = record.endDate
      ? moment.isMoment(record.endDate)
        ? record.endDate
        : moment(record.endDate, dateFormatting.dateFormal)
      : undefined;

    formTableAdditionalCode.setFieldsValue({
      ...record,
      startDate: startDate,
      endDate: endDate,
    });
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

  // Function Handle Detail
  const handleDetail = (r) => {
    setModalHistory(true);
    setDataHistory({
      recordId: r?.id,
      createdDate: r?.createdDate,
      createdBy: r?.createdBy,
      updatedDate: r?.updatedDate,
      updatedBy: r?.updatedBy,
    });
  };

  const closeModalHistory = () => {
    setModalHistory(false);
    setDataHistory({});
  };

  // Check overlapping dates
  const checkOverlappingDates = useCallback((newData, currentKey) => {
    for (let i = 0; i < newData.length; i++) {
      if (newData[i].key === currentKey) continue;

      for (let j = i + 1; j < newData.length; j++) {
        const item1 = newData[i];
        const item2 = newData[j];

        const start1 = moment(item1.startDate, dateFormatting.dateFormal);
        const end1 = item1.endDate
          ? moment(item1.endDate, dateFormatting.dateFormal)
          : null;
        const start2 = moment(item2.startDate, dateFormatting.dateFormal);
        const end2 = item2.endDate
          ? moment(item2.endDate, dateFormatting.dateFormal)
          : null;

        const hasOverlap =
          (start1.isSameOrBefore(start2) &&
            (!end1 || end1.isSameOrAfter(start2))) ||
          (start2.isSameOrBefore(start1) &&
            (!end2 || end2.isSameOrAfter(start1)));

        if (hasOverlap) {
          return true;
        }
      }
    }
    return false;
  }, []);

  // Function Save Data - FIXED VERSION
  const save = async (key) => {
    try {
      const row = await formTableAdditionalCode.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];

        // Convert moment objects to formatted date strings for storage
        const formattedRow = {
          ...row,
          startDate: row.startDate
            ? moment(row.startDate).format(dateFormatting.dateFormal)
            : null,
          endDate: row.endDate
            ? moment(row.endDate).format(dateFormatting.dateFormal)
            : null,
        };

        const updatedRow = { ...item, ...formattedRow };
        newData.splice(index, 1, updatedRow);

        // Check for overlapping dates
        const hasOverlap = checkOverlappingDates(newData, key);

        if (hasOverlap) {
          formTableAdditionalCode.setFields([
            {
              name: "startDate",
              errors: [`Overlapping date found`],
            },
            {
              name: "endDate",
              errors: [`Overlapping date found`],
            },
          ]);
        } else {
          updateData(newData);
          setEditingKey("");
          setStoredData(false);
          setStatusAction("");
          formTableAdditionalCode.resetFields();
        }
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  // Function Add Row Data
  const addRow = () => {
    // Check if existing data has overlapping dates
    const hasOverlap = checkOverlappingDates(data, null);

    if (hasOverlap) {
      setModalValidationTable(true);
    } else {
      formTableAdditionalCode.resetFields();
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
        title: "CODE",
        dataIndex: "code",
        width: 150,
        inputType: "text",
        required: true,
        ...getColumnSearchPropsPaging(
          "code",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
      {
        title: "DESCRIPTION",
        dataIndex: "description",
        width: 300,
        inputType: "description",
        required: true,
        ...getColumnSearchPropsPaging(
          "description",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
      {
        title: "START DATE",
        dataIndex: "startDate",
        width: 180,
        align: "center",
        inputType: "startDate",
        required: true,
        render: (text) => {
          if (!text) return "";
          // Handle both moment objects and string dates
          if (moment.isMoment(text)) {
            return text.format(dateFormatting.dateFormal);
          }
          return moment(text, dateFormatting.dateFormal).isValid()
            ? moment(text, dateFormatting.dateFormal).format(
                dateFormatting.dateFormal
              )
            : text;
        },
        ...getColumnSearchPropsPaging(
          "startDate",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
      {
        title: "END DATE",
        dataIndex: "endDate",
        width: 180,
        align: "center",
        inputType: "endDate",
        render: (text) => {
          if (!text) return "";
          // Handle both moment objects and string dates
          if (moment.isMoment(text)) {
            return text.format(dateFormatting.dateFormal);
          }
          return moment(text, dateFormatting.dateFormal).isValid()
            ? moment(text, dateFormatting.dateFormal).format(
                dateFormatting.dateFormal
              )
            : text;
        },
        ...getColumnSearchPropsPaging(
          "endDate",
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
          const isDelete =
            (status === "DRAFT" && statusApproval === "DRAFT") ||
            record.type !== "exist";

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
                  {type === "detail" ? (
                    <Tooltip title="Detail">
                      <div className="pt-1">
                        <SVGIcon
                          name="IconDetail"
                          width={24}
                          onClick={() => handleDetail(record)}
                        />
                      </div>
                    </Tooltip>
                  ) : (
                    <>
                      <Tooltip title="Edit">
                        <div>
                          <SVGIcon
                            name="IconEdit"
                            color={editingKey ? "#8D91A0" : "#ACC424"}
                            className={`${
                              editingKey ? "cursor-not-allowed" : ""
                            }`}
                            width={24}
                            onClick={
                              !editingKey ? () => edit(record) : undefined
                            }
                          />
                        </div>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <div>
                          <SVGIcon
                            name="IconDelete"
                            color={
                              isDelete && !editingKey ? "#D90000" : "#8D91A0"
                            }
                            width={24}
                            className={
                              isDelete && !editingKey
                                ? undefined
                                : "disabled cursor-not-allowed"
                            }
                            onClick={
                              isDelete && !editingKey
                                ? () => deleteRow(record)
                                : undefined
                            }
                          />
                        </div>
                      </Tooltip>
                    </>
                  )}
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

  // Function length column
  const scroll = {
    x: 1200,
    y: 300,
  };

  // Function Change Total Data Table
  const onChange = (_, __, ___, extra) => {
    setTotalData(extra?.currentDataSource?.length || 0);
  };

  return (
    <div className="flex flex-col w-full gap-4">
      {type !== "detail" && type !== "preview" ? (
        <div className="flex w-full justify-end">
          <ButtonComponent
            disabled={storedData}
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
            onClick={!storedData ? addRow : undefined}
          >
            Create
          </ButtonComponent>
        </div>
      ) : null}

      <div className="relative flex flex-col w-full">
        <Form form={formTableAdditionalCode} component={false}>
          <Table
            bordered
            className="w-full"
            dataSource={data}
            columns={columns().map((col) => ({
              ...col,
              onCell: (record) => ({
                record,
                inputType: col.inputType,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
                required: col.required,
                formTableAdditionalCode: formTableAdditionalCode,
              }),
            }))}
            pagination={{
              position: ["topRight"],
              current: page,
              pageSize: pageSize,
              onChange: handleChange,
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
      <ModalCustom
        isOpen={modalHistory}
        handleCancel={closeModalHistory}
        type="detail"
        header="ADDITIONAL CODE INFORMATION"
        width={800}
        footer={
          <ButtonComponent type={"default"} onClick={closeModalHistory}>
            Back
          </ButtonComponent>
        }
      >
        <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
          <DetailText label="Record ID">{dataHistory.recordId}</DetailText>
          <DetailText label="Created Date">
            {dataHistory?.createdDate
              ? moment(dataHistory.createdDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Created By">{dataHistory?.createdBy}</DetailText>
          <DetailText label="Updated Date">
            {dataHistory?.updatedDate
              ? moment(dataHistory.updatedDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Updated By">{dataHistory?.updatedBy}</DetailText>
        </CardComponent>
      </ModalCustom>

      {/* Modal Validation Table */}
      <ModalError
        isOpen={modalValidationTable}
        handleOk={() => setModalValidationTable(false)}
        handleCancel={() => setModalValidationTable(false)}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">{`You can't add Additional Code. Start date and end date can't overlap`}</p>
        </div>
      </ModalError>
    </div>
  );
};

export default FunctionalAdditionalCode;
