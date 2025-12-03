import React from "react";
<<<<<<< HEAD
import BaseContainer from "../components/CardContainer";
import { CloseCircleOutlined } from "@ant-design/icons";
import ButtonComponent from "../components/ButtonComponent";
import { useNavigate } from "react-router-dom";
import MaintenanceModeNotFound from "./pages/SystemSetup/MaintenanceMode/MaintenanceModeNotFound";

const NotFound = ({ type }) => {
  const navigate = useNavigate();

  const renderPage = (type) => {
    if (type === "not_found") {
      return (
        <div className="min-h-screen my-5">
          <div className={"py-auto"}>
            <div className={"w-full h-auto flex justify-center pt-10"}>
              <CloseCircleOutlined style={{ color: "red", fontSize: "3rem" }} />
            </div>
            <div className="w-full flex justify-center my-3">
              <h2 className={"font-semibold"}> 404 Not Found</h2>
            </div>
            <div className="w-full flex justify-center my-3">
              <ButtonComponent type={"reject"} onClick={() => navigate(-1)}>
                Back
              </ButtonComponent>
            </div>
          </div>
        </div>
      );
    } else if (type === "maintenance") {
      return <MaintenanceModeNotFound />;
    } else {
      return (
        <div>
          <BaseContainer>
            <div className={"w-full h-auto flex justify-center"}>
              <CloseCircleOutlined style={{ color: "red", fontSize: "3rem" }} />
            </div>
            <div className="w-full flex justify-center my-3">
              <h2 className={"font-semibold"}> Unauthorized Page</h2>
            </div>
            <div className="w-full flex flex-row justify-center">
              <h3>You don't have to access this page</h3>
            </div>
            <div className="w-full flex flex-row justify-center">
              <ButtonComponent type={"reject"} onClick={() => navigate(-1)}>
                Back
              </ButtonComponent>
            </div>
          </BaseContainer>
        </div>
      );
    }
  };

  return <>{renderPage(type)}</>;
||||||| (empty tree)
=======
import BaseContainer from "../components/BaseContainer";
import { CloseCircleOutlined } from "@ant-design/icons";
import ButtonComponent from "../components/ButtonComponent";
import { useNavigate } from "react-router-dom";
import MaintenanceModeNotFound from "./pages/SystemSetup/MaintenanceMode/MaintenanceModeNotFound";

const NotFound = ({ type }) => {
  const navigate = useNavigate();

  const renderPage = (type) => {
    if (type === "not_found") {
      return (
        <div className="min-h-screen my-5">
          <div className={"py-auto"}>
            <div className={"w-full h-auto flex justify-center pt-10"}>
              <CloseCircleOutlined style={{ color: "red", fontSize: "3rem" }} />
            </div>
            <div className="w-full flex justify-center my-3">
              <h2 className={"font-semibold"}> 404 Not Found</h2>
            </div>
            <div className="w-full flex justify-center my-3">
              <ButtonComponent type={"reject"} onClick={() => navigate(-1)}>
                Back
              </ButtonComponent>
            </div>
          </div>
        </div>
      );
    } else if (type === "maintenance") {
      return <MaintenanceModeNotFound />;
    } else {
      return (
        <div>
          <BaseContainer>
            <div className={"w-full h-auto flex justify-center"}>
              <CloseCircleOutlined style={{ color: "red", fontSize: "3rem" }} />
            </div>
            <div className="w-full flex justify-center my-3">
              <h2 className={"font-semibold"}> Unauthorized Page</h2>
            </div>
            <div className="w-full flex flex-row justify-center">
              <h3>You don't have to access this page</h3>
            </div>
            <div className="w-full flex flex-row justify-center">
              <ButtonComponent type={"reject"} onClick={() => navigate(-1)}>
                Back
              </ButtonComponent>
            </div>
          </BaseContainer>
        </div>
      );
    }
  };

  return (
    <>
      {renderPage(type)}
    </>
  );
>>>>>>> 20b7779 (Init)
};

export default NotFound;
