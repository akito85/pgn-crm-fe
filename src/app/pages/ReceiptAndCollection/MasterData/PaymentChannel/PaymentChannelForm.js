import { Select, Input, InputNumber } from "antd";
import { Form } from "antd";
import CardContainer from "../../../../../components/CardContainer";
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
    dataCategory
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

  // console.log("dataCategory",dataCategory)

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
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] text-primary">
              DELIVERY CHANNEL INFORMATION
            </p>
          </div>
        }
      >
        <div className="w-full grid grid-cols-5 gap-5">
          <Form.Item
            label={"Delivery Channel Code"}
            name={"ciCode"}
            rules={formMessageRequired("Delivery Channel Code")}
            style={{ marginBottom: 0 }}
          >
            <InputComponent maxLength={4} />
          </Form.Item>
          <Form.Item
            label={"Delivery Channel Name"}
            name={"name"}
            rules={formMessageRequired("Delivery Channel Name")}
            style={{ marginBottom: 0 }}
          >
            <InputComponent />
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
          <Form.Item
            label={"Category"}
            name={"category"}
            rules={formMessageRequired("Category")}
            style={{ marginBottom: 0 }}
          >
            <SelectComponent>
              {dataCategory?.data?.map((data) => (
                <Select.Option key={data.name} value={data.name}>
                  {data.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
        </div>
      </CardContainer>
    </div>
  );
};

export default PaymentChannelForm;
