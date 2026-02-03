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

const PartnerCaForm = (props) => {
  const {
    dataType,
    form,
    dataPartner,
    dataCollectionAgent,
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

  const disabledStartDate = (current) => {
    return false
  };

  return (
    <div>
      <BaseContainer header={"PARTNER CA INFORMATION"}>
        <div className="w-full grid grid-cols-5 gap-5">

          <Form.Item
            label={"Partner Code"}
            name={"partnerCode"}
            rules={formMessageRequired("Partner Code")}
          >
            <SelectComponent>
              {dataPartner?.data?.map((data) => (
                <Select.Option key={data.partnerCode} value={data.partnerCode}>
                  {data.partnerCode} - {data.partnerName}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>


          <Form.Item
            label={"Collection Agent Code"}
            name={"caCode"}
            rules={formMessageRequired("Collection Agent Code")}
          >
            <SelectComponent>
              {dataCollectionAgent?.data?.map((data) => (
                <Select.Option key={data.caCode} value={data.caCode}>
                  {data.caCode} - {data.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
          <Form.Item
            label={"Settlement Bank"}
            name={"settlementBank"}
            rules={formMessageRequired("Settlement Bank")}
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
          >
            <DateComponent
              dateDisable={disabledStartDate}
              onChange={handleStartDate}
            />
          </Form.Item>
          <Form.Item
            label={"End Date"}
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

export default PartnerCaForm;
