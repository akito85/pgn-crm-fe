import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import Highlighter from "react-highlight-words";

import ModalCustom from '../../../../../../../../../components/Modal/ModalCustom'
import ButtonComponent from '../../../../../../../../../components/ButtonComponent'
import DetailText from '../../../../../../../../../components/DetailText'
import NxTable from '../../../../../../../../../components/Nx/NxTable'
import SVGIcon from '../../../../../../../../../assets/Icon/index'
import { Input, Form, InputNumber, Space, Tooltip } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  required,
  disabledField,
  ...restProps
}) => {
  const rules = () => {
    let rules = [];
    if (required) {
      rules.push({
        ...required,
        message: `${required.message} ${dataIndex}!`,
      });
    }
    return rules.length !== 0 ? rules : undefined;
  };

  const getInputNode = (inputType, disabledField) => {
    switch (inputType) {
      case "number":
        return (
          <InputNumber
            type={"number"}
            style={{ width: "100%" }}
            controls={false}
            disabled={disabledField}
          />
        );
      default:
        return <Input disabled={disabledField} />;
    }
  };
  const inputNode = getInputNode(inputType, disabledField);

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
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={inputType !== "checkbox" ? rules() : undefined}
          className={"w-full"}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const ModalForm = ({
  modalFormTos,
  closeModalFormTos,
  dataFormTosModal = {},
  dataTermOfService = [],
  setDataTermOfService,
  tempDataUpdateTos = {},
  resetTableTosUpdate,
  dataTableTos,
  setDataTableTos,
  setModalFormTos
}) => {
  const searchInput = useRef(null);
  const [formTable] = Form.useForm();
  // State
  const [displayData, setDisplayData] = useState([]);
  const [loadedCount, setLoadedCount] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [disabledButton, setDisabledButton] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [storedDate, setStoredData] = useState(false);
  const [statusAction, setStatusAction] = useState("");
  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["operation"],
    left: [],
  }));

  const isEditing = (record) => record.key === editingKey;

  useEffect(() => {
    setDataTableTos(dataFormTosModal?.tosDetail)
  }, [dataFormTosModal?.tosdetail, tempDataUpdateTos])

  useEffect(() => {
    setDisabledButton(storedDate)
  }, [storedDate]);

  // Process all data (filter, sort)
  const processedData = useMemo(() => {
    let result = [...(dataTableTos || [])];
    if (searchedColumn) {
      result = result.filter((item) =>
        item[searchedColumn]?.toString()?.toLowerCase().includes(searchText?.toLowerCase())
      );
    }
    if (fieldSort) {
      result.sort((a, b) => {
        let fa = a[fieldSort]?.toString()?.toLowerCase() || "";
        let fb = b[fieldSort]?.toString()?.toLowerCase() || "";
        if (fa < fb) return orderSort === "asc" ? -1 : 1;
        if (fa > fb) return orderSort === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [dataTableTos, searchedColumn, searchText, fieldSort, orderSort]);

  // Infinite scroll
  useEffect(() => {
    const sliced = processedData.slice(0, loadedCount);
    setDisplayData(sliced);
    setHasMore(loadedCount < processedData.length);
  }, [processedData, loadedCount]);

  const handleLoadMore = useCallback(() => {
    return new Promise((resolve) => {
      setLoadedCount((prev) => prev + 20);
      resolve();
    });
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setLoadedCount(20);
  };

  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
    setLoadedCount(20);
  };

  // Inline editing handlers
  const edit = (record) => {
    formTable.setFieldsValue(record);
    setEditingKey(record.key);
    setStoredData(true);
    setStatusAction("edit");
  };

  const cancel = (key) => {
    if (statusAction === "add") {
      const newData = (dataTableTos || []).filter((item) => item.key !== key);
      setDataTableTos(newData);
    }
    setEditingKey("");
    setStoredData(false);
    setStatusAction("");
  };

  const save = async (key) => {
    try {
      const row = await formTable.validateFields();
      const newData = [...(dataTableTos || [])];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        const updatedRow = { ...item, ...row };
        newData.splice(index, 1, updatedRow);
        setDataTableTos(newData);
        setEditingKey("");
      }
      setStoredData(false);
      formTable.resetFields();
      setStatusAction("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  // Search Column Table
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      return (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={searchInput}
            placeholder={`Search`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => {
              handleSearch(selectedKeys, confirm, dataIndex);
            }}
            style={{ marginBottom: 8, display: "block" }}
          />
        </div>
      );
    },
    filterIcon: (filtered) => (
      <FilterOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 5000);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text || ""
      ),
  });

  const columns = useMemo(() => [
    {
      title: "NO",
      key: "no",
      dataIndex: "no",
      align: "center",
      width: 60,
      render: (t, r, i) => i + 1,
    },
    {
      title: "ATTRIBUTE",
      key: "attributeName",
      dataIndex: "attributeName",
      editable: true,
      sorter: true,
      width: 150,
      disabledField: true,
      ...getColumnSearchProps("attributeName"),
    },
    {
      title: "VALUE",
      key: "value",
      dataIndex: "value",
      editable: true,
      inputType: "number",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("value"),
      render: (text) => (<span>{text?.toString()}</span>)
    },
    {
      title: "ACTIONS",
      key: "operation",
      dataIndex: "operation",
      align: "center",
      fixed: "right",
      width: 150,
      render: (_, record) => {
        const editable = record.key === editingKey;
        return (
          <Space className="my-2 gap-2">
            {editable ? (
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
            ) : (
              <>
                <ButtonComponent
                  onClick={() => edit(record)}
                  disabled={editingKey !== ""}
                  icon={<SVGIcon name="IconEdit" width={24} />}
                  border={false}
                />
                {record.id ? (
                  <ButtonComponent
                    disabled
                    icon={<SVGIcon name="IconDelete" width={24} color={"#C0BEC6"} />}
                    border={false}
                  />
                ) : null}
              </>
            )}
          </Space>
        );
      },
    },
  ], [searchedColumn, searchText, editingKey]);

  const updateDataTos = (id) => {
    let newData = {
      description: dataFormTosModal.description,
      tosDetail: dataTableTos,
      termOfService: dataFormTosModal.termOfService
    }
    const updatedData = dataTermOfService.map(item => {
      if (item.key === id) {
        return { ...item, ...newData };
      }
      return item;
    });
    setDataTermOfService(updatedData);
    setModalFormTos(false)
  }

  return (
    <div>
      <ModalCustom
        header={"UPDATE TERM OF SERVICE VALUE"}
        isOpen={modalFormTos}
        type={"confirmation"} 
        handleCancel={closeModalFormTos}
        width={900}
        footer={
          <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
            <ButtonComponent
              onClick={resetTableTosUpdate}
              type="default"
              disabled={disabledButton}
            >
              Reset
            </ButtonComponent>
            <ButtonComponent
              disabled={disabledButton}
              onClick={()=>updateDataTos(dataFormTosModal?.key)}
              type="submit"
            >
              Save
            </ButtonComponent>
          </div>
        }
      >
        <div className="w-full p-5">
          <span className="text-primary uppercase font-bold">
            TERM OF SERVICE INFORMATION
          </span>
          <div className="grid grid-cols-2 gap-5 pt-[30px]">
            <DetailText label="Term of Service">{dataFormTosModal.tosName}</DetailText>
            <DetailText label="Description">{dataFormTosModal.description}</DetailText>
          </div>

          <div className="py-4">
            <Form form={formTable} component={false}>
              <NxTable
                idTable="modal-form-tos-table"
                dataSource={displayData}
                columns={columns.map((col) => ({
                  ...col,
                  onCell: (record) => ({
                    record,
                    inputType: col.inputType,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: isEditing(record),
                    required: col.required,
                    disabledField: col.disabledField,
                  }),
                }))}
                totalData={processedData.length}
                rowClassName={(record) => (isEditing(record) ? "editable-row" : "")}
                tableScrolled={{
                  x: "max-content",
                  y: 400,
                }}
                usePagination={false}
                useInfiniteScroll={true}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                loadMoreThreshold={2}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                columnDefinitions={columns.map((col) => ({
                  key: col.key || col.dataIndex || col.title,
                  title: col.title,
                }))}
                components={{
                  body: {
                    cell: EditableCell,
                  },
                }}
                onChange={onSort}
                loading={false}
                showAdvanceSearch={false}
                showSearchBar={false}
              />
            </Form>
          </div>
        </div>
      </ModalCustom>
    </div>
  )
}

export default ModalForm
