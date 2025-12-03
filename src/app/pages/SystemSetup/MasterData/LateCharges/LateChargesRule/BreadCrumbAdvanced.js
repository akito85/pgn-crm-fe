import React from "react";
import { Breadcrumb } from "antd";
import { NavLink } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";

const BreadCrumbAdvanced = ({ routes }) => {
  function itemRender(route, params, routes, paths) {
    return (
      <NavLink to={route.path} state={route.state}>
        {route.breadcrumbName}
      </NavLink>
    );
  }

  return (
    <Breadcrumb
      itemRender={itemRender}
      routes={routes}
      separator={<RightOutlined />}
      style={{ marginBottom: "30px" }}
    />
  );
};

export default BreadCrumbAdvanced;
