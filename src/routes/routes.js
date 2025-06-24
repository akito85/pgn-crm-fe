import Dashboard from "../app/pages/dashboard";
import { user_management } from "./user_management";
import { system_setup } from "./system_setup";
import { product_promo } from "./product_promo";
import MonitoringSession from "../app/pages/MonitoringSession";
import NewPassword from "../app/pages/Authentication/NewPassword";
import { account_management } from "./account_management";
import SwitchPage from "../app/pages/Authentication/SwitchPage";
import { receipt_and_collection } from "./Receipt&Collection";
import { rating_billing } from "./rating_billing";
import { invoice } from "./invoice";
export const index = [
	{
		path: "/",
		element: <Dashboard />,
		authority: "00"
	},
	{
		path: '/monitoring-session',
		element: <MonitoringSession />,
		authority: "10"
	},
	{
		path: '/generate-password/:id',
		element:<NewPassword/>
	},
	{
		path: '/switch-entity',
		element: <SwitchPage type={'switch-entity'} />,
		authority:'130'
	},
	{
		path: '/switch-position',
		element: <SwitchPage type={'switch-position'} />,
		authority:'130'
	},
	...product_promo,
	...user_management,
	...system_setup,
	...account_management,
	...receipt_and_collection,
	...rating_billing,
	...invoice
];
