import { Fragment } from "react";
import React from "react";
import BaseContainer from "../../../../components/BaseContainer";
import SVGIcon from "../../../../assets/Icon/index";
import CustomerInformation from "./DetailPages/CustomerInformation";
import RadioTabs from "../../../../components/RadioTabs";
import ButtonComponent from "../../../../components/ButtonComponent";
import { useState } from "react";
import AttachmentCustomer from "./DetailPages/Attachment.js/AttachmentCustomer";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../routes/account_management/customer_account_routes";
import { NavLink } from "react-router-dom";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import ToolbarAccount from "../ComponentAccount/ToolbarAccount";

const listCustomerPage = [
  { value: "Customer Information" },
  { value: "Attachment" },
];

const CustomerHeaderDetail = ({
  id = 0,
  data_detail = {},
  dispatch = () => {},
  access_account,
}) => {
  // useEffect(() => {},[]);

  //useState
  const [segmentedPage, setCustomerPage] = useState(listCustomerPage[0].value);
  const [type, setType] = useState(false);
  const [modalIsEdit, setModalIsEdit] = useState(false);
  //handle pages
  const handleCustomerPage = (e) => {
    setCustomerPage(e.target.value);
    setType(e.target.value === listCustomerPage[0].value ? false : true);
  };

  const renderSection = () => {
    switch (segmentedPage) {
      case listCustomerPage[0].value:
        return (
          <CustomerInformation
            data={data_detail}
            type={data_detail?.customerTypeId}
          />
        );
      case listCustomerPage[1].value:
        return (
          <AttachmentCustomer type={"detail"} id={id} dispatch={dispatch} />
        );
      default:
        return <></>;
    }
  };
  const itemActions = [
    {
      action: "Update",
      render: (
        <NavLink
          to={
            data_detail?.isEditor
              ? ACCOUNT_MANAGEMENT_ROUTES.UPDATE_CUSTOMER
              : ""
          }
          state={{ id: id }}
        >
          <ButtonComponent
            icon={<SVGIcon name="IconEdit" width={24} color="#FFFFFF" />}
            type={"submit"}
            border={false}
            onClick={() => setModalIsEdit(!data_detail?.isEditor)}
          >
            Update
          </ButtonComponent>
        </NavLink>
      ),
    },
  ];
  return (
    <Fragment>
      <BaseContainer>
        <div>
          <RadioTabs data={listCustomerPage} onChange={handleCustomerPage} />
        </div>

        {/* <Toolbar items={itemActions}/> */}
        <div className="flex w-full justify-end gap-3 mb-5">
          <ToolbarAccount items={itemActions} advancedAccess={access_account} />
        </div>

        <div className={"w-full flex justify-end mb-5"}>
          <NavLink
            to={data_detail?.isEditor ? ACCOUNT_MANAGEMENT_ROUTES.UPDATE_CUSTOMER : ''}
            state={{ id: id }}
          >
            <ButtonComponent
              icon={<SVGIcon name="IconEdit" width={24} color="#FFFFFF" />}
              type={"submit"}
              border={false}
              onClick={() => setModalIsEdit(!data_detail?.isEditor)}
            >
              Update
            </ButtonComponent>
          </NavLink>
        </div>

        <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
          {type ? "ATTACHMENT" : "CUSTOMER INFORMATION"}
        </div>

        <div className={"w-full mt-5"}>{renderSection()}</div>
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
              "You cannot update this customer because your entity/cost center is not registered in this customer assignment"
            }
          </p>
        </div>
      </ModalError>
    </Fragment>
  );
};

export default CustomerHeaderDetail;
