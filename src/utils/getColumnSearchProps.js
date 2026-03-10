import { FilterOutlined } from "@ant-design/icons";
import { DatePicker, Input, TimePicker, Select  } from "antd";
import Highlighter from "react-highlight-words";
import { dateFormatting, hasValue } from ".";
import moment from "moment";
// import InputComponent from "../components/InputComponent";
// import { format } from "react-number-format/types/numeric_format";


// BE
export const getColumnSearchPropsPaging = (
  dataIndex,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  excludeRender = false,
  typeFilter = "input",
  search
) => {
  let obj = {
    filteredValue: search?.[dataIndex] ? [search[dataIndex]] : null,
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      const onDataChange = (value, dateString) => {
        // setSelectedKeys(dateString ? [dateString] : null);
        handleSearch(dateString ? [dateString] : [], confirm, dataIndex);
      };

      return (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {typeFilter === "date" ? (
            <DatePicker onChange={onDataChange} format={dateFormatting.date} ref={searchInput} value={hasValue(searchText) && moment(searchText).clone()} />
          ) : null}
          {typeFilter === "dateCapital" ? (
            <DatePicker onChange={onDataChange} format={dateFormatting.dateCapital} ref={searchInput} value={hasValue(searchText) && moment(searchText).clone()} />
          ) : null}
          {typeFilter === "datetime" ? (
            <DatePicker onChange={onDataChange} showTime={true} format={dateFormatting.dateTime} ref={searchInput} value={hasValue(searchText) && moment(searchText).clone()} />
          ) : null}
          {typeFilter === "datePeriod" ? (
            <DatePicker onChange={onDataChange} picker="month" format={dateFormatting.datePeriod} ref={searchInput} value={hasValue(searchText) && moment(searchText).clone()} />
          ) : null}
          {typeFilter === "year_only" ? (
            <DatePicker onChange={onDataChange} picker="year" format={dateFormatting.year_only} ref={searchInput} value={hasValue(search[dataIndex]) && moment(search[dataIndex]).clone()} />
          ) : null}
          {typeFilter === "hour" ? (
            <TimePicker format={dateFormatting?.hour_format} onChange={onDataChange} />
          ) : null}
          {typeFilter === "input" ? (
            <Input
              ref={searchInput}
              placeholder={`Search`}
              value={selectedKeys[0] || search?.[dataIndex] || ""}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() =>
                handleSearch(selectedKeys, confirm, dataIndex)
              }
              styleGroup={{
                marginBottom: 8,
                display: "block",
              }}
            />
          ) : null}
          {typeFilter === 'boolean' ? (
            <Input
              ref={searchInput}
              placeholder={`Search (Y/N/y/n)`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^YyNn]/g, "")?.charAt(0)
              }
              }
              onPressEnter={() =>
                handleSearch(selectedKeys, confirm, dataIndex)
              }
              style={{
                marginBottom: 8,
                display: "block",
              }}
              maxLength={1}
            />
          ) : null}
          {typeFilter === 'yes_or_no' ? (
            <Input
              ref={searchInput}
              placeholder={`Search (Yes/No)`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^yesnoYESNO]/g, "");
              }
              }
              onPressEnter={() =>
                handleSearch(selectedKeys, confirm, dataIndex)
              }
              style={{
                marginBottom: 8,
                display: "block",
              }}
              maxLength={3}
            />
          ) : null}
        </div>
      );
    },
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered || search?.[dataIndex] ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text || ""
      ),
  };
  if (excludeRender) {
    delete obj.render;
  }
  return obj;
};


