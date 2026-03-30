import { Select, Input } from "antd";
import { Form } from "antd";
import BaseContainer from "../../../../../components/BaseContainer";
import { formMessageRequired } from "../../../../../utils";
import DateComponent from "../../../../../components/DateComponent";
import SelectComponent from "../../../../../components/SelectComponent";

const DeductionForm = (props) => {
  const { form, isEmbedded } = props;

  // Dummy Data
  const periodOptions = [
    { label: "Jan 2023", value: "Jan 2023" },
    { label: "Feb 2023", value: "Feb 2023" },
    { label: "Mar 2023", value: "Mar 2023" },
  ];

  const typeOptions = [
    { label: "Gas", value: "Gas" },
    { label: "Non-Gas", value: "Non-Gas" },
  ];

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
            options={periodOptions}
          />
        </Form.Item>

        <Form.Item
          label={"Type"}
          name={"type"}
          rules={formMessageRequired("Type")}
        >
          <SelectComponent
            placeholder="Select Type"
            options={typeOptions}
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
