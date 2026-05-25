import BaseContainer from "../../../../components/BaseContainer";
import DetailText from "../../../../components/DetailText";

const DetailGapuraManagement = ({ data_detail }) => {
    return (
        <BaseContainer header={"GAPURA MANAGEMENT INFORMATION"}>
            <div className="w-full grid grid-cols-2 gap-3">
                <DetailText label={"Payment Gateway"}>
                    {data_detail?.paymentGateway || ""}
                </DetailText>

                <DetailText label={"Total Bank"}>
                    {data_detail?.totalBank || ""}
                </DetailText>
            </div>
        </BaseContainer>
    );
};

export default DetailGapuraManagement;
