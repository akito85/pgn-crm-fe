import React, { useState } from "react";

import {
    MoreOutlined,
    PlusOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";
import SVGIcon from "../../../../../../assets/Icon/index";
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
import moment from "moment";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import InputComponent from "../../../../../../components/InputComponent";
import { hasValue } from "../../../../../../utils";
import { useDispatch } from "react-redux";
const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    options,
    optionsAdditional,
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
    onCellClicked = () => { },
    handleSelectDataRecord = () => { },
    form,
    dispatch,
    rules,
    inputTypeRow,
    dispatchCountryZone = () => { },
    setKeyEdit,
    ...restProps
}) => {
    // const [form] = Form.useForm();
    // const [visiblePassword, setVisiblePassword] = useState(false);
    const key = record?.key || 0;
    const encrypt = record?.encrypt;
    // const rules = () => {
    //     let rules = [];
    //     if (required) {
    //         rules.push({
    //             required: required === undefined || required === false ? false : true,
    //             message: `Please input your ${title.toLowerCase()}!`,
    //         });
    //     }
    //     if (dataIndex === "value") {
    //         if (form.getFieldValue("inputType") === 750) {
    //             rules.push({
    //                 type: "email",
    //                 message: "The input is not valid E-mail!",
    //             });
    //         }
    //     }
    //     if (inputType === "input_regex") {
    //         rules.push(regex);
    //     }
    //     return rules.length !== 0 ? rules : undefined;
    // };

    const handleDisableDate = (current) => {
        if (disableDate) {
            return disableDate(current);
        }
        return moment().add(-1, "days") >= current;
    };
    const getInputNode = (inputType, options, optionsAdditional) => {
        switch (inputType) {
            case "text":
                return (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        valuePropName={inputType === "checkbox" ? "checked" : "value"}
                        rules={rules}
                        className={"w-full"}
                        getValueFromEvent={(value) =>
                            handleSelectDataRecord(value, key, dataIndex)
                        }
                    >
                        <InputComponent />
                    </Form.Item>
                );
            case "input":
                if (inputTypeRow === 748) {
                    return (
                        <Form.Item
                            name={dataIndex}
                            style={{
                                margin: 0,
                            }}
                            valuePropName={inputType === "checkbox" ? "checked" : "value"}
                            rules={rules}
                            className={"w-full"}
                            getValueFromEvent={(value) =>
                                handleSelectDataRecord(value, key, dataIndex)
                            }
                        >
                            <div className="w-full flex flex-row">
                                <Select
                                    onChange={(e) => {
                                        setPrefix1((prevState) => {
                                            return {
                                                ...prevState,
                                                [key]: e,
                                            };
                                        });
                                        // dispatch(getZoneContact({ id: e }));
                                        dispatchCountryZone(e)
                                    }}
                                    value={prefix1[key] || undefined}
                                    showSearch
                                    optionFilterProp="children"
                                    allowClear
                                    filterOption={(input, option) =>
                                        (option?.children ?? "")
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                    style={{ width: "50%" }}
                                    placeholder={"Country Code"}
                                >
                                    {options?.country_code?.map((option) => (
                                        <Select.Option key={option.value} value={option.value}>
                                            {option.label}
                                        </Select.Option>
                                    ))}
                                </Select>
                                <Select
                                    onChange={(e) => {
                                        setPrefix2((prevState) => {
                                            return {
                                                ...prevState,
                                                [key]: e,
                                            };
                                        })
                                    }
                                    }
                                    value={prefix2[key] || undefined}
                                    showSearch
                                    optionFilterProp="children"
                                    allowClear
                                    filterOption={(input, option) =>
                                        (option?.children ?? "")
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                    style={{ width: "50%" }}
                                    placeholder={"Zone Code"}
                                >
                                    {options?.country_zone?.map((option) => (
                                        <Select.Option key={option.value} value={option.value}>
                                            {option.label}
                                        </Select.Option>
                                    ))}
                                </Select>
                                <InputComponent
                                    maxLength={13}
                                    onChange={(e) => {
                                        setValue((prevState) => {
                                            return {
                                                ...prevState,
                                                [key]: e?.target?.value,
                                            };
                                        })
                                    }
                                    }
                                    onInput={(e) =>
                                        (e.target.value = e.target.value.replace(/[^\d]|^0+/g, ''))
                                    }
                                    value={value[key]}
                                    // type={"number"}
                                    // controls={false}
                                    style={{ width: "100%" }}
                                />
                                
                                <InputComponent
                                    maxLength={13}
                                    onChange={(e) => {
                                        setSuffix((prevState) => {
                                            return {
                                                ...prevState,
                                                [key]: e?.target?.value,
                                            };
                                        })
                                    }
                                    }
                                    onInput={(e) =>
                                        (e.target.value = e.target.value.replace(/[^\d]/g, ''))
                                    }
                                    value={suffix[key]}
                                    prefix={"Ext"}
                                    // type={"number"}
                                    // controls={false}
                                    style={{ width: "100%" }}
                                />
                            </div>
                        </Form.Item>
                    )
                } else if (inputTypeRow === 751) {
                    return (

                        <Form.Item
                            name={dataIndex}
                            style={{
                                margin: 0,
                            }}
                            valuePropName={inputType === "checkbox" ? "checked" : "value"}
                            rules={rules}
                            className={"w-full"}
                        // getValueFromEvent={(value) =>
                        //     handleSelectDataRecord(value, key, dataIndex)
                        // }
                        >
                            <div className="w-full flex flex-row">
                                <Select
                                    onChange={(e) => {
                                        setPrefix1((prevState) => {
                                            return {
                                                ...prevState,
                                                [key]: e,
                                            };
                                        });
                                        // dispatch(getZoneContact({ id: e }));
                                        dispatchCountryZone(e)
                                    }}
                                    value={prefix1[key]}
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
                                    {options?.country_code?.map((option) => (
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
                                                [key]: e,
                                            };
                                        })
                                    }
                                    value={prefix2[key]}
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
                                    {options?.country_zone?.map((option) => (
                                        <Select.Option key={option.value} value={option.value}>
                                            {option.label}
                                        </Select.Option>
                                    ))}
                                </Select>
                                <InputComponent
                                    maxLength={13}
                                    onChange={(e) => {
                                        setValue((prevState) => {
                                            return {
                                                ...prevState,
                                                [key]: e?.target?.value,
                                            };
                                        })
                                    }
                                    }
                                    onInput={(e) =>
                                        (e.target.value = e.target.value.replace(/[^\d]|^0+/g, ''))
                                    }
                                    value={value[key]}
                                    // type={"number"}
                                    // controls={false}
                                    style={{ width: "100%" }}
                                />
                            </div>
                        </Form.Item>
                    )
                } else if (inputTypeRow === 749) {
                    return (
                        <Form.Item
                            name={dataIndex}
                            style={{
                                margin: 0,
                            }}
                            valuePropName={inputType === "checkbox" ? "checked" : "value"}
                            rules={rules}
                            className={"w-full"}
                            getValueFromEvent={(value) =>
                                handleSelectDataRecord(value, key, dataIndex)
                            }
                        >
                            <div className="w-full flex flex-row">
                                <Select
                                    onChange={(e) => {
                                        setPrefix1((prevState) => {
                                            return {
                                                ...prevState,
                                                [key]: e,
                                            };
                                        });
                                        // dispatch(getZoneContact({ id: e }));
                                    }}
                                    value={prefix1[key]}
                                    showSearch
                                    optionFilterProp="children"
                                    allowClear
                                    filterOption={(input, option) =>
                                        (option?.children ?? "")
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                    style={{ width: "50%" }}
                                >
                                    {options?.country_code?.map((option) => (
                                        <Select.Option key={option.value} value={option.value}>
                                            {option.label}
                                        </Select.Option>
                                    ))}
                                </Select>
                                <InputComponent
                                    maxLength={13}
                                    onChange={(e) => {
                                        setValue((prevState) => {
                                            return {
                                                ...prevState,
                                                [key]: e?.target?.value,
                                            };
                                        })
                                    }
                                    }
                                    onInput={(e) =>
                                        (e.target.value = e.target.value.replace(/[^\d]|^0+/g, ''))
                                    }
                                    value={value[key]}
                                    // type={"number"}
                                    // controls={false}
                                    style={{ width: "100%" }}
                                />
                            </div>
                        </Form.Item>
                    )
                } else {
                    return (
                        <Form.Item
                            name={dataIndex}
                            style={{
                                margin: 0,
                            }}
                            valuePropName={inputType === "checkbox" ? "checked" : "value"}
                            rules={rules}
                            className={"w-full"}
                            getValueFromEvent={(value) =>
                                handleSelectDataRecord(value, key, dataIndex)
                            }
                        >
                            <InputComponent
                                onChange={(e) =>
                                    setValue((prevState) => {
                                        return {
                                            ...prevState,
                                            [key]: e.target.value,
                                        };
                                    })
                                }
                                value={value[key]}
                            />
                        </Form.Item>
                    )
                }

            case "input_regex":
                return (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        valuePropName={inputType === "checkbox" ? "checked" : "value"}
                        rules={inputType !== "checkbox" ? rules : undefined}
                        className={"w-full"}
                        getValueFromEvent={(value) =>
                            handleSelectDataRecord(value, key, dataIndex)
                        }
                    >
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
                    </Form.Item>
                );
            case "number":
                return (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        valuePropName={inputType === "checkbox" ? "checked" : "value"}
                        rules={rules}
                        className={"w-full"}
                        getValueFromEvent={(value) =>
                            handleSelectDataRecord(value, key, dataIndex)
                        }
                    >
                        <InputNumber
                            type={"number"}
                            style={{ width: "100%" }}
                            controls={false}
                        />
                    </Form.Item>
                );
            case "select":
                return (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        valuePropName={inputType === "checkbox" ? "checked" : "value"}
                        rules={rules}
                        className={"w-full"}
                        getValueFromEvent={(value) =>
                            handleSelectDataRecord(value, key, dataIndex)
                        }
                    >
                        <Select
                            onChange={onCellClicked}
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
                    </Form.Item>
                );
            case "checkbox":
                return (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        valuePropName={inputType === "checkbox" ? "checked" : "value"}
                        rules={inputType !== "checkbox" ? rules : undefined}
                        className={"w-full"}
                        getValueFromEvent={(value) =>
                            handleSelectDataRecord(value, key, dataIndex)
                        }
                    >
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
                    </Form.Item>
                );
            case "date":
                return (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        valuePropName={inputType === "checkbox" ? "checked" : "value"}
                        rules={inputType !== "checkbox" ? rules : undefined}
                        className={"w-full"}
                        getValueFromEvent={(value) =>
                            handleSelectDataRecord(value, key, dataIndex)
                        }
                    >
                        <DatePicker
                            format={"YYYY-MM-DD"}
                            disabledDate={handleDisableDate}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                );
            case "input_password":
                return (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        valuePropName={inputType === "checkbox" ? "checked" : "value"}
                        rules={inputType !== "checkbox" ? rules : undefined}
                        className={"w-full"}
                        getValueFromEvent={(value) =>
                            handleSelectDataRecord(value, key, dataIndex)
                        }
                    >
                        <Input type={showPassword[key] ? "password" : "text"} />
                    </Form.Item>
                );
            case "description":
                return (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        valuePropName={inputType === "checkbox" ? "checked" : "value"}
                        rules={inputType !== "checkbox" ? rules : undefined}
                        className={"w-full"}
                        getValueFromEvent={(value) =>
                            handleSelectDataRecord(value, key, dataIndex)
                        }
                    >
                        <Input.TextArea rows={1} maxLength={255} />
                    </Form.Item>);
            default:
                return (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        valuePropName={inputType === "checkbox" ? "checked" : "value"}
                        rules={inputType !== "checkbox" ? rules : undefined}
                        className={"w-full"}
                        getValueFromEvent={(value) =>
                            handleSelectDataRecord(value, key, dataIndex)
                        }
                    >
                        <InputComponent />
                    </Form.Item>);
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

    return (
        <td {...restProps}>
            {editing ? (
                inputNode
            ) : (
                children
            )}
        </td>
    );
};

const ContactTableInlane = ({
    onDataChange,
    dataTableDetail,
    cols,
    tableData,
    mode,
    onDetail,
    onInactive,
    header,
    regex,
    searchedColumnInlane,
    data_contactType,
    data_inputType,
    fieldSortInlane,
    orderSortInlane,
    searchTextInlane,
    data_countryCode,
    data_countryZone,
    required,
    useDynamicAction = false,
    action,
    useSelect = false,
    usePagination = false,
    onChangePage = () => { },
    onSizeChanger = () => { },
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
    setKeyEdit,
    // keyModal,
    setSelectDataRecord = () => { },
    inputTypeRow,
    dispatchCountryZone = () => { },
    setInputTypeRow = () => { },
    selectedType,
    setSelectedType = () => { },
    setIsInserted = () => { }
}) => {
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState("");
    const [storedDate, setStoredData] = useState(false);
    const [isInsert, setIsInsert] = useState(false);
    const [visiblePassword, setVisiblePassword] = useState({});
    const isEditing = (record) => record.key === editingKey;
    const [statusAction, setStatusAction] = useState("");
    const [tempUpdate, setTempUpdate] = useState({});
    const dispatch = useDispatch();

    // use effect if user inserting field
    useEffect(() => {
        if (storedDate === true) {
            setIsInserted(true)
        } else {
            setIsInserted(false)
        }
    }, [storedDate, setIsInserted])

    const edit = (record, field) => {
        setKeyEdit(parseInt(record.key))
        setStoredData(true);
        form.setFieldsValue(record);
        setEditingKey(record.key);
        setStatusAction("edit");
        setInputTypeRow(record?.inputType)
        setSelectedType(record?.type)
        if (hasValue(prefix1[record?.key]) && (inputTypeRow === 748 || inputTypeRow === 751)) {
            dispatchCountryZone(prefix1[record?.key]);
        }
        setTempUpdate({
            ...record,
            suffix: suffix[`${record.key}`],
            prefix1: prefix1[`${record.key}`],
            prefix2: prefix2[`${record.key}`],
            value: value[`${record.key}`],
          });
    };

    const clearData = (key) => {
        setKeyEdit(0)
        setSelectDataRecord((prevState) => {
            let temp = { ...prevState };
            delete temp[`${key}inputType`];
            return temp;
        });

        setPrefix1((prevState) => {
            let temp = { ...prevState };
            delete temp[key];
            return temp;
        });
        setPrefix2((prevState) => {
            let temp = { ...prevState };
            delete temp[key];
            return temp;
        });
        setSuffix((prevState) => {
            let temp = { ...prevState };
            delete temp[key];
            return temp;
        });
        setValue((prevState) => {
            let temp = { ...prevState };
            delete temp[key];
            return temp;
        });
    };

    const cancel = (key) => {
        setKeyEdit(0)
        if (statusAction === "add") {
            const newData = tableData.filter((item) => item.key !== key);
            onDataChange(newData);
            // onDataChange(newData);
            clearData(key);
        } else{
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
        setStatusAction("");
        // clearData(key);
        setInputTypeRow(750);
        setSelectedType('')
        setTempUpdate({});
    };

    const handleVisiblePassword = (data) => {
        setVisiblePassword((prevState) => {
            return {
                ...prevState,
                ...data,
            };
        });
    };

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
            form.resetFields(["inputType", "value"]);
        }
        return value;
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


    const save = async (key) => {
        try {
            const row = await form.validateFields();
            if(Object.values(row).some(value => value === undefined || !checkValidationInside(selectDataRecord[`${key}type`], key))){
                form.validateFields(["value"])
              } else {
                setKeyEdit(0)
                const newData = [...tableData];
                const index = newData.findIndex((item) => key === item.key);
                if (index > -1) {
                    const item = newData[index];
                    const updatedRow = { ...item, ...row };
                    newData.splice(index, 1, updatedRow);
                    onDataChange(newData);
                    setEditingKey("");
                } else {
                    newData.push(row);
                    onDataChange(newData);
                    setEditingKey("");
                }
                setStoredData(false);
                form.resetFields();
                setStatusAction("");
                setInputTypeRow(750);
                setSelectedType('')
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
        setKeyEdit(tableData.length + 1)
        const newRowKey = (tableData.length + 1).toString()
        const newRow = {
            key: newRowKey,
            contactDetailId: null,
        };
        onDataChange((prevData) => [...prevData, newRow]);
        setEditingKey(newRow.key);

        // set prefix and additional value
        setPrefix1((prevState) => ({ ...prevState, [newRowKey]: "" }))
        setPrefix2((prevState) => ({ ...prevState, [newRowKey]: "" }))
        setSuffix((prevState) => ({ ...prevState, [newRowKey]: "" }))
        setValue((prevState) => ({ ...prevState, [newRowKey]: "" }))
    };

    const deleteRow = (key) => {
        const newData = tableData.filter((item) => item.key !== key);
        const index = (dataTableDetail || []).length + 1;
        form.resetFields();
        onDataChange(newData);
        setStoredData(false);
        clearData(key);
    };

    const renderDelete = (record) => {
        return record.id ? (
            <Tooltip title="Delete">
                <SVGIcon
                    name="IconDelete"
                    color={"#D90000"}
                    width={24}
                    onClick={() => deleteRow(record.key)}
                />
            </Tooltip>
        ) : (
            <Tooltip title="Delete">
                <SVGIcon
                    name="IconDelete"
                    color={"#D90000"}
                    width={24}
                    onClick={() => deleteRow(record.key)}
                />
            </Tooltip>
        );
    };

    const columns = [
        ...cols,
        {
            title: "ACTION",
            dataIndex: "operation",
            align: "center",
            fixed: "right",
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
                                            <Checkbox
                                                onClick={() => onInactive(record?.id)}
                                                checked={record.status === "ACTIVE" ? true : false}
                                            >
                                                <span className={"text-black normal-case text-[18px]"}>
                                                    {record?.status}
                                                </span>
                                            </Checkbox>
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
                                    <SVGIcon color={"#D90000"} name="IconDelete" width={24} />
                                ) : (
                                    <SVGIcon
                                        color={"#D90000"}
                                        name="IconDelete"
                                        width={24}
                                        onClick={() => deleteRow(record.key)}
                                    />
                                )}
                            </>
                        ) : (
                            <div className="flex w-full justify-center gap-6">
                                {actionButton?.includes("detail") && (
                                    <ButtonComponent
                                        icon={<SVGIcon name="IconDetail" width={24} />}
                                        border={false}
                                        onClick={() => onDetail(record?.id)}
                                    />
                                )}
                                {actionButton?.includes("update") && (
                                    <Tooltip title="Edit">
                                        <div
                                            className={`flex justify-center${editingKey ? " cursor-not-allowed" : ""
                                                }`}
                                        >
                                            <SVGIcon
                                                name="IconEdit"
                                                color={editingKey ? "#8D91A0" : "#ACC424"}
                                                width={24}
                                                onClick={!editingKey ? () => edit(record) : undefined}
                                            />
                                        </div>
                                    </Tooltip>
                                )}

                                {actionButton?.includes("inactive") && (
                                    <ButtonComponent border={false}>
                                        <Checkbox
                                            onClick={() => onInactive(record?.id)}
                                            checked={record?.status === "ACTIVE"}
                                        />
                                    </ButtonComponent>
                                )}

                                {actionButton?.includes("delete") && (
                                    <Tooltip title="Delete">
                                        <div
                                            className={`flex justify-center${editingKey ? " cursor-not-allowed" : ""
                                                }`}
                                        >
                                            <SVGIcon
                                                name="IconDelete"
                                                color={editingKey ? "#8D91A0" : "#D90000"}
                                                width={24}
                                                className={
                                                    record.type === "exist" ? "disabled" : undefined
                                                }
                                                // onClick={
                                                //   record.type !== "exist"
                                                //     ? () => deleteRow(record.key)
                                                //     : undefined
                                                // }
                                                onClick={
                                                    !editingKey ? () => deleteRow(record.key) : undefined
                                                }
                                            />
                                        </div>
                                    </Tooltip>
                                )}
                            </div>
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

    const filterDataByPageData = (type = "data") => {
        let result = [...(tableData || [])];

        if (searchedColumnInlane) {
            const tempSearchText = searchTextInlane.toLowerCase();
            result = result.filter((item) => {
                switch (searchedColumnInlane) {
                    case "type":
                        const temp = data_contactType
                            .filter((a) => a.id === item[searchedColumnInlane])
                            ?.find((b) => b.name)?.name;
                        return temp?.toLowerCase().includes(tempSearchText);
                    case "inputType":
                        const temp1 = data_inputType
                            .filter((a) => a.id === item[searchedColumnInlane])
                            ?.find((b) => b.name)?.name;
                        return temp1?.toLowerCase().includes(tempSearchText);
                    case "value":
                        const record = item;
                        const prefixName1 =
                            data_countryCode &&
                            data_countryCode
                                .filter((a) => a.id === prefix1[`${record.key}`])
                                .find((b) => b.name)?.name;

                        const prefixName2 =
                            data_countryZone &&
                            data_countryZone
                                .filter((a) => a.Id === prefix2[`${record.key}`])
                                .find((b) => b.text)?.text;

                        const tempValue = value[`${record.key}`];
                        let dataValue = tempValue;

                        if (record.type === 741) {
                            if (record.inputType === 748) {
                                dataValue = `(${prefixName1}) (${prefixName2}) - ${tempValue} Ext ${suffix[`${record.key}`]
                                    }`;
                            } else {
                                dataValue = `(${prefixName1}) - ${tempValue}`;
                            }
                        }
                        if (record.type === 746) {
                            dataValue = `(${prefixName1}) - ${tempValue}`;
                        }
                        if (record.type === 747) {
                            dataValue = `(${prefixName1}) - ${tempValue}`;
                        }

                        if (record.type === 745) {
                            dataValue = `(${prefixName1}) (${prefixName2}) - ${tempValue}`;
                        }
                        return dataValue?.toLowerCase().includes(tempSearchText);
                    case "startDate":
                    case "endDate":
                        const date = item[searchedColumnInlane]
                            ? moment(item[searchedColumnInlane]).format("DD MMM YYYY")
                            : "";
                        return date?.toLowerCase().includes(tempSearchText);
                    default:
                        return item[searchedColumnInlane]
                            ?.toLowerCase()
                            .includes(tempSearchText);
                }
                // }
            });
        }
        const handleDataSort = (obj) => {
            switch (fieldSortInlane) {
                case "value":
                    const record = obj;
                    const prefixName1 =
                        data_countryCode &&
                        data_countryCode
                            .filter((a) => a.id === prefix1[`${record.key}`])
                            .find((b) => b.name)?.name;

                    const prefixName2 =
                        data_countryZone &&
                        data_countryZone
                            .filter((a) => a.Id === prefix2[`${record.key}`])
                            .find((b) => b.text)?.text;

                    const tempValue = value[`${record.key}`];
                    let dataValue = tempValue;

                    if (record.type === 741) {
                        if (record.inputType === 748) {
                            dataValue = `(${prefixName1}) (${prefixName2}) - ${tempValue} Ext ${suffix[`${record.key}`]
                                }`;
                        } else {
                            dataValue = `(${prefixName1}) - ${tempValue}`;
                        }
                    }
                    if (record.type === 746) {
                        dataValue = `(${prefixName1}) - ${tempValue}`;
                    }
                    if (record.type === 747) {
                        dataValue = `(${prefixName1}) - ${tempValue}`;
                    }

                    if (record.type === 745) {
                        dataValue = `(${prefixName1}) (${prefixName2}) - ${tempValue}`;
                    }
                    return dataValue?.toLowerCase();
                case "type":
                    const temp = data_contactType
                        .filter((a) => a.id === obj[fieldSortInlane])
                        ?.find((b) => b.name)?.name;
                    return temp?.toLowerCase();
                case "inputType":
                    const temp1 = data_inputType
                        .filter((a) => a.id === obj[fieldSortInlane])
                        ?.find((b) => b.name)?.name;
                    return temp1?.toLowerCase();
                case "startDate":
                case "endDate":
                    const date = obj[fieldSortInlane]
                        ? moment(obj[fieldSortInlane]).format("DD MMM YYYY")
                        : "";
                    return date?.toLowerCase();
                default:
                    return obj[fieldSortInlane]?.toLowerCase();
            }
            // }
        };
        if (fieldSortInlane) {
            result.sort((a, b) => {
                let fa = handleDataSort(a);
                let fb = handleDataSort(b);
                if (fa < fb) {
                    return orderSortInlane === "asc" ? -1 : 1;
                }
                if (fa > fb) {
                    return orderSortInlane === "asc" ? 1 : -1;
                }
                return 0;
            });
        }
        const fix = result.slice((current - 1) * pageSize, current * pageSize);
        return type === "data" ? fix : result.length;
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
                        disabled={storedDate}
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
                            total={filterDataByPageData("length")}
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
                    dataSource={filterDataByPageData("data")}
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
                                    options: col?.options,
                                    onCellClicked: col.onClick,
                                    showPassword: visiblePassword,
                                    handlePassword: handleVisiblePassword,
                                    regex: regex,
                                    required: col.required,
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
                                    // keyModal: keyModal,
                                    form: form,
                                    handleSelectDataRecord: handleSelectDataRecord,
                                    dispatch: dispatch,
                                    rules: col.rules,
                                    inputTypeRow: inputTypeRow,
                                    dispatchCountryZone: dispatchCountryZone,
                                    setKeyEdit:setKeyEdit
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

export default ContactTableInlane;
