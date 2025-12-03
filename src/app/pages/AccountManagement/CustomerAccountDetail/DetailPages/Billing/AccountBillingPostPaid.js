import React from "react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Fragment } from "react";
import AccountBillingTable from "./AccountBillingTable";

const AccountBillingPostPaid = ({ handleChangeInteraction = () => {} }) => {
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
    <Fragment>
      <div className={"w-full"}>
        <AccountBillingTable
          handleChangeInteraction={handleChangeInteraction}
        />
      </div>
    </Fragment>
  );
};

export default AccountBillingPostPaid;
