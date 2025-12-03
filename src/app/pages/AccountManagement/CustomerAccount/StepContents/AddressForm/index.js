import React, { useState } from "react";
import { Form } from "antd";

import RadioTabs from "../../../../../../components/RadioTabs";
import ChooseAddressForm from "./ChooseAddressForm";
import CreateNewAddressForm from "./CreateNewAddressForm";

const headerTab = [
  { value: "Choose From Existing" },
  { value: "Create New Address" },
];

const AddressForm = () => {
  const [listSectionInfo, setListSectionInfo] = useState([
    { value: "Choose From Existing" },
    { value: "Create New Address" },
  ]);

  const [form] = Form.useForm();
  const [typeTabInfo, setTypeTabInfo] = useState(listSectionInfo[0].value);

  const handleTabInfo = (e) => {
    console.log(e.target.value);
    setTypeTabInfo(e.target.value);
  };

  return (
    <div>
      <RadioTabs data={headerTab} onChange={handleTabInfo} />
      <Form
        id="existingAddressForm"
        form={form}
        layout={"vertical"}
        onFinish={""}
        onFinishFailed={""}
        scrollToFirstError={true}
      >
        <div className="py-4">
          {typeTabInfo === listSectionInfo[0].value ? (
            <div>
              <ChooseAddressForm />
            </div>
          ) : (
            <div>
              <CreateNewAddressForm />
            </div>
          )}
        </div>
      </Form>
    </div>
  );
};

export default AddressForm;
