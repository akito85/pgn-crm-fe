import moment from "moment";
import BaseContainer from "../../../../../components/BaseContainer";
import DetailText from "../../../../../components/DetailText";
import SubSectionCard from "../../../../../components/SubSectionCard";

const DetailWarrantyInformation = ({ data_detail }) => {
    return (
        <SubSectionCard title="GUARANTEE INFORMATION">
            <div className="w-full grid grid-cols-4 gap-x-6 gap-y-4">
                <DetailText label={"Payment Guarantee Code"}>
                    {data_detail?.paymentWarrantyCode || "-"}
                </DetailText>
                <DetailText label={"Cost Center"}>
                    {data_detail?.warrantyAreaCode || "-"}
                </DetailText>
                <DetailText label={"Account Number"}>
                    {data_detail?.accountNumber || "-"}
                </DetailText>
                <DetailText label={"Account Name"}>
                    {data_detail?.accountName || "-"}
                </DetailText>

                <DetailText label={"Customer Number"}>
                    {data_detail?.customerId || "-"}
                </DetailText>
                <DetailText label={"Customer Name"}>
                    {data_detail?.customerName || "-"}
                </DetailText>
                <DetailText label={"Customer Segment"}>
                    {data_detail?.customerSegment || "-"}
                </DetailText>
                <DetailText label={"Customer Group"}>
                    {data_detail?.customerGroup || "-"}
                </DetailText>

                <DetailText label={"Type"}>
                    {data_detail?.type || "-"}
                </DetailText>
                <DetailText label={"Document Number"}>
                    {data_detail?.documentNumber || "-"}
                </DetailText>
                <DetailText label={"Document Date"}>
                    {data_detail?.mutationDate
                        ? moment(data_detail?.mutationDate).format("DD MMM YYYY")
                        : "-"}
                </DetailText>
                <DetailText label={"Issuer"}>
                    {data_detail?.publisher || "-"}
                </DetailText>

                <DetailText label={"Issuer Branch"}>
                    {data_detail?.issuerBranch || "-"}
                </DetailText>
                <DetailText label={"Currency"}>
                    {data_detail?.currency || "-"}
                </DetailText>
                <DetailText label={"Balance Amount"}>
                    {data_detail?.balance || "-"}
                </DetailText>
                <DetailText label={"Rate Type"}>
                    {data_detail?.rateType || "-"}
                </DetailText>

                <DetailText label={"Rate Date"}>
                    {data_detail?.rateDate
                        ? moment(data_detail?.rateDate).format("DD MMM YYYY")
                        : "-"}
                </DetailText>
                <DetailText label={"Rate"}>
                    {data_detail?.rate || "-"}
                </DetailText>
                <DetailText label={"EQV Balance Amount"}>
                    {data_detail?.equivalent || "-"}
                </DetailText>
                <DetailText label={"Reff. Start Date"}>
                    {data_detail?.effectiveDate
                        ? moment(data_detail?.effectiveDate).format("DD MMM YYYY")
                        : "-"}
                </DetailText>

                <DetailText label={"Reff. End Date"}>
                    {data_detail?.expiringDate
                        ? moment(data_detail?.expiringDate).format("DD MMM YYYY")
                        : "-"}
                </DetailText>
                <DetailText label={"Claim Period"}>
                    {data_detail?.endDateClaim
                        ? moment(data_detail?.endDateClaim).format("DD MMM YYYY")
                        : "-"}
                </DetailText>
                <DetailText label={"Account Type"}>
                    {data_detail?.accountType || "-"}
                </DetailText>
                <DetailText label={"Classification Type"}>
                    {data_detail?.classificationType || "-"}
                </DetailText>
            </div>
        </SubSectionCard>
    );
};

export default DetailWarrantyInformation;
