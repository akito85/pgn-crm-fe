import moment from "moment";
import BaseContainer from "../../../../../components/BaseContainer";
import DetailText from "../../../../../components/DetailText";

const DetailWarrantyInformation = ({ data_detail }) => {
    return (
        <BaseContainer header={"RECEIPT INFORMATION"}>
            <div className="w-full grid grid-cols-3 gap-3">
                <DetailText label={"Payment Warranty Code"}>
                    {data_detail?.paymentWarrantyCode || "-"}
                </DetailText>
                <DetailText label={"Area Code"}>
                    {data_detail?.warrantyAreaCode || "-"}
                </DetailText>
                <DetailText label={"Area Name"}>
                    {data_detail?.areaName || "-"}
                </DetailText>

                <DetailText label={"Customer ID"}>
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
                <DetailText label={"Penerbit"}>
                    {data_detail?.publisher || "-"}
                </DetailText>

                <DetailText label={"Currency"}>
                    {data_detail?.currency || "-"}
                </DetailText>
                <DetailText label={"Ballance"}>
                    {data_detail?.balance || "-"}
                </DetailText>
                <DetailText label={"Rate"}>
                    {data_detail?.rate || "-"}
                </DetailText>

                <DetailText label={"Rate Date"}>
                    {data_detail?.rateDate
                        ? moment(data_detail?.rateDate).format("DD MMM YYYY")
                        : "-"}
                </DetailText>
                <DetailText label={"Equivalent"}>
                    {data_detail?.equivalent || "-"}
                </DetailText>
                <DetailText label={"Document Number"}>
                    {data_detail?.documentNumber || "-"}
                </DetailText>

                <DetailText label={"Mutation Date"}>
                    {data_detail?.mutationDate
                        ? moment(data_detail?.mutationDate).format("DD MMM YYYY")
                        : "-"}
                </DetailText>
                <DetailText label={"Effective Date"}>
                    {data_detail?.effectiveDate
                        ? moment(data_detail?.effectiveDate).format("DD MMM YYYY")
                        : "-"}
                </DetailText>
                <DetailText label={"Expiring Date"}>
                    {data_detail?.expiringDate
                        ? moment(data_detail?.expiringDate).format("DD MMM YYYY")
                        : "-"}
                </DetailText>

                <DetailText label={"End Date Claim"}>
                    {data_detail?.endDateClaim
                        ? moment(data_detail?.endDateClaim).format("DD MMM YYYY")
                        : "-"}
                </DetailText>
            </div>
        </BaseContainer>
    );
};

export default DetailWarrantyInformation;
