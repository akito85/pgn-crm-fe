import React, { useState } from "react";
import { Form, Select, Space, Table, Tooltip } from "antd";
import { useSelector } from "react-redux";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";

const FunctionalTableDetailBillingItem = ({
  data = [],
  updateData = () => {},
  type,
  status,
  statusApproval,
}) => {
  const [formDetail] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [statusAction, setStatusAction] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data_billing_item } = useSelector((state) => state.bank);

  const isEditing = (record) => record.key === editingKey;

  const billingItemOptions = (data_billing_item || []).map((item) => ({
    value: item?.id ?? item?.Id,
    label: item?.name ?? item?.text ?? "",
  }));

  const addRow = () => {
    formDetail.resetFields();
    setStatusAction("add");
    const newRow = {
      key: data
        .reduce((current, next) => {
          const nextKey = next.key || 0;
          return current > nextKey
            ? parseInt(current) + 1
            : parseInt(nextKey) + 1;
        }, 1)
        .toString(),
    };
    updateData((prev) => [...prev, newRow]);
    setEditingKey(newRow.key);
  };

  const deleteRow = (record) => {
    updateData((prev) => prev.filter((item) => item.key !== record.key));
  };

  const cancel = (record) => {
    setEditingKey("");
    if (statusAction === "add") deleteRow(record);
    setStatusAction("");
  };

  const save = async (key) => {
    try {
      const row = await formDetail.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        updateData(newData);
        setEditingKey("");
      }
      setStatusAction("");
      formDetail.resetFields();
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const edit = (record) => {
    setStatusAction("edit");
    formDetail.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const columns = [
    {
      key: "no",
      title: "NO",
      width: 60,
      dataIndex: "no",
      align: "center",
      render: (text, obj, index) => (page - 1) * pageSize + index + 1,
    },
    {
      key: "billingItem",
      title: "BILLING ITEM",
      dataIndex: "billingItem",
      render: (val, record) => {
        const editable = isEditing(record);
        if (editable) {
          return (
            <Form.Item
              name="billingItem"
              style={{ margin: 0 }}
              rules={[{ required: true, message: "Please select a billing item!" }]}
            >
              <Select
                showSearch
                optionFilterProp="children"
                labelInValue
                filterOption={(input, option) =>
                  (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
                }
                style={{ width: "100%" }}
              >
                {billingItemOptions.map((opt) => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          );
        }
        return val?.label ?? val ?? "";
      },
    },
    {
      key: "operation",
      title: "ACTION",
      dataIndex: "operation",
      width: 140,
      align: "center",
      render: (_, record) => {
        const editable = isEditing(record);
        const isDelete =
          (status === "DRAFT" && statusApproval === "DRAFT") ||
          record.type !== "exist";
        return (
          <Space className="my-2 gap-2">
            {editable ? (
              <>
                <ButtonComponent onClick={() => cancel(record)} type="default">
                  Cancel
                </ButtonComponent>
                <ButtonComponent onClick={() => save(record.key)} type="submit">
                  Save
                </ButtonComponent>
              </>
            ) : (
              <div className="flex w-full justify-center gap-4">
                <Tooltip title="Edit">
                  <div>
                    <SVGIcon
                      name="IconEdit"
                      color={editingKey ? "#8D91A0" : "#ACC424"}
                      className={editingKey ? "cursor-not-allowed" : undefined}
                      width={24}
                      onClick={!editingKey ? () => edit(record) : undefined}
                    />
                  </div>
                </Tooltip>
                <Tooltip title="Delete">
                  <div>
                    <SVGIcon
                      name="IconDelete"
                      color={isDelete && !editingKey ? "#D90000" : "#8D91A0"}
                      width={24}
                      className={
                        isDelete && !editingKey ? undefined : "disabled cursor-not-allowed"
                      }
                      onClick={
                        isDelete && !editingKey ? () => deleteRow(record) : undefined
                      }
                    />
                  </div>
                </Tooltip>
              </div>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col w-full gap-3 p-4">
      <div className="text-primary text-xs font-bold uppercase">DETAIL 1</div>
      <div className="flex w-full justify-end">
        <ButtonComponent
          icon={<SVGIcon name="IconButtonCreate" width={24} />}
          type="submit"
          onClick={editingKey === "" ? addRow : undefined}
          disabled={editingKey !== ""}
        >
          Create New
        </ButtonComponent>
      </div>
      <Form form={formDetail} component={false}>
        <Table
          bordered
          dataSource={data.slice((page - 1) * pageSize, page * pageSize)}
          columns={columns}
          pagination={{
            position: ["topRight"],
            current: page,
            pageSize,
            onChange: handleChange,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `Showing ${range[0]} to ${range[1]} of ${total} records`,
          }}
          rowKey="key"
          scroll={{ x: 600 }}
        />
      </Form>
    </div>
  );
};

export default FunctionalTableDetailBillingItem;
