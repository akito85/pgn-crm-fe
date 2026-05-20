import { Form } from "antd";
import CardContainer from "../../../../../components/CardContainer";
import { formMessageRequired } from "../../../../../utils";
import InputComponent from "../../../../../components/InputComponent";
import moment from "moment";
import DateComponent from "../../../../../components/DateComponent";

const CollectingAgentForm = (props) => {
    const { form } = props;

    const disabledDate = (current) => {
        if (
            form.getFieldValue("effStartDate") === undefined ||
            form.getFieldValue("effStartDate") === null
        ) {
            return current && current < moment().add(-1, "days");
        } else {
            return current && current < moment(form.getFieldValue("effStartDate"));
        }
    };

    const handleStartDate = (date) => {
        if (!date) {
            form.setFieldsValue({ effEndDate: null });
        }
    };

    const disabledStartDate = () => false;

    return (
        <div>
            <CardContainer
                header={
                    <div className="flex -my-4 justify-between items-center">
                        <p className="mt-[15px] text-primary">
                            COLLECTING AGENT INFORMATION
                        </p>
                    </div>
                }
            >
                <div className="w-full grid grid-cols-4 gap-5">
                    <Form.Item
                        label={"Collection Agent Code"}
                        name={"caCode"}
                        rules={formMessageRequired("CA Code")}
                        style={{ marginBottom: 0 }}
                    >
                        <InputComponent maxLength={15} />
                    </Form.Item>
                    <Form.Item
                        label={"Collection Agent Name"}
                        name={"name"}
                        rules={formMessageRequired("CA Name")}
                        style={{ marginBottom: 0 }}
                    >
                        <InputComponent maxLength={100} />
                    </Form.Item>
                    <Form.Item
                        label={"Start Date"}
                        name={"effStartDate"}
                        rules={[{ required: true, message: "Please input your Start Date!" }]}
                        style={{ marginBottom: 0 }}
                    >
                        <DateComponent
                            dateDisable={disabledStartDate}
                            onChange={handleStartDate}
                        />
                    </Form.Item>
                    <Form.Item
                        label={"End Date"}
                        name={"effEndDate"}
                        rules={[{ required: false }]}
                        style={{ marginBottom: 0 }}
                    >
                        <DateComponent dateDisable={disabledDate} />
                    </Form.Item>
                </div>
            </CardContainer>
        </div>
    );
};

export default CollectingAgentForm;