// FE
export const getColumnSearchProps = (
  dataIndex,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  excludeRender = false,
  typeFilter = "input",
  search
) => {
  let obj = {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      const onDataChange = (value, dateString) => {
        setSelectedKeys(dateString ? [dateString] : []);
        handleSearch(dateString ? [dateString] : [], confirm, dataIndex);
      };
      return (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {typeFilter === "date" ? (
            <DatePicker onChange={onDataChange} format={dateFormatting.date} />
          ) : null}
          {typeFilter === "dateCapital" ? (
            <DatePicker onChange={onDataChange} format={dateFormatting.dateCapital} />
          ) : null}
          {typeFilter === "datetime" ? (
            <DatePicker onChange={onDataChange} showTime={true} format={dateFormatting.dateTime} />
          ) : null}
          {typeFilter === "datePeriod" ? (
            <DatePicker onChange={onDataChange} picker="month" format={dateFormatting.datePeriod} />
          ) : null}
           {typeFilter === "year_only" ? (
            <DatePicker onChange={onDataChange} picker="year" format={dateFormatting.year_only} ref={searchInput} value={hasValue(search[dataIndex]) && moment(search[dataIndex]).clone()} />
          ) : null}
          {typeFilter === "hour" ? (
            <TimePicker format={dateFormatting?.hour_format} onChange={onDataChange} />
          ) : null}
          {typeFilter === "input" || typeFilter === "status" || typeFilter === 'contact' || typeFilter === 'select' ? (
            <Input
              ref={searchInput}
              placeholder={`Search`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() =>
                handleSearch(selectedKeys, confirm, dataIndex)
              }
              style={{
                marginBottom: 8,
                display: "block",
              }}
            />
          ) : null}

          {typeFilter === 'boolean' ? (
            <Input
              ref={searchInput}
              placeholder={`Search (Y/N/y/n)`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^YyNn]/g, "")?.charAt(0)
              }
              }
              onPressEnter={() =>
                handleSearch(selectedKeys, confirm, dataIndex)
              }
              style={{
                marginBottom: 8,
                display: "block",
              }}
              maxLength={1}
            />
          ) : null}
          {typeFilter === 'yes_or_no' ? (
            <Input
              ref={searchInput}
              placeholder={`Search (Yes/No)`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^yesnoYESNO]/g, "");
              }
              }
              onPressEnter={() =>
                handleSearch(selectedKeys, confirm, dataIndex)
              }
              style={{
                marginBottom: 8,
                display: "block",
              }}
              maxLength={3}
            />
          ) : null}
        </div>
      );
    },
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    onFilter: (value, record) => {
      if (typeFilter === 'status') {
        return record[dataIndex].toString().toLowerCase() === value?.toLowerCase()
      } else if (typeFilter === 'dateCapital') {
        return moment(record[dataIndex])?.format(dateFormatting?.dateCapital)?.toLowerCase() === moment(value)?.format(dateFormatting.dateCapital)?.toLowerCase()
      } else if (typeFilter === 'datetime') {
        return moment(record[dataIndex]).format(dateFormatting?.dateTime)?.toLowerCase() === moment(value)?.format(dateFormatting.dateTime)?.toLowerCase()
      } else if (typeFilter === 'datePeriod') {
        return moment(record[dataIndex]).format(dateFormatting.datePeriod).toLowerCase() === moment(value)?.format(dateFormatting.datePeriod)?.toLowerCase()
      } else if (typeFilter === 'date') {
        return moment(record[dataIndex])?.format(dateFormatting?.date)?.toLowerCase() === moment(value)?.format(dateFormatting.date)?.toLowerCase()
      } else if (typeFilter === 'boolean') {
        let result;
        if (value?.toLowerCase() === 'y') {
          result = record[dataIndex] === true
        } else {
          result = record[dataIndex] === false
        }
        return result;
      } else {
        if (typeFilter === 'contact' && dataIndex === 'value') {
          let changeDataIndex = dataIndex === 'value' ? 'fullValue' : dataIndex;
          return record[changeDataIndex]?.toString()?.toLowerCase()?.includes(value?.toLowerCase()) || record[changeDataIndex]?.label?.toString()?.toLowerCase()?.includes(value?.toLowerCase());
        } else {
          return record[dataIndex]?.toString()?.toLowerCase()?.includes(value?.toLowerCase()) || record[dataIndex]?.label?.toString()?.toLowerCase()?.includes(value?.toLowerCase());
        }
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text || ""
      ),
  };
  if (excludeRender) {
    delete obj.render;
  }
  return obj;
};


