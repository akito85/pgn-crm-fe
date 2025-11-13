import { Fragment } from "react";
import React from "react";
import DetailText from "../../../../../../components/DetailText";

const data_detail = {
  id: 1,
  category: "External",
  corporate: "Yes",
  locationInformation: {
    sor: "SOR 3",
    costCenter: "015-AREA BOGOR",
    meterReadingCodes: "0054",
  },
  accountInformation: {
    accountNumber: "CSC1234567890",
    registrationNumber: "00889977665544",
    accountName: "PT KERAMIK INTI 1",
    category: "External",
    sor: "SOR 3",
    costCenter: "015-AREA BOGOR",
    meterReadingCodes: "0054",
    customerManagement: "CM Bogor 2",
    classificationType: "Related Party",
    segment: "KI",
    accountGroupType: "BRONZE1",
    accountType: "UMU",
    status: "Active",
  },
  customerInformation: {
    customerNumber: "CSC1234567890",
    customerName: "KERAMIK INTI",
    customerType: "Organization",
    customerRefId: "01234567890",
    identificationType: "KTP",
    primaryTaxIdentificationNumber: "98761234567890",
    taxIdentificationNumber: "98761234567890",
    personalIdentificationNumber: "98761234567890",
    searchKey: "Keramk Inti Pusat",
    description: "Keramik Inti Pusat",
    status: "Active",
  },
  budget: {
    budget: "APBN",
    budgetYear: "2021",
    teritory: "APBN",
  },
  createdBy: "Annisa",
  createdDate: "21 Agustus 2023 11:03:55",
  updatedBy: "Annisa",
  updatedDate: "22 Agustus 2023 11:03:55",
};

const RelationshipConfirm = ({
	data = {}
}) => {
  // useEffect(() => {},[]);
  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"RELATIONSHIP INFORMATION"}
      </div>

      <div className="w-full grid grid-cols-4 gap-4">
        {/* Account information */}

        <DetailText label="Object Table">
          {data?.objectTable}
        </DetailText>
        <DetailText label="Object Id">
          {data?.objectId}
        </DetailText>
        <DetailText label="Relation Code">
          {data?.relationCode}
        </DetailText>
        <DetailText label="Direction Flag">{data?.directionFlag}</DetailText>
      </div>
    </Fragment>
  );
};

export default RelationshipConfirm;
