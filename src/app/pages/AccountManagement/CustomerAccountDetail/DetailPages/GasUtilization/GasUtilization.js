import React,{ useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Spin, Tabs } from 'antd'

import BaseContainer from '../../../../../../components/BaseContainer'
import RadioTabs from '../../../../../../components/RadioTabs'
import TableGasUtilCurrent from './TableGasUtilCurrent'
import TableGasUtilHistory from './TableGasUtilHistory'
import { getGrantedAccessAccount } from '../../../../../../redux/slices/account_management/accountManagement'
import { useLocation } from 'react-router-dom'
import NxCardContainer from '../../../../../../components/Nx/NxCardContainer'


const listSegmentedPage = [
  { value: "Current Gas Utilization" },
  { value: "Gas Utilization History" },
];

const GasUtilization = ({idAccount, idCustomer, type}) => {
  const {loading } = useSelector(
    (state) =>  state.accountGasUtilization
  );
  const { access_account } = useSelector(
    (state) => state.accountManagement
  );
  const dispatch = useDispatch();
  const [segmentedPage, setSegmentedPage] = useState("Current Gas Utilization");
  const location = useLocation();

  useEffect(() => {
    if(location?.pathname.includes('account-standard')) {
      dispatch(getGrantedAccessAccount('/account-management/account-standard/gas-utilization'))
    }else{
      dispatch(getGrantedAccessAccount('/account-management/account-onetime/gas-utilization'))
    }
  }, [dispatch])

  const handleSegmentedPage = (e) => {
    setSegmentedPage(e.target.value);
  };

  const tabOptions = [
    {
      key: "current",
      label: "Current Gas Utilization",
      children: (
        <TableGasUtilCurrent idAccount={idAccount} idCustomer={idCustomer}/>
      )
    },
    {
      key: "history",
      label: "Gas Utilization History",
      children: (
        <TableGasUtilHistory access={access_account} idAccount={idAccount} idCustomer={idCustomer}/>
      )
    },
  ];

  const [activeKey, setActiveKey] = useState(tabOptions[0]?.key || "");

  return (
    <>
      <Spin spinning={loading}>
        <NxCardContainer
          header={"GAS UTILIZATION INFORMATION"}
          type={"tabs"}
          element={
            <Tabs
              items={tabOptions}
              onChange={setActiveKey}
              activeKey={activeKey}
              className="[&_.ant-tabs-tab]:text-[12px] [&_.ant-tabs-tab]:py-4 [&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-nav]:pt-0 -mt-0" 
            />
          }
          hideChildren
          withoutTopPadding
        >
        </NxCardContainer>
      </Spin>
    </>
  )
}

export default GasUtilization