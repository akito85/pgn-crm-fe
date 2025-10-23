import { Spin } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import ContactOverview from "../../Form/Contact/ContactOverview";

const Contact = ({
  data = [],
  prefix1,
  prefix2,
  suffix,
  keyModal,
  dataAddress = [],
}) => {
  // Selector
  const { loading } = useSelector((state) => state.account);
  return (
    <Spin spinning={loading}>
      <div className="w-full p-5">
        <p className="text-primary uppercase font-bold">
          Account Contact Information
        </p>

        <div className="pt-[30px]">
          <ContactOverview
            type={"confirmation"}
            contactTable={data}
            prefix1={prefix1}
            prefix2={prefix2}
            suffix={suffix}
            keyModal={keyModal}
            dataAddress={dataAddress}
          />
        </div>
      </div>
    </Spin>
  );
};

export default Contact;
