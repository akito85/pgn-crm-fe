import { Fragment } from "react";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { LeftOutlined } from "@ant-design/icons";
import BaseContainer from "../../../../../../components/BaseContainer";
import DetailText from "../../../../../../components/DetailText";

const ServicePointInformation = ({
  data_serviceP = {},
  handleChangeInteraction = () => {},
}) => {
  return (
    <Fragment>
      <BaseContainer header={"Service Point Information"}>
        <div className="w-full grid grid-cols-2 gap-5">
          <DetailText label="Service Point Name">
            {data_serviceP?.spName}
          </DetailText>
          <DetailText label="Description">
            {data_serviceP?.description}
          </DetailText>
        </div>
      </BaseContainer>

      <BaseContainer header={"History Log Information"}>
        {/* history log information */}
        <div className="w-full grid grid-cols-5 gap-4">
          <DetailText label="Record ID">{data_serviceP?.id}</DetailText>
          <DetailText label="Created Date">
            {data_serviceP?.createdDate}
          </DetailText>
          <DetailText label="Created By">{data_serviceP?.createdBy}</DetailText>
          <DetailText label="Updated Date">
            {data_serviceP?.updatedDate}
          </DetailText>
          <DetailText label="Updated By">{data_serviceP?.updatedBy}</DetailText>
        </div>
      </BaseContainer>

      <div className={"w-full flex justify-start mt-10"}>
        <div className=" flex">
          <ButtonComponent
            type={"submit"}
            onClick={() => handleChangeInteraction("")}
            icon={
              <LeftOutlined
                style={{
                  color: "#fff",
                  fontSize: 24,
                  justifyItems: "center",
                }}
              />
            }
          >
            Back
          </ButtonComponent>
        </div>
      </div>
    </Fragment>
  );
};

export default ServicePointInformation;
