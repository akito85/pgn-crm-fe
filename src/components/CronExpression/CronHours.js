import { Checkbox, Col, Radio, Select, Space } from "antd";
import React, { useState } from "react";

const CronHours = (props) => {
  const { onChangeHours } = props;
  const [startHours, setStartHours] = useState();
  const [endHours, setEndHours] = useState();
  const [checkHours, setCheckHours] = useState([]);
  const [startHours1, setStartHours1] = useState();
  const [endHours1, setEndHours1] = useState();
  const [valueHours, setValueHours] = useState(3);

  const handleChangeHours = (e) => {
    switch (e.target.value) {
      case 1:
        setValueHours(1);
        onChangeHours("*");
        break;
      case 2:
        setValueHours(2);
        onChangeHours(`${endHours}/${startHours}`);
        break;
      case 3:
        setValueHours(3);
        const valueCheck = checkHours.reduce(
          (prev, current) => prev + `,${current}`,
          ""
        );
        onChangeHours(valueCheck.slice(1));
        break;
      case 4:
        setValueHours(4);
        onChangeHours(`${startHours1}-${endHours1}`);
        break;
      default:
        break;
    }
  };

  const handleStartHours = (e) => {
    setStartHours(e);
    if (valueHours === 2) {
      onChangeHours(`${endHours}/${e}`);
    }
  };

  const handleEndHours = (e) => {
    setEndHours(e);
    if (valueHours === 2) {
      onChangeHours(`${e}/${startHours}`);
    }
  };

  const handleStartHours1 = (e) => {
    setStartHours1(e);
    if (valueHours === 4) {
      onChangeHours(`${e}-${endHours1}`);
    }
  };

  const handleEndHours1 = (e) => {
    setEndHours1(e);
    if (valueHours === 4) {
      onChangeHours(`${startHours1}-${e}`);
    }
  };
  const handleCheckHours = (e) => {
    setCheckHours(e);
    if (valueHours === 3) {
      const valueCheck = e.reduce((prev, current) => prev + `,${current}`, "");
      onChangeHours(valueCheck.slice(1));
    }
  };

  const hours1 = [];
  for (let i = 0; i < 26; i++) {
    hours1.push({
      timeHours: i,
    });
  }

  const hoursCheck = [];
  for (let i = 0; i < 24; i++) {
    hoursCheck.push({
      timehoursCek: i,
    });
  }
  return (
    <Radio.Group onChange={handleChangeHours} value={valueHours}>
      <Space direction="vertical">
        <Radio value={1}>Every Hours</Radio>
        <Radio value={2}>
          <div className="w-full flex gap-5 items-center ">
            Every
            <Select
              style={{
                width: 120,
              }}
              onChange={handleStartHours}
              allowClear
            >
              {hours1 &&
                hours1.map((ta, index) => (
                  <Select.Option value={ta.timeHours} key={index}>
                    {ta.timeHours}
                  </Select.Option>
                ))}
            </Select>
            minutes(s) starting at minutes
            <Select
              style={{
                width: 120,
              }}
              onChange={handleEndHours}
              allowClear
            >
              {hoursCheck &&
                hoursCheck.map((ta, index) => (
                  <Select.Option value={ta.timehoursCek} key={index}>
                    {ta.timehoursCek}
                  </Select.Option>
                ))}
            </Select>
          </div>
        </Radio>
        <Radio value={3}>
          <span className="gap-5">Specific Hours (choose one or many)</span>
          <div className="w-full grid grid-col-5">
            <Checkbox.Group
              style={{
                width: "100%",
              }}
              className=" w-full"
              onChange={handleCheckHours}
              defaultValue={[0]}
            >
              <div className="grid grid-cols-10">
                {hoursCheck.map((option, index) => (
                  <Col span={8} key={index}>
                    <Checkbox value={index}>{option.timehoursCek}</Checkbox>
                  </Col>
                ))}
              </div>
            </Checkbox.Group>
          </div>
        </Radio>
        <Radio value={4}>
          <div className="w-full flex items-center gap-5">
            <span>Every Hours between minutes</span>
            <Select
              style={{
                width: 80,
              }}
              onChange={handleStartHours1}
              allowClear
            >
              {hoursCheck &&
                hoursCheck.map((ta, index) => (
                  <Select.Option value={ta.timehoursCek} key={index}>
                    {ta.timehoursCek}
                  </Select.Option>
                ))}
            </Select>
            and minutes
            <Select
              style={{
                width: 80,
              }}
              onChange={handleEndHours1}
              allowClear
            >
              {hoursCheck &&
                hoursCheck.map((ta, index) => (
                  <Select.Option value={ta.timehoursCek} key={index}>
                    {ta.timehoursCek}
                  </Select.Option>
                ))}
            </Select>
          </div>
        </Radio>
      </Space>
    </Radio.Group>
  );
};

export default CronHours;
