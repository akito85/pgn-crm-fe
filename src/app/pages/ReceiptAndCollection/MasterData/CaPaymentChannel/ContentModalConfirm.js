import moment from "moment";
import BaseContainer from "../../../../../components/BaseContainer";
import DetailText from "../../../../../components/DetailText";
import { dateFormatting } from "../../../../../utils";

const ContentModalConfirm = (props) => {
    const {
        data,
        tabData,
        listDataAttachment,
        listDataAppHierDetail,
        dataOption,
        selectedHierarchy,
    } = props;

    const getApprovalName = () => {
        const found = dataOption?.find((item) => item.value === selectedHierarchy);
        return found?.name || "-";
    };

    return (
        <div>
            <BaseContainer header={"CA PAYMENT CHANNEL INFORMATION"}>
                <div className="w-full grid grid-cols-3 gap-3">
                    <DetailText label="CA Code">{data?.caCode}</DetailText>
                    <DetailText label="CI Code">{data?.ciCode}</DetailText>
                    <DetailText label="Name">{data?.name}</DetailText>
                    <DetailText label="Partner Code">{data?.partnerCode}</DetailText>
                    <DetailText label="Type">{data?.type}</DetailText>
                    <DetailText label="Eff Start Date">
                        {data?.effStartDate
                            ? moment(data?.effStartDate, dateFormatting.date).format(
                                dateFormatting.date
                            )
                            : ""}
                    </DetailText>
                    <DetailText label="Eff End Date">
                        {data?.effEndDate
                            ? moment(data?.effEndDate, dateFormatting.date).format(
                                dateFormatting.date
                            )
                            : ""}
                    </DetailText>
                </div>
            </BaseContainer>

            <BaseContainer header={"APPROVAL INFORMATION"}>
                <div className="w-full grid grid-cols-3 gap-3">
                    <DetailText label="Approval Hierarchy">
                        {getApprovalName()}
                    </DetailText>
                </div>
            </BaseContainer>

            {listDataAttachment && listDataAttachment.length > 0 && (
                <BaseContainer header={"ATTACHMENT INFORMATION"}>
                    <div className="w-full">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2 text-left">No</th>
                                    <th className="border p-2 text-left">File Name</th>
                                    <th className="border p-2 text-left">Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listDataAttachment.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border p-2">{index + 1}</td>
                                        <td className="border p-2">{item.fileName}</td>
                                        <td className="border p-2">{item.fileCategoryName}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </BaseContainer>
            )}
        </div>
    );
};

export default ContentModalConfirm;
