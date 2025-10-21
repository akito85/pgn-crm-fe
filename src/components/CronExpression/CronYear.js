import { Checkbox, Radio, Select, Space } from "antd";
import Col from "antd/es/grid/col";
import React, { useState } from "react";

const CronYear = (props) => {
  const { onChangeYear } = props;
  const [startYear, setStartYear] = useState();
  const [endYear, setEndYear] = useState();
  const [checkYear, setCheckYear] = useState([]);
  const [startYear1, setStartYear1] = useState();
  const [endYear1, setEndYear1] = useState();
  const [valueYear, setValueYear] = useState(3);

  // handle data Radio Button
  const handleChangeYear = (e) => {
    switch (e.target.value) {
      case 1:
        setValueYear(1);
        onChangeYear("*");
        break;
      case 2:
        setValueYear(2);
        onChangeYear(`${endYear}/${startYear}`);
        break;
      case 3:
        setValueYear(3);
        const valueCheck = checkYear.reduce(
          (prev, current) => prev + `,${current}`,
          "",
        );
        onChangeYear(valueCheck.slice(1));
        break;
      case 4:
        setValueYear(4);
        onChangeYear(`${startYear1}-${endYear1}`);
        break;
      default:
        break;
    }
  };

  // handle data radio button 2
  const handleStartYear = (e) => {
    setStartYear(e);
    if (valueYear === 2) {
      onChangeYear(`${endYear}/${e}`);
    }
  };

  const handleEndYear = (e) => {
    setEndYear(e);
    if (valueYear === 2) {
      onChangeYear(`${e}/${startYear}`);
    }
  };

  const handleStartYear1 = (e) => {
    setStartYear1(e);
    if (valueYear === 4) {
      onChangeYear(`${e}-${endYear1}`);
    }
  };

  const handleEndYear1 = (e) => {
    setEndYear1(e);
    if (valueYear === 4) {
      onChangeYear(`${startYear1}-${e}`);
    }
  };

  // handle data radio button 3

  const handleCheckYear = (e) => {
    setCheckYear(e);
    if (valueYear === 3) {
      const valueCheck = e.reduce((prev, current) => prev + `,${current}`, "");
      onChangeYear(valueCheck.slice(1));
    }
  };

  // for radio button 2
  const year1 = [];
  for (let i = 1; i < 85; i++) {
    year1.push({
      timeYear: i,
    });
  }
  const year2 = [];
  for (let i = 2022; i < 2052; i++) {
    year2.push({
      timeYear: i,
    });
  }

  // handle radio button 3
  const yearCheck = [];
  for (let i = 2020; i < 2100; i++) {
    yearCheck.push({
      timeyerarCek: i,
    });
  }
  return (
    <Radio.Group onChange={handleChangeYear} value={valueYear}>
      <Space direction="vertical">
        <Radio value={1}>Every Year</Radio>
        <Radio value={2}>
          <div className="w-full flex gap-5 items-center ">
            Every
            <Select
              style={{
                width: 120,
              }}
              onChange={handleStartYear}
              allowClear
            >
              {year1 &&
                year1.map((ta, index) => (
                  <Select.Option value={ta.timeYear} key={index}>
                    {ta.timeYear}
                  </Select.Option>
                ))}
            </Select>
            years(s) starting in
            <Select
              style={{
                width: 120,
              }}
              onChange={handleEndYear}
              allowClear
            >
              {year2 &&
                year2.map((ta, index) => (
                  <Select.Option value={ta.timeYear} key={index}>
                    {ta.timeYear}
                  </Select.Option>
                ))}
            </Select>
          </div>
        </Radio>
        <Radio value={3}>
          <span className="gap-5">Specific Year (choose one or many)</span>
          <div className="w-full grid grid-col-5">
            <Checkbox.Group
              style={{
                width: "100%",
              }}
              className=" w-full"
              onChange={handleCheckYear}
              defaultValue={[0]}
            >
              <div className="grid grid-cols-12">
                {yearCheck.map((option, index) => (
                  <Col span={8} key={index}>
                    <Checkbox value={option.timeyerarCek}>
                      {option.timeyerarCek}
                    </Checkbox>
                  </Col>
                ))}
              </div>
            </Checkbox.Group>
          </div>
        </Radio>
        <Radio value={4}>
          <div className="w-full flex items-center gap-5">
            <span>Every year between </span>
            <Select
              style={{
                width: 120,
              }}
              onChange={handleStartYear1}
              allowClear
            >
              {year2.map((ta, index) => (
                <Select.Option value={ta.timeYear}>{ta.timeYear}</Select.Option>
              ))}
            </Select>
            and
            <Select
              style={{
                width: 120,
              }}
              onChange={handleEndYear1}
              allowClear
            >
              {year2.map((ta, index) => (
                <Select.Option value={ta.timeYear}>{ta.timeYear}</Select.Option>
              ))}
            </Select>
          </div>
        </Radio>
      </Space>
    </Radio.Group>
  );
};
export default CronYear;
