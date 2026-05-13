import Dashboard from "../app/pages/dashboard";
import { user_management } from "./user_management";
import { system_setup } from "./system_setup";
import { product_promo } from "./product_promo";
import MonitoringSession from "../app/pages/UserManagement/MonitoringSession/MonitoringSessionPage";
import NewPassword from "../app/pages/Authentication/NewPassword";
import { account_management } from "./account_management";
import SwitchPage from "../app/pages/Authentication/SwitchPage";
import { receipt_and_collection } from "./Receipt&Collection";
import { rating_billing } from "./rating_billing";
import { debt_and_collection } from "./DebtAndCollection";  
import { invoice } from "./invoice";
import report_setup from "./report";
import { notification } from "./notification";
import { job_management } from "./job_management";
export const index = [
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/monitoring-session",
    element: <MonitoringSession />,
  },
  {
    path: "/generate-password/:id",
    element: <NewPassword />,
  },
  {
    path: "/switch-entity",
    element: <SwitchPage type={"switch-entity"} />,
  },
  {
    path: "/switch-position",
    element: <SwitchPage type={"switch-position"} />,
  },
  ...product_promo,
  ...user_management,
  ...job_management,
  ...system_setup,
  ...account_management,
  ...receipt_and_collection,
  ...rating_billing,
  ...invoice,
  ...report_setup,
  ...debt_and_collection,
  ...notification
];