export const getColumnSearchPropsUseFilteredValue = (
  search,
  dataIndex,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  excludeRender = false,
  typeFilter = "input",
  selectOptions = [],
  handleReset = null
) => {
  let obj = {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
      const onDataChange = (value, dateString) => {
        setSelectedKeys(dateString ? [dateString] : null);
        handleSearch(dateString ? [dateString] : [], confirm, dataIndex);
      };

      return (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {typeFilter === "date" ? (
            <DatePicker onChange={onDataChange} format={dateFormatting.date} ref={searchInput} value={hasValue(search[dataIndex]) && moment(search[dataIndex]).clone()} />
          ) : null}
          {typeFilter === "dateCapital" ? (
            <DatePicker onChange={onDataChange} format={dateFormatting.dateCapital} ref={searchInput} value={hasValue(search[dataIndex]) && moment(search[dataIndex]).clone()} />
          ) : null}
          {typeFilter === "datetime" ? (
            <DatePicker onChange={onDataChange} showTime={true} format={dateFormatting.dateTime} ref={searchInput} value={hasValue(search[dataIndex]) && moment(search[dataIndex]).clone()} />
          ) : null}
          {typeFilter === "datePeriod" ? (
            <DatePicker onChange={onDataChange} picker="month" format={dateFormatting.datePeriod} ref={searchInput} value={hasValue(search[dataIndex]) && moment(search[dataIndex]).clone()} />
          ) : null}
          {typeFilter === "year_only" ? (
            <DatePicker onChange={onDataChange} picker="year" format={dateFormatting.year_only} ref={searchInput} value={hasValue(search[dataIndex]) && moment(search[dataIndex]).clone()} />
          ) : null}
          {typeFilter === "hour" ? (
            <TimePicker format={dateFormatting?.hour_format} onChange={onDataChange} />
          ) : null}
          {/* TAMBAHKAN CASE SELECT INI */}
          {typeFilter === "select" ? (
            <Select
              ref={searchInput}
              placeholder="Select Status"
              value={selectedKeys[0]}
              onChange={(value) => {
                setSelectedKeys(value ? [value] : []);
                handleSearch(value ? [value] : [], confirm, dataIndex);
              }}
              style={{ width: 200, marginBottom: 8, display: "block" }}
              allowClear
            >
              {selectOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          ) : null}
          {typeFilter === "input" ? (
            <Input
              ref={searchInput}
              placeholder={`Search`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() =>
                handleSearch(selectedKeys, confirm, dataIndex)
              }
              styleGroup={{
                marginBottom: 8,
                display: "block",
              }}
            />
          ) : null}
          {typeFilter === 'boolean' ? (
            <Input
              ref={searchInput}
              placeholder={`Search (Y/N/y/n)`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^YyNn]/g, "")?.charAt(0)
              }}
              onPressEnter={() =>
                handleSearch(selectedKeys, confirm, dataIndex)
              }
              style={{
                marginBottom: 8,
                display: "block",
              }}
              maxLength={1}
            />
          ) : null}
          {typeFilter === 'yes_or_no' ? (
            <Input
              ref={searchInput}
              placeholder={`Search (Yes/No)`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^yesnoYESNO]/g, "");
              }}
              onPressEnter={() =>
                handleSearch(selectedKeys, confirm, dataIndex)
              }
              style={{
                marginBottom: 8,
                display: "block",
              }}
              maxLength={3}
            />
          ) : null}
          {handleReset ? (
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
              <button
                onClick={() => handleReset(clearFilters, dataIndex)}
                style={{ cursor: "pointer", padding: "2px 8px", fontSize: 12 }}
              >
                Reset
              </button>
            </div>
          ) : null}
        </div>
      );
    },
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered && hasValue(search[dataIndex]) === true ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text || ""
      ),
  };
  
  if (excludeRender) {
    delete obj.render;
  }
  
  // Tambahkan filteredValue untuk select
  if (typeFilter === "select") {
    obj.filteredValue = search[dataIndex] ? [search[dataIndex]] : null;
  }
  
  return obj;
};

