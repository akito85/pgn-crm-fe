import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import 'antd/dist/antd.min.css'
import "./app.less";
import "./tailwind.css";
import AppRoutes from "./routes/appRoutes";
import { ErrorBoundary }  from "react-error-boundary";
import NotFound from "./app/NotFound";
import MaintenanceModeNotFound from "./app/pages/SystemSetup/MaintenanceMode/MaintenanceModeNotFound";

const App = () => {
  return (
    <ErrorBoundary fallback={<MaintenanceModeNotFound />}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
};
export default App;
