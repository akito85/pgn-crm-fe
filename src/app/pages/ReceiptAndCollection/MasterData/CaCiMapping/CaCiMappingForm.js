import { Form, Select } from "antd";
import CardContainer from "../../../../../components/CardContainer";
import { formMessageRequired } from "../../../../../utils";
import InputComponent from "../../../../../components/InputComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import moment from "moment";
import DateComponent from "../../../../../components/DateComponent";

const CaCiMappingForm = (props) => {
  const { form, dataPartnerList, dataCollectingAgentList, dataDeliveryChannelList, dataType } = props;

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

  return (
    <div>
      <CardContainer header={"PAYMENT CHANNEL CA CI MAPPING INFORMATION"}>
        <div className="w-full grid grid-cols-5 gap-5">
          <Form.Item
            label="Partner"
            name="partnerId"
            rules={formMessageRequired("Partner")}
          >
            <SelectComponent placeholder="Select Partner">
              {(dataPartnerList?.data || []).map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.partnerCode} - {item.partnerName}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label="Collecting Agent"
            name="collectingAgentId"
            rules={formMessageRequired("Collecting Agent")}
          >
            <SelectComponent placeholder="Select Collecting Agent">
              {(dataCollectingAgentList?.data || []).map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.caCode} - {item.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label="Delivery Channel"
            name="deliveryChannelId"
            rules={formMessageRequired("Delivery Channel")}
          >
            <SelectComponent placeholder="Select Delivery Channel">
              {(dataDeliveryChannelList?.data || []).map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.code} - {item.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={formMessageRequired("Name")}
          >
            <InputComponent allowClear maxLength={100} placeholder="Input Name" />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={formMessageRequired("Type")}
          >
            <SelectComponent placeholder="Select Type">
              {(dataType?.data || []).map((item) => (
                <Select.Option key={item.name} value={item.name}>
                  {item.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
        </div>
        <div className="w-full grid grid-cols-5 gap-5">
          <Form.Item
            label="Eff Start Date"
            name="effStartDate"
            rules={[{ required: true, message: "Please input Eff Start Date!" }]}
          >
            <DateComponent
              placeholder="Select Eff Start Date"
              onChange={handleStartDate}
            />
          </Form.Item>
          <Form.Item
            label="Eff End Date"
            name="effEndDate"
            rules={formMessageRequired("Eff End Date")}
          >
            <DateComponent placeholder="Select Eff End Date" dateDisable={disabledDate} />
          </Form.Item>
        </div>
      </CardContainer>
    </div>
  );
};

export default CaCiMappingForm;
