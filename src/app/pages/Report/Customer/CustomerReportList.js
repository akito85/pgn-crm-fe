import { Spin } from "antd";
import React, { lazy, Suspense, useMemo } from "react";
import BreadCrumb from "../../../../components/BreadCrumb";
import BaseContainer from "../../../../components/BaseContainer";
import REPORT_ROUTES from "../../../../routes/report/report_routes";
import Toolbar from "../../../../components/Toolbar";
import TablePagination from "../../../../components/TablePagination";
import useCustomerList from "./Hooks/useCustomerList";
const LayoutMenu = lazy(
  () => import("../../../../components/SidebarMenu/LayoutMenu"),
);

const CustomerReportList = () => {
  const {
    data,
    loading,
    handleChange,
    page,
    pageSize,
    itemActions,
    handleSort,
    columnsCustomer,
    renderModal,
  } = useCustomerList();

  const routes = useMemo(() => {
    return [
      {
        path: "",
        breadcrumbName: "Summary",
      },
      {
        path: REPORT_ROUTES.VIEW_CUSTOMER_REPORT,
        breadcrumbName: "Account Summary",
      },
    ];
  }, []);

  return (
    <Suspense fallback={<Spin />}>
      <LayoutMenu>
        <Spin spinning={loading}>
          <BreadCrumb routes={routes} />
          <Toolbar items={itemActions} />
          <BaseContainer header={"Account Summary"}>
            <TablePagination
              dataSource={data?.result}
              totalData={data?.page?.totalElements}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              tableScrolled={{
                // x: 21000,
                y: 500,
              }}
              // expandable={{ expandedRowRender }}
              onSort={handleSort}
              columns={columnsCustomer}
            />
          </BaseContainer>
        </Spin>
        {renderModal()}
      </LayoutMenu>
    </Suspense>
  );
};

export default CustomerReportList;
