import moment from "moment";
import DetailText from "../../../../../components/DetailText";
import SubSectionCard from "../../../../../components/SubSectionCard";

const DetailTransferToCustomer = ({ data_detail }) => {
    return (
        <SubSectionCard title="TRANSFER TO CUSTOMER INFORMATION">
            <div className="w-full grid grid-cols-4 gap-3">
                <DetailText label={"From Customer Number"}>
                    {data_detail?.fromCustomerId || ""}
                </DetailText>

                <DetailText label={"From Customer Name"}>
                    {data_detail?.fromCustomerName || ""}
                </DetailText>

                <DetailText label={"Area Code"}>
                    {data_detail?.areaCode || ""}
                </DetailText>

                <DetailText label={"Category"}>
                    {data_detail?.category || ""}
                </DetailText>
            </div>
            <div className="mt-4">
                <DetailText label={"Description"}>
                    {data_detail?.description || ""}
                </DetailText>
            </div>
        </SubSectionCard>
    );
};

export default DetailTransferToCustomer;
