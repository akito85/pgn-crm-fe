import React, { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { index } from "./routes";
import { motion } from "framer-motion";
import { PrevLocProvider } from "../utils/usePrevLoc";
import AccountPromo from "../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/Promo/AccountPromo";
import SuspenseComponent from '../components/SuspenseComponent';

const NotFound = lazy(() => import('../app/NotFound'));
const LogIn = lazy(() => import('../app/pages/Authentication/LogIn'));
const ForgotPassword = lazy(() => import('../app/pages/Authentication/ForgotPassword'));
const PrivateRoute = lazy(() => import('../components/PrivateRoute'));
const NewPassword = lazy(() => import('../app/pages/Authentication/NewPassword'));
const UnderConstruction = lazy(() => import('../app/UnderConstruction'));
const UpdateProfile = lazy(() => import('../app/pages/UpdateProfile'));
const ChangePassword = lazy(() => import('../app/pages/ChangePassword'));
const PublicRoute = lazy(() => import('../components/PublicRoute'));
const SelectionPage = lazy(() => import('../app/pages/Authentication/SelectionPage'));
const ChoosePositionRoute = lazy(() => import('../components/ChoosePositionRoute'));
const ChooseEntityRoute = lazy(() => import('../components/ChooseEntityRoute'));
const VerifyPage = lazy(() => import('../app/pages/Authentication/VerifyPage'));
const SwitchPage = lazy(() => import('../app/pages/Authentication/SwitchPage'));
const PageLayout = ({ children }) => children;
const pageVariants = {
  initial: {
    opacity: 1,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 2,
  },
};

const pageTransition = {
  type: "tween",
  ease: "linear",
  duration: 4,
};
const AppRoutes = () => {
  const location = useLocation();
  return (
    <PageLayout>
      <PrevLocProvider>
        <motion.div
          key={location}
          initial="initial"
          animate="in"
          variants={pageVariants}
          transition={pageTransition}
        >
          <Suspense fallback={<SuspenseComponent/>}>
            <Routes>
              {/* Public Route */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<LogIn type={"enduser"} />} />
                <Route path="/login-su" element={<LogIn type={"superuser"} />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                {/* <Route path="/generate-password/:id" element={<NewPassword/>} /> */}
                <Route path="/maintenance" element={<UnderConstruction />} />
                {/* <Route path="/profile" element={<Profile />} /> */}
                <Route path="/update-profile" element={<UpdateProfile />} />
                <Route path="/change-password" element={<ChangePassword />} />
              </Route>
              <Route path="/promo" element={<AccountPromo />} />

              {/* Protected Route */}
              <Route element={<PrivateRoute />}>
                {index.map((menus, key) => {
                  return (
                    <Route path={menus.path} key={key} element={menus.element} />
                  );
                })}
              </Route>

              {/* Selection Routes */}
              <Route element={<ChoosePositionRoute />}>
                <Route
                  path="/position"
                  element={<SelectionPage type={"position"} />}
                />
              </Route>
              <Route element={<ChooseEntityRoute />}>
                <Route
                  path="/choose-entity"
                  element={<SelectionPage type={"entity"} />}
                />
              </Route>

              {/* Not Found  */}
              <Route
                path="/verify-email/*"
                element={<VerifyPage type={"email"} />}
              />
              <Route
                path="/verify-phone/*"
                element={<VerifyPage type={"phone"} />}
              />
              <Route
                path="/verify-email-phone/*"
                element={<VerifyPage type={"email-phone"} />}
              />
              <Route
                path="/verify-password/*"
                element={<VerifyPage type={"password"} />}
              />
              <Route path="/new-password/*" element={<NewPassword />} />
              <Route path="/create-user/*" element={<NewPassword />} />
              <Route path="*" element={<NotFound type={"not_found"} />} />
              <Route path="/under-construction" element={<UnderConstruction />} />
            </Routes>
          </Suspense>
        </motion.div>
      </PrevLocProvider>
    </PageLayout>
  );
};

export default AppRoutes;
