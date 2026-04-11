import { Tooltip, Form, Button } from "antd";
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
    listCustomer = [],
    currencyDDL = [],
    handleCustomerChange = () => { }
}) => {
    const defaultCellProps = {
        style: { padding: '4px 12px' }
    };

    const columns = [
        {
            title: "NO",
            dataIndex: "no",
            key: "no",
            width: 50,
            render: (text, record, index) => (page - 1) * pageSize + index + 1,
            onCell: () => defaultCellProps,
        },
        {
            title: "CUSTOMER NUMBER",
            dataIndex: "customer",
            key: "customer",
            width: 180,
            render: (text, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <div style={{ padding: '4px 0' }}>
                        <Form.Item
                            name="itemCustomer"
                            style={{ margin: 0 }}
                            rules={[{ required: true, message: "Please select customer!" }]}
                        >
                            <SelectComponent
                                placeholder="Select Customer Number"
                                options={listCustomer.map(item => ({ 
                                    label: item.customerNumber || item.customerId, 
                                    value: item.customerId !== undefined && item.customerId !== null ? item.customerId : item.customerNumber 
                                }))}
                                onChange={(val) => handleCustomerChange(val)}
                            />
                        </Form.Item>
                    </div>
                ) : text;
            },
            onCell: () => defaultCellProps,
        },
        {
            title: "AREA CODE",
            dataIndex: "areaCode",
            key: "areaCode",
            width: 100,
            render: (text, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <div style={{ padding: '2px 0' }}>
                        <Form.Item
                            name="itemAreaCode"
                            style={{ margin: 0 }}
                        >
                            <InputComponent disabled placeholder="Area Code" />
                        </Form.Item>
                    </div>
                ) : text;
            },
            onCell: () => defaultCellProps,
        },
        {
            title: "TO CUSTOMER NAME",
            dataIndex: "toCustomerName",
            key: "toCustomerName",
            width: 200,
            render: (text, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <div style={{ padding: '4px 0' }}>
                        <Form.Item
                            name="itemToCustomerName"
                            style={{ margin: 0 }}
                        >
                            <InputComponent disabled placeholder="To Customer Name" />
                        </Form.Item>
                    </div>
                ) : text;
            },
            onCell: () => defaultCellProps,
        },
        {
            title: "CURRENCY",
            dataIndex: "currency",
            key: "currency",
            width: 150,
            align: "center",
            render: (text, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <div style={{ padding: '4px 0' }}>
                        <Form.Item
                            name="itemCurrency"
                            style={{ margin: 0 }}
                            rules={[{ required: true, message: "Please select currency!" }]}
                        >
                            <SelectComponent
                                placeholder="Select Currency"
                                options={currencyDDL.map(item => ({ 
                                    label: item.name || item.text || item.id, 
                                    value: item.id 
                                }))}
                            />
                        </Form.Item>
                    </div>
                ) : text;
            },
            onCell: () => defaultCellProps,
        },
        {
            title: "AMOUNT",
            dataIndex: "amount",
            key: "amount",
            width: 150,
            render: (text, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <div style={{ padding: '4px 0' }}>
                        <Form.Item
                            name="itemAmount"
                            style={{ margin: 0 }}
                            getValueFromEvent={(val) => val.floatValue}
                            rules={[
                                { required: true, message: 'Amount is required' },
                                { 
                                  pattern: /^\d+(\.\d{1,2})?$/,
                                  message: 'Amount must be a positive number with max 2 decimal places'
                                },
                                { 
                                  validator: (_, value) => {
                                    const floatValue = value;
                                    if (floatValue === undefined || floatValue === null || floatValue <= 0) {
                                      return Promise.reject(new Error('Amount must be greater than 0'));
                                    }
                                    if (floatValue > 999999999999) {
                                      return Promise.reject(new Error('Amount exceeds maximum allowed value'));
                                    }
                                    return Promise.resolve();
                                  }
                                }
                            ]}
                        >
                            <InputComponent 
                                placeholder="Amount" 
                                type="numeric"
                                thousandSeparator=","
                                decimalSeparator="."
                                decimalScale={2}
                                fixedDecimalScale={true}
                            />
                        </Form.Item>
                    </div>
                ) : text ? Number(text).toLocaleString("id-ID") : 0;
            },
            align: "right",
            onCell: () => defaultCellProps,
        },
    ];


    if (actionType !== "none") {
        columns.push({
            title: "ACTION",
            dataIndex: "action",
            key: "action",
            width: 150,
            align: "center",
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <div className="flex justify-center gap-2" style={{ padding: '4px 0' }}>
                        <Button 
                            key="cancel" 
                            onClick={cancel} 
                            style={{ borderRadius: '8px', fontSize: '12px' }}
                        >
                            cancel
                        </Button>
                        <Button 
                            key="save" 
                            type="primary" 
                            onClick={() => save(record.key)}
                            style={{ borderRadius: '8px', fontSize: '12px' }}
                        >
                            save
                        </Button>
                    </div>
                ) : (
                    <div className="flex justify-center gap-6" style={{ padding: '4px 0' }}>
                        <Tooltip title="Edit">
                            <div onClick={() => onEdit(record)} className="cursor-pointer">
                                <SVGIcon 
                                    name="IconEditTable" 
                                    width={20} 
                                />
                            </div>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <div onClick={() => onDelete(record)} className="cursor-pointer">
                                <SVGIcon 
                                    name="IconEraserTable" 
                                    width={20} 
                                />
                            </div>
                        </Tooltip>
                    </div>
                );
            },
            onCell: () => defaultCellProps,
        });
    }

    return columns;
};
