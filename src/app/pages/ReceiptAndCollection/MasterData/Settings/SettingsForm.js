import { Form, Select } from "antd";
import CardContainer from "../../../../../components/CardContainer";
import { formMessageRequired } from "../../../../../utils";
import SelectComponent from "../../../../../components/SelectComponent";
import moment from "moment";
import DateComponent from "../../../../../components/DateComponent";
import InputComponent from "../../../../../components/InputComponent";
import PropTypes from "prop-types";

const SettingsForm = (props) => {
  const { form, dataMappingList } = props;
  const formatCodeName = (code, name) => {
    if (code && name) return `${code} - ${name}`;
    return code || name || "";
  };

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
      <CardContainer header={"PARTNER INFORMATION"}>
        <div className="w-full grid grid-cols-5 gap-5 mb-5">
          <Form.Item
            label="CA CI Mapping Name"
            name="mappingId"
            rules={formMessageRequired("CA CI Mapping")}
          >
            <SelectComponent
              placeholder="Select CA CI Mapping Code - Name"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
              }
              onChange={(val) => {
                const selectedItem = dataMappingList?.data?.find((item) => item.id === val);
                if (selectedItem) {
                  form.setFieldsValue({
                    partnerCode: formatCodeName(
                      selectedItem.partner?.partnerCode,
                      selectedItem.partner?.partnerName
                    ),
                    caCode: formatCodeName(
                      selectedItem.collectingAgent?.code,
                      selectedItem.collectingAgent?.name
                    ),
                    dcCode: formatCodeName(
                      selectedItem.deliveryChannel?.code,
                      selectedItem.deliveryChannel?.name
                    ),
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
            <InputComponent disabled={true} placeholder="(value)" />
          </Form.Item>
          <Form.Item label="Collecting Agent" name="caCode">
            <InputComponent disabled={true} placeholder="(value)" />
          </Form.Item>
          <Form.Item label="Delivery Channel" name="dcCode">
            <InputComponent disabled={true} placeholder="(value)" />
          </Form.Item>
          <Form.Item label="Type" name="type">
            <InputComponent disabled={true} placeholder="(value)" />
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
                    if (moment(value).isBefore(moment(startDate), "day")) {
                      return Promise.reject(new Error("End Date cannot be before Start Date"));
                    }
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
            <SelectComponent placeholder="Input Start Hour" showSearch>
              {hourOptions}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label="End Hour"
            name="endHour"
            rules={formMessageRequired("End Hour")}
          >
            <SelectComponent placeholder="Input End Hour" showSearch>
              {hourOptions}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label="Start Minute"
            name="startMinute"
            rules={formMessageRequired("Start Minute")}
          >
            <SelectComponent placeholder="Input Start Minute" showSearch>
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
            <SelectComponent placeholder="Input End Minute" showSearch>
              {minuteOptions}
            </SelectComponent>
          </Form.Item>
        </div>
      </CardContainer>
    </div>
  );
};

SettingsForm.propTypes = {
  form: PropTypes.shape({
    getFieldValue: PropTypes.func,
    setFieldsValue: PropTypes.func,
  }).isRequired,
  dataMappingList: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        name: PropTypes.string,
        type: PropTypes.string,
        partner: PropTypes.shape({
          partnerCode: PropTypes.string,
          partnerName: PropTypes.string,
        }),
        collectingAgent: PropTypes.shape({
          code: PropTypes.string,
          name: PropTypes.string,
        }),
        deliveryChannel: PropTypes.shape({
          code: PropTypes.string,
          name: PropTypes.string,
        }),
      })
    ),
  }),
};

export default SettingsForm;
