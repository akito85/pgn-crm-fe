import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Fragment } from "react";
import MiniBaseContainer from "../../../../../../components/MiniBaseContainer";
import { useDispatch, useSelector } from "react-redux";
import { getGrantedAccessAccount } from "../../../../../../redux/slices/account_management/accountManagement";
import BaseContainer from "../../../../../../components/BaseContainer";

const MultiDestination = ({
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
  const dispatch = useDispatch();
  const location = useLocation();

    // Use Effect
    useEffect(() => {
      if(location?.pathname.includes('account-standard')) {
        dispatch(getGrantedAccessAccount('/account-management/account-standard/financial-information'))
      }else{
        dispatch(getGrantedAccessAccount('/account-management/account-onetime/financial-information'))
      }
    }, [dispatch])

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

  return (
    <Fragment>
      <BaseContainer
        header={"MULTI DESTINATION LIST"}
      >
        {/* template collapse */}
        
      </BaseContainer>
    </Fragment>
  );
};

export default MultiDestination;
