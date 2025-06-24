import React, { useState } from "react";
import {
  Table,
  Input,
  InputNumber,
  Form,
  Select,
  Checkbox,
  Tooltip,
  DatePicker,
  Popover,
  Pagination,
  Space,
} from "antd";
import { useSelector } from "react-redux";
import moment from "moment";
import {
  DeleteOutlined,
  MoreOutlined,
  PlusOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";
import SVGIcon from "../../../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../../../components/ButtonComponent";
import InputComponent from "../../../../../../../../components/InputComponent";
import { hasValue } from "../../../../../../../../utils";
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  options,
  optionsAdditional = [],
  showPassword,
  handlePassword,
  regex,
  required,
  disableDate,
  selectDataRecord,
  setPrefix1,
  setPrefix2,
  setSuffix,
  setValue,
  prefix1,
  prefix2,
  suffix,
  value,
  keyModal,
  onCellClicked = () => {},
  handleSelectDataRecord = () => {},
  dispatch,
  getCountryZone,
  form,
  ...restProps
}) => {
  // const [form] = Form.useForm();
  // const [visiblePassword, setVisiblePassword] = useState(false);
  const {
    data_country_zone,
  } = useSelector((state) => state.accountContact);
  const key = record?.key || 0;
  const encrypt = record?.encrypt;
  const rules = () => {
    let rules = [];
    if (required) {
      rules.push({
        required: required === undefined || required === false ? false : true,
        message: `Please input your ${title.toLowerCase()}!`,
      });
    }
    if (dataIndex === "value") {
      if (form.getFieldValue("inputType") === 750) {
        rules.push({
          type: "email",
          message: "The input is not valid E-mail!",
        });
      }
    }
    if (inputType === "input_regex") {
      rules.push(regex);
    }
    return rules.length !== 0 ? rules : undefined;
  };

  const handleInputChangePhoneNumber = (e) => {
    // Check if the value starts with '0', and if so, remove the '0'  onInput={(e) => {
    const temp =
      e.target.value && String(e.target.value || "").startsWith("0")
        ? e.target.value.substring(1).replace(/\D/g, "")
        : e.target.value.replace(/\D/g, "");

    e.target.value = temp;
  };

  const validateEmail = (_, value) => {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || emailRegex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject("The Input is not valid E-mail!");
  };

  const getInputProps = (width = 100, validate = true) => {
    return {
      onInput: validate ? handleInputChangePhoneNumber : null,
      // allowClear: true,
      controls: false,
      className: "text-right",
      style: {
        width: `${width}%`,
        textAlign: "right !important",
        borderRadius: "6px",
        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        padding: "4px 12px",
      },
      type: "",
    };
  };

  const handleDisableDate = (current) => {
    if (disableDate) {
      return disableDate(current);
    }
    return moment().add(-1, "days") >= current;
  };
  
  const getInputNode = (inputType, options, optionsAdditional) => {
    switch (inputType) {
      case "text":
        return <InputComponent />;
      case "input":
        if (selectDataRecord[`${record.key}type`] === 741) {
          if (selectDataRecord[`${record.key}inputType`] === 748) {
            return (
              <div className="w-full flex flex-row">
                <Select
                  onChange={(e) => {
                    getCountryZone(e)
                    setPrefix1((prevState) => {
                      return {
                        ...prevState,
                        [`${key}`]: e,
                      };
                    })
                  }
                  }
                  value={prefix1[`${key}`]}
                  showSearch
                  optionFilterProp="children"
                  allowClear
                  filterOption={(input, option) =>
                    (option?.children ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  style={{ width: "40%" }}
                >
                  {options?.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
                <Select
                  onChange={(e) =>
                    setPrefix2((prevState) => {
                      return {
                        ...prevState,
                        [`${key}`]: e,
                      };
                    })
                  }
                  value={prefix2[`${key}`]}
                  showSearch
                  optionFilterProp="children"
                  allowClear
                  filterOption={(input, option) =>
                    (option?.children ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  style={{ width: "40%" }}
                >
                  {optionsAdditional?.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
                <Input
                  {...getInputProps(50)}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setValue((prevState) => {
                      return {
                        ...prevState,
                        [`${key}`]: inputValue,
                      };
                    });
                  }}
                  value={value[`${key}`]}
                  maxLength={12}
                  // type={"number"}
                  // controls={false}
                  // style={{ width: "50%" }}
                />
                {/* <InputNumber
                  maxLength={12}
                  onChange={(e) =>
                    setValue((prevState) => {
                      return {
                        ...prevState,
                        [`${key}`]: e,
                      };
                    })
                  }
                  value={value[`${key}`]}
                  type={"number"}
                  controls={false}
                  style={{ width: "90%" }}
                /> */}
                <span className="custom-number-input">
                  <Input
                    {...getInputProps(100, false)}
                    onChange={(e) => {
                      setSuffix((prevState) => {
                        return {
                          ...prevState,
                          [`${key}`]: hasValue(e.target.value) ? e.target.value : null,
                        };
                      });
                    }}
                    value={suffix[`${key}`]}
                    prefix={"Ext"}
                    // type={"number"}
                    // controls={false}
                    // style={{ width: "50%"}}
                  />
                </span>
                {/* <InputNumber
                  onChange={(e) =>
                    setSuffix((prevState) => {
                      return {
                        ...prevState,
                        [`${key}`]: e,
                      };
                    })
                  }
                  value={suffix[`${key}`]}
                  prefix={"Ext"}
                  type={"number"}
                  controls={false}
                  style={{ width: "60%" }}
                /> */}
              </div>
            );
          } else {
            return (
              <div className="w-full flex flex-row">
                <Select
                  onChange={(e) =>
                    setPrefix1((prevState) => {
                      return {
                        ...prevState,
                        [`${key}`]: e,
                      };
                    })
                  }
                  value={prefix1[`${key}`]}
                  showSearch
                  optionFilterProp="children"
                  allowClear
                  filterOption={(input, option) =>
                    (option?.children ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  style={{ width: "35%" }}
                >
                  {options?.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
                <Input
                  {...getInputProps()}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setValue((prevState) => {
                      return {
                        ...prevState,
                        [`${key}`]: inputValue,
                      };
                    });
                  }}
                  value={value[`${key}`]}
                  maxLength={12}
                  // type={"number"}
                  // controls={false}
                  // style={{ width: "100%" }}
                />
                {/* <InputNumber
                  onChange={(e) =>
                    setValue((prevState) => {
                      return {
                        ...prevState,
                        [`${key}`]: e,
                      };
                    })
                  }
                  value={value[`${key}`]}
                  type={"number"}
                  controls={false}
                  style={{ width: "100%" }}
                /> */}
              </div>
            );
          }
        }
        if (selectDataRecord[`${record.key}type`] === 743) {
          return (
            <InputComponent 
              onChange={(e) =>
                setValue((prevState) => {
                  return {
                    ...prevState,
                    [`${key}`]: e.target.value,
                  };
                })
              }
              value={value[`${key}`]}
            />
          )
        }
        if (selectDataRecord[`${record.key}type`] === 742) {
          return (
            <InputComponent 
              onChange={(e) =>
                setValue((prevState) => {
                  return {
                    ...prevState,
                    [`${key}`]: e.target.value,
                  };
                })
              }
              value={value[`${key}`]}
            />
          ) 
        }
        if (selectDataRecord[`${record.key}type`] === 746) {
          return (
            <div className="w-full flex flex-row">
              <Select
                onChange={(e) =>
                  setPrefix1((prevState) => {
                    return {
                      ...prevState,
                      [`${key}`]: e,
                    };
                  })
                }
                value={prefix1[`${key}`]}
                showSearch
                optionFilterProp="children"
                allowClear
                filterOption={(input, option) =>
                  (option?.children ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                style={{ width: "35%" }}
              >
                {options?.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
              <Input
                {...getInputProps()}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  setValue((prevState) => {
                    return {
                      ...prevState,
                      [`${key}`]: inputValue,
                    };
                  });
                }}
                value={value[`${key}`]}
                maxLength={12}
                // type={"number"}
                // controls={false}
                // style={{ width: "100%" }}
              />
              {/* <InputNumber
                maxLength={12}
                onChange={(e) =>
                  setValue((prevState) => {
                    return {
                      ...prevState,
                      [`${key}`]: e,
                    };
                  })
                }
                value={value[`${key}`]}
                type={"number"}
                controls={false}
                style={{ width: "100%" }}
              /> */}
            </div>
          );
        }
        if (selectDataRecord[`${record.key}type`] === 747) {
          return (
            <div className="w-full flex flex-row">
              <Select
                onChange={(e) =>
                  setPrefix1((prevState) => {
                    return {
                      ...prevState,
                      [`${key}`]: e,
                    };
                  })
                }
                value={prefix1[`${key}`]}
                showSearch
                optionFilterProp="children"
                allowClear
                filterOption={(input, option) =>
                  (option?.children ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                style={{ width: "35%" }}
              >
                {options?.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
              <Input
                {...getInputProps()}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  setValue((prevState) => {
                    return {
                      ...prevState,
                      [`${key}`]: inputValue,
                    };
                  });
                }}
                value={value[`${key}`]}
                maxLength={12}
                // type={"number"}
                // controls={false}
                // style={{ width: "100%" }}
              />
              {/* <InputNumber
                maxLength={12}
                onChange={(e) =>
                  setValue((prevState) => {
                    return {
                      ...prevState,
                      [`${key}`]: e,
                    };
                  })
                }
                value={value[`${key}`]}
                type={"number"}
                controls={false}
                style={{ width: "100%" }}
              /> */}
            </div>
          );
        }
        if (selectDataRecord[`${record.key}type`] === 745) {
          return (
            <div className="w-full flex flex-row">
              <Select
                onChange={(e) =>{
                  getCountryZone(e)
                  setPrefix1((prevState) => {
                    return {
                      ...prevState,
                      [`${key}`]: e,
                    };
                  })
                }
                }
                value={prefix1[`${key}`]}
                showSearch
                optionFilterProp="children"
                allowClear
                filterOption={(input, option) =>
                  (option?.children ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                style={{ width: "35%" }}
              >
                {options?.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
              <Select
                onChange={(e) =>
                  setPrefix2((prevState) => {
                    return {
                      ...prevState,
                      [`${key}`]: e,
                    };
                  })
                }
                value={prefix2[`${key}`]}
                showSearch
                optionFilterProp="children"
                allowClear
                filterOption={(input, option) =>
                  (option?.children ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                style={{ width: "40%" }}
              >
                {optionsAdditional?.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
              <Input
                onChange={(e) => {
                  const inputValue = e.target.value;
                  setValue((prevState) => {
                    return {
                      ...prevState,
                      [`${key}`]: inputValue,
                    };
                  });
                }}
                value={value[`${key}`]}
                // type={"number"}
                // controls={false}
                // style={{ width: "100%" }}
              />
              <span className="custom-number-input">
                <Input
                  {...getInputProps(100, false)}
                  onChange={(e) => {
                    setSuffix((prevState) => {
                      return {
                        ...prevState,
                        [`${key}`]: hasValue(e.target.value) ? e.target.value : null,
                      };
                    });
                  }}
                  value={suffix[`${key}`]}
                  prefix={"Ext"}
                  // type={"number"}
                  // controls={false}
                  // style={{ width: "50%"}}
                />
              </span>
              {/* <InputNumber
                onChange={(e) =>
                  setValue((prevState) => {
                    return {
                      ...prevState,
                      [`${key}`]: e,
                    };
                  })
                }
                value={value[`${key}`]}
                type={"number"}
                controls={false}
                style={{ width: "100%" }}
              /> */}
            </div>
          );
        }
        if (selectDataRecord[`${record.key}type`] === 744) {
          return (
            <InputComponent
              onChange={(e) =>
                setValue((prevState) => {
                  return {
                    ...prevState,
                    [`${key}`]: e.target.value,
                  };
                })
              }
              value={value[`${key}`]}
            />
          );
        } else {
          return (
            <InputComponent
              onChange={(e) =>
                setValue((prevState) => {
                  return {
                    ...prevState,
                    [`${key}`]: e.target.value,
                  };
                })
              }
              value={value[`${key}`]}
            />
          );
        }
      case "input_regex":
        return (
          <Input
            suffix={
              <Tooltip
                title={
                  <span className={"w-1/2"}>
                    Your key must contain at least:
                    <br />
                    - No Space
                    <br />
                    - Upper case letter
                    <br />- Non-alphanumeric characters, such as !, @, #, $, %,
                    ^, &, *, etc.
                  </span>
                }
              >
                <InfoCircleOutlined
                  style={{
                    color: "rgba(0,0,0,.45)",
                  }}
                />
              </Tooltip>
            }
          />
        );
      case "number":
        return (
          <InputNumber
            type={"number"}
            style={{ width: "100%" }}
            controls={false}
          />
        );
      case "select":
        return (
          <Select
            // onChange={form.resetFields([""])}
            disabled={dataIndex === "inputType" ? true : false}
            showSearch
            optionFilterProp="children"
            allowClear
            filterOption={(input, option) =>
              (option?.children ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {options?.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        );
      case "checkbox":
        return (
          <Checkbox
            className="action-checkbox"
            value={encrypt || false}
            onChange={(e) => {
              const data = {
                [key]: e.target.checked,
              };
              handlePassword(data);
            }}
          />
        );
      case "date":
        return (
          <DatePicker
            format={"YYYY-MM-DD"}
            disabledDate={handleDisableDate}
            style={{ width: "100%" }}
          />
        );
      case "input_password":
        return <Input type={showPassword[key] ? "password" : "text"} />;
      case "description":
        return <Input.TextArea rows={1} maxLength={255} />;
      default:
        return <InputComponent />;
    }
  };
  const inputNode = getInputNode(inputType, options, optionsAdditional);

  if (
    dataIndex === "operation" ||
    dataIndex === "no" ||
    dataIndex === "status"
  ) {
    return (
      <td {...restProps}>
        <div>{children}</div>
      </td>
    );
  }

  const getRules = () => {
    switch (inputType) {
      case "input":
        // Apply email validation
        return selectDataRecord[`${record.key}type`] === 742 ||
          selectDataRecord[`${record.key}type`] === 743
          ? [{ validator: validateEmail }]
          : null;

      case "checkbox":
        // checkbox validation
        return rules();

      default:
        // Default case for other input types
        return null;
    }
  };

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          valuePropName={inputType === "checkbox" ? "checked" : "value"}
          // rules={inputType !== "checkbox" ? rules() : undefined}
          rules={getRules()}
          className={"w-full"}
          getValueFromEvent={(value) =>
            handleSelectDataRecord(value, key, dataIndex)
          }
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const TableInlineContact = ({
  onDataChange,
  cols,
  tableData,
  mode,
  onDetail,
  onInactive,
  header,
  regex,
  required,
  useDynamicAction = false,
  action,
  useSelect = false,
  usePagination = false,
  onChangePage = () => {},
  onSizeChanger = () => {},
  pageSize,
  current,
  totalData,
  showCreateButton = true,
  scrollTable = {},
  disableDate,
  setOpenModal,
  actionButton,
  onSort,
  selectDataRecord,
  setPrefix1,
  setPrefix2,
  setSuffix,
  setValue,
  prefix1,
  prefix2,
  suffix,
  value,
  keyModal,
  setSelectDataRecord = () => {},
  dataTableDetail,
  getCountryZone = () => {},
  dispatch,
  setIsEditing = () => {},
  setModalValidate = () => {},
  setEmptyValueValidate = () => {},
}) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [storedDate, setStoredData] = useState(false);
  const [isInsert, setIsInsert] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState({});
  const isEditing = (record) => record.key === editingKey;
  const [statusAction, setStatusAction] = useState("");
  const [tempUpdate, setTempUpdate] = useState({});

  useEffect(() => {
    if(dataTableDetail)
    setData(dataTableDetail)
  }, [dataTableDetail])

  useEffect(() => {
    if(editingKey !== null){
      setIsEditing(editingKey !== "" ? true : false)
    }
  },[editingKey])

  const edit = (record, field) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
    setStoredData(true);
    setTempUpdate({
      ...record,
      suffix: suffix[`${record.key}`],
      prefix1: prefix1[`${record.key}`],
      prefix2: prefix2[`${record.key}`],
      value: value[`${record.key}`],
    });
    setStatusAction("edit");
  };

  const cancel = (key) => {
    if (statusAction === "add") {
      const newData = data.filter((item) => item.key !== key);
      setData(newData);
      onDataChange(newData);
    }else{
      setPrefix1((prevState) => {
        return {
          ...prevState,
          [`${key}`]: tempUpdate.prefix1, // Reset the value for changes
        };
      });
  
      setPrefix2((prevState) => {
        return {
          ...prevState,
          [`${key}`]: tempUpdate.prefix2, // Reset the value for changes
        };
      });
  
      setSuffix((prevState) => {
        return {
          ...prevState,
          [`${key}`]: tempUpdate.suffix, // Reset the value for changes
        };
      });
  
      setValue((prevState) => {
        return {
          ...prevState,
          [`${key}`]: tempUpdate.value, // Reset the value for changes
        };
      });
    }
    setEditingKey("");
    setStoredData(false);
    setTempUpdate({});
    setStatusAction("");
  };

  const handleVisiblePassword = (data) => {
    setVisiblePassword((prevState) => {
      return {
        ...prevState,
        ...data,
      };
    });
  };

  const typeValue = (data) => {
    switch (data) {
      case 741: // phone
        return 748;
      case 746: // Whatsapp
      case 747: // pgn mobile
        return 749;
      case 742: // pgn mobile (email)
      case 743: // email
        return 750;
      case 745: // fax
        return 751;
      case 744: // url
        return 752;
      default:
        return 1; // Or any other default value
    }
  };

  const checkValidationInside = (data, key) => {
    switch (data) {
      case 741: // phone
        return  hasValue(prefix1[`${key}`]) && hasValue(value[`${key}`]) && hasValue(prefix2[`${key}`]);
      case 746: // Whatsapp
      case 747: // pgn mobile
        return hasValue(prefix1[`${key}`]) && hasValue(value[`${key}`]);
      case 742: // pgn mobile (email)
      case 743: // email
        return hasValue(value[`${key}`]);
      case 745: // fax
        return hasValue(prefix1[`${key}`]) && hasValue(value[`${key}`]) && hasValue(prefix2[`${key}`]);
      case 744: // url
        return hasValue(value[`${key}`]);
      default:
        return true; // Or any other default value
    }
  }

  const handleSelectDataRecord = (data, key, index) => {
    const keyName = key + index;
    const value = index === "value" ? data.target.value : data;
    setSelectDataRecord((prevState) => {
      return {
        ...prevState,
        [keyName]: value,
      };
    });
    if (index === "type") {
      setSelectDataRecord((prevState) => {
        return {
          ...prevState,
          // [keyName]: value,
          [`${key}inputType`] : typeValue(value),
        };
      });
      form.setFieldsValue({
        inputType: typeValue(value),
      });
      setPrefix1((prevState) => {
        return {
          ...prevState,
          [`${key}`]: "", // Reset the value for changes
        };
      })
      setPrefix2((prevState) => {
        return {
          ...prevState,
          [`${key}`]: "", // Reset the value for changes
        };
      })
      setSuffix((prevState) => {
        return {
          ...prevState,
          [`${key}`]: "", // Reset the value for changes
        };
      })
      setValue((prevState) => {
        return {
          ...prevState,
          [`${key}`]: "", // Reset the value for changes
        };
      });
      form.resetFields([
        // "inputType", 
        "value"]);
    }
    return value;
  };

  const handleInputType = (col, record) => {
    if (col.dataIndex === "inputType") {
      const obj = {
        741: [748, 749], // phone = phone, mobile phone
        743: [750], // email = email
        742: [750], // pgn mobile (email) = email
        746: [749], // Whatsapp = mobile phone
        747: [749], // pgn mobile (phone) = mobile phone
        745: [751], // fax = fax
        744: [752], // url = free
      };
      const data = selectDataRecord[`${record.key}type`];
      return col.options?.filter((a) => obj[data]?.includes(a.value));
    }
    return col.options;
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      if(Object.values(row).some(value => value === undefined || !checkValidationInside(selectDataRecord[`${key}type`], key))){
        setEmptyValueValidate(true);
        setModalValidate(true);
      } else {
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        const updatedRow = { ...item, ...row };
        newData.splice(index, 1, updatedRow);
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
      setStoredData(false);
      onDataChange([...newData]);
      form.resetFields();
      setStatusAction("");
    }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const addRow = () => {
    form.resetFields();
    setStoredData(true);
    setIsInsert(true);
    setStatusAction("add");
    const newRow = {
      key: (data.length + 1).toString(),
    };
    // setData((prevData) => [...prevData, newRow]);
    // setEditingKey(newRow.key);
    setPrefix1((prevState) => {
      let temp = { ...prevState };
      temp[newRow.key] = ""; // Reset the value for the new row
      return temp;
    });

    setPrefix2((prevState) => {
      let temp = { ...prevState };
      temp[newRow.key] = ""; // Reset the value for the new row
      return temp;
    });

    setSuffix((prevState) => {
      let temp = { ...prevState };
      temp[newRow.key] = ""; // Reset the value for the new row
      return temp;
    });

    setValue((prevState) => {
      let temp = { ...prevState };
      temp[newRow.key] = ""; // Reset the value for the new row
      return temp;
    });

    setData((prevData) => [...prevData, newRow]);
    setEditingKey(newRow.key);
  };

  const deleteRow = (key) => {
    // const newData = data.filter((item) => item.key !== key);
    const newData = data.filter((item) => item.key !== key).map((item) => {
      const currentKey = parseInt(item.key, 10);
    
      // Update the key only if it comes after the deleted key
      if (currentKey > key) {
        item.key = (currentKey - 1).toString();
      }
    
      return item;
    });

    // const index = (dataTableDetail || []).length + 1;
    setData(newData);
    onDataChange(newData);
    setStoredData(false);

    setSelectDataRecord((prevState) => {
      let temp = { ...prevState };
      delete temp[`${key}inputType`];
      delete temp[`${key}type`];
      return temp;
    });

    // setPrefix1((prevState) => {
    //   let temp = { ...prevState };
    //   delete temp[key];
    //   return temp;
    // });

    setPrefix1((prevState) => {
      let temp = { ...prevState };
      delete temp[`${key}`];
    
      // Iterate over the remaining keys and update their values
      Object.keys(temp).forEach((existingKey) => {
        const existingKeyNumber = parseInt(existingKey, 10);
    
        // Update the key only if it comes after the deleted key
        if (existingKeyNumber > key) {
            const newKey = existingKeyNumber - 1;
            temp[newKey] = temp[existingKey];
            delete temp[existingKey];
        }
      });
    
      return temp;
    });

    // setPrefix2((prevState) => {
    //   let temp = { ...prevState };
    //   delete temp[key];
    //   return temp;
    // });

    setPrefix2((prevState) => {
      let temp = { ...prevState };
      delete temp[`${key}`];
    
      // Iterate over the remaining keys and update their values
      Object.keys(temp).forEach((existingKey) => {
        const existingKeyNumber = parseInt(existingKey, 10);
    
        // Update the key only if it comes after the deleted key
        if (existingKeyNumber > key) {
            const newKey = existingKeyNumber - 1;
            temp[newKey] = temp[existingKey];
            delete temp[existingKey];
        }
      });
    
      return temp;
    });

    // setSuffix((prevState) => {
    //   let temp = { ...prevState };
    //   delete temp[key];
    //   return temp;
    // });

    setSuffix((prevState) => {
      let temp = { ...prevState };
      delete temp[`${key}`];
    
      // Iterate over the remaining keys and update their values
      Object.keys(temp).forEach((existingKey) => {
        const existingKeyNumber = parseInt(existingKey, 10);
    
        // Update the key only if it comes after the deleted key
        if (existingKeyNumber > key) {
            const newKey = existingKeyNumber - 1;
            temp[newKey] = temp[existingKey];
            delete temp[existingKey];
        }
      });
    
      return temp;
    });

    // setValue((prevState) => {
    //   let temp = { ...prevState };
    //   delete temp[key];
    //   return temp;
    // });

    setValue((prevState) => {
      let temp = { ...prevState };
      delete temp[`${key}`];
    
      // Iterate over the remaining keys and update their values
      Object.keys(temp).forEach((existingKey) => {
        const existingKeyNumber = parseInt(existingKey, 10);
    
        // Update the key only if it comes after the deleted key
        if (existingKeyNumber > key) {
            const newKey = existingKeyNumber - 1;
            temp[newKey] = temp[existingKey];
            delete temp[existingKey];
        }
      });
    
      return temp;
    });
  };

  const renderDelete = (record) => {
    return record.status === "ACTIVE" || record.status === "INACTIVE" ? (
      <ButtonComponent
        disabled
        icon={<DeleteOutlined style={{ fontSize: "24px", color: "#C0BEC6" }} />}
        border={false}
      />
    ) : (
      <ButtonComponent
        onClick={() => deleteRow(record.key)}
        disabled={editingKey !== ""}
        icon={                      
          <SVGIcon
            name="IconDelete"
            color={"#D90000"}
            width={24}
          />
        }
        border={false}
      />
    );
  };

  const columns = [
    ...cols,
    {
      title: "ACTIONS",
      dataIndex: "operation",
      fixed: "right",
      align: "center",
      width: 200,
      render: (_, record) => {
        const editable = record.key === editingKey;
        return (
          // rendering button
          <Space className="my-2 gap-2">
            {useDynamicAction ? (
              action(record, editable)
            ) : editable ? (
              <>
                <ButtonComponent
                  onClick={() => cancel(record.key)}
                  type="default"
                >
                  Cancel
                </ButtonComponent>
                <ButtonComponent onClick={() => save(record.key)} type="submit">
                  Save
                </ButtonComponent>
              </>
            ) : actionButton?.length >= 4 ? (
              <>
                <Popover
                  content={
                    <Space direction="vertical">
                      <ButtonComponent
                        icon={<SVGIcon name="IconDetail" width={24} />}
                        border={false}
                        onClick={() => onDetail(record?.id)}
                      >
                        <span className={"text-black"}> Detail</span>
                      </ButtonComponent>
                      <ButtonComponent
                        onClick={() => edit(record)}
                        disabled={editingKey !== ""}
                        icon={<SVGIcon name="IconEdit" width={24} />}
                        border={false}
                      >
                        <span className={"text-black"}> Update</span>
                      </ButtonComponent>
                      <ButtonComponent border={false}>
                        <Checkbox
                          onClick={() => onInactive(record?.id)}
                          checked={record.status === "ACTIVE" ? true : false}
                        >
                          <span
                            className={"text-black normal-case text-[18px]"}
                          >
                            {record?.status}
                          </span>
                        </Checkbox>
                      </ButtonComponent>
                    </Space>
                  }
                  trigger={"click"}
                  placement="bottomRight"
                >
                  <ButtonComponent
                    icon={<MoreOutlined style={{ fontSize: "24px" }} />}
                    border={false}
                  />
                </Popover>
                {record.status === "ACTIVE" || record.status === "INACTIVE" ? (
                  <ButtonComponent
                    disabled
                    icon={
                      <SVGIcon
                      name="IconDelete"
                      color={"#8D91A0"}/>
                    }
                    border={false}
                  />
                ) : (
                  <ButtonComponent
                    onClick={() => deleteRow(record.key)}
                    disabled={editingKey !== ""}
                    icon={
                      <SVGIcon
                      name="IconDelete"
                      color={"#8D91A0"}/>
                    }
                    border={false}
                  />
                )}
              </>
            ) : (
              <>
                {actionButton?.includes("detail") && (
                  <ButtonComponent
                    icon={<SVGIcon name="IconDetail" width={24} />}
                    border={false}
                    onClick={() => onDetail(record?.id)}
                  />
                )}
                {actionButton?.includes("update") && (
                  <ButtonComponent
                    onClick={() => edit(record)}
                    disabled={editingKey !== ""}
                    icon={<SVGIcon name="IconEdit" width={24} />}
                    border={false}
                  />
                )}

                {actionButton?.includes("inactive") && (
                  <ButtonComponent border={false}>
                    <Checkbox
                      onClick={() => onInactive(record?.id)}
                      checked={record?.status === "ACTIVE"}
                    />
                  </ButtonComponent>
                )}
                {actionButton?.includes("delete") && renderDelete(record)}
              </>
            )}
          </Space>
        );
      },
    },
  ];

  const [optionSelectedCol, setOptionSelectedCol] = useState([]);

  const handleDisplayColumn = (value) => {
    setOptionSelectedCol(value);
  };

  const paginationTable = (page, pageSize) => {
    return data?.slice((page - 1) * pageSize, page * pageSize);
  };

  const filterColumn = (dataColumn) => {
    return dataColumn.filter((col) => {
      return !optionSelectedCol.includes(col.title);
    });
  };

  return (
    <div className={"w-full flex flex-col gap-4"}>
      <div className={"w-full flex justify-end"}>
        {showCreateButton && (
          <ButtonComponent
            onClick={storedDate === false && addRow}
            type={"submit"}
            border={false}
            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
          >
            Create
          </ButtonComponent>
        )}
      </div>
      {useSelect || usePagination ? (
        <div className={"w-full flex mb-5 gap-2 justify-between"}>
          {useSelect ? (
            <Select
              mode="multiple"
              placeholder="Show All Column"
              className={"w-2/6"}
              maxTagCount={3}
              onChange={handleDisplayColumn}
            >
              {columns
                .map((col) => (
                  <Select.Option
                    key={col.title}
                    value={col.title}
                    disabled={
                      optionSelectedCol.length > 3
                        ? optionSelectedCol.includes(col.title)
                          ? false
                          : true
                        : false
                    }
                  >
                    {col.title}
                  </Select.Option>
                ))
                .splice(1)}
            </Select>
          ) : null}
          {usePagination ? (
            <Pagination
              total={totalData}
              className={"pr-1"}
              showSizeChanger
              current={current}
              pageSize={pageSize}
              onChange={onChangePage}
              onShowSizeChange={onSizeChanger}
              showTotal={(total, range) =>
                `Showing ${range[0]} to ${range[1]} of ${total} records`
              }
            />
          ) : null}
        </div>
      ) : null}
      <Form form={form} component={false}>
        <Table
          bordered
          dataSource={paginationTable(current, pageSize)}
          columns={filterColumn(
            columns.map((col) => {
              return {
                ...col,
                onCell: (record) => ({
                  record,
                  inputType: col.inputType,
                  dataIndex: col.dataIndex,
                  title: col.title,
                  editing: isEditing(record),
                  options: handleInputType(col, record),
                  optionsAdditional: col.optionsAdditional,
                  onCellClicked: col.onCellClicked,
                  showPassword: visiblePassword,
                  handlePassword: handleVisiblePassword,
                  regex: regex,
                  required: required,
                  disableDate,
                  selectDataRecord: selectDataRecord,
                  setPrefix1: setPrefix1,
                  setPrefix2: setPrefix2,
                  setSuffix: setSuffix,
                  setValue: setValue,
                  prefix1: prefix1,
                  prefix2: prefix2,
                  suffix: suffix,
                  value: value,
                  keyModal: keyModal,
                  handleSelectDataRecord: handleSelectDataRecord,
                  dispatch:dispatch,
                  getCountryZone:getCountryZone,
                  form: form,
                }),
              };
            })
          )}
          rowClassName={(record) => (isEditing(record) ? "editable-row" : "")}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          scroll={scrollTable}
          tableLayout="fixed"
          onChange={onSort}
          pagination={false}
        />
      </Form>
    </div>
  );
};

export default TableInlineContact;
