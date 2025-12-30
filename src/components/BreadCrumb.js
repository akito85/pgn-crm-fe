import { Breadcrumb } from "antd";
import { NavLink } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";

const BreadCrumb = ({ routes }) => {
  function itemRender(route, params, routes, paths) {
    return <NavLink to={route.path}>{route.breadcrumbName}</NavLink>;
  }

  return (
    <Breadcrumb
      itemRender={itemRender}
      routes={routes}
      separator={<RightOutlined />}
      style={{ marginBottom: "10px" }}
    />
  );
};

export default BreadCrumb;
