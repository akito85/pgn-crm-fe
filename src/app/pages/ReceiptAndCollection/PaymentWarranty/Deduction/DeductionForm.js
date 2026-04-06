import { Select, Input } from "antd";
import { Form } from "antd";
import BaseContainer from "../../../../../components/BaseContainer";
import { formMessageRequired } from "../../../../../utils";
import DateComponent from "../../../../../components/DateComponent";
import SelectComponent from "../../../../../components/SelectComponent";

const DeductionForm = (props) => {
  const { form, isEmbedded, dataType, dataPeriod } = props;

  const content = (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-5">
        <Form.Item
          label={"Deduction Period"}
          name={"deductionPeriod"}
          rules={formMessageRequired("Deduction Period")}
        >
          <SelectComponent
            placeholder="Select Period"
            options={dataPeriod}
          />
        </Form.Item>

        <Form.Item
          label={"Type"}
          name={"type"}
          rules={formMessageRequired("Type")}
        >
          <SelectComponent
            placeholder="Select Type"
            options={dataType}
          />
        </Form.Item>

        <Form.Item
          label={"Deduction Date"}
          name={"deductionDate"}
          rules={formMessageRequired("Deduction Date")}
        >
          <DateComponent
            format="DD MMM YYYY"
            placeholder="Select Date"
          />
        </Form.Item>
      </div>

      <Form.Item
        label={"Description"}
        name={"description"}
        rules={formMessageRequired("Description")}
      >
        <Input.TextArea
          placeholder="Type..."
          rows={4}
        />
      </Form.Item>
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <BaseContainer header={"DEDUCTION INFORMATION"}>
      {content}
    </BaseContainer>
  );
};

export default DeductionForm;
