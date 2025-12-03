import React, { Fragment, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"
import BaseContainer from "../../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { LeftOutlined, RightOutlined, PlusOutlined, FilterOutlined } from "@ant-design/icons";
import CustomerServiceRequestTable from "./CustomerServiceRequestTable";

const CustomerServiceRequestList = ({ id = 0, dispatch = () => {} }) => {
  //declare
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Fragment>
      <BaseContainer header={"SERVICE REQUEST LIST"}>
        <div className="mb-5 flex justify-end gap-5">
          <ButtonComponent
            type={"submit"}
            onClick={() => navigate(-1)}
            icon={
              <FilterOutlined
                style={{
                  color: "#0075bf",
                  fontSize: 24,
                  justifyItems: "center",
                }}
              />
            }
            style={{
              backgroundColor: "#fff",
              color: "#0075bf",
              borderColor: "#0075bf",
              border: "1px solid #0075bf"
            }}
            border={true}
          >
            Filter
          </ButtonComponent>
          <ButtonComponent
            type={"submit"}
            onClick={() => navigate(-1)}
            icon={
              <PlusOutlined
                style={{
                  color: "#fff",
                  fontSize: 24,
                  justifyItems: "center",
                }}
              />
            }
          >
            Create
          </ButtonComponent>
        </div>
        <CustomerServiceRequestTable id={id} dispatch={dispatch} />
      </BaseContainer>
    </Fragment>
  );
};

export default CustomerServiceRequestList;
