import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";

import BaseContainer from "../../../../../../components/BaseContainer";
import RadioTabs from "../../../../../../components/RadioTabs";
import TableGasUtilCurrent from "./TableGasUtilCurrent";
import TableGasUtilHistory from "./TableGasUtilHistory";
import { getGrantedAccessAccount } from "../../../../../../redux/slices/account_management/accountManagement";
import { useLocation } from "react-router-dom";

const listSegmentedPage = [
  { value: "Current Gas Utilization" },
  { value: "Gas Utilization History" },
];

const GasUtilization = ({ idAccount, idCustomer, type }) => {
  const { loading } = useSelector((state) => state.accountGasUtilization);
  const { access_account } = useSelector((state) => state.accountManagement);
  const dispatch = useDispatch();
  const [segmentedPage, setSegmentedPage] = useState("Current Gas Utilization");
  const location = useLocation();

  useEffect(() => {
    if (location?.pathname.includes("account-standard")) {
      dispatch(
        getGrantedAccessAccount(
          "/account-management/account-standard/gas-utilization",
        ),
      );
    } else {
      dispatch(
        getGrantedAccessAccount(
          "/account-management/account-onetime/gas-utilization",
        ),
      );
    }
  }, [dispatch]);

  const handleSegmentedPage = (e) => {
    setSegmentedPage(e.target.value);
  };

  return (
    <>
      <Spin spinning={loading}>
        <BaseContainer header="GAS UTILIZATION INFORMATION">
          <div className="pt-[20px]">
            <RadioTabs
              data={listSegmentedPage}
              onChange={handleSegmentedPage}
              currentPosition={segmentedPage}
            />
          </div>
          <div className={"w-full pt-4"}>
            {segmentedPage === listSegmentedPage[0].value ? (
              <TableGasUtilCurrent
                idAccount={idAccount}
                idCustomer={idCustomer}
              />
            ) : (
              <TableGasUtilHistory
                access={access_account}
                idAccount={idAccount}
                idCustomer={idCustomer}
              />
            )}
          </div>
        </BaseContainer>
      </Spin>
    </>
  );
};

export default GasUtilization;
