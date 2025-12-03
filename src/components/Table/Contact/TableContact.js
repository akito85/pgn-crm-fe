import { Form, Pagination, Select, Table } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useContactHooks } from "./useContactHooks";
import ButtonComponent from "../../ButtonComponent";
import { PlusOutlined } from "@ant-design/icons";
import SelectComponent from "../../SelectComponent";
import InputComponent from "../../InputComponent";
import { formMessageRequired, hasValue } from "../../../utils";
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  indexValue,
  options,
  optionsAdditional,
  required,
  rules,
  children,
  form,
  onCellClicked = () => {},
  changePrefix = () => {},
  ...restProps
}) => {
  const [lengthPrefix_1, setLengthPrefix_1] = useState(0);
  const [lengthPrefix_2, setLengthPrefix_2] = useState(0);

  // render node
  const getInputNode = useCallback(
    (dataIndex, options, form, rules) => {
      const formValue = form?.getFieldsValue();

      const maxLengthValidation = () => {
        const max = 14;
        if (formValue?.inputType?.value === 749) {
          return max - lengthPrefix_1;
        } else if (
          formValue?.inputType?.value === 748 ||
          formValue?.inputType?.value === 751
        ) {
          return max - lengthPrefix_1 - lengthPrefix_2;
        }
      };

      if (dataIndex === "type" || dataIndex === "inputType") {
        return (
          <Form.Item name={dataIndex} rules={rules}>
            <SelectComponent
              options={options}
              onChange={onCellClicked}
              labelInValue
            />
          </Form.Item>
        );
      } else if (dataIndex === "value") {
        if (formValue?.inputType?.value === 749) {
          return (
            <Form.List
              name={"values"}
              initialValue={[{ prefix_1: undefined, value: undefined }]}
            >
              {(fields) => {
                return (
                  <>
                    {fields?.map(({ key, name }, indexList) => {
                      return (
                        <div className="flex gap-2 w-full">
                          <Form.Item
                            name={[name, "prefix_1"]}
                            rules={formMessageRequired("Country Code")}
                            className="w-full"
                          >
                            <SelectComponent
                              placeholder={"Country Code"}
                              labelInValue
                              options={options?.country_code}
                              onChange={(e) => {
                                changePrefix(record, formValue, e, [
                                  name,
                                  "prefix_1",
                                ]);
                                setLengthPrefix_1(
                                  e?.label?.split(" ")?.at(-1)?.length,
                                );
                              }}
                            />
                          </Form.Item>
                          <Form.Item
                            name={[name, "value"]}
                            rules={formMessageRequired("Value")}
                            className="w-full"
                          >
                            <InputComponent
                              maxLength={maxLengthValidation()}
                              onInput={(e) =>
                                (e.target.value = e.target.value.replace(
                                  /[^\d]|^0+/g,
                                  "",
                                ))
                              }
                            />
                          </Form.Item>
                        </div>
                      );
                    })}
                  </>
                );
              }}
            </Form.List>
          );
          // } else if (formValue?.inputType?.value === 748) {
          //     return (
          //         <Form.List name={'values'} initialValue={[{ prefix_1: undefined, value: undefined, prefix_2: undefined }]}>
          //             {(fields) => {
          //                 return (
          //                     <>
          //                         {fields?.map(({ key, name }, indexList) => {
          //                             return (
          //                                 <div className='flex gap-2 w-full'>
          //                                     <Form.Item
          //                                         name={[name, 'prefix_1']}
          //                                         rules={formMessageRequired('Country Code')}
          //                                         className='w-1/3'
          //                                     >
          //                                         <SelectComponent placeholder={"Country Code"} labelInValue options={options?.country_code} onChange={(e) => {
          //                                             changePrefix(record, formValue, e, [name, 'prefix_1'])
          //                                             setLengthPrefix_1(e?.label?.split(' ')?.at(-1)?.length)
          //                                         }} />
          //                                     </Form.Item>
          //                                     <Form.Item
          //                                         name={[name, 'prefix_2']}
          //                                         rules={formMessageRequired('Zone Code')}
          //                                         className='w-1/3'
          //                                     >
          //                                         <SelectComponent placeholder={"Zone Code"} labelInValue onChange={(e) => {
          //                                             changePrefix(record, formValue, e, [name, 'prefix_2'])
          //                                             setLengthPrefix_2(e?.label?.split(' ')?.at(0)?.length)
          //                                         }} options={options?.country_zone} />
          //                                     </Form.Item>
          //                                     <Form.Item
          //                                         name={[name, 'value']}
          //                                         rules={formMessageRequired('Value')}
          //                                         className='w-full'
          //                                     >
          //                                         <InputComponent
          //                                             maxLength={maxLengthValidation()} onInput={(e) =>
          //                                                 (e.target.value = e.target.value.replace(/[^\d]|^0+/g, ''))
          //                                             } />
          //                                     </Form.Item>
          //                                 </div>
          //                             )
          //                         })}
          //                     </>
          //                 )
          //             }
          //             }

          //         </Form.List>
          //     )
        } else if (
          formValue?.inputType?.value === 751 ||
          formValue?.inputType?.value === 748
        ) {
          return (
            <Form.List
              name={"values"}
              initialValue={[
                {
                  prefix_1: undefined,
                  value: undefined,
                  prefix_2: undefined,
                  sufix: undefined,
                },
              ]}
            >
              {(fields) => {
                return (
                  <>
                    {fields?.map(({ key, name }, indexList) => {
                      return (
                        <div className="flex gap-2 w-full">
                          <Form.Item
                            name={[name, "prefix_1"]}
                            rules={formMessageRequired("Country Code")}
                            className="w-1/3"
                          >
                            <SelectComponent
                              labelInValue
                              options={options?.country_code}
                              placeholder={"Country Code"}
                              onChange={(e) => {
                                changePrefix(record, formValue, e, [
                                  name,
                                  "prefix_1",
                                ]);
                                setLengthPrefix_1(
                                  e?.label?.split(" ")?.at(-1)?.length,
                                );
                              }}
                            />
                          </Form.Item>
                          <Form.Item
                            name={[name, "prefix_2"]}
                            rules={formMessageRequired("Zone Code")}
                            className="w-1/3"
                          >
                            <SelectComponent
                              placeholder={"Zone Code"}
                              labelInValue
                              onChange={(e) => {
                                changePrefix(record, formValue, e, [
                                  name,
                                  "prefix_2",
                                ]);
                                setLengthPrefix_2(
                                  e?.label?.split(" ")?.at(0)?.length,
                                );
                              }}
                              options={options?.country_zone}
                            />
                          </Form.Item>
                          <Form.Item
                            name={[name, "value"]}
                            rules={formMessageRequired("Value")}
                            className="w-full"
                            placeholder={"Value"}
                          >
                            <InputComponent
                              maxLength={maxLengthValidation()}
                              onInput={(e) =>
                                (e.target.value = e.target.value.replace(
                                  /[^\d]|^0+/g,
                                  "",
                                ))
                              }
                            />
                          </Form.Item>
                          <Form.Item name={[name, "sufix"]} className="w-full">
                            <InputComponent
                              prefix={"Ext."}
                              maxLength={5}
                              onInput={(e) =>
                                (e.target.value = e.target.value.replace(
                                  /[^\d]/g,
                                  "",
                                ))
                              }
                            />
                          </Form.Item>
                        </div>
                      );
                    })}
                  </>
                );
              }}
            </Form.List>
          );
        } else {
          return (
            <Form.List name={"values"} initialValue={[{ value: undefined }]}>
              {(fields) => {
                return (
                  <>
                    {fields?.map(({ key, name }) => {
                      return (
                        <>
                          <Form.Item
                            name={[name, "value"]}
                            rules={[
                              ...formMessageRequired(
                                formValue?.inputType?.value === 750
                                  ? "Email"
                                  : "Value",
                              ),
                              formValue?.inputType?.value === 750 && {
                                type: "email",
                                message: "The input is not valid E-mail!",
                              },
                            ]}
                          >
                            <InputComponent />
                          </Form.Item>
                        </>
                      );
                    })}
                  </>
                );
              }}
            </Form.List>
          );
        }
      }
    },
    [changePrefix, lengthPrefix_1, lengthPrefix_2, onCellClicked, record],
  );

  if (dataIndex === "action" || dataIndex === "no" || dataIndex === "status") {
    return (
      <td {...restProps}>
        <div>{children}</div>
      </td>
    );
  } else {
    return (
      <td {...restProps}>
        {editing ? getInputNode(dataIndex, options, form, rules) : children}
      </td>
    );
  }
};

