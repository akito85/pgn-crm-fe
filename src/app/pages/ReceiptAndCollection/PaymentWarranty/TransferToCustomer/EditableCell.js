import { Form } from "antd";
import InputComponent from "../../../../../components/InputComponent";
import SelectComponent from "../../../../../components/SelectComponent";

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const isAmount = dataIndex === "amount";

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    getValueFromEvent={isAmount ? (val) => val.floatValue : undefined}
                    rules={
                        isAmount
                            ? [
                                { required: true, message: "Amount is required" },
                                {
                                    validator: (_, value) => {
                                        const floatValue = value;
                                        if (floatValue === undefined || floatValue === null || floatValue <= 0) {
                                            return Promise.reject(new Error("Amount must be greater than 0"));
                                        }
                                        if (floatValue > 999999999999) {
                                            return Promise.reject(new Error("Amount exceeds maximum allowed value"));
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]
                            : [
                                {
                                    required: true,
                                    message: `Please Input ${title}!`,
                                },
                            ]
                    }
                >
                    {dataIndex === "currency" ? (
                        <SelectComponent
                            placeholder="Select"
                            options={[
                                { label: "IDR", value: "IDR" },
                                { label: "USD", value: "USD" },
                            ]}
                        />
                    ) : isAmount ? (
                        <InputComponent
                            placeholder="Amount"
                            type="numeric"
                            thousandSeparator=","
                            decimalSeparator="."
                            decimalScale={2}
                            fixedDecimalScale={true}
                        />
                    ) : (
                        <InputComponent />
                    )}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export default EditableCell;
