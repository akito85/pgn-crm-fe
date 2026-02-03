import React from "react";
import BaseContainer from "../../../../../components/BaseContainer";
import TableRBI from "../../../../../components/TableRBI";

const DetailPaymentWarrantyPartner = (props) => {
  const { data } = props;

  const renderInfo = (label, value) => (
    <div className="flex flex-col gap-1">
      <span className="text-gray-500 text-xs">{label}</span>
      <span className="font-semibold text-sm">{value || "-"}</span>
    </div>
  );

  const columnsAttachment = [
    { title: "NO", width: 60, align: "center", render: (text, record, index) => index + 1 },
    { title: "FILE NAME", dataIndex: "fileName", key: "fileName" },
    { title: "CATEGORY", dataIndex: "category", key: "category" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <BaseContainer header={"PARTNER INFORMATION"}>
        <div className="grid grid-cols-5 gap-5">
          {renderInfo("Partner Name", data?.partnerName)}
          {renderInfo("Partner Type", data?.partnerType)}
          {renderInfo("Swift Code", data?.swiftCode)}
          {renderInfo("NPWP", data?.npwp)}
          {renderInfo("License Number", data?.licenseNum)}
          {renderInfo("Parent ID", data?.parentId)}
        </div>
      </BaseContainer>

      <BaseContainer header={"ADDRESS INFORMATION"}>
        <div className="grid grid-cols-4 gap-5">
          {renderInfo("Street", data?.address?.street)}
          {renderInfo("Building", data?.address?.building)}
          {renderInfo("Address Number", data?.address?.addressNum)}
          {renderInfo("District", data?.address?.district)}
          {renderInfo("City", data?.address?.city)}
          {renderInfo("Province", data?.address?.province)}
          {renderInfo("Country", data?.address?.country)}
          {renderInfo("Zip Code", data?.address?.zipCode)}
        </div>
      </BaseContainer>

      <BaseContainer header={"CONTACT INFORMATION"}>
        <div className="grid grid-cols-3 gap-5">
          {renderInfo("Contact Person", data?.contact?.contactPerson)}
          {renderInfo("Phone Number", data?.contact?.phoneNum)}
          {renderInfo("Email", data?.contact?.email)}
        </div>
      </BaseContainer>

      <BaseContainer header={"ATTACHMENT INFORMATION"}>
        <TableRBI
          dataSource={data?.attachmentDtoList || []}
          columns={columnsAttachment}
          pagination={false}
        />
      </BaseContainer>
    </div>
  );
};

export default DetailPaymentWarrantyPartner;
