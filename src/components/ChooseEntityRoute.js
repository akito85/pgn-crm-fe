import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ChooseEntityRoute = () => {
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
    if (level === "superuser" && token === null) {
      to = "/login-su";
    } else {
      to = "/login";
    }
    return to;
  };
  return type_token?.type === "TEMP TOKEN" &&
    type_token?.userLevel === "Super User" ? (
    <Outlet />
  ) : (
    <Navigate to={navigator()} />
  );
};

export default ChooseEntityRoute;
