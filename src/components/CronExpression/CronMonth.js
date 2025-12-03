import { Checkbox, Radio, Select, Space } from "antd";
import Col from "antd/es/grid/col";
import React, { useState } from "react";

const CronMonth = (props) => {
  const { onChangeMonth } = props;
  const [startMonth, setStartMonth] = useState();
  const [endMonth, setEndMonth] = useState();
  const [checkMonth, setCheckMonth] = useState([]);
  const [startMonth1, setStartMonth1] = useState();
  const [endMonth1, setEndMonth1] = useState();
  const [valueMonth, setValueMonth] = useState(3);

  //data Nama Bulannn
  const dataMonth = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];
  // handle data bulan jadi 3 huruf pertama
  const namaBulan = dataMonth.map((item) => {
    return {
      namaBulan: item.label.substring(0, 3),
    };
  });

  // handle data Radio Button

  const handleChangeMonth = (e) => {
    switch (e.target.value) {
      case 1:
        setValueMonth(1);
        onChangeMonth("*");
        break;
      case 2:
        setValueMonth(2);
        onChangeMonth(`${endMonth}/${startMonth}`);
        break;
      case 3:
        setValueMonth(3);
        const valueCheck = checkMonth.reduce(
          (prev, current) => prev + `,${current}`,
          ""
        );
        onChangeMonth(valueCheck.slice(1));
        break;
      case 4:
        setValueMonth(4);
        onChangeMonth(`${startMonth1}-${endMonth1}`);
        break;
      default:
        break;
    }
  };

  // handle data radio button 2

  const handleStartMonth = (e) => {
    setStartMonth(e);
    if (valueMonth === 2) {
      onChangeMonth(`${endMonth}/${e}`);
    }
  };

  const handleEndMonth = (e) => {
    setEndMonth(e);
    if (valueMonth === 2) {
      onChangeMonth(`${e}/${startMonth}`);
    }
  };

  const handleStartMonth1 = (e) => {
    setStartMonth1(e);
    if (valueMonth === 4) {
      onChangeMonth(`${e}-${endMonth1}`);
    }
  };

  const handleEndMonth1 = (e) => {
    setEndMonth1(e);
    if (valueMonth === 4) {
      onChangeMonth(`${startMonth1}-${e}`);
    }
  };

  // handle data radio button 3

  const handleCheckMonth = (e) => {
    setCheckMonth(e);
    if (valueMonth === 3) {
      const valueCheck = e.reduce((prev, current) => prev + `,${current}`, "");
      onChangeMonth(valueCheck.slice(1));
    }
  };

  // for radio button 2
  const month1 = [];
  for (let i = 1; i < 14; i++) {
    month1.push({
      timeMonth: i,
    });
  }

  const monthCheck = [];
  for (let i = 0; i < 24; i++) {
    monthCheck.push({
      timemonthCek: i,
    });
  }
  return (
    <Radio.Group onChange={handleChangeMonth} value={valueMonth}>
      <Space direction="vertical">
        <Radio value={1}>Every Month</Radio>
        <Radio value={2}>
          <div className="w-full flex gap-5 items-center ">
            Every
            <Select
              style={{
                width: 120,
              }}
              onChange={handleStartMonth}
              allowClear
            >
              {month1 &&
                month1.map((ta, index) => (
                  <Select.Option value={ta.timeMonth} key={index}>
                    {ta.timeMonth}
                  </Select.Option>
                ))}
            </Select>
            month(s) starting in
            <Select
              style={{
                width: 120,
              }}
              onChange={handleEndMonth}
              allowClear
            >
              {dataMonth.map((ta, index) => (
                <Select.Option value={ta.value}>{ta.label}</Select.Option>
              ))}
            </Select>
          </div>
        </Radio>
        <Radio value={3}>
          <span className="gap-5">Specific Month (choose one or many)</span>
          <div className="w-full grid grid-col-5">
            <Checkbox.Group
              style={{
                width: "100%",
              }}
              className=" w-full"
              onChange={handleCheckMonth}
              defaultValue={[0]}
            >
              <div className="grid grid-cols-12">
                {namaBulan.map((option, index) => (
                  <Col span={8} key={index}>
                    <Checkbox value={index}>{option.namaBulan}</Checkbox>
                  </Col>
                ))}
              </div>
            </Checkbox.Group>
          </div>
        </Radio>
        <Radio value={4}>
          <div className="w-full flex items-center gap-5">
            <span>Every month between </span>
            <Select
              style={{
                width: 120,
              }}
              onChange={handleStartMonth1}
              allowClear
            >
              {dataMonth.map((ta, index) => (
                <Select.Option value={ta.value}>{ta.label}</Select.Option>
              ))}
            </Select>
            and
            <Select
              style={{
                width: 120,
              }}
              onChange={handleEndMonth1}
              allowClear
            >
              {dataMonth.map((ta, index) => (
                <Select.Option value={ta.value}>{ta.label}</Select.Option>
              ))}
            </Select>
          </div>
        </Radio>
      </Space>
    </Radio.Group>
  );
};

export default CronMonth;
