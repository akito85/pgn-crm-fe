import React, { Fragment, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import BaseContainer from "../../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { Spin, Input, Form, Alert, Popover, Checkbox, Tooltip } from "antd";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import ServiceRequestTable from "./ServiceRequestTable";
import { FilterOutlined, DownloadOutlined, CheckOutlined, PlusOutlined } from "@ant-design/icons"

const ServiceRequest = () => {
  const navigate = useNavigate();

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
        <div className="flex justify-between items-center gap-5 mb-5">
          {/* Filter Button - Left side */}
          <ButtonComponent
            type={"submit"}
            onClick={() => navigate(-1)}
            icon={
              <FilterOutlined
                style={{
                  color: "#fff",
                  fontSize: 20,
                }}
              />
            }
            style={{
              backgroundColor: "#0075bf",
              color: "#fff",
              borderColor: "#0075bf",
              border: "1px solid #0075bf",
              width: "128px",
              height: "48px",
              borderRadius: "5px"
            }}
          >
            Filters
          </ButtonComponent>
          
          {/* Right side buttons container */}
          <div className="flex justify-end items-center gap-2.5">
            {/* Download List Button */}
            <ButtonComponent
              type={"submit"}
              onClick={() => {}}
              icon={
                <DownloadOutlined
                  style={{
                    color: "#fff",
                    fontSize: 20,
                  }}
                />
              }
              style={{
                backgroundColor: "#0075bf",
                color: "#fff",
                borderColor: "#0075bf",
                border: "1px solid #0075bf",
                borderRadius: "5px",
                height: "48px"
              }}
            >
              Download List
            </ButtonComponent>

            {/* Approval Button */}
            <ButtonComponent
              type={"submit"}
              onClick={() => {}}
              icon={
                <CheckOutlined
                  style={{
                    color: "#fff",
                    fontSize: 20,
                  }}
                />
              }
              style={{
                backgroundColor: "#0075bf",
                color: "#fff",
                borderColor: "#0075bf",
                border: "1px solid #0075bf",
                borderRadius: "5px",
                height: "48px"
              }}
            >
              Approval
            </ButtonComponent>

            {/* Create Button */}
            <ButtonComponent
              type={"submit"}
              onClick={() => navigate("/account-management/customers/view/service-requests/create")}
              icon={
                <PlusOutlined
                  style={{
                    color: "#fff",
                    fontSize: 20,
                  }}
                />
              }
              style={{
                backgroundColor: "#0075bf",
                color: "#fff",
                borderColor: "#0075bf",
                border: "1px solid #0075bf",
                borderRadius: "5px",
                height: "48px"
              }}
            >
              Create
            </ButtonComponent>
          </div>
        </div>
        <div className={"w-full"}>
          <ServiceRequestTable />
        </div>
      </BaseContainer>
      {/* </Spin> */}
    </Fragment>
  );
};

export default ServiceRequest;
