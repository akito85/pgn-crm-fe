import { Input } from "antd";
import { Form, Select } from "antd";
import BaseContainer from "../../../../../components/BaseContainer";
import { formMessageRequired } from "../../../../../utils";
import InputComponent from "../../../../../components/InputComponent";
import moment from "moment";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import DateComponent from "../../../../../components/DateComponent";
import SelectComponent from "../../../../../components/SelectComponent";

const CaPaymentChannelForm = (props) => {
    const { form, dataCollectionAgentList, dataPaymentChannelList, dataPartnerList, dataTypeList } = props;

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const id = location?.state?.id;

    // const typeOptions = [
    //     { name: "PREPAID", value: "PREPAID" },
    //     { name: "POSTPAID", value: "POSTPAID" },
    // ];

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
            <BaseContainer header={"CA PAYMENT CHANNEL"}>
                <div className="w-full grid grid-cols-2 gap-5">
                    {/* <Form.Item
                        label={"Collection Agent Code"}
                        name={"caCode"}
                        rules={formMessageRequired("CA Code")}
                    >
                        <InputComponent maxLength={15} />
                    </Form.Item> */}
                    <Form.Item
                        label={"Collection Agent Code"}
                        name={"caCode"}
                        rules={formMessageRequired("Collection Agent Code")}
                    >
                        <SelectComponent>
                            {dataCollectionAgentList?.data?.map((data) => (
                                <Select.Option key={data.caCode} value={data.caCode}>
                                    {data.caCode} - {data.name}
                                </Select.Option>
                            ))}
                        </SelectComponent>
                    </Form.Item>

                    {/* <Form.Item
                        label={"Payment Channel Code"}
                        name={"ciCode"}
                        rules={formMessageRequired("CI Code")}
                    >
                        <InputComponent allowClear maxLength={4}  />
                    </Form.Item> */}
                    <Form.Item
                        label={"Payment Channel Code"}
                        name={"ciCode"}
                        rules={formMessageRequired("Payment Channel Code")}
                    >
                        <SelectComponent>
                            {dataPaymentChannelList?.data?.map((data) => (
                                <Select.Option key={data.ciCode} value={data.ciCode}>
                                    {data.ciCode} - {data.name}
                                </Select.Option>
                            ))}
                        </SelectComponent>
                    </Form.Item>

                    <Form.Item
                        label={"Name"}
                        name={"name"}
                        rules={formMessageRequired("Name")}
                    >
                        <InputComponent maxLength={100} />
                    </Form.Item>
                    {/* <Form.Item
                        label={"Partner Code"}
                        name={"partnerCode"}
                        rules={formMessageRequired("Partner Code")}
                    >
                        <Input allowClear maxLength={4} />
                    </Form.Item> */}

                    <Form.Item
                        label={"Partner Code"}
                        name={"partnerCode"}
                        rules={formMessageRequired("Partner Code")}
                    >
                        <SelectComponent>
                            {dataPartnerList?.data?.map((data) => (
                                <Select.Option key={data.partnerCode} value={data.partnerCode}>
                                    {data.partnerCode} - {data.partnerName}
                                </Select.Option>
                            ))}
                        </SelectComponent>
                    </Form.Item>

                    {/* <Form.Item
                        label={"Type"}
                        name={"type"}
                        rules={formMessageRequired("Type")}
                    >
                        <SelectComponent
                            options={typeOptions}
                            placeholder="Select Type"
                        />
                    </Form.Item> */}

                    <Form.Item
                        label={"Type"}
                        name={"type"}
                        rules={formMessageRequired("Type")}
                    >
                        <SelectComponent>
                            {dataTypeList?.data?.map((data) => (
                                <Select.Option key={data.name} value={data.name}>
                                    {data.name}
                                </Select.Option>
                            ))}
                        </SelectComponent>
                    </Form.Item>

                    <Form.Item
                        label={"Eff Start Date"}
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
                        label={"Eff End Date"}
                        name={"effEndDate"}
                        rules={formMessageRequired("Eff End Date")}
                    >
                        <DateComponent dateDisable={disabledDate} />
                    </Form.Item>
                </div>
            </BaseContainer>
        </div>
    );
};

export default CaPaymentChannelForm;
