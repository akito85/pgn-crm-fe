import moment from "moment";
import BaseContainer from "../../../../../components/BaseContainer";
import DetailText from "../../../../../components/DetailText";

const DetailTransferToCustomer = ({ data_detail }) => {
    return (
        <BaseContainer header={"TRANSFER INFORMATION"}>
            <div className="w-full grid grid-cols-3 gap-3">
                <DetailText label={"From Customer ID"}>
                    {data_detail?.fromCustomerId || "-"}
                </DetailText>

                <DetailText label={"From Customer Name"}>
                    {data_detail?.fromCustomerName || "-"}
                </DetailText>

                <DetailText label={"Area Code"}>
                    {data_detail?.areaCode || "-"}
                </DetailText>
            </div>
        </BaseContainer>
    );
};

export default DetailTransferToCustomer;
