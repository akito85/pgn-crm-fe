import { useEffect, memo } from "react";
import { Collapse } from "antd";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Fragment } from "react";
import WitholdingTax from "./WitholdingTax/WitholdingTax";
import PaymentChannel from "./Payment Channel/PaymentChannel";
import TaxIdentifierAndRelation from "./TaxIdentifier/TaxIdentifierAndRelation";
import AccountingRule from "./AccountingRule/AccountingRule";
import TaxImplication from "./TaxImplication/TaxImplication";
import BillingBucket from "./BillingBucket/BillingBucket";
import PaymentRelation from "./PaymentRelation/PaymentRelation";
import { useDispatch, useSelector } from "react-redux";
import { getGrantedAccessAccount } from "../../../../../../redux/slices/account_management/accountManagement";
import InvoiceRelation from "./InvoiceRelation/InvoiceRelation";
import { usePrevLocContext } from "../../../../../../utils/usePrevLoc";
import NxBaseContainer from "../../../../../../components/Nx/NxBaseContainer";

const { Panel } = Collapse;

const FinancialInformation = ({
  id = 0,
  idCustomer = 0,
  isApproval = false,
  setIsApproval = () => {},
  setShowApprovalButton = () => {},
  submitApprovalCondition = "",
  setSubmitApprovalCondition = () => {},
}) => {
  //   // const dispatch = useDispatch();
  //   const { data, data_detail, loading } = useSelector((state) => state.tos);
  const { path } = usePrevLocContext();
  
	const [current, setCurrent] = useState(
    path?.pathname.includes("/account-management/account-standard/financial-information/payment-relation") ? 6
    : path?.pathname.includes("/account-management/account-standard/financial-information/invoice-relation") ? 7
    : 0
  )
  
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { access_account } = useSelector(
    (state) => state.accountManagement
  );

  // Use Effect
  useEffect(() => {
    let collapse = "";

    switch (current) {
      case 0:
        collapse = "/payment-channel"
        break;
      case 1:
        collapse = "/tax-identifier"
        break;
      case 2:
        collapse = "/witholding-tax"
        break;
      case 3:
        collapse = "/accounting-rule"
        break;
      case 4:
        collapse = "/billing-bucket"
        break;
      case 5:
        collapse = "/tax-implication"
        break;
      case 6:
        collapse = "/payment-relation"
        break;
      case 7:
        collapse = "/invoice-relation"
        break;
    }

    if(location?.pathname.includes('account-standard')) {
      dispatch(getGrantedAccessAccount(`/account-management/account-standard/financial-information${collapse}`))
    }else{
      dispatch(getGrantedAccessAccount(`/account-management/account-onetime/financial-information${collapse}`))
    }
  }, [current]);

  const financialList = [
    // {
    //   header: "Insurance",
    //   children: <p>Insurance</p>,
    // },
    {
      header: "Payment Channel",
      children: <PaymentChannel access={access_account} id={id}/>,
    },
    {
      header: "Tax Identifier",
      children: <TaxIdentifierAndRelation access={access_account} id={id}/>,
    },
    {
      header: "Witholding tax",
      children: <WitholdingTax access={access_account} id={id}/>,
    },
    {
      header: "Accounting Rule",
      children: <AccountingRule id={id}/>,
    },
    // {
    //   header: "Payment Relation",
    //   children: <p>Payment Relation</p>,
    // },
    {
      header: "Billing Bucket",
      children: <BillingBucket id={id}/>,
    },
    {
      header: "Tax Implication",
      children: <TaxImplication id={id}/>,
    },
    {
      header: "Payment Relation",
      children: (
        <PaymentRelation
          id={id}
          idCustomer={idCustomer}
          isActive={current === 6}
          isApproval={isApproval}
          setIsApproval={setIsApproval}
          setShowApprovalButton={setShowApprovalButton}
          submitApprovalCondition={submitApprovalCondition}
          setSubmitApprovalCondition={setSubmitApprovalCondition}
        />
      ),
    },
    {
      header: "Invoice Relation",
      children: (
        <InvoiceRelation
          id={id}
          idCustomer={idCustomer}
          isActive={current === 7}
          isApproval={isApproval}
          setIsApproval={setIsApproval}
          setShowApprovalButton={setShowApprovalButton}
          submitApprovalCondition={submitApprovalCondition}
          setSubmitApprovalCondition={setSubmitApprovalCondition}
        />
      ),
    },
  ];

  // useEffect(() => {
  //   dispatch(getAllTosPaginate({ page, pageSize }));
  // }, [dispatch, page, pageSize]);
  // const handleDetail = (id) => {
  //   setModalDetail(true);
  //   dispatch(getTosDetail(id));
  // };

  //   const handleOk = () => {
  //     dispatch(inactiveMenu(id))
  //     dispatch(getAllTosNewsPaginate({page, pageSize}))
  //     setModalInactive(false);
  // };

	const handleCollapse = (e,index) =>{
		if(index !== current){
			setCurrent(index)
		}
		else{
			setCurrent(undefined)
		}
	}

  const collapseStyle = {
    borderRadius: 5,
  };

  const panelStyle = {
    border: "1px solid #d9d9d9",
    borderRadius: 4,
    overflow: "hidden",
  };

  const headerStyle = {
    fontSize: 15,
    fontWeight: 500,
    color: "#0075bf",
    textTransform: "uppercase",
  };

  return (
    <Fragment>
      <NxBaseContainer>
				{/* template collapse */}
        <div className="flex flex-col gap-y-4">
          {financialList.map((elm, index) => (
            <Collapse
              key={index}
							activeKey={index === current ? [0] : undefined }
							onChange={
								(e) => handleCollapse(e,index)
							}
              style={collapseStyle}
            >
              <Panel
                header={
                  <span style={headerStyle}>{elm.header}</span>
                }
                style={panelStyle}
              >
                <NxBaseContainer border>
                  {elm.children}
                </NxBaseContainer>
              </Panel>
            </Collapse>
          ))}
        </div>
      </NxBaseContainer>
    </Fragment>
  );
};

export default memo(FinancialInformation);
