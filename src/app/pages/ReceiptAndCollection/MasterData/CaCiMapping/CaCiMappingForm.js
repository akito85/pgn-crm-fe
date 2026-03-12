import { Form, Select } from "antd";
import CardContainer from "../../../../../components/CardContainer";
import { formMessageRequired } from "../../../../../utils";
import InputComponent from "../../../../../components/InputComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import moment from "moment";
import DateComponent from "../../../../../components/DateComponent";

const CaCiMappingForm = (props) => {
  const { form, dataPartnerList, dataCollectingAgentList, dataDeliveryChannelList, dataType } = props;

  const disabledEndDate = (current) => {
    const startDate = form.getFieldValue("effStartDate");
    if (!startDate) {
      return current && current < moment().add(-1, "days");
    }
    const maxDate = moment(startDate).add(10, "years");
    return current && (current < moment(startDate) || current > maxDate);
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
            <SelectComponent
              placeholder="Select Partner"
              aria-label="Select partner for CA CI mapping"
              aria-required="true"
            >
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
            <SelectComponent
              placeholder="Select Collecting Agent"
              aria-label="Select collecting agent for CA CI mapping"
              aria-required="true"
            >
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
            <SelectComponent
              placeholder="Select Delivery Channel"
              aria-label="Select delivery channel for CA CI mapping"
              aria-required="true"
            >
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
            <InputComponent
              allowClear
              maxLength={100}
              placeholder="Input Name"
              aria-label="Input name for CA CI mapping"
              aria-required="true"
            />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={formMessageRequired("Type")}
          >
            <SelectComponent
              placeholder="Select Type"
              aria-label="Select type for CA CI mapping"
              aria-required="true"
            >
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
              dateDisable={() => false}
            />
          </Form.Item>
          <Form.Item
            label="Eff End Date"
            name="effEndDate"
            rules={[
              { required: true, message: "Please input Eff End Date!" },
              {
                validator: (_, value) => {
                  const startDate = form.getFieldValue("effStartDate");
                  if (value && startDate) {
                    const diffYears = moment(value).diff(moment(startDate), 'years');
                    if (diffYears > 10) {
                      return Promise.reject(new Error("Eff End Date cannot exceed 10 years from Eff Start Date"));
                    }
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <DateComponent placeholder="Select Eff End Date" dateDisable={disabledEndDate} />
          </Form.Item>
        </div>
      </CardContainer>
    </div>
  );
};

export default CaCiMappingForm;
