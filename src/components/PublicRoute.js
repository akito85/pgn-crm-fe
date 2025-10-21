import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PublicRoute = () => {
  const { level } = useSelector((state) => state.user_level);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const token =
    localStorage.getItem("token") || window.sessionStorage.getItem("token");
  const type =
    localStorage.getItem("type") || window.sessionStorage.getItem("type");
  const location = useLocation();
  const type_token = JSON.parse(token);
  const navigator = () => {
    let to;
    if (
      type_token?.userLevel === "End User" &&
      type_token?.type === "TEMP TOKEN"
    ) {
      to = "/position";
    } else if (
      type_token?.userLevel === "Super User" &&
      type_token?.type === "TEMP TOKEN"
    ) {
      to = "/choose-entity";
    } else {
      to = "/";
    }

    return to;
  };
  return type_token === null ? <Outlet /> : <Navigate to={navigator()} />;
};

export default PublicRoute;
