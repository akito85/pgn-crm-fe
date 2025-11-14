import moment from "moment";
import React, { Fragment, useState } from "react";
import ApprovalComponentGeneral from "../../../../../../components/Approval/ApprovalComponentGeneral";
import DetailText from "../../../../../../components/DetailText";
import RadioTabs from "../../../../../../components/RadioTabs";
import { dateFormatting } from "../../../../../../utils";
import AttachmentSectionForm from "../../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";

const ModalConfirmDailyRate = ({
  data,
  listDataAttachment = [],
  listDataAppHierDetail = [],
  tabData = [],
  data_cur,
  dataOption,
  selectedHierarchy,
  data_rate,
}) => {
  const [valuePage, setValuePage] = useState(tabData[0].value);

  const dataFromCurrency = data_cur
    ?.filter((a) => a?.Id === data?.fromCurrency)
    ?.find((b) => b?.text)?.text;

  const dataToCurrency = data_cur
    ?.filter((a) => a?.Id === data?.toCurrency)
    ?.find((b) => b?.text)?.text;

  const dataRate = data_rate
    ?.filter((a) => a?.code === data?.rateType)
    ?.find((b) => b?.text)?.text;

    const tempValue = data?.convertedRate ? (data?.convertedRate + "").split(".") : [];
    const thousandSeparator = ",";
    const decimalSeparator = ".";
    const descimal = tempValue[1]
      ? `${decimalSeparator}${tempValue[1]?.length < 2 ? `${tempValue[1]}0` : tempValue[1]}`
      : `${decimalSeparator}00`;
    const convertedRate =
      tempValue.length > 0
        ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
          descimal
        : "";
  const showSection = () => {
    switch (valuePage) {
      case tabData[0].value:
        return (
          <div>
            <div className="grid grid-cols-3 w-full">
              <DetailText label={"Rate Type"}>{dataRate}</DetailText>
              <DetailText label={"From Currency"}>
                {/* {data?.fromCurrency} */}
                {dataFromCurrency}
              </DetailText>
              <DetailText label={"To Currency"}>{dataToCurrency}</DetailText>
              <DetailText label={"Rate Date"}>
                {moment(data?.rateDate).format(dateFormatting.dateCapital)}
              </DetailText>
              <DetailText label={"Converted Rate"}>
                {convertedRate} 
              </DetailText>
            </div>
            <div>
              <DetailText label={"Description"}>{data?.description}</DetailText>
            </div>
          </div>
        );
      case tabData[1].value:
        return (
          <ApprovalComponentGeneral
            showSelect={false}
            disableSelect={true}
            approvalName={
              (dataOption || []).filter(
                (data) => data.value === selectedHierarchy
              )?.[0].name || ""
            }
            dataTable={listDataAppHierDetail}
            selectedHierarchy
          />
        );
      case tabData[2].value:
        return (
          <AttachmentSectionForm type={"preview"} data={listDataAttachment} />
        );
      default:
        return <Fragment></Fragment>;
    }
  };
  const handleMethod = (e) => {
    setValuePage(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <RadioTabs data={tabData} onChange={handleMethod} />
      <div className="flex flex-col gap-4">
        <div className="text-primary text-xs font-bold uppercase">
          {`${valuePage} INFORMATION`}
        </div>
        {showSection()}
      </div>
    </div>
  );
};

export default ModalConfirmDailyRate;
