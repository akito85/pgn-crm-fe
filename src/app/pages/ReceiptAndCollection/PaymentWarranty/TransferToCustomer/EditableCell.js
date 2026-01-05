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
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {/* Simple toggle for now, can be sophisticated based on inputType */}
                    {dataIndex === 'currency' ? (
                        <SelectComponent
                            placeholder="Select"
                            options={[{ label: "IDR", value: "IDR" }, { label: "USD", value: "USD" }]}
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