const TableContact = ({
  dataTable = [],
  setDataTable = () => {},
  cols = [],
  page,
  pageSize,
  onSizeChanger = () => {},
  onChangePage = () => {},
  form,
  scrollTable = {},
  actionButtons,
  showButtonCreate = true,
  useSelect = true,
  usePagination = true,
  editRecords = () => {},
  changePrefix = () => {},
  isStored = () => {},
}) => {
  const [statusStored, setStatusStored] = useState("");
  const [editingKey, setEditingKey] = useState("");
  const [filterColumn, setFilterColumn] = useState([]);
  const [storedData, setStoredData] = useState(false);
  const [totalData, setTotalData] = useState(dataTable.length);
  // set is editing
  const isEditing = useCallback(
    (record) => {
      return record?.key === editingKey;
    },
    [editingKey],
  );

  useEffect(() => {
    isStored(storedData);
    setTotalData(dataTable?.length);
  }, [dataTable, isStored, statusStored, storedData]);

  const setFullValue = useCallback((row) => {
    let value = hasValue(row?.values[0]?.value) ? row?.values[0]?.value : "";
    let prefix_1 = hasValue(row?.values[0]?.prefix_1?.label)
      ? row?.values[0]?.prefix_1?.label
      : "";
    let prefix_2 = hasValue(row?.values[0]?.prefix_2?.label)
      ? row?.values[0]?.prefix_2?.label
      : "";
    let sufix = hasValue(row?.values[0]?.sufix)
      ? `Ext. ${row?.values[0]?.sufix}`
      : "";
    return `${prefix_1} ${prefix_2} ${value} ${sufix}`;
  }, []);

  const handleSave = useCallback(
    async (record) => {
      try {
        const row = await form.validateFields();
        const newData = [...dataTable];
        const index = newData.findIndex((item) => record?.key === item.key);
        if (index > -1) {
          const item = newData[index];
          const updatedRow = {
            ...item,
            ...{
              ...row,
              value: hasValue(row?.values[0]?.value)
                ? row?.values[0]?.value
                : null,
              prefix_1: hasValue(row?.values[0]?.prefix_1)
                ? row?.values[0]?.prefix_1
                : null,
              prefix_2: hasValue(row?.values[0]?.prefix_2)
                ? row?.values[0]?.prefix_2
                : null,
              sufix: hasValue(row?.values[0]?.sufix)
                ? row?.values[0]?.sufix
                : null,
              fullValue: setFullValue(row),
            },
          };
          newData.splice(index, 1, updatedRow);
          setDataTable(newData);
          setEditingKey("");
        }
        setStatusStored("");
        form.resetFields();
        setStoredData(false);
      } catch (error) {
        console.log(error, " error");
      }
    },
    [dataTable, form, setDataTable, setFullValue],
  );

  const handleDetail = useCallback((record) => {
    console.log(record);
  }, []);

  // handle update
  const handleUpdate = useCallback(
    (record) => {
      editRecords(record);
      setStatusStored("update");
      setEditingKey(record?.key);
      form.setFieldsValue(record);
      setStoredData(true);
    },
    [editRecords, form],
  );

  // handle inactive
  const handleInactivate = useCallback((record) => {
    console.log(record);
  }, []);

  // handle delete
  const handleDelete = useCallback(
    (record) => {
      const newData = dataTable.filter((item) => item?.key !== record?.key);
      setDataTable(newData);
      form.resetFields();
      setEditingKey("");
      setStatusStored("");
    },
    [dataTable, form, setDataTable],
  );

  // handle cancel
  const handleCancel = useCallback(
    (record) => {
      if (statusStored === "add") {
        const newData = dataTable.filter((item) => item?.key !== record?.key);
        setDataTable(newData);
      }
      setEditingKey("");
      form.resetFields();
      setStoredData(false);
    },
    [dataTable, form, setDataTable, statusStored],
  );

  const columnAction = useContactHooks(
    editingKey,
    handleDetail,
    handleUpdate,
    handleInactivate,
    handleDelete,
    handleCancel,
    handleSave,
    actionButtons,
  );

  // column table
  const columns = useMemo(() => {
    return [...cols, ...columnAction];
  }, [cols, columnAction]);

  const handleAddRow = useCallback(() => {
    setStatusStored("add");
    const newRowKey = (dataTable.length + 1).toString();
    const newRow = columns.reduce(
      (acc, column) => {
        acc[column.dataIndex] = column.dataIndex === "key" ? newRowKey : null;

        return { ...acc, fullValue: null };
      },
      { key: newRowKey },
    );

    setDataTable((prev) => {
      return [...dataTable, newRow];
    });
    setEditingKey(newRow?.key);
    setStoredData(true);
  }, [columns, dataTable, setDataTable]);

  // handle display column
  const handleDisplayColumn = useCallback((value) => {
    setFilterColumn(value);
  }, []);

  const handleFilterColumn = useCallback(
    (columns) => {
      const filteredColumn = columns?.filter(
        (item) => !filterColumn?.includes(item?.title),
      );
      return filteredColumn;
    },
    [filterColumn],
  );

  const paginationTable = useCallback(
    (page, pageSize) => {
      return dataTable?.slice((page - 1) * pageSize, page * pageSize);
    },
    [dataTable],
  );

  const changeTable = (pagination, filters, sorter, extra) => {
    const filteredData = extra?.currentDataSource?.length || [];
    setTotalData(filteredData);
  };

  return (
    <div className={"w-full flex flex-col gap-4"}>
      <div className={"w-full flex gap-2 justify-between items-center"}>
        {useSelect && (
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
                    filterColumn.length > 3
                      ? filterColumn.includes(col.title)
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
        )}

        <div>
          <div className={"w-full flex justify-end mb-5"}>
            {showButtonCreate && (
              <ButtonComponent
                onClick={storedData === false && handleAddRow}
                type={"submit"}
                border={true}
                icon={<PlusOutlined style={{ fontSize: "24px" }} />}
                disabled={storedData}
              >
                Create
              </ButtonComponent>
            )}
          </div>
          {usePagination && totalData > 0 && (
            <Pagination
              total={totalData}
              className={"pr-1"}
              showSizeChanger
              current={page}
              pageSize={pageSize}
              onChange={(page, pageSize) => onChangePage(page, pageSize)}
              onShowSizeChange={onSizeChanger}
              showTotal={(total, range) =>
                `Showing ${range[0]} to ${range[1]} of ${total} records`
              }
            />
          )}
        </div>
      </div>
      <Form form={form}>
        <Table
          dataSource={paginationTable(page, pageSize)}
          columns={handleFilterColumn(
            columns?.map((item) => ({
              ...item,
              onCell: (record) => ({
                editing: isEditing(record),
                dataIndex: item?.dataIndex,
                required: item.required,
                title: item?.title,
                inputType: item?.inputType,
                record,
                index: item?.index,
                indexValue: item?.indexValue,
                options: item?.options,
                rules: item?.rules,
                form: form,
                onCellClicked: item?.onClick,
                changePrefix: changePrefix,
              }),
            })),
          )}
          rowClassName={(record) => (isEditing(record) ? "editable-row" : "")}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          scroll={{ x: 1500, y: 500 }}
          tableLayout="fixed"
          onChange={changeTable}
          pagination={false}
        />
      </Form>
    </div>
  );
};

export default TableContact;
