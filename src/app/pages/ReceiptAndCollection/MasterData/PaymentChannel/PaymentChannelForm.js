import { Select, Input,InputNumber } from "antd";
import { Form } from "antd";
import BaseContainer from "../../../../../components/BaseContainer";
import { formMessageRequired } from "../../../../../utils";
import InputComponent from "../../../../../components/InputComponent";
import moment from "moment";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import DateComponent from "../../../../../components/DateComponent";
import SelectComponent from "../../../../../components/SelectComponent";

const PaymentChannelForm = (props) => {
  const {
    dataType,
    form,
  } = props;

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const id = location?.state?.id;

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
        endDate: null,
      });
    }
  };

  // const disableStartDate = (current) => {
  //   return moment().add(-2, "days") >= current;
  //   //  current && current < moment().startOf("month");
  // };
  const disabledStartDate = (current) => {
    // const today = moment();
    // const startDate = today.clone().startOf("month");
    // const endDate = today.clone().endOf("month");
    // return current < startDate || current > endDate;
    return false
  };

  return (
    <div>
      <BaseContainer header={"PAYMENT CHANNEL"}>
        <div className="w-full grid grid-cols-2 gap-5">
          <Form.Item
            label={"Payment Channel Code"}
            name={"ciCode"}
            rules={formMessageRequired("Payment Channel Code")}
          >
            <Input allowClear maxLength={4} />
          </Form.Item>
          <Form.Item
            label={"Name"}
            name={"name"}
            rules={formMessageRequired("Name")}
          >
            <InputComponent />
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
        <div className="w-full grid grid-cols-1">
          <Form.Item
            label={"Type"}
            name={"type"}
            rules={formMessageRequired("Type")}
          >
            <SelectComponent>
              {dataType?.data?.map((data) => (
                <Select.Option key={data.name} value={data.name}>
                  {data.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
        </div>
        
      </BaseContainer>
    </div>
  );
};

export default PaymentChannelForm;
