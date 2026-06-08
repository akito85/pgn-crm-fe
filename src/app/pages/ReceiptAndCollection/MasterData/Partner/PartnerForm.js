import { InputNumber } from "antd";
import { Form } from "antd";
import CardContainer from "../../../../../components/CardContainer";
import { formMessageRequired } from "../../../../../utils";
import InputComponent from "../../../../../components/InputComponent";
import moment from "moment";
import DateComponent from "../../../../../components/DateComponent";

const PartnerForm = (props) => {
  const {
    form,
  } = props;

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
  };

  const alignStyle = `
    .align-left-input-number .ant-input-number-input::placeholder {
      text-align: left !important;
    }
  `;

  return (
    <div>
      <style>{alignStyle}</style>
      <CardContainer header={"PARTNER INFORMATION"}>
        <div className="w-full grid grid-cols-5 gap-5">
          <Form.Item
            label={"Partner Code"}
            name={"partnerCode"}
            rules={formMessageRequired("Partner Code")}
          >
            <InputComponent allowClear maxLength={4} placeholder="Input Partner Code" />
          </Form.Item>
          <Form.Item
            label={"Partner Name"}
            name={"partnerName"}
            rules={[
              ...formMessageRequired("Partner Name"),
              { max: 20, message: "partnerName maximum length is 20" },
            ]}
          >
            <InputComponent maxLength={20} placeholder="Input Partner Name" />
          </Form.Item>

          <Form.Item
            label={"Sec Key Signature"}
            name={"secKeySignature"}
            rules={formMessageRequired("Sec Key Signature")}
          >
            <InputComponent placeholder="Input Sec Key Signature" />
          </Form.Item>
          <Form.Item
            label="Token Expiration Time"
            name="tokenExpirationTime"
            rules={formMessageRequired("Token Expiration Time")}
          >
            <InputNumber
              type={"number"}
              placeholder="Input Token Expiration Time"
              controls={false}
              className="align-left-input-number"
              style={{
                width: "100%",
                borderRadius: "5px",
              }}
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
              placeholder="Select Start Date"
              dateDisable={disabledStartDate}
              onChange={handleStartDate}
            />
          </Form.Item>
        </div>
        <div className="w-full grid grid-cols-5 gap-5">
          <Form.Item
            label={"End Date"}
            name={"effEndDate"}
            rules={formMessageRequired("Eff End Date")}
          >
            <DateComponent placeholder="Select End Date" dateDisable={disabledDate} />
          </Form.Item>
        </div>
      </CardContainer>
    </div>
  );
};

export default PartnerForm;
