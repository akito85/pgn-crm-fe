import { Fragment, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BaseContainer from "../../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { useNavigate } from "react-router-dom";
import ServiceRequestTable from "./ServiceRequestTable";
import { Spin } from "antd";
import { FilterOutlined, DownloadOutlined, CheckOutlined, PlusOutlined } from "@ant-design/icons"
import { getFilteredServiceRequests } from "../../../../../../redux/slices/account_management/detailAccount/ServiceRequest"

const ServiceRequest = ({ idAccount, idCustomer, type }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { serviceRequests, loading, errors } = useSelector(state => state.serviceRequest);

  console.log(idAccount, idCustomer, type)

  useEffect(() => {
    // Fetch service requests when component mounts
    dispatch(getFilteredServiceRequests({
      page: 1,
      pageSize: 10,
      // sort: "createdDate~desc",
      search: '',
      filters: { accountId: idCustomer, isDeleted: "N" }
    }));
  }, [dispatch]);

  // if (loading.serviceRequests) {
  //   return <div>Loading service requests...</div>;
  // }

  return (
    <Fragment>
      {/*
      <Spin spinning={loading.serviceRequests} className={"w-full top-20"} tip={"Loading..."}>
      */}
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
              onClick={() => navigate("/account-management/account-standard/service-requests/create", {
                state: { idAccount, idCustomer, type }
              })}
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
      {/* 
      </Spin>
      */}
    </Fragment>
  );
};

export default ServiceRequest;
