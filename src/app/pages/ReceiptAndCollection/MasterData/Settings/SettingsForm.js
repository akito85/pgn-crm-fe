import { Select, Input, InputNumber } from "antd";
import { Form } from "antd";
import BaseContainer from "../../../../../components/BaseContainer";
import { formMessageRequired } from "../../../../../utils";
import InputComponent from "../../../../../components/InputComponent";
import moment from "moment";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import DateComponent from "../../../../../components/DateComponent";
import SelectComponent from "../../../../../components/SelectComponent";

const SettingsForm = (props) => {
  const {
    dataType,
    form,
    dataPartnerList,
    dataCollectionAgentList,
    dataPaymentChannelList
  } = props;

  // console.log("dataCollectionAgentList", dataCollectionAgentList);
  // console.log("dataType", dataType);
  // console.log("dataPartnerList", dataPartnerList);

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
      <BaseContainer header={"PARTNER"}>
        <div className="w-full grid grid-cols-2 gap-5">
          {/* <Form.Item
            label={"Partner Code"}
            name={"partnerCode"}
            rules={formMessageRequired("Partner Code")}
          >
            <Input allowClear maxLength={11} />
          </Form.Item> */}

          <Form.Item
            label={"Partner Code"}
            name={"partnerCode"}
            rules={formMessageRequired("partnerCode")}
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
            label={"Collection Agent Code"}
            name={"caCode"}
            rules={formMessageRequired("CA Code")}
          >
            <Input allowClear maxLength={10} />
          </Form.Item> */}

          <Form.Item
            label={"Collection Agent Code"}
            name={"caCode"}
            rules={formMessageRequired("Collection Agent Code")}
          >
            <SelectComponent>
              {/* {dataCollectionAgentList?.data?.length > 0 && (
                <Select.Option value={"All"}>All</Select.Option>
              )} */}
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
          >
            <Input allowClear maxLength={10} />
          </Form.Item> */}

          <Form.Item
            label={"Payment Channel Code"}
            name={"ciCode"}
            rules={formMessageRequired("Payment Channel Code")}
          >
            <SelectComponent>
              {/* {dataPaymentChannelList?.data?.length > 0 && (
                <Select.Option value={"All"}>All</Select.Option>
              )} */}
              {dataPaymentChannelList?.data?.map((data) => (
                <Select.Option key={data.ciCode} value={data.ciCode}>
                  {data.ciCode} - {data.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Date Start"}
            name={"dateStart"}
            rules={formMessageRequired("Date Start")}
          >
            <InputNumber
              type="number"
              controls={false}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label={"Date End"}
            name={"dateEnd"}
            rules={formMessageRequired("Date End")}
          >
            <InputNumber
              type="number"
              controls={false}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label={"Hour Start"}
            name={"hourStart"}
            rules={formMessageRequired("Hour Start")}
          >
            <InputNumber
              type="number"
              controls={false}
              min={0}
              max={23}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label={"Hour End"}
            name={"hourEnd"}
            rules={formMessageRequired("Hour End")}
          >
            <InputNumber
              type="number"
              controls={false}
              min={0}
              max={23}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label={"Minute Start"}
            name={"minuteStart"}
            rules={formMessageRequired("Minute Start")}
          >
            <InputNumber
              type="number"
              controls={false}
              min={0}
              max={59}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label={"Minute End"}
            name={"minuteEnd"}
            rules={formMessageRequired("Minute End")}
          >
            <InputNumber
              type="number"
              controls={false}
              min={0}
              max={59}
              style={{ width: "100%" }}
            />
          </Form.Item>

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

export default SettingsForm;
