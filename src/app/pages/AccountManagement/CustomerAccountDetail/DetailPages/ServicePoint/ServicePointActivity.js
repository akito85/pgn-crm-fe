import React from "react";
import BaseContainer from "../../../../../../components/BaseContainer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ServicePointActivityTable from "./ServicePointActivityTable";

const ServicePointActivity = () => {
  //   // const dispatch = useDispatch();
  //   const { data, data_detail, loading } = useSelector((state) => state.tos);
  const [page, setPage] = useState(1);
  const navigate = useNavigate;
  const [pageSize, setPageSize] = useState(10);
  const [id, setId] = useState("");
  const [status, setStatus] = useState();

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
    <BaseContainer header={"ACTIVITY HISTORY LIST"}>
      <div className={"w-full"}>
        <ServicePointActivityTable />
      </div>
    </BaseContainer>
  );
};

export default ServicePointActivity;
