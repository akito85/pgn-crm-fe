import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Table } from "antd";
import React, { useState } from "react";
import BaseContainer from "../BaseContainer";
import RadioTabs from "../RadioTabs";
import CronDay from "./CronDay";
import CronHours from "./CronHours";
import CronMinutes from "./CronMinutes";
import CronMonth from "./CronMonth";
import CronSecond from "./CronSecond";
import CronYear from "./CronYear";

const CronExpression = (props) => {
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const [dataTable, setDataTable] = useState([
    {
      second: 0,
      minutes: 0,
      hours: 0,
      dom: "?",
      month: "*",
      dow: "*",
      year: "*",
    },
  ]);

  const tabData = [
    { value: "Second" },
    { value: "Minutes" },
    { value: "Hours" },
    { value: "Day" },
    { value: "Month" },
    { value: "Year" },
  ];

  const tempData = dataTable[0];
  const kirimData = `${tempData.second} ${tempData.minutes} ${tempData.hours} ${tempData.dom} ${tempData.month} ${tempData.dow} ${tempData.year}`;

  const [chooseTab, setChooseTab] = useState(tabData[0].value);
  const [second, setSecond] = useState("*");
  const [minutes, setMinutes] = useState("*");
  const [hours, setHours] = useState("*");
  const [day, setDay] = useState("?");
  const [month, setMonth] = useState("*");
  const [year, setYear] = useState("*");
  const handleChooseTab = (e) => {
    setChooseTab(e.target.value);
  };

  const tabCron = ({
    section = "",
    options = [],
    handleChangeOption = () => {},
  }) => {
    const handleChooseTab = (e) => {
      setChooseTab(e.target.value);
    };
  };

  const [tabSecond, setTabSecond] = useState(tempData.second);
  const column = [
    {
      title: "Second",
      dataIndex: "second",
      align: "center",
      width: 160,
    },
    {
      title: "Minutes",
      dataIndex: "minutes",
      width: 160,
      align: "center",
    },
    {
      title: "Hours",
      dataIndex: "hours",
      width: 160,
      align: "center",
    },
    {
      title: "Day of Month",
      dataIndex: "dom",
      width: 160,
      align: "center",
    },
    {
      title: "Month",
      dataIndex: "month",
      width: 160,
      align: "center",
    },
    {
      title: "Day of Week",
      dataIndex: "dow",
      width: 160,
      align: "center",
    },
    {
      title: "Year",
      dataIndex: "year",
      width: 160,
      align: "center",
    },
  ];

  const onChangeSecond = (e) => {
    setSecond(e);
    setDataTable((prev) => {
      let temp = [...prev];
      temp[0] = {
        ...temp[0],
        second: e,
      };
      setTabSecond(temp[0].second);
      return temp;
    });
  };

  const onChangeMinutes = (e) => {
    setMinutes(e);
    setDataTable((prev) => {
      let temp = [...prev];
      temp[0] = {
        ...temp[0],
        minutes: e,
      };
      return temp;
    });
  };

  const onChangeHours = (e) => {
    setHours(e);
    setDataTable((prev) => {
      let temp = [...prev];
      temp[0] = {
        ...temp[0],
        hours: e,
      };
      return temp;
    });
  };

  const onChangeDay = (e, type) => {
    setDataTable((prev) => {
      console.log("prevv", prev);
      console.log("val", e);
      let temp = [...prev];
      if (type === "dom") {
        temp[0] = {
          ...temp[0],
          dom: e,
          dow: "?",
        };
      } else {
        temp[0] = {
          ...temp[0],
          dow: e,
          dom: "?",
        };
      }
      return temp;
    });
  };

  const onChangeMonth = (e) => {
    setMonth(e);
    setDataTable((prev) => {
      let temp = [...prev];
      temp[0] = {
        ...temp[0],
        month: e,
      };
      return temp;
    });
  };

  const onChangeYear = (e) => {
    setYear(e);
    setDataTable((prev) => {
      let temp = [...prev];
      temp[0] = {
        ...temp[0],
        year: e,
      };
      return temp;
    });
  };

  return (
    <BaseContainer
      type={"tabs"}
      element={<RadioTabs data={tabData} onChange={handleChooseTab} />}
    >
      {/* <RadioTabs data={options} onChange={tabCron} />
      <div
        style={{
          display: section !== tabData.second ? "none" : undefined,
        }}
      >
        <CronSecond data={onChangeSecond} />
      </div> */}
      <Form
        form={form}
        layout={"vertical"}
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
      >
        {chooseTab === "Second" ? (
          <CronSecond valChecked={tabSecond} onChangeSecond={onChangeSecond} />
        ) : chooseTab === "Minutes" ? (
          <CronMinutes onChangeMinutes={onChangeMinutes} />
        ) : chooseTab === "Hours" ? (
          <CronHours onChangeHours={onChangeHours} />
        ) : chooseTab === "Day" ? (
          <CronDay onChangeDay={onChangeDay} typeDom={"dom"} />
        ) : chooseTab === "Month" ? (
          <CronMonth onChangeMonth={onChangeMonth} />
        ) : chooseTab === "Year" ? (
          <CronYear onChangeYear={onChangeYear} />
        ) : null}
      </Form>
      <div className="my-5 gap-5">
        <Table columns={column} pageSize={pageSize} dataSource={dataTable} />
      </div>
    </BaseContainer>
  );
};

export default CronExpression;