export const getColumnSearchPropsUseFilteredValueFE = (
  search,
  dataIndex,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  excludeRender = false,
  typeFilter = "input",
  storedData = false,
) => {
  let obj = {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      const onDataChange = (value, dateString) => {
        setSelectedKeys(dateString ? [dateString] : null);
        handleSearch(dateString ? [dateString] : [], confirm, dataIndex);
      };

      return (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {typeFilter === "date" ? (
            <DatePicker onChange={onDataChange} format={dateFormatting.date} ref={searchInput} value={hasValue(search[dataIndex]) && moment(search[dataIndex]).clone()} />
          ) : null}
          {typeFilter === "dateCapital" ? (
            <DatePicker onChange={onDataChange} format={dateFormatting.dateCapital} ref={searchInput} value={hasValue(search[dataIndex]) && moment(search[dataIndex]).clone()} />
          ) : null}
          {typeFilter === "datetime" ? (
            <DatePicker onChange={onDataChange} showTime={true} format={dateFormatting.dateTime} ref={searchInput} value={hasValue(search[dataIndex]) && moment(search[dataIndex]).clone()} />
          ) : null}
          {typeFilter === "datePeriod" ? (
            <DatePicker onChange={onDataChange} picker="month" format={dateFormatting.datePeriod} ref={searchInput} value={hasValue(search[dataIndex]) && moment(search[dataIndex]).clone()} />
          ) : null}
          {typeFilter === "hour" ? (
            <TimePicker format={dateFormatting?.hour_format} onChange={onDataChange} />
          ) : null}
          {typeFilter === "input" || typeFilter === 'status' || typeFilter === 'select' || typeFilter === 'currency' ? (
            <Input
              ref={searchInput}
              placeholder={`Search`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() =>
                handleSearch(selectedKeys, confirm, dataIndex)
              }
              styleGroup={{
                marginBottom: 8,
                display: "block",
              }}
            />
          ) : null}
          {typeFilter === 'boolean' ? (
            <Input
              ref={searchInput}
              placeholder={`Search (Y/N/y/n)`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^YyNn]/g, "")?.charAt(0)
              }
              }
              onPressEnter={() =>
                handleSearch(selectedKeys, confirm, dataIndex)
              }
              style={{
                marginBottom: 8,
                display: "block",
              }}
              maxLength={1}
            />
          ) : null}
           {typeFilter === 'yes_or_no' ? (
            <Input
              ref={searchInput}
              placeholder={`Search (Yes/No)`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^yesnoYESNO]/g, "");
              }
              }
              onPressEnter={() =>
                handleSearch(selectedKeys, confirm, dataIndex)
              }
              style={{
                marginBottom: 8,
                display: "block",
              }}
              maxLength={3}
            />
          ) : null}
          {typeFilter?.includes("decimal") ? (
            <Input
              ref={searchInput}
              placeholder={`Search`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() =>
                handleSearch(selectedKeys, confirm, dataIndex)
              }
              styleGroup={{
                marginBottom: 8,
                display: "block",
              }}
            />
          ) : null}
        </div>
      );
    },
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered && hasValue(search[dataIndex]) === true ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    onFilter: (value, record) => {
      if (typeFilter === 'status') {
        return record[dataIndex].toString().toLowerCase() === value?.toLowerCase()
      } else if (typeFilter === 'dateCapital') {
        return moment(record[dataIndex])?.format(dateFormatting?.dateCapital)?.toLowerCase() === moment(value)?.format(dateFormatting.dateCapital)?.toLowerCase()
      } else if (typeFilter === 'datetime') {
        return moment(record[dataIndex]).format(dateFormatting?.dateTime)?.toLowerCase() === moment(value)?.format(dateFormatting.dateTime)?.toLowerCase()
      } else if (typeFilter === 'datePeriod') {
        return moment(record[dataIndex]).format(dateFormatting.datePeriod).toLowerCase() === moment(value)?.format(dateFormatting.datePeriod)?.toLowerCase()
      } else if (typeFilter === 'date') {
        return moment(record[dataIndex])?.format(dateFormatting?.date)?.toLowerCase() === moment(value)?.format(dateFormatting.date)?.toLowerCase()
      } else if (typeFilter === 'boolean') {
        let result;
        if (value?.toLowerCase() === 'y') {
          result = record[dataIndex] === true
        } else {
          result = record[dataIndex] === false
        }
        return result;
      } else {
        if (typeFilter === 'contact' && dataIndex === 'value') {
          let changeDataIndex = dataIndex === 'value' ? 'fullValue' : dataIndex;
          return record[changeDataIndex]?.toString()?.toLowerCase()?.includes(value?.toLowerCase()) || record[changeDataIndex]?.label?.toString()?.toLowerCase()?.includes(value?.toLowerCase());
        } else if (typeFilter === "currency") {
          const tempValue = record[dataIndex]
            ? (record[dataIndex] + "").split(".")
            : [];
          const thousandSeparator = ",";
          const decimalSeparator = ".";
          const descimal = tempValue[1]
            ? `${decimalSeparator}${tempValue[1]}`
            : `${decimalSeparator}00`;
          const format =
            tempValue.length > 0
              ? tempValue[0].replace(
                /\B(?=(\d{3})+(?!\d))/g,
                thousandSeparator
              ) + descimal
              : "";
          return format?.toString()?.toLowerCase()?.includes(value?.toLowerCase())
        } else if(typeFilter?.includes("decimal")){
          const decimal = parseInt(typeFilter?.split(",")[1]);
          const tempValue = record[dataIndex]
            ? (record[dataIndex] + "").split(".")
            : [];
          const thousandSeparator = ",";
          const decimalSeparator = ".";
          const descimal = tempValue[1]
            ? `${decimalSeparator}${tempValue[1]}${"0"?.repeat(
                decimal - tempValue[1].length > 0
                  ? decimal - tempValue[1].length
                  : 0
              )}`
            : `${decimalSeparator}${"0"?.repeat(decimal)}`;

          const format =
            tempValue.length > 0
              ? tempValue[0].replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  thousandSeparator
                ) + descimal
              : "";

      return format?.toString()?.toLowerCase()?.includes(value?.toLowerCase())
        } else {
          return record[dataIndex]?.toString()?.toLowerCase()?.includes(value?.toLowerCase()) || record[dataIndex]?.label?.toString()?.toLowerCase()?.includes(value?.toLowerCase());
        }
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text || ""
      ),
  };
  if (excludeRender) {
    delete obj.render;
  }
  return obj;
};