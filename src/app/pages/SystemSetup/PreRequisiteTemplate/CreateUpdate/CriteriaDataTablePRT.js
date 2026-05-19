import { useState } from "react";
import { Button, Empty, Form, Input, Tooltip } from "antd";
import NxTable from "../../../../../components/Nx/NxTable";
import SVGIcon from "../../../../../assets/Icon/index";

/**
 * Editable cell component — renders an Input when the row is in edit mode,
 * otherwise renders the read-only cell content.
 */
const EditableCell = ({
    editing,
    dataIndex,
    title,
    required,
    children,
    ...restProps
}) => {
    if (dataIndex === "operation" || dataIndex === "no") {
        return <td {...restProps}>{children}</td>;
    }

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={
                        required
                            ? [{ required: true, message: `${title} is required!` }]
                            : undefined
                    }
                >
                    <Input size="small" />
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

/**
 * Inline-editable criteria data table for PreRequisiteTemplate.
 *
 * Columns are derived dynamically from the selected criteria values — no
 * hardcoded IDs. Each selected criteria becomes one editable column, using
 * its `value` field as the row data key and its `name` field as the header.
 *
 * @param {string[]} criteriaValues    - Currently selected criteria value strings (e.g. ["ACCOUNT"])
 * @param {object[]} criteriaOptions   - Full list from API: [{ id, name, value }]
 * @param {object[]} data              - Row data for the table
 * @param {Function} updateData        - State setter for row data (supports callback form)
 * @param {boolean}  storedData        - Whether a row is currently being edited
 * @param {Function} setStoredData     - Setter for storedData
 */
const CriteriaDataTablePRT = ({
    criteriaValues = [],
    criteriaOptions = [],
    data = [],
    updateData = () => {},
    storedData = false,
    setStoredData = () => {},
}) => {
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState("");
    const [statusAction, setStatusAction] = useState("");

    const isEditing = (record) => record.key === editingKey;

    // Only show columns for currently-selected criteria
    const selectedCriteria = criteriaOptions.filter((c) =>
        criteriaValues.includes(c.value)
    );

    // --- Row operations ---
    const addRow = () => {
        form.resetFields();
        setStoredData(true);
        setStatusAction("add");
        const newKey = (
            data.reduce((max, row) => Math.max(max, parseInt(row.key || 0)), 0) + 1
        ).toString();
        updateData((prev) => [...prev, { key: newKey }]);
        setEditingKey(newKey);
    };

    const edit = (record) => {
        form.setFieldsValue({ ...record });
        setStatusAction("edit");
        setStoredData(true);
        setEditingKey(record.key);
    };

    const cancel = (record) => {
        if (statusAction === "add") {
            updateData((prev) => prev.filter((item) => item.key !== record.key));
        }
        setEditingKey("");
        setStatusAction("");
        setStoredData(false);
        form.resetFields();
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => item.key === key);
            if (index > -1) {
                newData.splice(index, 1, { ...newData[index], ...row });
                updateData(newData);
            }
            setEditingKey("");
            setStatusAction("");
            setStoredData(false);
            form.resetFields();
        } catch (e) {
            console.log("Validate Failed:", e);
        }
    };

    const deleteRow = (record) => {
        updateData((prev) => prev.filter((item) => item.key !== record.key));
        if (storedData && statusAction === "") setStoredData(false);
    };

    // --- Column definitions ---
    const baseColumns = [
        {
            key: "no",
            title: "NO",
            dataIndex: "no",
            width: 60,
            align: "center",
            render: (_, __, index) => index + 1,
        },
        // One column per selected criteria, keyed by criteria.value
        ...selectedCriteria.map((c) => ({
            key: c.value,
            title: c.name.toUpperCase(),
            dataIndex: c.value,
        })),
        {
            key: "operation",
            title: "ACTION",
            dataIndex: "operation",
            width: storedData ? 200 : 120,
            fixed: "right",
            align: "center",
            render: (_, record) => {
                const editable = isEditing(record);
                return (
                    <div className="flex w-full justify-center gap-2 my-1">
                        {editable ? (
                            <>
                                <Button type="menu" onClick={() => cancel(record)}>
                                    Cancel
                                </Button>
                                <Button type="submit" onClick={() => save(record.key)}>
                                    Save
                                </Button>
                            </>
                        ) : (
                            <>
                                <Tooltip title={editingKey ? "" : "Update"}>
                                    <Button
                                        type="table-action"
                                        disabled={!!editingKey}
                                        onClick={() => edit(record)}
                                    >
                                        <SVGIcon name="IconEdit" width={20} />
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <Button
                                        type="table-action"
                                        disabled={!!editingKey}
                                        onClick={() => deleteRow(record)}
                                    >
                                        <SVGIcon name="IconDelete" width={20} />
                                    </Button>
                                </Tooltip>
                            </>
                        )}
                    </div>
                );
            },
        },
    ];

    // Inject onCell for EditableCell
    const columns = baseColumns.map((col) => ({
        ...col,
        onCell: (record) => ({
            editing: isEditing(record),
            dataIndex: col.dataIndex,
            title: typeof col.title === "string" ? col.title : col.dataIndex,
            required: selectedCriteria.some((c) => c.value === col.dataIndex),
        }),
    }));

    if (criteriaValues.length === 0) return (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Select at least one criteria" />
    );

    return (
        <div className="flex flex-col gap-4">
            <div className="flex w-full justify-end">
                <Button
                    icon={<SVGIcon name="IconButtonCreate" width={14} />}
                    type="submit"
                    disabled={!!editingKey}
                    onClick={addRow}
                >
                    Create
                </Button>
            </div>
            <Form form={form} component={false}>
                <NxTable
                    idTable="criteria-data-prt-table"
                    dataSource={data}
                    columns={columns}
                    totalData={data.length}
                    tableScrolled={{ x: "max-content" }}
                    usePagination={false}
                    useInfiniteScroll={false}
                    components={{ body: { cell: EditableCell } }}
                    rowClassName={(record) =>
                        isEditing(record) ? "editable-row" : ""
                    }
                />
            </Form>
        </div>
    );
};

export default CriteriaDataTablePRT;
