import { Fragment, useEffect, useState } from "react";
import ContainerWithTab from "./components/ContainerWithTab";
import { Col, Divider, Row } from "antd";
import HeaderText from "./components/HeaderText";
import HeadersTabs from "./components/HeadersTabs";

const HeaderCriteriaAndCondition = ({ selectedTab, onChangeTab }) => {
  return (
    <HeadersTabs
      keys={[
        { label: "CRITERIA", value: "criteria" },
        { label: "CONDITIONS", value: "conditions" },
      ]}
      selectedTab={selectedTab}
      onChangeTab={onChangeTab}
      isModal={true}
    />
  );
};

const selectedRender = (selectedTab) => {
  switch (selectedTab) {
    case "criteria":
      return <HeaderText text="Criteria information goes here." />;
    case "conditions":
      return <HeaderText text="Conditions information goes here." />;
    default:
      return null;
  }
};

const CriteriaAndCondition = () => {
  const [selectedTab, setSelectedTab] = useState("criteria");
  const onChangeTab = (value) => {
    setSelectedTab(value);
  };

  return (
    <Fragment>
      <HeaderCriteriaAndCondition
        selectedTab={selectedTab}
        onChangeTab={onChangeTab}
      />
      <Divider style={{ margin: "1.5rem 0" }} />
      {selectedRender(selectedTab)}
    </Fragment>
  );
};

export default CriteriaAndCondition;
