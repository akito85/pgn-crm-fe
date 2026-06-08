import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import { clearBodyMessage } from "../redux/slices/general_slice";
import ProtectedLayout from "./ProtectedLayout";

const PrivateRoute = () => {
  //   const { level } = useSelector((state) => state.user_level);
  //   const { isLoggedIn } = useSelector((state) => state.auth);
  const token =
    localStorage.getItem("token") || window.sessionStorage.getItem("token");
  const type =
    localStorage.getItem("type") || window.sessionStorage.getItem("type");
  //   const location = useLocation();
  const type_token = JSON.parse(token);
  // Use optional chaining to avoid crash when token is null
  const dateExpired = moment(
    type_token?.dateExpired?.toString() ?? "",
    "YYYY-MM-DD HH:mm:ss",
  );
  const currentTime = moment();
  const isExpired = type_token ? currentTime.isAfter(dateExpired) : false;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isExpired) {
      localStorage.clear();
      sessionStorage.clear();
      dispatch(clearBodyMessage());
      if (type_token?.userLevel === "Super User") {
        navigate("/login-su");
      } else {
        navigate("/login");
      }
    }
  }, [isExpired, type_token, navigate, dispatch]);

  const navigator = () => {
    // If token is expired, redirect directly to login instead of position
    if (isExpired) {
      return type_token?.userLevel === "Super User" ? "/login-su" : "/login";
    }
    if (
      type_token?.userLevel === "Super User" &&
      type_token?.type === "TEMP TOKEN"
    ) {
      return "/choose-entity";
    }
    return "/position";
  };

  const isAuthenticated =
    (type_token?.type === "TRUE TOKEN" ||
      type_token?.type === "EXISTING TOKEN") &&
    !isExpired;

  return isAuthenticated ? (
    <ProtectedLayout>
      <Outlet />
    </ProtectedLayout>
  ) : (
    <Navigate to={navigator()} />
  );
};

export default PrivateRoute;
