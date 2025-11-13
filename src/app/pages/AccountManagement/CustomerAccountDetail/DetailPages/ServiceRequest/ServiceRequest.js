import React, { Fragment } from "react";
import BaseContainer from "../../../../../../components/BaseContainer";
import ServiceRequestTable from "./ServiceRequestTable";

const ServiceRequest = () => {
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

  return (
    <Fragment>
      {/* <Spin spinning={loading} className={"w-full top-20"} tip={"Loading..."}> */}
      <BaseContainer header={"SERVICE REQUEST LIST"}>
        <div className={"w-full"}>
          <ServiceRequestTable />
        </div>
      </BaseContainer>
      {/* </Spin> */}
    </Fragment>
  );
};

export default ServiceRequest;
