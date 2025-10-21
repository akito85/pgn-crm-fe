import React from "react";
import BreadCrumb from "../../components/BreadCrumb";
import LayoutMenu from "../../components/SidebarMenu/LayoutMenu";

const Dashboard = () => {
  return (
    <LayoutMenu>
      <BreadCrumb pageName={["testing", "testing"]} />
      <h2>Dashboard</h2>
    </LayoutMenu>
  );
};

export default Dashboard;
