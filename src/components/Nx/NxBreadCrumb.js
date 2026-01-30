import { Breadcrumb } from "antd";
import { NavLink } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";

const NxBreadCrumb = ({ routes }) => {
  function itemRender(route, params, routes, paths) {
    return <NavLink to={route.path}>{route.breadcrumbName}</NavLink>;
  }

  return (
    <Breadcrumb
      itemRender={itemRender}
      routes={routes}
      separator={<RightOutlined />}
    />
  );
};

export default NxBreadCrumb;
