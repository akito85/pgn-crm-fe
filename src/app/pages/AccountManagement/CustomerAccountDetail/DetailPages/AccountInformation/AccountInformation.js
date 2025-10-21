import { Fragment } from "react";
import React, { useEffect, useRef, useState } from "react";
import DetailText from "../../../../../../components/DetailText";
import BaseContainer from "../../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import StatusComponent from "../../../../../../components/StatusComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAccountOneTimeDetail,
  getAccountStandardDetail,
  getGrantedAccessAccount,
} from "../../../../../../redux/slices/account_management/accountManagement";
import moment from "moment";
import { ModalError } from "../../../../../../components/Modal/ModalPopUp";
import { dateFormatting } from "../../../../../../utils";
import ToolbarAccount from "../../../ComponentAccount/ToolbarAccount";

const AccountInformation = ({
  id = 0,
  data_header = [],
  idCustomer = 0,
  type = "",
}) => {
  const dispatch = useDispatch();
  const { data_accountDetail, access_account } = useSelector(
    (state) => state.accountManagement,
  );

  const [modalIsEdit, setModalIsEdit] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location?.pathname.includes("account-standard")) {
      dispatch(
        getGrantedAccessAccount(
          "/account-management/account-standard/account-information",
        ),
      );
    } else {
      dispatch(
        getGrantedAccessAccount(
          "/account-management/account-onetime/account-information",
        ),
      );
    }
  }, [dispatch]);

  useEffect(() => {
    if (id && idCustomer && type) {
      if (type === "standard") {
        dispatch(getAccountStandardDetail({ idCustomer, idAccount: id }));
      } else {
        dispatch(getAccountOneTimeDetail({ idCustomer, idAccount: id }));
      }
    }
  }, [dispatch, id, idCustomer, type]);

  const renderDate = (date) => {
    if (date) {
      return moment(date).format(dateFormatting.dateTime);
    } else {
      return "";
    }
  };

  const itemActions = [
    //action toolbar

    {
      action: "Update",
      render: (
        <NavLink
          to={
            data_accountDetail?.accountInformation?.isEditor
              ? type === "standard"
                ? ACCOUNT_MANAGEMENT_ROUTES.UPDATE_ACCOUNT_STANDARD
                : ACCOUNT_MANAGEMENT_ROUTES.UPDATE_ACCOUNT_ONETIME
              : ""
          }
          state={{ idAccount: id, idCustomer: idCustomer, type: type }}
        >
          <ButtonComponent
            icon={<SVGIcon name="IconEdit" color={"#FFFFFF"} width={24} />}
            type="submit"
            // onClick={() =>
            //   handleChangeInteraction({ action: "", section: "account" })
            // }
            onClick={() =>
              setModalIsEdit(!data_accountDetail?.accountInformation?.isEditor)
            }
          >
            Update
          </ButtonComponent>
        </NavLink>
      ),
    },
  ];

  return (
    <Fragment>
      <ToolbarAccount items={itemActions} advancedAccess={access_account} />

      {/* <div className="flex w-full justify-end gap-3 mt-5">
        <NavLink
          to={
            data_accountDetail?.accountInformation?.isEditor ? 
            type === "standard" ? 
            ACCOUNT_MANAGEMENT_ROUTES.UPDATE_ACCOUNT_STANDARD : ACCOUNT_MANAGEMENT_ROUTES.UPDATE_ACCOUNT_ONETIME 
            : ''}
          state={{ idAccount: id, idCustomer: idCustomer, type: type }}
        >
          <ButtonComponent
            icon={<SVGIcon name="IconEdit" color={"#FFFFFF"} width={24} />}
            type="submit"
            // onClick={() =>
            //   handleChangeInteraction({ action: "", section: "account" })
            // }
            onClick={() => setModalIsEdit(!data_accountDetail?.accountInformation?.isEditor)}
            
          >
            Update
          </ButtonComponent>
        </NavLink>
      </div> */}

      <BaseContainer header={data_header[0]}>
        <div className="w-full grid grid-cols-3 gap-3">
          {/* Account information */}

          <DetailText label="Account Group">
            {data_accountDetail?.accountInformation?.accountGroup}
          </DetailText>
          <DetailText label="Account Reference ID">
            {data_accountDetail?.accountInformation?.accountReferenceId}
          </DetailText>
          <DetailText label="Customer Management">
            {data_accountDetail?.accountInformation?.customerManagement}
          </DetailText>
          <DetailText label="Status">
            {data_accountDetail?.accountInformation?.status}
          </DetailText>
          <div className="col-span-3">
            <DetailText label="Description">
              {data_accountDetail?.accountInformation?.description}
            </DetailText>
          </div>
        </div>

        <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
          {data_header[1]}
        </div>

        {/* account location information */}

        <div className="w-full grid grid-cols-3 gap-3">
          <DetailText label="SOR">
            {data_accountDetail?.accountInformation?.sor}
          </DetailText>
          <DetailText label="Cost-Center">
            {data_accountDetail?.accountInformation?.costCenter}
          </DetailText>
          <DetailText label="Meter Reading Code">
            {data_accountDetail?.accountInformation?.meterReadingCodes}
          </DetailText>
        </div>

        {/* <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
          {data_header[2]}
        </div> */}

        {/* account identification information */}

        {/* <div className="w-full grid grid-cols-3 gap-3">
          <DetailText label="Account Number">
            {data_accountDetail?.accountInformation?.accountNumber}
          </DetailText>
          <DetailText label="Registration Number">
            {data_accountDetail?.accountInformation?.registrationNumber}
          </DetailText>
          <DetailText label="Account Name">
            {data_accountDetail?.accountInformation?.accountName}
          </DetailText>
          <DetailText label="Category">{data_accountDetail?.accountInformation?.category}</DetailText>
        </div> */}

        <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
          {data_header[3]}
        </div>

        {/* segment information */}

        <div className="w-full grid grid-cols-3 gap-3">
          <DetailText label="Segment">
            {data_accountDetail?.accountInformation?.segment}
          </DetailText>
          <DetailText label="Account Group Type">
            {data_accountDetail?.accountInformation?.accountGroupType}
          </DetailText>
          <DetailText label="Account Type">
            {data_accountDetail?.accountInformation?.accountType}
          </DetailText>
          <DetailText label="Classification Type">
            {data_accountDetail?.accountInformation?.classificationType}
          </DetailText>
          <DetailText label="Priority">
            {data_accountDetail?.accountInformation?.priority}
          </DetailText>
          <DetailText label="Corporate Customer">
            {data_accountDetail?.accountInformation?.corporateCustomer
              ? "Yes "
              : "No"}
          </DetailText>
          <DetailText label="Rating & Billing Exception">
            {data_accountDetail?.accountInformation?.ratingAndBillingException
              ? "Yes "
              : "No"}
          </DetailText>
        </div>

        <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
          {data_header[4]}
        </div>

        {/* Budget information */}

        <div className="w-full grid grid-cols-4 gap-4">
          <DetailText label="Industrial Sector">
            {data_accountDetail?.accountInformation?.industrialSector}
          </DetailText>
        </div>

        <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
          {data_header[5]}
        </div>

        {/* Budget information */}

        <div className="w-full grid grid-cols-3 gap-3">
          <DetailText label="Budget Year">
            {data_accountDetail?.accountInformation?.budgetYear}
          </DetailText>
          <DetailText label="Budget">
            {data_accountDetail?.accountInformation?.budget}
          </DetailText>
          <DetailText label="Teritory">
            {data_accountDetail?.accountInformation?.teritory}
          </DetailText>
        </div>
      </BaseContainer>

      <BaseContainer header={data_header[6]}>
        {/* history log information */}
        <div className="w-full grid grid-cols-5 gap-4">
          <DetailText label="Record ID">
            {data_accountDetail?.accountInformation?.accountId}
          </DetailText>
          <DetailText label="Created Date">
            {moment(data_accountDetail?.accountInformation?.createdDate).format(
              dateFormatting.dateTime,
            )}
          </DetailText>
          <DetailText label="Created By">
            {data_accountDetail?.accountInformation?.createdBy}
          </DetailText>
          <DetailText label="Updated Date">
            {renderDate(data_accountDetail?.accountInformation?.updatedDate)}
          </DetailText>
          <DetailText label="Updated By">
            {data_accountDetail?.accountInformation?.updatedBy}
          </DetailText>
        </div>
      </BaseContainer>

      <ModalError
        isOpen={modalIsEdit}
        handleOk={() => setModalIsEdit(false)}
        handleCancel={() => setModalIsEdit(false)}
        customText={"Back"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">
            {
              "You cannot update this account because your position is not registered in this account customer management"
            }
          </p>
        </div>
      </ModalError>
    </Fragment>
  );
};

export default AccountInformation;
