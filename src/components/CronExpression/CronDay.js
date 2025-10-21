import { Checkbox, Col, Radio, Select, Space } from "antd";
import React, { useState } from "react";

const CronDay = (props) => {
  const { onChangeDay, typeDom } = props;
  const [startDay, setStartDay] = useState();
  const [endDay, setEndDay] = useState();
  const [checkDay, setCheckDay] = useState([]);
  const [startDay1, setStartDay1] = useState();
  const [endDay1, setEndDay1] = useState();
  const [valueDay, setValueDay] = useState();
  const [startDay2, setStartDay2] = useState();
  const [endDay2, setEndDay2] = useState();
  const [spekDOW, setSpekDOW] = useState([]);
  const [spekDOM, setSpekDOM] = useState([1]);
  const [oneLsm, setOneLsm] = useState("");
  const [oneLastDay, setOneLastDay] = useState();
  const [nearest, setNearest] = useState();
  const [selectedOption, setSelectedOption] = useState(null);
  const handleChangeDay = (e) => {
    switch (e.target.value) {
      case 1:
        setValueDay(1);
        onChangeDay("*", "dow");
        break;
      case 2:
        setValueDay(2);
        onChangeDay(`${endDay}/${startDay}`, "dow");
        break;
      case 3:
        setValueDay(3);
        onChangeDay(`${endDay2}/${startDay2}`, "dom");
        break;
      case 4:
        setValueDay(4);
        let result = "1";
        if (spekDOW.length > 0) {
          const tigaArray = spekDOW.map((item) => item.slice(0, 3));
          const joinArray = tigaArray.join(",");
          result = joinArray.toUpperCase();
        }
        onChangeDay(`${result}`, "dow");
        break;
      case 5:
        setValueDay(5);
        const valueCheck = spekDOM.reduce(
          (prev, current) => prev + `,${current}`,
          "",
        );
        onChangeDay(valueCheck.slice(1), "dom");
        break;
      case 6:
        setValueDay(6);
        onChangeDay("L", "dom");
        break;
      case 7:
        setValueDay(7);
        onChangeDay("LW", "dom");
        break;
      case 8:
        setValueDay(8);
        onChangeDay(`${oneLsm + "L"}`, "dow");
        break;
      case 9:
        setValueDay(9);
        onChangeDay(`${"L-" + oneLastDay}`, "dom");
        break;
      case 10:
        setValueDay(10);
        onChangeDay(`${nearest + "W"}`, "dom");
      //   case 4:
      //     setValueDay(4);
      //     onChangeDay(`${startDay1}-${endDay1}`);
      //     break;
      default:
        break;
    }
  };

  const handleClearSelection = (e) => {
    setSelectedOption(e);
  };

  //Handle Radio Button 2
  const handleStartDay = (e) => {
    setStartDay(e);
    if (valueDay === 2) {
      onChangeDay(`${endDay}/${e}`, "dow");
    }
  };

  const handleEndDay = (e) => {
    setEndDay(e);
    if (valueDay === 2) {
      onChangeDay(`${e}/${startDay}`, "dow");
    }
  };

  // Handle Radio Button 3
  const handleStartDay2 = (e) => {
    setStartDay2(e);
    if (valueDay === 3) {
      onChangeDay(`${endDay2}/${e}`, "dom");
    }
  };

  const handleEndDay2 = (e) => {
    setEndDay2(e);
    if (valueDay === 3) {
      onChangeDay(`${e}/${startDay2}`, "dom");
    }
  };

  const handleStartDay1 = (e) => {
    setStartDay1(e);
    if (valueDay === 4) {
      onChangeDay(`${e}-${endDay1}`);
    }
  };

  const handleEndDay1 = (e) => {
    setEndDay1(e);
    if (valueDay === 4) {
      onChangeDay(`${startDay1}-${e}`);
    }
  };

  //handle radio button 4
  const handleSpekDayOfWeek = (e) => {
    if (valueDay === 4) {
      setSpekDOW(e);
      const tigaArray = e.map((item) => item.slice(0, 3));
      const joinArray = tigaArray.join(",");
      const upperCase = joinArray.toUpperCase();
      onChangeDay(upperCase, "dow");
    }
  };
  // radio button 5
  const handleCheckDOM = (e) => {
    if (valueDay) {
      setSpekDOM(e);
      const valueCheck = e.reduce((prev, current) => prev + `,${current}`, "");
      onChangeDay(valueCheck.slice(1), "dom");
    }
  };

  const handleOneThelast = (e) => {
    setOneLsm(e);
    if (valueDay === 8) {
      onChangeDay(`${e} ${"L"}`, "dow");
    }
  };

  const handleOneLastDay = (e) => {
    setOneLastDay(e);
    if (valueDay === 9) {
      onChangeDay(`${"L-"}${e}`, "dom");
    }
  };

  const handleNearest = (e) => {
    setNearest(e);
    if (valueDay === 10) {
      onChangeDay(`${e}${"W"}`, "dom");
    }
  };
  const dataDay = [
    { label: "Sunday", value: 1 },
    { label: "Monday", value: 2 },
    { label: "Tuesday", value: 3 },
    { label: "Wednesday", value: 4 },
    { label: "Thursday", value: 5 },
    { label: "Friday", value: 6 },
    { label: "Saturday", value: 7 },
  ];

  const Day1 = [];
  for (let i = 1; i < 24; i++) {
    Day1.push({
      timeDay: i,
    });
  }

  const Day2 = [];
  for (let i = 1; i < 32; i++) {
    Day2.push({
      timeDay2: i,
    });
  }

  const DayCheck = [];
  for (let i = 1; i < 8; i++) {
    DayCheck.push({
      timeDayCek: i,
    });
  }

  const dayst = [];
  let namest = "st";
  for (let i = 1; i < 33; i++) {
    dayst.push({
      dayST: i + namest,
    });
  }

  return (
    <Radio.Group onChange={handleChangeDay} value={valueDay}>
      <Space direction="vertical">
        <Radio value={1} checked={handleClearSelection === 1}>
          Every Day
        </Radio>
        <Radio value={2} checked={handleClearSelection === 2}>
          <div className="w-full flex gap-5 items-center ">
            Every
            <Select
              style={{
                width: 120,
              }}
              onChange={handleStartDay}
            >
              {DayCheck &&
                DayCheck.map((ta, index) => (
                  <Select.Option value={ta.timeDayCek} key={index}>
                    {ta.timeDayCek}
                  </Select.Option>
                ))}
            </Select>
            Day(s) starting on
            <Select
              style={{
                width: 120,
              }}
              onChange={handleEndDay}
              //   defaultValue={0}
            >
              {dataDay &&
                dataDay.map((ta, index) => (
                  <Select.Option value={ta.value} key={index}>
                    {ta.label}
                  </Select.Option>
                ))}
            </Select>
          </div>
        </Radio>

        <Radio value={3} checked={handleClearSelection === 3}>
          <div className="w-full flex gap-5 items-center ">
            Every
            <Select
              style={{
                width: 120,
              }}
              onChange={handleStartDay2}
              allowClear={true}
              onClear={handleClearSelection}
            >
              {Day2 &&
                Day2.map((ta, index) => (
                  <Select.Option value={ta.timeDay2} key={index}>
                    {ta.timeDay2}
                  </Select.Option>
                ))}
            </Select>
            day(s) starting on the
            <Select
              style={{
                width: 120,
              }}
              onChange={handleEndDay2}
              //   defaultValue={0}
            >
              {dayst &&
                dayst.map((ta, index) => (
                  <Select.Option value={ta.index} key={index}>
                    {ta.dayST}
                  </Select.Option>
                ))}
            </Select>
            of the month
          </div>
        </Radio>
        <Radio value={4} checked={handleClearSelection === 4}>
          <span className="gap-5">
            Specific day of the week (choose one or many)
          </span>
          <div className="w-full grid grid-col-5">
            <Checkbox.Group
              style={{
                width: "100%",
              }}
              className=" w-full"
              onChange={handleSpekDayOfWeek}
            >
              <div className="grid grid-cols-11">
                {dataDay.map((option, index) => (
                  <Col span={8} key={index}>
                    <Checkbox value={option.label}>{option.label}</Checkbox>
                  </Col>
                ))}
              </div>
            </Checkbox.Group>
          </div>
        </Radio>
        <Radio value={5} checked={handleClearSelection === 5}>
          <span className="gap-5">
            Specific day of month (choose one or many)
          </span>
          <div className="w-full grid grid-col-5">
            <Checkbox.Group
              style={{
                width: "100%",
              }}
              className=" w-full"
              onChange={handleCheckDOM}
              value={spekDOM}
            >
              <div className="grid grid-cols-10">
                {Day2.map((option, index) => (
                  <Col span={8} key={index}>
                    <Checkbox value={option.timeDay2}>
                      {option.timeDay2}
                    </Checkbox>
                  </Col>
                ))}
              </div>
            </Checkbox.Group>
          </div>
        </Radio>
        <Radio value={6} checked={handleClearSelection === 6}>
          On the last day of the month
        </Radio>
        <Radio value={7} checked={handleClearSelection === 7}>
          On the last weekday of the month
        </Radio>
        <Radio value={8} checked={handleClearSelection === 8}>
          <div className="w-full flex gap-5 items-center ">
            On the Last
            <Select
              style={{
                width: 120,
              }}
              onChange={handleOneThelast}
              allowClear
            >
              {dataDay &&
                dataDay.map((ta, index) => (
                  <Select.Option value={ta.value} key={index}>
                    {ta.label}
                  </Select.Option>
                ))}
            </Select>
            of the month
          </div>
        </Radio>
        <Radio value={9} checked={handleClearSelection === 9}>
          <div className="w-full flex gap-5 items-center ">
            Every
            <Select
              style={{
                width: 120,
              }}
              onChange={handleOneLastDay}
            >
              {Day2 &&
                Day2.map((ta, index) => (
                  <Select.Option value={ta.Day2} key={index}>
                    {ta.timeDay2}
                  </Select.Option>
                ))}
            </Select>
            day(s) before the end of the month
          </div>
        </Radio>
        <Radio value={10}>
          <div className="flex gap-2 items-center">
            <span>Nearest weekday (Monday to Friday) to the </span>
            <Select
              style={{
                width: 120,
              }}
              onChange={handleNearest}
              allowClear
            >
              {dayst &&
                dayst.map((ta, index) => (
                  <Select.Option value={ta.index} key={index}>
                    {ta.dayST}
                  </Select.Option>
                ))}
            </Select>
            of the month
          </div>
        </Radio>
        <Radio value={11}>
          <div className="flex gap-2 items-center">
            <span>On the</span>
            <Select
              style={{
                width: 120,
              }}
              onChange={handleNearest}
              allowClear
            >
              {dayst &&
                dayst.map((ta, index) => (
                  <Select.Option value={ta.index} key={index}>
                    {ta.dayST}
                  </Select.Option>
                ))}
            </Select>
            <Select
              style={{
                width: 120,
              }}
              onChange={handleOneThelast}
              allowClear
            >
              {dataDay &&
                dataDay.map((ta, index) => (
                  <Select.Option value={ta.value} key={index}>
                    {ta.label}
                  </Select.Option>
                ))}
            </Select>
            of the month
          </div>
        </Radio>
      </Space>
    </Radio.Group>
  );
};

export default CronDay;
