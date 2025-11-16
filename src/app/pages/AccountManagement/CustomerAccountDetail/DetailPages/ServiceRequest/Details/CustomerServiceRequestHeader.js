import { Fragment } from "react";
import BaseContainer from "../../../../../../../components/BaseContainer";
import CustomerInformation from "../../../../Customer/DetailPages/CustomerInformation";


const CustomerServiceRequestHeader = ({
  id = 0,
  data_detail = {},
  dispatch = () => {},
  access_account
}) => {

  return (
    <Fragment>
      <BaseContainer header={"CUSTOMER INFORMATION"}>
        <CustomerInformation data={data_detail} type={data_detail?.customerTypeId} />
      </BaseContainer>
    </Fragment>
  );
};

export default CustomerServiceRequestHeader;
