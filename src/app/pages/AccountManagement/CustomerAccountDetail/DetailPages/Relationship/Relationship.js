import { Fragment } from "react";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import BaseContainer from "../../../../../../components/BaseContainer";
import RelationshipTable from "./RelationshipTable";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";

const Relationship = ({ id = 0, handleChangeInteraction = () => {} }) => {
  // useEffect(() => {},[]);
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [listDataCriteria, setListDataCriteria] = useState([]);
  const [criteriaOptions, setCriteriaOptions] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate;
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState();
  //   const attribute = data_detail?.attributes
  //     .map((item) => item.attributeId)
  //     .join(",");

  // const dispatch = useDispatch()

  return (
    // <Spin spinning={loading} className={"w-full top-20"} tip={"Loading..."}>
    <Fragment>
      <BaseContainer header={"RELATIONSHIP LIST"}>
        <div className="w-full flex justify-end mb-[30px]">
          <NavLink
            to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_RELATIONSHIP}
            state={{ id: id }}
          >
            <ButtonComponent
              type={"submit"}
              icon={<SVGIcon name="IconButtonCreate" width={24} />}
            >
              Create
            </ButtonComponent>
          </NavLink>
        </div>

        <div className={"w-full mt-5"}>
          <RelationshipTable
            // handleChangeInteraction={handleChangeInteraction}
          />
        </div>
      </BaseContainer>
    </Fragment>
    // </Spin>
  );
};

export default Relationship;
