import React, { Fragment } from "react";
import { useState } from "react";
import AccountBillingPostPaid from "./AccountBillingPostPaid";
import BaseContainer from "../../../../../../components/BaseContainer";
import RadioTabs from "../../../../../../components/RadioTabs";

const listBillingPage = [
  { value: "Postpaid" },
  { value: "Prepaid" },
];

const AccountBilling = ({
  handleChangeInteraction = () => {},
}) => {
  // const dispatch = useDispatch();

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
  
  const [segmentedPage, setBillingPage] = useState(
    listBillingPage[0].value
  );

  const handleBillingPage = (e) => {
    setBillingPage(e.target.value);
  };

  const renderSection = () => {
    switch (segmentedPage) {
      case listBillingPage[0].value:
        return <AccountBillingPostPaid handleChangeInteraction={handleChangeInteraction}/>;
      case listBillingPage[1].value:
        return <p>prepaid</p>
      default:
        return <></>;
    }
  };

  return (
    <Fragment>
      {/* <Spin spinning={loading} className={"w-full top-20"} tip={"Loading..."}> */}
        <BaseContainer header={"BILLING LIST"}>
            
        <div>
          <RadioTabs data={listBillingPage} onChange={handleBillingPage} />
        </div>

        <div className={"w-full mt-5"}>{renderSection()}</div>
          
      </BaseContainer>
      {/* </Spin> */}
    </Fragment>
  );
};

export default AccountBilling;
