import { Spin } from "antd";
import React, { lazy, Suspense, useMemo } from "react";
import BreadCrumb from "../../../../components/BreadCrumb";
import Toolbar from "../../../../components/Toolbar";
import BaseContainer from "../../../../components/BaseContainer";
import REPORT_ROUTES from "../../../../routes/report/report_routes";
import useCustomerWarrantyReportHooks from "./hooks/useCustomerWarrantyReportHooks";
import TablePagination from "../../../../components/TablePagination";
const LayoutMenu = lazy(
  () => import("../../../../components/SidebarMenu/LayoutMenu"),
);

const CustomerWarrantyReport = () => {
  const { columns, handleChange, handleSort, itemActions, page, pageSize } =
    useCustomerWarrantyReportHooks();

  const routes = useMemo(() => {
    return [
      {
        path: "",
        breadcrumbName: "Report",
      },
      {
        path: REPORT_ROUTES.VIEW_CUSTOMER_REPORT,
        breadcrumbName: "Report Customer Warranty",
      },
    ];
  }, []);
  return (
    <Suspense fallback={<Spin />}>
      <LayoutMenu>
        <Spin spinning={false}>
          <BreadCrumb routes={routes} />
          <Toolbar items={itemActions} />

          <BaseContainer header={"Report Customer Warranty"}>
            <TablePagination
              dataSource={[]}
              totalData={[]}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              tableScrolled={{
                x: 3000,
                y: 500,
              }}
              // expandable={{ expandedRowRender }}
              onSort={handleSort}
              columns={columns}
            />
          </BaseContainer>
        </Spin>
      </LayoutMenu>
    </Suspense>
  );
};

export default CustomerWarrantyReport;
