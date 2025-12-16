import { Input } from "antd";
import { Form } from "antd";
import BaseContainer from "../../../../../components/BaseContainer";
import { formMessageRequired } from "../../../../../utils";
import InputComponent from "../../../../../components/InputComponent";
import moment from "moment";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import DateComponent from "../../../../../components/DateComponent";
import SelectComponent from "../../../../../components/SelectComponent";

const CollectingAgentForm = (props) => {
    const { form } = props;

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const id = location?.state?.id;

    const typeOptions = [
        { name: "PREPAID", value: "PREPAID" },
        { name: "POSTPAID", value: "POSTPAID" },
    ];

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
            form.setFieldsValue({
                effEndDate: null,
            });
        }
    };

    const disabledStartDate = (current) => {
        return false;
    };

    return (
        <div>
            <BaseContainer header={"Collecting Agent"}>
                <div className="w-full grid grid-cols-2 gap-5">
                    <Form.Item
                        label={"Collection Agent Code"}
                        name={"caCode"}
                        rules={formMessageRequired("CA Code")}
                    >
                        <InputComponent maxLength={15} />
                    </Form.Item>
                    <Form.Item
                        label={"Name"}
                        name={"name"}
                        rules={formMessageRequired("Name")}
                    >
                        <InputComponent maxLength={100} />
                    </Form.Item>
                    <Form.Item
                        label={"Type"}
                        name={"type"}
                        rules={formMessageRequired("Type")}
                    >
                        <SelectComponent
                            options={typeOptions}
                            placeholder="Select Type"
                        />
                    </Form.Item>
                    <Form.Item
                        label={"Start Date"}
                        name={"effStartDate"}
                        rules={[
                            {
                                required: true,
                                message: "Please input your Start Date!",
                            },
                        ]}
                    >
                        <DateComponent
                            dateDisable={disabledStartDate}
                            onChange={handleStartDate}
                        />
                    </Form.Item>
                    <Form.Item
                        label={"End Date"}
                        name={"effEndDate"}
                    >
                        <DateComponent dateDisable={disabledDate} />
                    </Form.Item>
                </div>
            </BaseContainer>
        </div>
    );
};

export default CollectingAgentForm;
