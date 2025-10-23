import { Fragment } from "react";
import React, { useEffect, useRef } from "react";
import DetailText from "../../../../../components/DetailText";
import BaseContainer from "../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../components/ButtonComponent";
import StatusComponent from "../../../../../components/StatusComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import { renderDate } from "../../../RatingBillingInvoice/POS/Utils";

const data_detail = {
  id: 1,
  customerInformation: {
    customerNumber: "CSC1234567890",
    customerName: "KERAMIK INTI",
    customerType: "Organization",
    customerRefId: "01234567890",
    identificationType: "KTP",
    taxIdentificationNumber: "98761234567890",
    personalIdentificationNumber: "98761234567890",
    searchKey: "Keramk Inti Pusat",
		description:"Keramik Inti Pusat",
    status: "Active",
  },
  additional: {
    foundedPlace: "KERAMIK INTI",
    foundedDate: "Organization",
    industrialSector: "01234567890",
    searchKey: "Keramk Inti Pusat",
  },
	createdBy: "Ijlal",
	createdDate: "21 Agustus 2023 11:03:55",
	updatedBy: "Ijlal",
	updatedDate: "22 Agustus 2023 11:03:55",
};

const CustomerInformation = ({data_header=[]}) => {
  // useEffect(() => {},[]);

  return (
    <Fragment>
			
			<div className="flex w-full justify-end gap-3 mt-5">
          {/* <NavLink to={PRODUCT_PROMO_ROUTES.VIEW_TOS_CREATE} state={{ x: 1 }}> */}
            <ButtonComponent
              icon={
								<SVGIcon name="IconEdit" color={"#FFFFFF"} width={24} />
							}
              type="submit"
            >
              Update
            </ButtonComponent>
          {/* </NavLink> */}
        </div>
      <BaseContainer header={data_header[0]}>
        <div className="w-full grid grid-cols-4 gap-4">

          {/* customer information */}
          <DetailText label="Customer Number">
            {data_detail?.customerInformation?.customerNumber}
          </DetailText>
          <DetailText label="Customer Name">
            {data_detail?.customerInformation?.customerName}
          </DetailText>
          <DetailText label="Customer Type">
            {data_detail?.customerInformation?.customerType}
          </DetailText>
          <DetailText label="Customer Reference ID">
            {data_detail?.customerInformation?.customerRefId}
          </DetailText>
          <DetailText label="Identification Type">
            {data_detail?.customerInformation?.identificationType}
          </DetailText>
          <DetailText label="Tax Identification Number">
            {data_detail?.customerInformation?.taxIdentificationNumber}
          </DetailText>
          <DetailText label="Personal Identification Number">
            {data_detail?.customerInformation?.personalIdentificationNumber}
          </DetailText>
          <DetailText label="Search Key">
            {data_detail?.additional?.searchKey}
          </DetailText>
					<DetailText label="Status">
            <div className=" flex justify-start">
              <StatusComponent colour={data_detail?.customerInformation?.status}>
                <div className="flex justify-center px-5">
                  {data_detail?.customerInformation?.status}
                </div>
              </StatusComponent>
            </div>
          </DetailText>
        </div>
        <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
          {data_header[1]}
        </div>

				{/* customer additional information */}
				
				<div className="w-full grid grid-cols-4 gap-4">
          <DetailText label="Founded Place">
            {data_detail?.additional?.foundedPlace}
          </DetailText>
          <DetailText label="Founded Date">
            {renderDate(data_detail?.additional?.foundedDate, 'date')}
          </DetailText>
          <DetailText label="Industrial Sector">
            {data_detail?.additional?.industrialSector}
          </DetailText>
         
        </div>
				</BaseContainer>

				<BaseContainer header={data_header[2]}>

					{/* history log information */}
					<div className="w-full grid grid-cols-4 gap-4">
						<DetailText label="Created Date">
							{data_detail?.createdDate}
						</DetailText>
						<DetailText label="Created By">
							{data_detail?.createdBy}
						</DetailText>
						<DetailText label="Updated Date">
							{data_detail?.updatedDate}
						</DetailText>
						<DetailText label="Updated By">
							{data_detail?.updatedBy}
						</DetailText>
					</div>
				</BaseContainer>
    </Fragment>
  );
};

export default CustomerInformation;
