import { Select, Form } from "antd";
import CardContainer from "../../../../../components/CardContainer";
import { formMessageRequired } from "../../../../../utils";
import moment from "moment";
import DateComponent from "../../../../../components/DateComponent";
import SelectComponent from "../../../../../components/SelectComponent";

const PartnerCaForm = (props) => {
  const {
    form,
    dataPartner,
    dataCollectionAgent,
    dataBankList,
  } = props;

  const disabledEndDate = (current) => {
    const startDate = form.getFieldValue("startDate");
    if (startDate) {
      return current && current < moment(startDate);
    }
    return false;
  };

  const handleStartDateChange = (date) => {
    if (!date) {
      form.setFieldsValue({ endDate: null });
    }
  };

  return (
    <div>
      <CardContainer header="PARTNER COLLECTING AGENT MAPPING INFORMATION">
        <div className="w-full grid grid-cols-5 gap-5">

          <Form.Item
            label="Partner"
            name="partnerId"
            rules={formMessageRequired("Partner")}
          >
            <SelectComponent
              showSearch
              filterOption={(input, option) =>
                option?.children?.toString().toLowerCase().includes(input.toLowerCase())
              }
            >
              {dataPartner?.data?.map((item) => (
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
              showSearch
              filterOption={(input, option) =>
                option?.children?.toString().toLowerCase().includes(input.toLowerCase())
              }
            >
              {dataCollectionAgent?.data?.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.caCode} - {item.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label="Settlement Bank"
            name="settlementBankId"
            rules={formMessageRequired("Settlement Bank")}
          >
            <SelectComponent
              showSearch
              filterOption={(input, option) =>
                option?.children?.toString().toLowerCase().includes(input.toLowerCase())
              }
            >
              {dataBankList?.data?.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.bankCode} - {item.bankName}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label="Start Date"
            name="startDate"
            rules={[{ required: true, message: "Please input Start Date!" }]}
          >
            <DateComponent onChange={handleStartDateChange} dateDisable={() => false} />
          </Form.Item>

          <Form.Item
            label="End Date"
            name="endDate"
          >
            <DateComponent dateDisable={disabledEndDate} />
          </Form.Item>

        </div>
      </CardContainer>
    </div>
  );
};

export default PartnerCaForm;
