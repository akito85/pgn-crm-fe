import { Checkbox, Col, Radio, Select, Space } from "antd";
import React, { useState } from "react";

const CronMinutes = (props) => {
  const { onChangeMinutes } = props;
  const [startMinutes, setStartMinutes] = useState();
  const [endMinutes, setEndMinutes] = useState();
  const [checkMinutes, setCheckMinutes] = useState([]);
  const [startMinutes1, setStartMinutes1] = useState();
  const [endMinutes1, setEndMinutes1] = useState();
  const [valueMinutes, setValueMinutes] = useState(3);

  const handleChangeMinutes = (e) => {
    switch (e.target.value) {
      case 1:
        setValueMinutes(1);
        onChangeMinutes("*");
        break;
      case 2:
        setValueMinutes(2);
        onChangeMinutes(`${endMinutes}/${startMinutes}`);
        break;
      case 3:
        setValueMinutes(3);
        const valueCheck = checkMinutes.reduce(
          (prev, current) => prev + `,${current}`,
          "",
        );
        onChangeMinutes(valueCheck.slice(1));
        break;
      case 4:
        setValueMinutes(4);
        onChangeMinutes(`${startMinutes1}-${endMinutes1}`);
        break;
      default:
        break;
    }
  };

  const handleStartMinutes = (e) => {
    setStartMinutes(e);
    if (valueMinutes === 2) {
      onChangeMinutes(`${endMinutes}/${e}`);
    }
  };

  const handleEndMinutes = (e) => {
    setEndMinutes(e);
    if (valueMinutes === 2) {
      onChangeMinutes(`${e}/${startMinutes}`);
    }
  };

  const handleStartMinutes1 = (e) => {
    setStartMinutes1(e);
    if (valueMinutes === 4) {
      onChangeMinutes(`${e}-${endMinutes1}`);
    }
  };

  const handleEndMinutes1 = (e) => {
    setEndMinutes1(e);
    if (valueMinutes === 4) {
      onChangeMinutes(`${startMinutes1}-${e}`);
    }
  };
  const handleCheckMinutes = (e) => {
    setCheckMinutes(e);
    if (valueMinutes === 3) {
      const valueCheck = e.reduce((prev, current) => prev + `,${current}`, "");
      onChangeMinutes(valueCheck.slice(1));
    }
  };

  const minutes1 = [];
  for (let i = 0; i < 62; i++) {
    minutes1.push({
      timeMinutes: i,
    });
  }

  const minutesCheck = [];
  for (let i = 0; i < 60; i++) {
    minutesCheck.push({
      timeminCek: i,
    });
  }
  return (
    <Radio.Group onChange={handleChangeMinutes} value={valueMinutes}>
      <Space direction="vertical">
        <Radio value={1}>Every Minutes</Radio>
        <Radio value={2}>
          <div className="w-full flex gap-5 items-center ">
            Every
            <Select
              style={{
                width: 120,
              }}
              onChange={handleStartMinutes}
              allowClear
            >
              {minutes1 &&
                minutes1.map((ta, index) => (
                  <Select.Option value={ta.timeMinutes} key={index}>
                    {ta.timeMinutes}
                  </Select.Option>
                ))}
            </Select>
            minutes(s) starting at minutes
            <Select
              style={{
                width: 120,
              }}
              onChange={handleEndMinutes}
              allowClear
            >
              {minutes1 &&
                minutes1.map((ta, index) => (
                  <Select.Option value={ta.timeMinutes} key={index}>
                    {ta.timeMinutes}
                  </Select.Option>
                ))}
            </Select>
          </div>
        </Radio>
        <Radio value={3}>
          <span className="gap-5">Specific Minutes (choose one or many)</span>
          <div className="w-full grid grid-col-5">
            <Checkbox.Group
              style={{
                width: "100%",
              }}
              className=" w-full"
              onChange={handleCheckMinutes}
              defaultValue={[0]}
            >
              <div className="grid grid-cols-10">
                {minutesCheck.map((option, index) => (
                  <Col span={8} key={index}>
                    <Checkbox value={index}>{option.timeminCek}</Checkbox>
                  </Col>
                ))}
              </div>
            </Checkbox.Group>
          </div>
        </Radio>
        <Radio value={4}>
          <div className="w-full flex items-center gap-5">
            <span>Every Minutes between minutes</span>
            <Select
              style={{
                width: 80,
              }}
              onChange={handleStartMinutes1}
              allowClear
            >
              {minutes1 &&
                minutes1.map((ta, index) => (
                  <Select.Option value={ta.minutes1} key={index}>
                    {ta.timeMinutes}
                  </Select.Option>
                ))}
            </Select>
            and minutes
            <Select
              style={{
                width: 80,
              }}
              onChange={handleEndMinutes1}
              allowClear
            >
              {minutes1 &&
                minutes1.map((ta, index) => (
                  <Select.Option value={ta.minutes1} key={index}>
                    {ta.timeMinutes}
                  </Select.Option>
                ))}
            </Select>
          </div>
        </Radio>
      </Space>
    </Radio.Group>
  );
};

export default CronMinutes;
