import React, { Fragment } from "react";
import { useState } from "react";
import BaseContainer from "../../../../../../components/BaseContainer";
import RadioTabs from "../../../../../../components/RadioTabs";
import AccountReceiptPostPaid from "./AccountReceiptPostPaid";

const listReceiptPage = [{ value: "Postpaid" }, { value: "Prepaid" }];

const AccountReceipt = ({ handleChangeInteraction = () => {} }) => {
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

  const [receiptPage, setReceiptPage] = useState(listReceiptPage[0].value);

  const handleReceiptPage = (e) => {
    setReceiptPage(e.target.value);
  };

  const renderSection = () => {
    switch (receiptPage) {
      case listReceiptPage[0].value:
        return (
          <AccountReceiptPostPaid
            handleChangeInteraction={handleChangeInteraction}
          />
        );
      case listReceiptPage[1].value:
        return <p>prepaid</p>;
      default:
        return <></>;
    }
  };

  return (
    <Fragment>
      {/* <Spin spinning={loading} className={"w-full top-20"} tip={"Loading..."}> */}
      <BaseContainer header={"RECEIPT LIST"}>
        <div>
          <RadioTabs data={listReceiptPage} onChange={handleReceiptPage} />
        </div>

        <div className={"w-full mt-5"}>{renderSection()}</div>
      </BaseContainer>
      {/* </Spin> */}
    </Fragment>
  );
};

export default AccountReceipt;
