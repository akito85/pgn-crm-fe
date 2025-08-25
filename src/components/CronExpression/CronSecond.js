import React, { useState } from "react";
import { Checkbox, Col, Form, Radio, Select, Space } from "antd";
const CronSecond = (props) => {
  const { onChangeSecond, valChecked, handleResetSecond } = props;
  console.log(
    "🚀 ~ file: CronSecond.js:5 ~ CronSecond ~ valChecked:",
    valChecked
  );
  const valueChecked = valChecked ? valChecked.split(",") : [];
  const intValCheck = valueChecked.map((item) => {
    return parseInt(item, 10);
  });

  const [startSecond, setStartSecond] = useState(1);
  const [endSecond, setEndSecond] = useState(0);
  const [checkSecond, setCheckSecond] = useState([0]);
  const [startSecond1, setStartSecond1] = useState(0);
  const [endSecond1, setEndSecond1] = useState(0);
  const [valueSecond, setValueSecond] = useState(3);

  const handleChangeSecond = (e) => {
    switch (e.target.value) {
      case 1:
        setValueSecond(1);
        onChangeSecond("*");
        break;
      case 2:
        setValueSecond(2);
        onChangeSecond(`${endSecond}/${startSecond}`);
        break;
      case 3:
        setValueSecond(3);
        const valueCheck = checkSecond.reduce(
          (prev, current) => prev + `,${current}`,
          ""
        );
        onChangeSecond(valueCheck.slice(1));
        break;
      case 4:
        setValueSecond(4);
        onChangeSecond(`${startSecond1}-${endSecond1}`);
        break;
      default:
        break;
    }
  };

  const handleStartSecond = (e) => {
    setStartSecond(e);
    if (valueSecond === 2) {
      onChangeSecond(`${endSecond}/${e}`);
    }
  };

  const handleEndSecond = (e) => {
    setEndSecond(e);
    if (valueSecond === 2) {
      onChangeSecond(`${e}/${startSecond}`);
    }
  };

  const handleStartSecond1 = (e) => {
    setStartSecond1(e);
    if (valueSecond === 4) {
      onChangeSecond(`${e}-${endSecond1}`);
    }
  };

  const handleEndSecond1 = (e) => {
    setEndSecond1(e);
    if (valueSecond === 4) {
      onChangeSecond(`${startSecond1}-${e}`);
    }
  };
  const handleCheckSecond = (e) => {
    setCheckSecond(e);
    if (valueSecond === 3) {
      const valueCheck = e.reduce((prev, current) => prev + `,${current}`, "");
      onChangeSecond(valueCheck.slice(1));
    }
  };

  const second1 = [];
  for (let i = 0; i < 60; i++) {
    second1.push({
      timeSecond: i,
    });
  }

  const handleClearSelection = () => {};

  return (
    <Radio.Group onChange={handleChangeSecond} value={valueSecond}>
      <Space direction="vertical">
        <Radio value={1}>Every Second</Radio>

        <Radio value={2}>
          <Form.Item name={"btn2"}>
            <div className="w-full flex gap-5 items-center ">
              Every
              <Select
                style={{
                  width: 120,
                }}
                onChange={handleStartSecond}
                // handleResetSecond();
                // value={startSecond}
                allowClear
              >
                {second1 &&
                  second1.map((ta, index) => (
                    <Select.Option value={ta.timeSecond} key={index}>
                      {ta.timeSecond}
                    </Select.Option>
                  ))}
              </Select>
              second(s) starting at second
              <Select
                style={{
                  width: 120,
                }}
                onChange={handleEndSecond}
                // value={endSecond}
                allowClear
              >
                {second1 &&
                  second1.map((ta, index) => (
                    <Select.Option value={ta.timeSecond} key={index}>
                      {ta.timeSecond}
                    </Select.Option>
                  ))}
              </Select>
            </div>
          </Form.Item>
        </Radio>
        <Radio value={3}>
          <Form.Item>
            <span className="gap-5">
              Specific day of the week (choose one or many)
            </span>
            <div className="w-full grid grid-col-5">
              <Checkbox.Group
                style={{
                  width: "100%",
                }}
                className=" w-full"
                onChange={handleCheckSecond}
                defaultValue={intValCheck}
              >
                <div className="grid grid-cols-10">
                  {second1.map((option, index) => (
                    <Col span={8} key={index}>
                      <Checkbox value={index}>{option.timeSecond}</Checkbox>
                    </Col>
                  ))}
                </div>
              </Checkbox.Group>
            </div>
          </Form.Item>
        </Radio>
        <Radio value={4}>
          <div className="w-full flex items-center gap-5">
            <span>Every Second between second</span>
            <Select
              style={{
                width: 80,
              }}
              onChange={handleStartSecond1}
              allowClear
            >
              {second1 &&
                second1.map((ta, index) => (
                  <Select.Option value={ta.timeSecond} key={index}>
                    {ta.timeSecond}
                  </Select.Option>
                ))}
            </Select>
            and second
            <Select
              style={{
                width: 80,
              }}
              onChange={handleEndSecond1}
              allowClear
            >
              {second1 &&
                second1.map((ta, index) => (
                  <Select.Option value={ta.timeSecond} key={index}>
                    {ta.timeSecond}
                  </Select.Option>
                ))}
            </Select>
          </div>
        </Radio>
      </Space>
    </Radio.Group>
  );
};

export default CronSecond;
