import React, { useState } from "react";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../components/BreadCrumb";
import BaseContainer from "../../../../../components/BaseContainer";
import DetailText from "../../../../../components/DetailText";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { LeftOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { Select, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../routes/account_management/customer_account_routes";
import { useEffect } from "react";
import { getDetailAddress } from "../../../../../redux/slices/account_management/MasterData/addresses_slice";
import GoogleMapsCustom from "../../../AccountManagement/CustomerAccountDetail/DetailPages/AccountAddress/GoogleMapsCustom";
import InputComponent from "../../../../../components/InputComponent";
import SelectComponent from "../../../../../components/SelectComponent";

const DetailAddresses = () => {
  const { loading, data_detail } = useSelector((state) => state?.address);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLocationCreateNew, setSelectedLocationCreateNew] = useState({
    lat: -6.184395,
    lng: 106.844298,
  });
  // useEffect
  useEffect(() => {
    if (location?.state?.id) {
      dispatch(getDetailAddress(location?.state?.id));
    }
  }, [location, dispatch]);

  useEffect(() => {
    if (data_detail) {
      setSelectedLocationCreateNew((prevState) => {
        return {
          ...prevState,
          lat: data_detail?.coordinateInformation?.latitude,
          lng: data_detail?.coordinateInformation?.longtitude,
        };
      });
    }
  }, [data_detail]);

  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_ADDRESSES,
      breadcrumbName: "Address",
    },
    {
      path: "",
      breadcrumbName: "Detail Address",
    },
  ];

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <BaseContainer header={"address information"}>
          <div className="w-full grid grid-cols-3">
            <DetailText label={"Country"}>
              {data_detail?.information?.country}
            </DetailText>
            <DetailText label={"Province"}>
              {data_detail?.information?.province}
            </DetailText>
            <DetailText label={"City"}>
              {data_detail?.information?.city}
            </DetailText>
          </div>
          <div className="w-full grid grid-cols-3">
            <DetailText label={"District"}>
              {data_detail?.information?.district}
            </DetailText>
            <DetailText label={"Sub District"}>
              {data_detail?.information?.subDistrict}
            </DetailText>
            <DetailText label={"Postal Code"}>
              {data_detail?.information?.postalCode}
            </DetailText>
          </div>
          <div className="w-full grid grid-cols-3">
            <DetailText label={"Building"}>
              {data_detail?.information?.building}
            </DetailText>
            <DetailText label={"Floor"}>
              {data_detail?.information?.floor}
            </DetailText>
            <DetailText label={"House Name"}>
              {data_detail?.information?.houseName}
            </DetailText>
          </div>
          <div className="w-full grid grid-cols-3">
            <DetailText label={"Street Name"}>
              {data_detail?.information?.streetName}
            </DetailText>
            <DetailText label={"Block"}>
              {data_detail?.information?.block}
            </DetailText>
            <DetailText label={"House Number"}>
              {data_detail?.information?.houseNumber}
            </DetailText>
          </div>
          <div className="w-full grid grid-cols-3">
            <DetailText label={"RT"}>{data_detail?.information?.rt}</DetailText>
            <DetailText label={"RW"}>{data_detail?.information?.rw}</DetailText>
            <DetailText label={"Type"}>
              {data_detail?.information?.type}
            </DetailText>
          </div>
          <div className="w-full grid grid-cols-2">
            <DetailText label={"Additional Note"}>
              {data_detail?.information?.additionalInfo}
            </DetailText>
          </div>
          <div className="w-full grid grid-cols-1">
            <DetailText label={"Description"}>
              {data_detail?.information?.description}
            </DetailText>
            <DetailText label={"Address"}>
              {data_detail?.information?.address?.toUpperCase()}
            </DetailText>
          </div>
        </BaseContainer>
        <BaseContainer header={"address coordinate information"}>
          <div className="w-full grid grid-cols-4 gap-3 mb-5">
            <DetailText label={"Source"}>
              {data_detail?.coordinateInformation?.source}
            </DetailText>
            <DetailText label={"Longitude"}>
              {data_detail?.coordinateInformation?.longtitude}
            </DetailText>
            <DetailText label={"Latitude"}>
              {data_detail?.coordinateInformation?.latitude}
            </DetailText>
            <DetailText label={"Altitude"}>
              {data_detail?.coordinateInformation?.altitude}
            </DetailText>
          </div>
          <GoogleMapsCustom
            zoom={13}
            selectedLocation={selectedLocationCreateNew}
          />
        </BaseContainer>
        <BaseContainer header={"history log information"}>
          <div className="w-full grid grid-cols-5">
            <DetailText label={"Record ID"}>
              {data_detail?.historyLogInformation?.id}
            </DetailText>
            <DetailText label={"Created Date"}>
              {data_detail?.historyLogInformation?.createdDate}
            </DetailText>
            <DetailText label={"Created By"}>
              {data_detail?.historyLogInformation?.createdBy}
            </DetailText>
            <DetailText label={"Updated Date"}>
              {data_detail?.historyLogInformation?.updatedDate}
            </DetailText>
            <DetailText label={"Updated By"}>
              {data_detail?.historyLogInformation?.updatedBy}
            </DetailText>
          </div>
        </BaseContainer>
        <div className="my-5">
          <ButtonComponent
            type={"submit"}
            onClick={() => navigate(-1)}
            icon={
              <LeftOutlined
                style={{
                  color: "#fff",
                  fontSize: 16,
                  justifyItems: "center",
                }}
              ></LeftOutlined>
            }
          >
            Back
          </ButtonComponent>
        </div>
      </Spin>
    </LayoutMenu>
  );
};

export default DetailAddresses;
