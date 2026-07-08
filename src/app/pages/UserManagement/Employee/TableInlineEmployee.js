import React, { useEffect, useState } from "react";
import {
    Table,
    Input,
    InputNumber,
    Form,
    Select,
    Checkbox,
    Tooltip,
    DatePicker,
    Popover,
    Pagination,
    Space,
} from "antd";
import moment from "moment";
import {
    MoreOutlined,
    PlusOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import SVGIcon from "../../../../assets/Icon/index";
import ButtonComponent from "../../../../components/ButtonComponent";
import BaseContainer from "../../../../components/BaseContainer";
import { dateFormatting } from "../../../../utils";
import InputComponent from "../../../../components/InputComponent";
import NxTable from "../../../../components/Nx/NxTable";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import { useSelector } from "react-redux";
const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    options,
    showPassword,
    handlePassword,
    regex,
    required,
    disableDate,
    onCellClicked,
    onInput = () => { },
    maxLength,
    form,
    employeeStartDate,
    ...restProps
}) => {
    // const [form] = Form.useForm();
    // const [visiblePassword, setVisiblePassword] = useState(false);
    const key = record?.key || 0;
    const encrypt = record?.encrypt;
    const rules = () => {
        let rules = [];
        if (required) {
            rules.push({
                required: required === undefined || required === false ? false : true,
                message: `Please input your ${title.toLowerCase()}!`,
            });
        }
        if (inputType === "input_regex") {
            rules.push(regex);
        }
        return rules.length !== 0 ? rules : undefined;
    };

    const handleDisableDate = (current) => {
        if (dataIndex === "endDate") {
            return current && current < moment(form.getFieldValue("startDate"));
        } else if (dataIndex === "startDate") {
            // Row start date must be strictly after today AND strictly after the
            // employee's own start date (from the outer EmployeeForm), whichever is later.
            const today = moment().startOf("day");
            const minStartDate =
                employeeStartDate && moment(employeeStartDate).startOf("day").isAfter(today)
                    ? moment(employeeStartDate).startOf("day")
                    : today;
            return current && current.startOf("day").isSameOrBefore(minStartDate);
        } else {
            return current && current < moment().add(-1, "days");
        }
    };
    const getInputNode = (inputType, options) => {
        switch (inputType) {
            case "text":
                return <InputComponent />;
            case "input_regex":
                return (
                    <Input
                        suffix={
                            <Tooltip
                                title={
                                    <span className={"w-1/2"}>
                                        Your key must contain at least:
                                        <br />
                                        - No Space
                                        <br />
                                        - Upper case letter
                                        <br />- Non-alphanumeric characters, such as !, @, #, $, %,
                                        ^, &, *, etc.
                                    </span>
                                }
                            >
                                <InfoCircleOutlined
                                    style={{
                                        color: "rgba(0,0,0,.45)",
                                    }}
                                />
                            </Tooltip>
                        }
                    />
                );
            case "number":
                return (
                    <InputNumber
                        type={"number"}
                        style={{ width: "100%" }}
                        controls={false}
                    />
                );
            case "select":
                return (
                    <Select
                        onChange={onCellClicked}
                        showSearch
                        labelInValue
                        optionFilterProp="children"
                        allowClear
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
            case "checkbox_default":
                return <Checkbox defaultChecked={false} />;
            case "checkbox":
                return (
                    <Checkbox
                        className="action-checkbox"
                        value={encrypt || false}
                        onChange={(e) => {
                            const data = {
                                [key]: e.target.checked,
                            };
                            handlePassword(data);
                        }}
                    />
                );
            case "date":
                return (
                    <DatePicker
                        format={dateFormatting.dateCapital}
                        disabledDate={handleDisableDate}
                        style={{ width: "100%" }}
                    />
                );
            case "input_password":
                return <Input type={showPassword[key] ? "password" : "text"} />;
            case "description":
                return <Input.TextArea rows={1} maxLength={255} />;
            default:
                return <InputComponent />;
        }
    };
    const inputNode = getInputNode(inputType, options);

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
    const initValue = (type) => {
        if (type === "checkbox") {
            return false;
        } else {
            return "";
        }
    };
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    valuePropName={inputType === "checkbox" ? "checked" : "value"}
                    rules={inputType !== "checkbox" ? rules() : undefined}
                    initialValue={initValue(inputType)}
                    className={"w-full"}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const TableInlineEmployee = ({
    onDataChange,
    cols,
    tableData,
    mode,
    onDetail,
    onInactive,
    header,
    regex,
    // required,
    useDynamicAction = false,
    action,
    useSelect = false,
    usePagination = false,
    onChangePage = () => { },
    onSizeChanger = () => { },
    pageSize,
    current,
    totalData,
    showCreateButton = true,
    scrollTable = {},
    disableDate,
    setOpenModal,
    actionButton,
    onSort,
    useContainer = true,
    checkInputBy,
    checkNameColumn,
    handleValidate,
    messageValidate,
    actionFix,
    setMessageValidate = () => { },
    setInserted = () => { },
    employeeStartDate,
}) => {
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState("");
    const [storedDate, setStoredData] = useState(false);
    const [isInsert, setIsInsert] = useState(false);
    const [visiblePassword, setVisiblePassword] = useState({});
    const isEditing = (record) => record.key === editingKey;
    const [statusAction, setStatusAction] = useState("");
    const [isSame, setIsSame] = useState(false);
    const [isValid, setIsValid] = useState(true);

    const { data: dataUser = {} } = useSelector((state) => state.profile);
    
    useEffect(() => {
        if (isInsert === true) {
            setInserted(true);
        } else {
            setInserted(false)
        }
    }, [isInsert, setInserted]);


    const edit = (record, field) => {
        form.setFieldsValue(record);
        setEditingKey(record.key);
        setStoredData(true);
        setStatusAction("edit");
        setIsInsert(true)
    };
    const cancel = (key) => {
        if (statusAction === "add") {
            const newData = tableData.filter((item) => item.key !== key);
            onDataChange(newData);
            onDataChange(newData);
        }
        setEditingKey("");
        setStoredData(false);
        setStatusAction("");
        setIsInsert(false)
    };

    const handleVisiblePassword = (data) => {
        setVisiblePassword((prevState) => {
            return {
                ...prevState,
                ...data,
            };
        });
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...tableData];
            const index = newData.findIndex((item) => key === item.key);
            let dataValid = true;
            if (index > -1 && dataValid === true) {
                const item = newData[index];
                const updatedRow = { ...item, ...row };
                newData.splice(index, 1, updatedRow);
                setEditingKey("");
                onDataChange(newData);
                setMessageValidate("");
                form.resetFields();
            } else {
                setStatusAction("");
                setIsSame(false);
                setIsValid(true);
            }
            setStoredData(false);
            setIsInsert(false)
        } catch (errInfo) {
            console.log("Validate Failed:", errInfo);
        }
    };
    const addRow = () => {
        form.resetFields();
        setStoredData(true);
        setIsInsert(true);
        setStatusAction("add");
        const newRow = {
            key: (tableData.length + 1).toString(),
            status: "ACTIVE",
        };
        onDataChange((prevData) => [...prevData, newRow]);
        setEditingKey(newRow.key);
    };

    const deleteRow = (key) => {
        const newData = tableData.filter((item) => item.key !== key);
        onDataChange(newData);
        onDataChange(newData);
        setStoredData(false);
        setIsInsert(false)
    };
    const renderDelete = (record) => {
        // return record.status === "ACTIVE" || record.status === "INACTIVE" ? (
        // assignId (not id) marks a row loaded from the backend: NxTable injects
        // a synthetic `id` into every row for its own rowKey needs, so `id` alone
        // can't tell a saved row apart from a newly-added, unsaved one.
        return record.assignId ? (
            <ButtonComponent
                disabled
                icon={<SVGIcon name="IconDelete" width={24} color={"#C0BEC6"} />}
                border={false}
            />
        ) : (
            <ButtonComponent
                onClick={() => deleteRow(record.key)}
                disabled={editingKey !== ""}
                icon={
                    <SVGIcon name="IconDelete" width={24} />
                    // <DeleteOutlined style={{ fontSize: "24px", color: "#c81912" }} />
                }
                border={false}
            />
        );
    };
    const columns = [
        ...cols,
        {
            title: "ACTIONS",
            dataIndex: "operation",
            ...(actionFix ? { fixed: "right" } : {}),
            align: "center",
            fixed:'right',
            render: (_, record) => {
                const editable = record.key === editingKey;
                return (
                    // rendering button
                    <Space className="my-2 gap-2">
                        {useDynamicAction ? (
                            action(record, editable)
                        ) : editable ? (
                            <>
                                <ButtonComponent
                                    onClick={() => cancel(record.key)}
                                    type="default"
                                >
                                    Cancel
                                </ButtonComponent>
                                <ButtonComponent onClick={() => save(record.key)} type="submit">
                                    Save
                                </ButtonComponent>
                            </>
                        ) : actionButton?.length >= 4 ? (
                            <>
                                <Popover
                                    content={
                                        <Space direction="vertical">
                                            {record?.assignId ? (
                                                <ButtonComponent
                                                    icon={<SVGIcon name="IconDetail" width={24} />}
                                                    border={false}
                                                    onClick={() => onDetail(record?.assignId)}
                                                >
                                                    <span className={"text-black"}> Detail</span>
                                                </ButtonComponent>
                                            ) : (
                                                <ButtonComponent
                                                    disabled
                                                    icon={
                                                        <SVGIcon
                                                            name="IconDetail"
                                                            color={"#C0BEC6"}
                                                            width={24}
                                                        />
                                                    }
                                                    border={false}
                                                // onClick={() => onDetail(record?.assignId)}
                                                >
                                                    <span className={"text-[#C0BEC6]"}> Detail</span>
                                                </ButtonComponent>
                                            )}
                                            <ButtonComponent
                                                onClick={() => edit(record)}
                                                disabled={editingKey !== ""}
                                                icon={<SVGIcon name="IconEdit" width={24} />}
                                                border={false}
                                            >
                                                <span className={"text-black"}> Update</span>
                                            </ButtonComponent>
                                            <ButtonComponent border={false}>
                                                <Checkbox
                                                    onClick={() => onInactive(record)}
                                                    checked={record.status === "ACTIVE" ? true : false}
                                                >
                                                    <span
                                                        className={"text-black normal-case text-[18px]"}
                                                    >
                                                        {record?.status}
                                                    </span>
                                                </Checkbox>
                                            </ButtonComponent>
                                        </Space>
                                    }
                                    trigger={"click"}
                                    placement="bottomRight"
                                >
                                    <ButtonComponent
                                        icon={<MoreOutlined style={{ fontSize: "24px" }} />}
                                        border={false}
                                    />
                                </Popover>
                                {/* {record.status === "ACTIVE" || record.status === "INACTIVE" ? ( */}
                                {record.assignId ? (
                                    <ButtonComponent
                                        disabled
                                        icon={
                                            <SVGIcon name="IconDelete" width={24} color={"#C0BEC6"} />
                                        }
                                        border={false}
                                    />
                                ) : (
                                    <ButtonComponent
                                        onClick={() => deleteRow(record.key)}
                                        disabled={editingKey !== ""}
                                        icon={<SVGIcon name="IconDelete" width={24} />}
                                        border={false}
                                    />
                                )}
                            </>
                        ) : (
                            <>
                                {actionButton?.includes("detail") && (
                                    <ButtonComponent
                                        icon={<SVGIcon name="IconDetail" width={24} />}
                                        border={false}
                                        onClick={() => onDetail(record?.assignId)}
                                    />
                                )}
                                {actionButton?.includes("update") && (
                                    <ButtonComponent
                                        onClick={() => edit(record)}
                                        disabled={editingKey !== ""}
                                        icon={<SVGIcon name="IconEdit" width={24} />}
                                        border={false}
                                    />
                                )}

                                {actionButton?.includes("inactive") && (
                                    <ButtonComponent
                                        border={false}
                                        disabled={record?.status !== "ACTIVE"}
                                    >
                                        <Checkbox
                                            onClick={
                                                record?.status === "ACTIVE"
                                                    ? () => onInactive(record?.assignId)
                                                    : undefined
                                            }
                                            checked={record?.status === "ACTIVE"}
                                        />
                                    </ButtonComponent>
                                )}
                                {actionButton?.includes("delete") && renderDelete(record)}
                            </>
                        )}
                    </Space>
                );
            },
        },
    ];

    const [optionSelectedCol, setOptionSelectedCol] = useState([]);

    const handleDisplayColumn = (value) => {
        setOptionSelectedCol(value);
    };

    const filterColumn = (dataColumn) => {
        return dataColumn.filter((col) => {
            return !optionSelectedCol.includes(col.title);
        });
    };

    const paginationTable = (page, pageSize) => {
        return tableData?.slice((page - 1) * pageSize, page * pageSize);
    };

    return useContainer === true ? (
        <NxCardContainer header={header}>
            <div className={"w-full flex flex-col gap-4"}>
                <div className={"w-full flex justify-end"}>
                    {showCreateButton && (
                        <ButtonComponent
                            onClick={storedDate === false && addRow}
                            type={"submit"}
                            border={false}
                            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
                            disabled={isInsert}
                        >
                            Create
                        </ButtonComponent>
                    )}
                </div>
                {/* {useSelect || usePagination ? (
                    <div className={"w-full flex mb-5 gap-2 justify-between"}>
                        {useSelect ? (
                            <Select
                                mode="multiple"
                                placeholder="Show All Column"
                                className={"w-2/6"}
                                maxTagCount={3}
                                onChange={handleDisplayColumn}
                            >
                                {columns
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
                        ) : null}
                        {usePagination ? (
                            <Pagination
                                total={totalData}
                                className={"pr-1"}
                                showSizeChanger
                                current={current}
                                pageSize={pageSize}
                                onChange={onChangePage}
                                onShowSizeChange={onSizeChanger}
                                showTotal={(total, range) =>
                                    `Showing ${range[0]} to ${range[1]} of ${total} records`
                                }
                            />
                        ) : null}
                    </div>
                ) : null} */}
                <Form form={form} component={false}>
                    <NxTable
                        idTable={"employee-table-inline"}
                        userId={dataUser?.data?.username}
                        showAdvanceSearch={false}
                        usePagination={false}
                        showSearchBar={false}
                        dataSource={paginationTable(current, pageSize)}
                        columns={filterColumn(
                            columns.map((col) => {
                                return {
                                    ...col,
                                    onCell: (record) => ({
                                        record,
                                        inputType: col.inputType,
                                        dataIndex: col.dataIndex,
                                        title: col.title,
                                        editing: isEditing(record),
                                        options: col.options,
                                        onCellClicked: col.onClick,
                                        showPassword: visiblePassword,
                                        handlePassword: handleVisiblePassword,
                                        regex: regex,
                                        required: col.required,
                                        disableDate,
                                        form: form,
                                        onInput: col.onInput,
                                        maxLength: col.maxLength,
                                        employeeStartDate,
                                    }),
                                };
                            })
                        )}
                        rowClassName={(record) => (isEditing(record) ? "editable-row" : "")}
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        scroll={scrollTable}
                        tableLayout="fixed"
                        bordered
                        onChange={onSort}
                        pagination={false}
                    />
                </Form>
                {isSame && (
                    <div className={"w-full flex mb-5 gap-2 justify-between"}>
                        <span className="font-bold text-red-700">
                            {checkNameColumn} is exist
                        </span>
                    </div>
                )}
                {!isValid ? (
                    <div className={"w-full flex mb-5 gap-2 justify-between"}>
                        <span className="font-bold text-red-700">
                            {messageValidate || "data cannot save"}
                        </span>
                    </div>
                ) : null}
            </div>
        </NxCardContainer>
    ) : (
        <>
            {/* {useSelect || usePagination ? (
                <div className={"w-full flex mb-5 gap-2 justify-between"}>
                    {useSelect ? (
                        <div className={"w-2/5"}>
                            <Select
                                mode="multiple"
                                placeholder="Show All Column"
                                className={"w-2/6"}
                                maxTagCount={3}
                                onChange={handleDisplayColumn}
                            >
                                {columns
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
                    ) : null}
                    {usePagination ? (
                        <Pagination
                            total={totalData}
                            className={"pr-1"}
                            showSizeChanger
                            current={current}
                            pageSize={pageSize}
                            onChange={onChangePage}
                            onShowSizeChange={onSizeChanger}
                            showTotal={(total, range) =>
                                `Showing ${range[0]} to ${range[1]} of ${total} records`
                            }
                        />
                    ) : null}
                </div>
            ) : null} */}
            <Form form={form} component={false}>
                <NxTable
                    idTable={"employee-table-inline-2"}
                    dataSource={paginationTable(current, pageSize)}
                    columns={filterColumn(
                        columns.map((col) => {
                            return {
                                ...col,
                                onCell: (record) => ({
                                    record,
                                    inputType: col.inputType,
                                    dataIndex: col.dataIndex,
                                    title: col.title,
                                    editing: isEditing(record),
                                    options: col.options,
                                    onCellClicked: col.onClick,
                                    showPassword: visiblePassword,
                                    handlePassword: handleVisiblePassword,
                                    regex: regex,
                                    required: col.required,
                                    disableDate,
                                    form: form,
                                    onInput: col.onInput,
                                    maxLength: col.maxLength,
                                    employeeStartDate,
                                }),
                            };
                        })
                    )}
                    rowClassName={(record) => (isEditing(record) ? "editable-row" : "")}
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    scroll={scrollTable}
                    tableLayout="fixed"
                    bordered
                    onChange={onSort}
                    pagination={false}
                />
            </Form>
            {isSame && (
                <div className={"w-full flex mb-5 gap-2 justify-between"}>
                    <span className="font-bold text-red-700">
                        {checkNameColumn} is exist
                    </span>
                </div>
            )}
        </>
    );
};

export default TableInlineEmployee;
