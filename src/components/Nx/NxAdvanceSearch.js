import React, { useState } from "react";
import { Modal, Select, Input, Button, Dropdown, Menu, Divider } from "antd";
import {
  PlusOutlined,
  CloseOutlined,
  DownOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";

const { Option } = Select;

const NxAdvanceSearch = ({
  visible,
  onClose,
  onSearch,
  onClear,
  columns = [],
  modalWidth = 1100,
}) => {
  const [filters, setFilters] = useState([
    {
      id: Date.now(),
      column: "",
      operator: "Equal to",
      value: "",
      logic: "AND",
    },
  ]);
  const [filterRules, setFilterRules] = useState([]);
  const [limitData, setLimitData] = useState("");

  // Available operators
  const operators = [
    "Equal to",
    "Not equal to",
    "Contains",
    "Does not contain",
    "Greater than",
    "Less than",
    "Greater than or equal",
    "Less than or equal",
    "Is empty",
    "Is not empty",
  ];

  // Add new filter to main group
  const addFilter = () => {
    const newFilter = {
      id: Date.now(),
      column: "",
      operator: "Equal to",
      value: "",
      logic: "AND",
    };
    setFilters([...filters, newFilter]);
  };

  // Remove filter from main group
  const removeFilter = (id) => {
    if (filters.length > 1) {
      setFilters(filters.filter((f) => f.id !== id));
    }
  };

  // Update filter in main group
  const updateFilter = (id, field, value) => {
    setFilters(
      filters.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  // Add filter rule group
  const addFilterRule = () => {
    setFilterRules([
      ...filterRules,
      {
        id: Date.now(),
        filters: [
          {
            id: Date.now() + 1,
            column: "",
            operator: "Equal to",
            value: "",
            logic: "AND",
          },
        ],
        groupLogic: "OR",
      },
    ]);
  };

  // Add filter within a rule group
  const addFilterToRule = (ruleId) => {
    setFilterRules(
      filterRules.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              filters: [
                ...rule.filters,
                {
                  id: Date.now(),
                  column: "",
                  operator: "Equal to",
                  value: "",
                  logic: "AND",
                },
              ],
            }
          : rule
      )
    );
  };

  // Update filter in rule group
  const updateRuleFilter = (ruleId, filterId, field, value) => {
    setFilterRules(
      filterRules.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              filters: rule.filters.map((f) =>
                f.id === filterId ? { ...f, [field]: value } : f
              ),
            }
          : rule
      )
    );
  };

  // Update rule group logic
  const updateRuleLogic = (ruleId, logic) => {
    setFilterRules(
      filterRules.map((rule) =>
        rule.id === ruleId ? { ...rule, groupLogic: logic } : rule
      )
    );
  };

  // Remove rule group
  const removeRuleGroup = (ruleId) => {
    setFilterRules(filterRules.filter((rule) => rule.id !== ruleId));
  };

  // Handle search
  const handleSearch = () => {
    const searchData = {
      filters: filters,
      filterRules: filterRules,
      limitData: limitData,
    };
    onSearch?.(searchData);
  };

  // Handle clear
  const handleClear = () => {
    setFilters([
      {
        id: Date.now(),
        column: "",
        operator: "Equal to",
        value: "",
        logic: "AND",
      },
    ]);
    setFilterRules([]);
    setLimitData("");
    onClear?.();
  };

  // Logic dropdown menu
  const getLogicMenu = (currentLogic, onChange) => (
    <Menu
      selectedKeys={[currentLogic]}
      onClick={({ key }) => onChange(key)}
      style={{ minWidth: 30 }}
    >
      <Menu.Item key="AND">AND</Menu.Item>
      <Menu.Item key="OR">OR</Menu.Item>
    </Menu>
  );

  return (
    <Modal
      visible={visible}
      footer={null}
      onCancel={onClose}
      width={modalWidth}
      bodyStyle={{ padding: "0px" }}
      closable={false}
    >
      <div className="space-y-6">
        {/* Main Filter Group */}
        <div className="flex p-5 gap-[50px]">
          <div className="text-base font-normal text-gray-800">Where</div>
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-4 mb-4">
              {/* First Filter Row */}
              <div className="flex-1 flex gap-3">
                <Select
                  placeholder="Select Column"
                  value={filters[0]?.column || undefined}
                  onChange={(value) =>
                    updateFilter(filters[0].id, "column", value)
                  }
                  className="flex-1"
                  showSearch
                  size="large"
                  style={{
                    borderRadius: 8,
                  }}
                >
                  {columns.map((col) => (
                    <Option key={col.key} value={col.key}>
                      {col.title}
                    </Option>
                  ))}
                </Select>

                <Select
                  value={filters[0]?.operator}
                  onChange={(value) =>
                    updateFilter(filters[0].id, "operator", value)
                  }
                  style={{ width: 200 }}
                  size="large"
                >
                  {operators.map((op) => (
                    <Option key={op} value={op}>
                      {op}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            {/* First Filter Value Input */}
            <div className="mb-4">
              <TextArea
                placeholder="Input Value or Formula"
                value={filters[0]?.value}
                onChange={(e) =>
                  updateFilter(filters[0].id, "value", e.target.value)
                }
                size="large"
                style={{ borderRadius: 8 }}
              />
            </div>
            {/* Additional Filters in Main Group */}
            {filters.slice(1).map((filter, index) => (
              <div key={filter.id} className="mb-4">
                <div className="mb-3">
                  <Dropdown
                    overlay={getLogicMenu(filter.logic, (logic) =>
                      updateFilter(filter.id, "logic", logic)
                    )}
                    trigger={["click"]}
                  >
                    <Button
                      style={{
                        borderRadius: 8,
                        minWidth: 100,
                        height: 36,
                      }}
                    >
                      {filter.logic} <DownOutlined />
                    </Button>
                  </Dropdown>
                </div>

                <div className="flex gap-3 mb-3">
                  <Select
                    placeholder="Select Column"
                    value={filter.column || undefined}
                    onChange={(value) =>
                      updateFilter(filter.id, "column", value)
                    }
                    className="flex-1"
                    showSearch
                    size="large"
                  >
                    {columns.map((col) => (
                      <Option key={col.key} value={col.key}>
                        {col.title}
                      </Option>
                    ))}
                  </Select>

                  <Select
                    value={filter.operator}
                    onChange={(value) =>
                      updateFilter(filter.id, "operator", value)
                    }
                    style={{ width: 200 }}
                    size="large"
                  >
                    {operators.map((op) => (
                      <Option key={op} value={op}>
                        {op}
                      </Option>
                    ))}
                  </Select>
                </div>

                <TextArea
                  placeholder="Input Value or Formula"
                  value={filter.value}
                  onChange={(e) =>
                    updateFilter(filter.id, "value", e.target.value)
                  }
                  size="large"
                  style={{ borderRadius: 8 }}
                />
              </div>
            ))}

            {/* Add Linear Filter Button */}
            <Button
              type="link"
              icon={<PlusOutlined />}
              onClick={addFilter}
              style={{
                padding: "4px 8px",
                color: "#1890ff",
                fontSize: 15,
                height: "auto",
                border: "1px dashed #d9d9d9",
                borderRadius: 6,
              }}
            >
              Add Linear Filter
            </Button>
          </div>
        </div>

        <Divider />
        {/* Filter Rule Groups */}
        {filterRules.map((rule, ruleIndex) => (
          <div key={rule.id} className="flex flex-col gap-5 px-5 border-t ">
            <div className="flex gap-5">
              <div className="mb-4">
                <Dropdown
                  overlay={getLogicMenu(rule.groupLogic, (logic) =>
                    updateRuleLogic(rule.id, logic)
                  )}
                  trigger={["click"]}
                >
                  <Button
                    style={{
                      borderRadius: 8,
                      minWidth: 50,
                      height: 36,
                    }}
                  >
                    {rule.groupLogic} <DownOutlined />
                  </Button>
                </Dropdown>
              </div>

              <div className="flex flex-col w-full">
                {rule.filters.map((filter, filterIndex) => (
                  <div key={filter.id} className="mb-4 ">
                    {filterIndex > 0 && (
                      <div className="mb-3">
                        <Dropdown
                          overlay={getLogicMenu(filter.logic, (logic) =>
                            updateRuleFilter(rule.id, filter.id, "logic", logic)
                          )}
                          trigger={["click"]}
                        >
                          <Button
                            style={{
                              borderRadius: 8,
                              minWidth: 100,
                              height: 36,
                            }}
                          >
                            {filter.logic} <DownOutlined />
                          </Button>
                        </Dropdown>
                      </div>
                    )}

                    <div className="flex gap-3 mb-3 ">
                      <Select
                        placeholder="Select Column"
                        value={filter.column || undefined}
                        onChange={(value) =>
                          updateRuleFilter(rule.id, filter.id, "column", value)
                        }
                        className="flex-1"
                        showSearch
                        size="large"
                      >
                        {columns.map((col) => (
                          <Option key={col.key} value={col.key}>
                            {col.title}
                          </Option>
                        ))}
                      </Select>

                      <Select
                        value={filter.operator}
                        onChange={(value) =>
                          updateRuleFilter(
                            rule.id,
                            filter.id,
                            "operator",
                            value
                          )
                        }
                        style={{ width: 200 }}
                        size="large"
                      >
                        {operators.map((op) => (
                          <Option key={op} value={op}>
                            {op}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    <TextArea
                      placeholder="Input Value or Formula"
                      value={filter.value}
                      onChange={(e) =>
                        updateRuleFilter(
                          rule.id,
                          filter.id,
                          "value",
                          e.target.value
                        )
                      }
                      size="large"
                      style={{ borderRadius: 8 }}
                    />
                  </div>
                ))}
                <Button
                  type="link"
                  icon={<PlusOutlined />}
                  onClick={() => addFilterToRule(rule.id)}
                  style={{
                    padding: "4px 8px",
                    color: "#1890ff",
                    fontSize: 15,
                    height: "auto",
                    border: "1px dashed #d9d9d9",
                    borderRadius: 6,
                  }}
                >
                  Add Linear Filter
                </Button>
              </div>
            </div>
          </div>
        ))}

        <Divider />
        {/* Add Filter Rules Button */}
        <div className="border-t px-5">
          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={addFilterRule}
            style={{
              padding: "4px 0",
              fontSize: 15,
              height: "auto",
            }}
          >
            Add Filter Rules
          </Button>
        </div>

        {/* Set Limit Data */}
        <div className="border border-[#0000] pt-6 bg-[#F5F5F5] px-5">
          <div className="text-base font-normal text-gray-800 mb-3">
            Set Limit Data
          </div>
          <Input
            placeholder="No Limitation"
            value={limitData}
            onChange={(e) => setLimitData(e.target.value)}
            type="number"
            size="large"
            style={{ borderRadius: 8 }}
          />
          {/* Footer Actions */}
          <div className="flex justify-between bg-[#F5F5F5] border-t py-[20px]">
            <Button
              onClick={onClose}
              size="large"
              style={{
                borderColor: "#BDBDBD",
                borderRadius: 8,
                backgroundColor: "white",
                minWidth: 100,
                height: 42,
                fontSize: 15,
                color: "black",
              }}
            >
              Cancel
            </Button>

            <div className="flex gap-3">
              <Button
                onClick={handleClear}
                size="large"
                style={{
                  color: "#ff4d4f",
                  borderColor: "#ff4d4f",
                  backgroundColor: "#FFEBEE",
                  borderRadius: 8,
                  width: "fit-content",
                  height: 42,
                  fontSize: 15,
                }}
              >
                Clear Filter
              </Button>
              <Button
                type="primary"
                onClick={handleSearch}
                size="large"
                style={{
                  borderRadius: 8,
                  width: "fit-content",
                  height: 42,
                  fontSize: 15,
                }}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default NxAdvanceSearch;
