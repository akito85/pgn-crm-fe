import { Form, Select } from "antd";
import CardContainer from "../../../../../components/CardContainer";
import { formMessageRequired } from "../../../../../utils";
import SelectComponent from "../../../../../components/SelectComponent";
import moment from "moment";
import DateComponent from "../../../../../components/DateComponent";
import InputComponent from "../../../../../components/InputComponent";

const SettingsForm = (props) => {
  const { form, dataMappingList } = props;

  const disabledEndDate = (current) => {
    const startDate = form.getFieldValue("startDate");
    if (!startDate) {
      return current && current < moment().add(-1, "days");
    }
    const maxDate = moment(startDate).add(10, "years");
    return current && (current < moment(startDate) || current > maxDate);
  };

  const handleStartDate = (date) => {
    if (!date) {
      form.setFieldsValue({ endDate: null });
    }
  };

  const hourOptions = Array.from({ length: 24 }, (_, i) => {
    const val = i.toString().padStart(2, "0");
    return <Select.Option key={val} value={val}>{val}</Select.Option>;
  });

  const minuteOptions = Array.from({ length: 60 }, (_, i) => {
    const val = i.toString().padStart(2, "0");
    return <Select.Option key={val} value={val}>{val}</Select.Option>;
  });

  return (
    <div>
      <CardContainer header={"PAYMENT CHANNEL CONFIGURATION INFORMATION"}>
        <div className="w-full grid grid-cols-5 gap-5 mb-5">
          <Form.Item
            label="CA CI Mapping Name"
            name="mappingId"
            rules={formMessageRequired("CA CI Mapping")}
          >
            <SelectComponent
              placeholder="Select CA CI Mapping"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
              }
              onChange={(val) => {
                const selectedItem = dataMappingList?.data?.find((item) => item.id === val);
                if (selectedItem) {
                  form.setFieldsValue({
                    partnerCode: selectedItem.partner?.partnerCode || "",
                    caCode: selectedItem.collectingAgent?.code || "",
                    dcCode: selectedItem.deliveryChannel?.code || "",
                    type: selectedItem.type || "",
                  });
                } else {
                  form.setFieldsValue({ partnerCode: "", caCode: "", dcCode: "", type: "" });
                }
              }}
            >
              {(dataMappingList?.data || []).map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
          <Form.Item label="Partner Code" name="partnerCode">
            <InputComponent disabled={true} placeholder="{value}" />
          </Form.Item>
          <Form.Item label="Collecting Agent" name="caCode">
            <InputComponent disabled={true} placeholder="{value}" />
          </Form.Item>
          <Form.Item label="Delivery Channel" name="dcCode">
            <InputComponent disabled={true} placeholder="{value}" />
          </Form.Item>
          <Form.Item label="Type" name="type">
            <InputComponent disabled={true} placeholder="{value}" />
          </Form.Item>
        </div>

        <div className="w-full grid grid-cols-5 gap-5 mb-5">
          <Form.Item
            label="Start Date"
            name="startDate"
            rules={[{ required: true, message: "Please input Start Date!" }]}
          >
            <DateComponent
              placeholder="Select Start Date"
              onChange={handleStartDate}
              dateDisable={() => false}
            />
          </Form.Item>
          <Form.Item
            label="End Date"
            name="endDate"
            rules={[
              { required: true, message: "Please input End Date!" },
              {
                validator: (_, value) => {
                  const startDate = form.getFieldValue("startDate");
                  if (value && startDate) {
                    const diffYears = moment(value).diff(moment(startDate), 'years');
                    if (diffYears > 10) {
                      return Promise.reject(new Error("End Date cannot exceed 10 years from Start Date"));
                    }
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <DateComponent placeholder="Select End Date" dateDisable={disabledEndDate} />
          </Form.Item>

          <Form.Item
            label="Start Hour"
            name="startHour"
            rules={formMessageRequired("Start Hour")}
          >
            <SelectComponent placeholder="HH" showSearch>
              {hourOptions}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label="End Hour"
            name="endHour"
            rules={formMessageRequired("End Hour")}
          >
            <SelectComponent placeholder="HH" showSearch>
              {hourOptions}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label="Start Minute"
            name="startMinute"
            rules={formMessageRequired("Start Minute")}
          >
            <SelectComponent placeholder="mm" showSearch>
              {minuteOptions}
            </SelectComponent>
          </Form.Item>
        </div>

        <div className="w-full grid grid-cols-5 gap-5">
          <Form.Item
            label="End Minute"
            name="endMinute"
            rules={formMessageRequired("End Minute")}
          >
            <SelectComponent placeholder="mm" showSearch>
              {minuteOptions}
            </SelectComponent>
          </Form.Item>
        </div>
      </CardContainer>
    </div>
  );
};

export default SettingsForm;
