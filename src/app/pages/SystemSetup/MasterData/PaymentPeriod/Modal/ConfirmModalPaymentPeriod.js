import moment from "moment";
import { Fragment, useState } from "react";
import ApprovalComponentGeneral from "../../../../../../components/Approval/ApprovalComponentGeneral";
import DetailText from "../../../../../../components/DetailText";
import RadioTabs from "../../../../../../components/RadioTabs";
import { dateFormatting } from "../../../../../../utils";
import AttachmentSectionForm from "../../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";

const ConfirmModalPaymentPeriod = ({
    data,
    dataOption,
    selectedHierarchy,
    listDataAppHierDetail = [],
    listDataAttachment = [],
    tabData = [],
}) => {
    const [valuePage, setValuePage] = useState(tabData[0].value);

    const showSection = () => {
        switch (valuePage) {
            case tabData[0].value:
                return (
                    <div className="w-full">
                        <div className="grid grid-cols-2 gap-4 w-full">
                            <DetailText label={"Period Name"}>
                                {data?.periodName || "-"}
                            </DetailText>
                            <DetailText label={"Start Date"}>
                                {data?.startDate ? moment(data?.startDate).format(dateFormatting.date) : "-"}
                            </DetailText>
                            <DetailText label={"End Date"}>
                                {data?.endDate ? moment(data?.endDate).format(dateFormatting.date) : "-"}
                            </DetailText>
                            <div className="col-span-2">
                                <DetailText label={"Description"}>
                                    {data?.description || "-"}
                                </DetailText>
                            </div>
                        </div>
                    </div>
                );
            case tabData[1].value:
                return (
                    <ApprovalComponentGeneral
                        showSelect={false}
                        disableSelect={true}
                        approvalName={
                            (dataOption || []).find((opt) => opt.value === selectedHierarchy)?.name || ""
                        }
                        dataTable={listDataAppHierDetail}
                        selectedHierarchy={selectedHierarchy}
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

    const handleTabChange = (e) => {
        setValuePage(e.target.value);
    };

    return (
        <div className="flex flex-col gap-4">
            <RadioTabs
                data={tabData}
                onChange={handleTabChange}
                currentPosition={valuePage}
            />
            <div className="flex flex-col gap-4">
                <div className="text-primary text-xs font-bold uppercase">
                    {`${valuePage} INFORMATION`}
                </div>
                {showSection()}
            </div>
        </div>
    );
};

export default ConfirmModalPaymentPeriod;
