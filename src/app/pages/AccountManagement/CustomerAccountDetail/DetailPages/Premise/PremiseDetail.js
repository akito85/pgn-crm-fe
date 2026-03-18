import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Spin } from "antd";
import moment from "moment";
import BaseContainer from "../../../../../../components/BaseContainer";
import DetailText from "../../../../../../components/DetailText";
import { LeftOutlined } from "@ant-design/icons";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import BreadCrumbAdvanced from "../../../../../../components/BreadCrumbAdvanced";
import HeaderDetail from "../../HeaderDetail";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import { useDispatch, useSelector } from "react-redux";
import { getPremiseDetail } from "../../../../../../redux/slices/account_management/detailAccount/Premise";
import GoogleMapsCustom from "../AccountAddress/GoogleMapsCustom";
import { dateFormatting } from "../../../../../../utils";

const PremiseDetail = () =>
  // { id = {},
  // handleChangeInteraction = () => {} }
  {
    const dispatch = useDispatch();
    const { data_premiseDetail, loading } = useSelector(
      (state) => state.premise
    );

    //declare
    const navigate = useNavigate();
    const location = useLocation();
    const id = location?.state?.id;
    const premiseId = location?.state?.premiseId;
    const idCustomer = location?.state?.idCustomer;
    const type = location?.state?.type;
    const [selectedLocationDetail, setSelectedLocationDetail] = useState({
      lat: {},
      lng: {},
    });
    // const id = 101;

    //utils
    // console.log(location?.state, "id");
    const renderDate = (date) => {
      if (date) {
        return moment(date).format(dateFormatting.dateTime);
      } else {
        return "";
      }
    };

    //useEffect
    useEffect(() => {
      if (id) {
        dispatch(getPremiseDetail(premiseId));
      }
    }, [dispatch, premiseId]);

    useEffect(() => {
      if (data_premiseDetail) {
        setSelectedLocationDetail({
          lat: parseFloat(data_premiseDetail?.latitude),
          lng: parseFloat(data_premiseDetail?.longitude),
        });
      }
    }, [data_premiseDetail]);

    const routes = (id) => {
      return [
        {
          path: "",
          breadcrumbName: "Account",
        },
        {
          path:
            type == "standard"
              ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD
              : ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_ONETIME,
          breadcrumbName:
            type == "standard" ? "Account - Standard" : "Account - One Time",
        },
        {
          path:
            type == "standard"
              ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
              : ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME,
          breadcrumbName: "Detail Account",
          state: {
            idAccount: id,
          }
        },
        {
          path: "",
          breadcrumbName: "Detail Premise",
        },
      ];
    }

    return (
      <Spin spinning={loading} className={"w-full top-20"}>
        <BreadCrumbAdvanced routes={routes(id)} />
        <div className="w-full">
          <HeaderDetail
            data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
            dispatch={dispatch}
            idAccount={id}
            idCustomer={idCustomer}
            type={type}
          />
        </div>

        <BaseContainer header={"PREMISE ADDRESS INFORMATION"}>
          <div className="w-full grid grid-cols-4 gap-4">
            <DetailText label="Country">
              {data_premiseDetail?.country?.name}
            </DetailText>
            <DetailText label="Province">
              {data_premiseDetail?.province?.name}
            </DetailText>
            <DetailText label="City">
              {data_premiseDetail?.city?.name}
            </DetailText>
            <DetailText label="District">
              {data_premiseDetail?.district?.name}
            </DetailText>
            <DetailText label="Sub-District">
              {data_premiseDetail?.subDistrict?.name}
            </DetailText>
            <DetailText label="Postal Code">
              {data_premiseDetail?.postalCode?.name}
            </DetailText>
            <DetailText label="Building">
              {data_premiseDetail?.building}
            </DetailText>
            <DetailText label="Floor">{data_premiseDetail?.floor}</DetailText>
            <DetailText label="House Name">
              {data_premiseDetail?.houseName}
            </DetailText>
            <DetailText label="Street Name">
              {data_premiseDetail?.streetName}
            </DetailText>
            <DetailText label="Block">{data_premiseDetail?.block}</DetailText>
            <DetailText label="House Number">
              {data_premiseDetail?.houseNumber}
            </DetailText>{" "}
            {/* <DetailText label="Street Number">
              {data_premiseDetail?.streetNumber}
            </DetailText> */}
            <DetailText label="RT">{data_premiseDetail?.rt}</DetailText>
            <DetailText label="RW">{data_premiseDetail?.rw}</DetailText>
            <DetailText label="Type">{data_premiseDetail?.type}</DetailText>
            <DetailText label="Additonal Information">
              {data_premiseDetail?.additionalNote}
            </DetailText>
            <div className="col-span-3">
              <DetailText label="Description">
                {data_premiseDetail?.descAddress}
              </DetailText>
            </div>
            <div className="col-span-3">
              <DetailText label="Address">
                {data_premiseDetail?.fullAddress}
              </DetailText>
            </div>
          </div>

          <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
            {"ADDRESS COORDINATE"}
          </div>

          <div className="w-full grid grid-cols-4 gap-4">
            <DetailText label="Source">
              {data_premiseDetail?.source}
            </DetailText>
            <DetailText label="Longitude">
              {data_premiseDetail?.longitude}
            </DetailText>
            <DetailText label="Latitude">
              {data_premiseDetail?.latitude}
            </DetailText>
            <DetailText label="Altitude">
              {data_premiseDetail?.altitude}
            </DetailText>
          </div>

          {/* SECTION ADDRESS PURPOSE INFORMATION */}
          <div className="text-center">
            <GoogleMapsCustom
              zoom={19}
              selectedLocation={selectedLocationDetail}
            />
          </div>

          <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
            ADDRESS PURPOSE INFORMATION
          </div>
          <div className="w-full grid grid-cols-4 gap-4">
            <DetailText label="Business Purpose">
              {data_premiseDetail?.businessPurpose}
            </DetailText>
            <DetailText label="Premise">
              {data_premiseDetail?.premiseFlag ? "Yes" : "No"}
            </DetailText>
            <DetailText label="Primary">
              {data_premiseDetail?.primaryFlag ? "Yes" : "No"}
            </DetailText>
          </div>
          <div className="col-span-3">
            <DetailText label="Remark">
              {data_premiseDetail?.descAccountAddress}
            </DetailText>
          </div>
        </BaseContainer>

        <BaseContainer header={"History Log Information"}>
          <div className="w-full grid grid-cols-5 gap-5">
            <DetailText label="Record ID">
              {data_premiseDetail?.accountAddressId}
            </DetailText>
            <DetailText label="Created Date">
              {moment(data_premiseDetail?.createdDate).format(
                dateFormatting.dateTime
              )}
            </DetailText>
            <DetailText label="Created By">
              {data_premiseDetail?.createdBy}
            </DetailText>
            <DetailText label="Updated Date">
              {renderDate(data_premiseDetail?.updatedDate)}
            </DetailText>
            <DetailText label="Updated By">
              {data_premiseDetail?.updatedBy}
            </DetailText>
          </div>
        </BaseContainer>

        <div className="my-5 flex">
          <Link
            to={
              type === "standard"
                ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
                : ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME
            }
            state={{
              section: "Premise",
              idAccount: id,
              idCustomer: idCustomer,
            }}
          >
            <ButtonComponent
              type={"submit"}
              // onClick={() => {
              //   // handleChangeInteraction({
              //   //   action: "",
              //   //   section: "",
              //   // });

              // }}
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
          </Link>
        </div>
      </Spin>
    );
  };
export default PremiseDetail;
