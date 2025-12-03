import React, { Fragment } from 'react';
import BaseContainer from '../../../../../../../components/BaseContainer';
import moment from 'moment';

// Dummy data
const dummyData = {
  serviceRequestId: "SR-2025-001847",
  serviceRequestType: "Maintenance Request",
  serviceRequestCategory: "HVAC System",
  priority: "High",
  requesterName: "John Michael Thompson",
  telephone: "+1-555-0147",
  email: "john.thompson@example.com",
  source: "Phone Call",
  address: "1250 Oak Street, Suite 302, Springfield, IL 62701",
  createdDate: "2025-10-28T14:30:00Z",
  age: 45,
  escalation: "Yes",
  description: "Customer reported that the HVAC system in the main office is not functioning properly. The system has been making unusual noises for the past 3 days and the temperature control is not responding to adjustments. The thermostat displays an error code E-4521. This is affecting the entire third floor workspace with approximately 25 employees. The customer has already attempted basic troubleshooting including resetting the system and checking the thermostat batteries, but the issue persists. The system was last serviced in March 2025. Customer requests urgent attention as the lack of proper climate control is impacting productivity and employee comfort. Preferred contact time is between 9 AM and 5 PM on weekdays."
};

const data_customerDetail = {
  customerId: 1,
  createdDate: "2025-10-30T15:15:00Z",
  createdBy: "Admin",
  updatedDate: "2025-10-30T15:15:00Z",
  updatedBy: "Admin"
}

const dateFormatting = {
  date: 'MM/DD/YYYY'
};

// DetailText component (assuming you have this)
const DetailText = ({ label, children }) => (
  <div className="flex flex-col">
    <span className="text-xs font-semibold text-gray-700">{label}</span>
    <span className="text-xs text-gray-900">{children}</span>
  </div>
);

const CustomerServiceRequestDetailInfo = () => {
  const data = dummyData;

  return (
    <Fragment>
      <BaseContainer header={"SERVICE REQUEST INFORMATION"}>
        <div className="w-full grid grid-cols-4 gap-4 mb-5">
          {/* Service Request Information */}
          <DetailText label="Service Request ID">{data?.serviceRequestId}</DetailText>
          <DetailText label="Service Request Type">
            {data?.serviceRequestType}
          </DetailText>
          <DetailText label="Service Request Category">
            {data?.serviceRequestCategory}
          </DetailText>
          <DetailText label="Priority">{data?.priority}</DetailText>
          
          {/* Requester Information */}
          <DetailText label="Requester Name">{data?.requesterName}</DetailText>
          <DetailText label="Telephone">{data?.telephone}</DetailText>
          <DetailText label="Email">{data?.email}</DetailText>
          <DetailText label="Source">{data?.source}</DetailText>
          
          {/* Request Details */}
          <DetailText label="Address">{data?.address}</DetailText>
          <DetailText label="Created Date">
            {data?.createdDate ? moment(data?.createdDate).format(dateFormatting.date) : ""}
          </DetailText>
          <DetailText label="Age">{data?.age}</DetailText>
          <DetailText label="Escalation">{data?.escalation}</DetailText>
        </div>
        <div className="w-full">
          <DetailText label="Description">{data?.description}</DetailText>
        </div>
      </BaseContainer>

      <BaseContainer header={"HISTORY LOG INFORMATION"}>
        <div className="w-full grid grid-cols-5 gap-5">
          <DetailText label="Record ID">
            {data_customerDetail?.customerId}
          </DetailText>
          <DetailText label="Created Date">
            {data_customerDetail?.createdDate}
          </DetailText>
          <DetailText label="Created By">
            {data_customerDetail?.createdBy}
          </DetailText>
          <DetailText label="Update Date">
            {data_customerDetail?.updatedDate}
          </DetailText>
          <DetailText label="Updated By">
            {data_customerDetail?.updatedBy}
          </DetailText>
        </div>
      </BaseContainer>
    </Fragment>
  );
};

export default CustomerServiceRequestDetailInfo;
