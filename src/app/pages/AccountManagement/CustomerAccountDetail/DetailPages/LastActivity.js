import { Fragment } from "react";
import React, { useEffect, useRef } from "react";
import DetailText from "../../../../../components/DetailText";
import BaseContainer from "../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../components/ButtonComponent";
import StatusComponent from "../../../../../components/StatusComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import MiniBaseContainer from "../../../../../components/MiniBaseContainer";

const data_detail = {
  id: 1,
  rating: {
    time: "27 Jan 2023",
    periode: "Jan",
    value: "IDR 1.000.000",
  },
  usage: {
    time: "28 Jan 2023",
    number: "798500",
    type: "MMBTM",
  },
  lastBill: {
    time: "29 Jan 2023",
    value: "IDR 1.000.000",
  },
  payment: {
    time: "25 Jan 2023",
    value: "IDR 1.000.000",
  },
  serviceRequest: {
    time: "1 Jan 2023",
    request: "Suspend Request",
    status: "Completed",
  },
  order: {
    time: "24 Des 2022",
    request: "Gas In",
    status: "Completed",
  },
  badDebt: {
    time: "10 des 2022",
    value: "IDR 1.000.000",
  },
  saService: {
    time: "25 may 2022",
    number: "0987654",
  },
  accountStatus: {
    time: "28 jan 2022",
    request: "Active",
    by: "CM Bogor 2",
  },
  createdBy: "Ijlal",
  createdDate: "21 Agustus 2023 11:03:55",
  updatedBy: "Ijlal",
  updatedDate: "22 Agustus 2023 11:03:55",
};

const LastActivity = ({ data_header = [] }) => {
  // useEffect(() => {},[]);

  return (
    <Fragment>
      <BaseContainer header={data_header[0]}>
        <div className="w-full grid grid-cols-3 gap-3">
          <MiniBaseContainer header={"Usage"}>
            {/* Usage information */}
            <div className="w-full grid grid-cols-10">
              <div className="flex justify-center mt-2">
                <div className="dot" />
              </div>
              <div className="col-start-2 col-span-8">
                <p>
                  Last Usage : {data_detail?.usage?.time}-{" "}
                  {data_detail?.usage?.number} {data_detail?.usage?.type}
                </p>
              </div>
            </div>
          </MiniBaseContainer>

          <MiniBaseContainer header={"Rating"}>
            {/* Rating information */}
            <div className="w-full grid grid-cols-10">
              <div className="flex justify-center mt-2">
                <div className="dot" />
              </div>
              <div className="col-start-2 col-span-8">
                <p>
                  Last Rating : {data_detail?.rating?.time}-{" "}
                  {data_detail?.rating?.periode} Periode:{" "}
                  {data_detail?.rating?.value}
                </p>
              </div>
            </div>
          </MiniBaseContainer>

          <MiniBaseContainer header={"Last Billing"}>
            {/* Last Billing information */}
            <div className="w-full grid grid-cols-10">
              {/* // cirlce */}
              <div className="flex justify-center mt-2">
                <div className="dot" />
              </div>
              <div className="col-start-2 col-span-8">
                <p>
                  Last Billing : {data_detail?.lastBill?.time}-{" "}
                  {data_detail?.lastBill?.value}
                </p>
              </div>
            </div>
          </MiniBaseContainer>

          <MiniBaseContainer header={"Payment"}>
            {/* Payment information */}
            <div className="w-full grid grid-cols-10">
              <div className="flex justify-center mt-2">
                <div className="dot" />
              </div>
              <div className="col-start-2 col-span-8">
                <p>
                  Last Payment : {data_detail?.payment?.time}-{" "}
                  {data_detail?.payment?.value}
                </p>
              </div>
            </div>
          </MiniBaseContainer>

          <MiniBaseContainer header={"Service Request"}>
            {/* Service Request information */}
            <div className="w-full grid grid-cols-10">
              <div className="flex justify-center mt-2">
                <div className="dot" />
              </div>
              <div className="col-start-2 col-span-8">
                <p>
                  Last Service Request : {data_detail?.serviceRequest?.time} -{" "}
                  {data_detail?.serviceRequest?.request} - Status :{" "}
                  {data_detail?.serviceRequest?.status}
                </p>
              </div>
            </div>
          </MiniBaseContainer>

          <MiniBaseContainer header={"Order"}>
            {/* Order information */}
            <div className="w-full grid grid-cols-10">
              {/* // cirlce */}
              <div className="flex justify-center mt-2">
                <div className="dot" />
              </div>
              <div className="col-start-2 col-span-8">
                <p>
                  Last Billing : {data_detail?.order?.time} -{" "}
                  {data_detail?.order?.request} - Status :{" "}
                  {data_detail?.order?.status}
                </p>
              </div>
            </div>
          </MiniBaseContainer>

          <MiniBaseContainer header={"Bad Debt"}>
            {/* Bad Debt information */}
            <div className="w-full grid grid-cols-10">
              <div className="flex justify-center mt-2">
                <div className="dot" />
              </div>
              <div className="col-start-2 col-span-8">
                <p>
                  Last Bad Debt : {data_detail?.badDebt?.time}-{" "}
                  {data_detail?.badDebt?.value}
                </p>
              </div>
            </div>
          </MiniBaseContainer>

          <MiniBaseContainer header={"SA Approval Date"}>
            {/* SA Approval Date information */}
            <div className="w-full grid grid-cols-10">
              <div className="flex justify-center mt-2">
                <div className="dot" />
              </div>
              <div className="col-start-2 col-span-8">
                <p>
                  Last Approval Date : {data_detail?.saService?.time}- SA Number
                  : {data_detail?.saService?.number}
                </p>
              </div>
            </div>
          </MiniBaseContainer>

          <MiniBaseContainer header={"Account Status"}>
            {/* Account Status information */}
            <div className="w-full grid grid-cols-10">
              <div className="flex justify-center mt-2">
                <div className="dot" />
              </div>
              <div className="col-start-2 col-span-8">
                <p>
                  Last Service Request : {data_detail?.accountStatus?.time} -{" "}
                  {data_detail?.accountStatus?.request} - By :{" "}
                  {data_detail?.accountStatus?.status}
                </p>
              </div>
            </div>
          </MiniBaseContainer>
        </div>
      </BaseContainer>
    </Fragment>
  );
};

export default LastActivity;
