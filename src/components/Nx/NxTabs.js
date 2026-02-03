import { Tabs } from "antd"

const NxTabs = ({
  items = [],
  onChange = () => {},
  activeKey = "",
  className = "",
  ...props
}) => (
  <Tabs
    items={items}
    onChange={onChange}
    activeKey={activeKey}
    className={`[&_.ant-tabs-tab]:text-[12px] [&_.ant-tabs-tab]:py-4 [&_.ant-tabs-nav]:!mb-0 [&_.ant-tabs-nav-list]:px-4 [&_.ant-tabs-nav::before]:!border-b-[#C8CDD4] [&_.ant-tabs-nav]:pt-0 ${(items[0] && items[0].children) ? "[&_.ant-tabs-content]:p-4" : ""} ${className}`}
    {...props}

  />
)

export default NxTabs;