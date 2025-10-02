import React from "react";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BaseContainer from "../../../../components/BaseContainer";
import { INVOICE_ROUTES } from "../../../../routes/invoice/invoice_routes";

const EMeteraiManagement = () => {
  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Invoice",
    },
    {
      path: INVOICE_ROUTES.E_METERAI_MANAGEMENT,
      breadcrumbName: "E-Meterai Management",
    },
  ];

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <BaseContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] font-bold">E-Meterai Management</p>
          </div>
        }
      >
        <div className="w-full">
          <p>This is the E-Meterai Management page.</p>
          {/* Add your e-meterai management content here */}
        </div>
      </BaseContainer>
    </LayoutMenu>
  );
};

export default EMeteraiManagement;
