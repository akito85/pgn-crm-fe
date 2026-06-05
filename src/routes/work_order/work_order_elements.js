import React from "react";
import WorkOrderList from "../../app/pages/AccountManagement/WorkOrder/WorkOrderList";
import WorkOrderDetail from "../../app/pages/AccountManagement/WorkOrder/WorkOrderDetail";
import CreateWorkOrder from "../../app/pages/AccountManagement/shared/WorkOrder/Create/CreateWorkOrder";

export const WORK_ORDER_ELEMENTS = {
  WO_LIST_PAGE: <WorkOrderList />,
  WO_DETAIL_PAGE: <WorkOrderDetail />,
  WO_CREATE_PAGE: <CreateWorkOrder />,
};
