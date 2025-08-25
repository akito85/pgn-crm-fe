import { Form, Input, Pagination, Select, Space, Table, Tooltip } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCriteriaHooks } from './useCriteriaHooks';
import ButtonComponent from '../ButtonComponent';
import SVGIcon from "../../../src/assets/Icon/index"
import { hasValue, renderColumn, renderDateConverter } from '../../utils';
import ModalCustom from '../Modal/ModalCustom';
import CardComponent from '../Card/CardComponent';
import DetailText from '../DetailText';
import { ModalError } from '../Modal/ModalPopUp';
import { sorterFunction } from '../../utils/sorterFunction';
import { getColumnSearchProps, getColumnSearchPropsUseFilteredValueFE } from '../../utils/getColumnSearchProps';
import { CommonTable } from './CommonTableCriteria';
import moment from 'moment';
import DateComponent from '../DateComponent';
import { useDispatch } from 'react-redux';
import { setStored } from '../../redux/slices/criteria_slice';
import SelectComponent from '../SelectComponent';
import InputComponent from '../InputComponent';


const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    options = [],
    dependDataIndex,
    dataEditRecord,
    urlIndex,
    required,
    formTableCriteria,
    rules = [],
    indexValue,
    handleEditDataRecord = () => { },
    validateStartDate,
  validateEndDate,
    checkStartDateHeader,
    ...restProps
}) => {
    const key = record?.key || 0;
    const dataDepend = dependDataIndex
        ? dataEditRecord[key + dependDataIndex]
        : "";

    // const handleDisableDate = useCallback((current) => {
    //     if (dataIndex === 'startDate') {
    //         if (hasValue(startDate) && hasValue(endDate)) {
    //             return current < moment(startDate) || current > moment(endDate).add(1, 'days')
    //         } else if (hasValue(startDate) && checkStartDateHeader) {
    //             return moment(startDate) > current
    //         } else {
    //             return null;
    //         }
    //     } else if (dataIndex === 'endDate') {
    //         if (hasValue(startDate) && hasValue(endDate) && hasValue(formTableCriteria.getFieldValue('startDate')) === false) {
    //             return current < moment(startDate) || current > moment(endDate).add(1, 'days')
    //         } else if (hasValue(formTableCriteria.getFieldValue('startDate')) && hasValue(endDate)) {
    //             return moment(formTableCriteria.getFieldValue('startDate')) > current || current > moment(endDate).add(1, 'days')
    //         } else if (hasValue(formTableCriteria.getFieldValue('startDate'))) {
    //             return moment(formTableCriteria.getFieldValue().startDate) > current
    //         } else if (checkStartDateHeader) {
    //             return moment(startDate) > current
    //         } else {
    //             return null;
    //         }
    //     } else {
    //         return moment()
    //     }
    // }, [checkStartDateHeader, dataIndex, endDate, formTableCriteria, startDate]);

    const endDateValidator = (startDate) => (_, value) => {
        const momentStartDate = moment(startDate);
        const momentEndDate = moment(value);
    
        if ((value && momentStartDate <= momentEndDate) || !value) {
          return Promise.resolve();
        } else {
          return Promise.reject(new Error("End Date must be after Start Date"));
        }
      };
    
      const handleDisableDateBetween = (current) => {
        if (
          dataIndex === "endDate" &&
          hasValue(formTableCriteria.getFieldValue("startDate")) &&
          hasValue(validateEndDate)
        ) {
          return (
            moment(formTableCriteria.getFieldValue("startDate")) > current ||
            current > moment(validateEndDate).add(1, "days")
          );
        } else if (validateStartDate && validateEndDate) {
          const startDate = moment(validateStartDate).startOf("day");
          const endDate = moment(validateEndDate).endOf("day");
          return current.isBefore(startDate) || current.isAfter(endDate);
        } else {
          return true; // Disable all dates if start or end date is not defined
        }
      };
    
      // Validation Handle Start Date from Header Data
      const handleDisableDateBefore = (current) => {
        if (validateStartDate !== null) {
          return moment(validateStartDate) > current;
        }
        return moment().add(-1, "days") >= current;
      };


    const filterOption = (input, option) =>
        option.props.children.toLowerCase().includes(input.toLowerCase());

    const getInputNode = (inputType) => {
        switch (inputType) {
            case "select":
                return (
                    <SelectComponent
                        showSearch
                        optionFilterProp="children"
                        filterOption={filterOption}
                        labelInValue
                        disabled={dependDataIndex ? !dataDepend : false}
                        onChange={(e) => handleEditDataRecord(e?.value, key, dataIndex, record)}
                    >
                        {options.map((option) => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </SelectComponent>
                );
            case "startDate":
                return <DateComponent  dateDisable={
                    validateEndDate === null || validateEndDate === undefined
                      ? handleDisableDateBefore
                      : handleDisableDateBetween
                  }
                  disabled={validateStartDate === null} />;
            case "endDate":
                return (
                    <DateComponent
                    disabled={
                        formTableCriteria.getFieldValue().startDate === null ||
                        formTableCriteria.getFieldValue().startDate === undefined
                      }
                      dateDisable={
                        validateEndDate === null || validateEndDate === undefined
                          ? handleDisableDateBefore
                          : handleDisableDateBetween
                      }
                    />
                )
            default:
                return (
                    <InputComponent />
                );
        }
    };
    const inputNode = getInputNode(inputType);

    if (
        dataIndex === "action" ||
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
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    valuePropName={"value"}
                    rules={
                        inputType !== "endDate"
                          ? rules
                          : [
                              {
                                validator: (_, value) =>
                                  endDateValidator(
                                    formTableCriteria.getFieldValue().startDate
                                  )(_, value),
                              },
                            ]
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

const FunctionalCriteria = ({
    columnCriteria,
    type,
    dataCriteria,
    dataTable,
    setUpdateDataTable,
    startDateHeader,
    endDateHeader,
    checkStartDate = true,
    formCriteria,
    defaultColumn = [],
    handleEditDataRecord = () => { },
    editDataRecord,
    setEditDataRecord = () => { },
    conditionalDispatcher = () => { }
}) => {
    const dispatch = useDispatch()
    const { stored, updateStoredData } = useCriteriaHooks();
    const isEditing = (record) => record.key === editingKey;
    
    const searchInput = useRef(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalData, setTotalData] = useState(0);
    const [editingKey, setEditingKey] = useState("");
    const [search, setSearch] = useState({});
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [statusAction, setStatusAction] = useState("");
    // const [editDataRecord, setEditDataRecord] = useState({});
    const [optionSelectedCol, setOptionSelectedCol] = useState([]);
    const [modalRequired, setModalRequired] = useState(false);
    const [modalHistory, setModalHistory] = useState(false);
    const [dataHistory, setDataHistory] = useState(false);

    // use effect
    useEffect(() => {
        setTotalData(dataTable?.length)
    }, [dataTable])

    // search
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
        setSearch((prevState) => {
            if (prevState[dataIndex] !== selectedKeys[0]) {
                setPage(1);
            }
            return {
                ...prevState,
                [dataIndex]: selectedKeys[0],
            };
        });
    };


    // edit row
    const edit = useCallback((record, field) => {
        dispatch(setStored(true))
        formCriteria.resetFields();
        updateStoredData(true);
        setStatusAction("edit");
        formCriteria.setFieldsValue({
            ...record,
            startDate: record?.startDate ? moment(record.startDate) : undefined,
            endDate: record.endDate ? moment(record.endDate) : undefined,
        });
        const { key, ...extraProps } = record || {};

        const tempValue = { ...extraProps };
        for (const attribute in tempValue) {
            if (Object.hasOwnProperty.call(tempValue, attribute)) {
                const tempData = tempValue[attribute];
                setEditDataRecord((prevState) => {
                    return {
                        ...prevState,
                        [`${key}${attribute}`]: tempData,
                    };
                });
            }
        }
        
        setEditingKey(record.key);
        conditionalDispatcher(record)
    }, [conditionalDispatcher, dispatch, formCriteria, setEditDataRecord, updateStoredData]);

    // handle save
    const save = useCallback(async (key) => {
        try {
            const row = await formCriteria.validateFields();
            const newData = [...dataTable];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                const updatedRow = { ...item, ...row };
                newData.splice(index, 1, updatedRow);
                setUpdateDataTable(newData);
                setEditingKey("");
            }
            updateStoredData(false);
            setStatusAction("");
            formCriteria.resetFields()
            setEditDataRecord({})
            dispatch(setStored(false))
        } catch (error) {
            console.log(error, 'dasd');

        }

    }, [formCriteria, dataTable, updateStoredData, setEditDataRecord, dispatch, setUpdateDataTable])


    // Function Delete Row
    const deleteRow = useCallback((record) => {
        setUpdateDataTable((prevState) =>
            prevState.filter((item) => item.key !== record.key)
        );
        updateStoredData(false);
        setEditDataRecord({})
        formCriteria.resetFields()
        dispatch(setStored(false))
    }, [setUpdateDataTable, updateStoredData, setEditDataRecord, formCriteria, dispatch]);

    // Function Cancel Data
    const cancel = useCallback((record) => {
        setEditingKey("");
        if (statusAction === "add") {
            deleteRow(record);
        }
        setStatusAction("");
        updateStoredData(false);
        setEditDataRecord({})
        formCriteria.resetFields()
        dispatch(setStored(false))
    }, [statusAction, updateStoredData, setEditDataRecord, formCriteria, dispatch, deleteRow]);

    const handleDetailHistory = (record) => {

    }

    // handle display column
    const handleDisplayColumn = (value) => {
        setOptionSelectedCol(value);
    };

    const handleChange = useCallback((pageChange, pageSizeChange) => {
        setPage(pageSize !== pageSizeChange ? 1 : pageChange);
        setPageSize(pageSizeChange);
    }, [pageSize]);


    // const column 
    const column = useMemo(() => {
        return [
            {
                title: "NO",
                width: 60,
                dataIndex: "no",
                align: "center",
                render: (text, object, index) => (page - 1) * pageSize + index + 1,
            },
            ...columnCriteria?.map(item => (
                {
                    required: true,
                    title: item?.title,
                    width: 240,
                    sorter: (a, b) => sorterFunction(item?.dataIndex, a[item?.dataIndex]?.label, b[item?.dataIndex]?.label, item?.inputType),
                    dataIndex: item?.dataIndex,
                    dataIndexForm: item?.dataIndexFrom,
                    indexValue: item?.indexValue,
                    inputType: item?.inputType,
                    filteredValue: search?.[item?.dataIndex] ? [search?.[item?.dataIndex]] : null,
                    option: item?.option,
                    url: item?.url,
                    dependDataIndex: item?.dependDataIndex,
                    rules: item?.rules,
                    ...getColumnSearchProps(
                        item?.dataIndex,
                        searchInput,
                        hasValue(search[item?.dataIndex]),
                        searchText,
                        handleSearch,
                        true,
                        item?.inputType
                    ),
                    render: (text) =>
                        renderColumn(
                            item?.dataIndex,
                            hasValue(search[item?.dataIndex]),
                            searchText,
                            text?.label,
                            false,
                            "input",
                            search
                        ),
                }
            )),
            ...CommonTable(
                formCriteria,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                search,
                stored
            ),
            {
                title: "ACTION",
                dataIndex: "action",
                width: stored ? 240 : 120,
                fixed: "right",
                align: "center",
                render: (_, record) => {
                    console.log(record, ' record');

                    const editable = record.key === editingKey;
                    const isDelete =
                        // (status === "DRAFT" && statusApproval === "DRAFT") ||
                        record?.dataType !== "exist";

                    return (
                        <Space className="my-3 gap-2">
                            {editable ? (
                                <>
                                    <ButtonComponent
                                        onClick={() => cancel(record)}
                                        type="default"
                                    >
                                        Cancel
                                    </ButtonComponent>
                                    <ButtonComponent
                                        onClick={() => save(record.key)}
                                        type="submit"
                                    >
                                        Save
                                    </ButtonComponent>
                                </>
                            ) : (
                                <div className="flex w-full justify-center gap-4">
                                    {type === "detail" ? (
                                        <Tooltip title="Detail">
                                            <div className="pt-1">
                                                <SVGIcon
                                                    name="IconDetail"
                                                    width={24}
                                                    onClick={() => handleDetailHistory(record)}
                                                />
                                            </div>
                                        </Tooltip>
                                    ) : (
                                        <>
                                            <Tooltip title="Update">
                                                <div>
                                                    <SVGIcon
                                                        name="IconEdit"
                                                        color={editingKey ? "#8D91A0" : "#ACC424"}
                                                        className={
                                                            editingKey ? "cursor-not-allowed" : undefined
                                                        }
                                                        width={24}
                                                        onClick={
                                                            !editingKey ? () => edit(record) : undefined
                                                        }
                                                    />
                                                </div>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <div
                                                    className={`flex justify-center${record.typeData === "exist" || hasValue(editingKey) === true ? " cursor-not-allowed" : ""
                                                        }`}
                                                >
                                                    <SVGIcon
                                                        name="IconDelete"
                                                        color={
                                                            record.typeData !== "exist" && hasValue(editingKey) === false ? "#D90000" : "#8D91A0"
                                                        }
                                                        width={24}
                                                        className={
                                                            record.typeData === "exist" || hasValue(editingKey) === true ? "cursor-not-allowed" : undefined
                                                        }
                                                        onClick={
                                                            record.typeData !== "exist" && hasValue(editingKey) === false
                                                                ? () => deleteRow(record)
                                                                : undefined
                                                        }
                                                    />
                                                </div>
                                            </Tooltip>
                                        </>
                                    )}
                                </div>
                            )}
                        </Space>
                    );
                },
            },
        ]
    }, [cancel, columnCriteria, deleteRow, edit, editingKey, formCriteria, page, pageSize, save, search, searchText, searchedColumn, stored, type])



    const filterColumn = useCallback((dataColumn) => {
        let lowerDefaultColumn = defaultColumn?.map(item => item?.toLowerCase())
        let sliceColumn = dataColumn?.filter(item => lowerDefaultColumn.includes(item?.dataIndex?.toLowerCase()))
        let filteredColumn = dataColumn?.filter(item => dataCriteria?.includes(item?.indexValue))
        let newColumn = [];
        lowerDefaultColumn.forEach(col => {
            if (col === 'startdate') {
                newColumn.push(...filteredColumn); // Insert filteredColumn before 'startdate'
            }
            let column = sliceColumn.find(item => item?.dataIndex?.toLowerCase() === col);
            if (column) {
                newColumn.push(column);
            }
        });
        return newColumn

    }, [dataCriteria, defaultColumn]);



    // add row
    const addRow = useCallback(() => {
        dispatch(setStored(true))
        setSearch({});
        formCriteria.resetFields();
        updateStoredData(true);
        setStatusAction("add");
        const filteredColumns = filterColumn(column)?.filter(item => item?.dataIndex !== 'no')
        const newKey = (dataTable.length + 1).toString();

        const newRow = filteredColumns.reduce(
            (acc, col) => ({ ...acc, [col.dataIndex]: undefined }),
            { key: newKey }
        );
        setUpdateDataTable((prevData) => [...prevData, newRow]);
        setEditingKey(newRow.key);
    }, [dispatch, formCriteria, updateStoredData, filterColumn, column, dataTable.length, setUpdateDataTable])

    // Function length column
    const scroll = useMemo(() => {
        const numColumns = 16;
        const numRows = column?.length;

        const maxWidth = 10000;
        const maxHeight = 300;

        const x = numColumns * 10;
        const y = numRows * 150;

        const validatedX = Math.min(x, maxWidth);
        const validatedY = Math.min(y, maxHeight);

        return {
            x: validatedX,
            y: validatedY,
        }
    }, [column]);


    // Function Change Total Data Table
    const onChange = (_, __, ___, extra) => {

        setTotalData(extra?.currentDataSource?.length || 0);
    };

    useEffect(() => {
        if (type !== "detail" && type !== "preview" && dataCriteria?.length > 0) {
            const dispatchedUrls = new Set();
            const filteredColumns = filterColumn(column);
            filteredColumns?.forEach((element) => {
                if (
                    hasValue(element?.url) && !hasValue(element?.dependDataIndex) &&
                    (!hasValue(element?.option) || element?.option?.length < 1)
                ) {
                    if (dispatchedUrls.has(element?.url)) {
                        dispatchedUrls.add(element?.url);
                    } else {
                        dispatch(element?.url);
                    }
                }
            });

        }
    }, [dispatch, type, dataCriteria])

    console.log(dataCriteria, "dataCriteria");
    

    const paginationTable = useCallback((page, pageSize) => {
        return dataTable?.slice((page - 1) * pageSize, page * pageSize);
    }, [dataTable]);
    return (
        dataCriteria?.length > 0 && !dataCriteria?.includes(24) &&
        <div className="flex flex-col w-full gap-4">

            <div className="relative flex flex-col w-full">
                <div className={`my-4 w-full flex justify-between items-center`}>
                    <Select
                        mode="multiple"
                        placeholder="Show All Column"
                        className={"w-2/6"}
                        maxTagCount={3}
                        onChange={handleDisplayColumn}
                    >
                        {column
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
                    <div>
                        {type !== "detail" && type !== "preview" ? (
                            <div className="flex w-full justify-end mb-4">
                                <ButtonComponent
                                    icon={<SVGIcon name="IconButtonCreate" width={24} />}
                                    type="submit"
                                    onClick={() => {
                                        if (
                                            !stored &&
                                            (hasValue(startDateHeader) || !checkStartDate) &&
                                            !(
                                                dataCriteria?.includes(37) && //All
                                                dataTable?.length > 0
                                            ) //All must only have 1 data
                                        ) {
                                            addRow();
                                        } else {
                                            if (dataCriteria?.includes(37) && dataTable?.length > 0) {
                                                setModalRequired(true);
                                            } else if (!hasValue(startDateHeader)) {
                                                setModalRequired(true);
                                            }
                                        }
                                    }}
                                    disabled={stored}
                                >
                                    Create
                                </ButtonComponent>
                            </div>
                        ) : null}
                        {totalData > 0 &&
                            <Pagination
                                total={totalData}
                                className={"pr-1"}
                                showSizeChanger
                                current={page}
                                pageSize={pageSize}
                                onChange={(page, pageSize) => handleChange(page, pageSize)}
                                // onShowSizeChange={onSizeChanger}
                                showTotal={(total, range) =>
                                    `Showing ${range[0]} to ${range[1]} of ${total} records`
                                }
                            />

                        }
                    </div>
                </div>
                <Form form={formCriteria} component={false}>
                    <Table
                        bordered
                        className="w-full"
                        dataSource={paginationTable(page, pageSize)}
                        columns={filterColumn(
                            column.map((col) => ({
                                ...col,
                                onCell: (record) => ({
                                    record,
                                    inputType: col.inputType,
                                    dataIndex: col.dataIndex,
                                    title: col.title,
                                    editing: isEditing(record),
                                    options: col.option,
                                    indexValue: col.indexValue,
                                    dependDataIndex: col?.dependDataIndex,
                                    dataEditRecord: editDataRecord,
                                    handleEditDataRecord: handleEditDataRecord,
                                    required: col.required,
                                    formTableCriteria: formCriteria,
                                    rules: col?.rules,
                                    validateStartDate: startDateHeader,
                                    validateEndDate: endDateHeader,
                                    checkStartDateHeader: checkStartDate
                                }),
                            }))
                        )}
                        pagination={false
                            //     {
                            // position: ["topRight"],
                            // current: page,
                            // pageSize: pageSize,
                            // onChange: handleChange,
                            // className: "pr-1 w-3/4",
                            // style: { marginLeft: "auto", marginRight: 0 },
                            // showSizeChanger: true,
                            // showTotal: (total, range) =>
                            //     `Showing ${range[0]} to ${range[1]} of ${total} records`,
                            //     }
                        }
                        rowClassName={(record) => (isEditing(record) ? "editable-row" : "")}
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        scroll={scroll}
                        onChange={onChange}
                    />
                </Form>
            </div>
            {/* Modal History Log */}
            <ModalCustom
                isOpen={modalHistory}
                handleCancel={() => {
                    setModalHistory(false);
                }}
                type="detail"
                header="DETAIL INFORMATION"
                width={800}
                footer={
                    <ButtonComponent
                        type={"default"}
                        onClick={() => {
                            setModalHistory(false);
                        }}
                    >
                        Back
                    </ButtonComponent>
                }
            >
                <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
                    <DetailText label="Record ID">{dataHistory.id}</DetailText>
                    <DetailText label="Created Date">
                        {dataHistory?.createdDate
                            ? renderDateConverter(dataHistory?.createdDate, 'datetime')
                            : ""}
                    </DetailText>
                    <DetailText label="Created By">{dataHistory?.createdBy}</DetailText>
                    <DetailText label="Updated Date">
                        {dataHistory?.updatedDate
                            ? renderDateConverter(dataHistory?.createdDate, 'datetime')
                            : ""}
                    </DetailText>
                    <DetailText label="Updated By">{dataHistory?.updatedBy}</DetailText>
                </CardComponent>
            </ModalCustom>

            {/* modal error no startDate */}
            {ModalError ? (
                <ModalError
                    isOpen={modalRequired}
                    handleOk={() => setModalRequired(false)}
                    handleCancel={() => setModalRequired(false)}
                // customText={"Try Again"}
                >
                    <div className="px-5 pt-5 pb-[10px] justify-center">
                        <div className="w-full flex gap-[20px]">
                            <SVGIcon name="IconFailed" width={48} />
                            <p className="text-[18px] font-bold">{"Failed"}</p>
                        </div>
                        <p className="pl-[70px]">{`You can't create criteria. ${dataCriteria?.includes(37) && dataTable?.length > 0
                            ? "Criteria All must only have 1 data!"
                            : "Please input Start Date!"
                            }`}</p>
                    </div>
                </ModalError>
            ) : null}
        </div>
    );
}

export default FunctionalCriteria;
