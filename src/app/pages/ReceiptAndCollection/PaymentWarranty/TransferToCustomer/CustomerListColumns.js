import { Tooltip, Input, Select, InputNumber, Form } from "antd";
import SVGIcon from "../../../../../assets/Icon/index";
import InputComponent from "../../../../../components/InputComponent";
import SelectComponent from "../../../../../components/SelectComponent";

export const getCustomerListColumns = ({
    page = 1,
    pageSize = 10,
    onDelete = () => { },
    onEdit = () => { },
    editingKey = "",
    isEditing = () => false,
    save = () => { },
    cancel = () => { },
    form,
    actionType = "none",
}) => {
    const columns = [
        {
            title: "NO",
            dataIndex: "no",
            key: "no",
            width: 50,
            render: (text, record, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: "CUSTOMER",
            dataIndex: "customer",
            key: "customer",
            width: 180,
            editable: true,
            render: (text, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <Form.Item
                        name="customer"
                        style={{ margin: 0 }}
                        rules={[{ required: true, message: "Please select customer!" }]}
                    >
                        <SelectComponent
                            placeholder="Select"
                            options={[{ label: "CUS003", value: "CUS003" }]} // Dummy options
                        />
                    </Form.Item>
                ) : text;
            }
        },
        {
            title: "AREA CODE",
            dataIndex: "areaCode",
            key: "areaCode",
            width: 100,
            editable: true,
            render: (text, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <Form.Item
                        name="areaCode"
                        style={{ margin: 0 }}
                    >
                        <InputComponent disabled placeholder="BEK001" />
                    </Form.Item>
                ) : text;
            }
        },
        {
            title: "FROM CUSTOMER NAME",
            dataIndex: "fromCustomerName",
            key: "fromCustomerName",
            width: 200,
            editable: true,
            render: (text, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <Form.Item
                        name="fromCustomerName"
                        style={{ margin: 0 }}
                    >
                        <InputComponent disabled placeholder="PLN" />
                    </Form.Item>
                ) : text;
            }
        },
        {
            title: "CURRENCY",
            dataIndex: "currency",
            key: "currency",
            width: 80,
            editable: true,
            render: (text, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <Form.Item
                        name="currency"
                        style={{ margin: 0 }}
                        rules={[{ required: true, message: "Please select currency!" }]}
                    >
                        <SelectComponent
                            placeholder="Select"
                            options={[{ label: "IDR", value: "IDR" }, { label: "USD", value: "USD" }]}
                        />
                    </Form.Item>
                ) : text;
            }
        },
        {
            title: "AMOUNT",
            dataIndex: "amount",
            key: "amount",
            width: 150,
            editable: true,
            render: (text, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <Form.Item
                        name="amount"
                        style={{ margin: 0 }}
                        rules={[{ required: true, message: "Please input amount!" }]}
                    >
                        <InputComponent placeholder="0" style={{ textAlign: "right" }} />
                    </Form.Item>
                ) : text ? text.toLocaleString("id-ID") : 0;
            },
            align: "right",
        },
    ];


    if (actionType !== "none") {
        columns.push({
            title: "ACTION",
            dataIndex: "action",
            key: "action",
            width: 100,
            align: "center",
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <div className="flex justify-center gap-2">
                        <div
                            className="cursor-pointer text-blue-500 font-bold"
                            onClick={() => save(record.key)}
                        >
                            Save
                        </div>
                        <div
                            className="cursor-pointer text-gray-500 font-bold"
                            onClick={cancel}
                        >
                            Cancel
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center gap-2">
                        <Tooltip title="Edit">
                            <SVGIcon
                                name="IconEdit"
                                width={24}
                                onClick={() => onEdit(record)}
                                className="cursor-pointer"
                            />
                        </Tooltip>
                        <Tooltip title="Delete">
                            <SVGIcon
                                name="IconDelete"
                                width={24}
                                onClick={() => onDelete(record)}
                                className="cursor-pointer"
                            />
                        </Tooltip>
                    </div>
                );
            },
        });
    }

    return columns;
};
