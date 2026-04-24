import React, { useState } from "react";
import { Input, Button, message, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CardContainer from "../../../../../components/CardContainer";
import SelectComponent from "../../../../../components/SelectComponent";
import TableRBI from "../../../../../components/TableRBI";

const GLAccountCreate = ({
  data,
  setData,
  glOptions = [],
  typeOptions = []
}) => {
  const [editingKey, setEditingKey] = useState('');
  const [tempRow, setTempRow] = useState({});

  const handleCreateNew = () => {
    setEditingKey('new');
    setTempRow({
      key: 'new',
      type: null,
      glNumber: null,
      glDesc: '',
      description: ''
    });
  };

  const handleEdit = (record) => {
    setTempRow({ ...record });
    setEditingKey(record.key);
  };

  const handleDelete = (key) => {
    setData(data.filter(item => item.key !== key));
  };

  const handleSave = () => {
    if (!tempRow.type || !tempRow.glNumber) {
      message.error("Type dan GL Account Number wajib diisi!");
      return;
    }

    if (editingKey === 'new') {
      setData([...data, { ...tempRow, key: Date.now() }]);
    } else {
      setData(data.map(item => item.key === editingKey ? tempRow : item));
    }
    setEditingKey('');
  };

  const handleCancel = () => {
    setEditingKey('');
  };

  const handleGLNumberSelect = (val) => {
    const selectedItem = glOptions.find(opt => opt.value === val);
    setTempRow({
      ...tempRow,
      glNumber: val,
      glDesc: selectedItem ? selectedItem.labelName : 'Auto-filled'
    });
  };

  const columns = [
    { title: "NO", width: 60, align: "center", render: (_, __, index) => index + 1 },
    {
      title: "TYPE",
      dataIndex: "type",
      width: 150,
      render: (text, record) => {
        if (record.key === editingKey) {
          return (
            <SelectComponent
              placeholder="Select Type"
              value={tempRow.type}
              onChange={(val) => setTempRow({ ...tempRow, type: val })}
              options={typeOptions}
            />
          );
        }
        const typeLabel = typeOptions.find(opt => opt.value === text)?.label;
        return typeLabel || text;
      }
    },
    {
      title: "GL ACCOUNT NUMBER",
      dataIndex: "glNumber",
      width: 250,
      render: (text, record) => {
        if (record.key === editingKey) {
          return (
            <SelectComponent
              placeholder="Select GL Number"
              value={tempRow.glNumber}
              onChange={handleGLNumberSelect}
              options={glOptions}
            />
          );
        }
        const glLabel = glOptions.find(opt => opt.value === text)?.labelNumber;
        return glLabel || text;
      }
    },
    {
      title: "GL ACCOUNT DESCRIPTION",
      dataIndex: "glDesc",
      width: 250,
      render: (text, record) => {
        if (record.key === editingKey) {
          return <Input disabled value={tempRow.glDesc} placeholder="Auto-filled" />;
        }
        return text;
      }
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      width: 200,
      render: (text, record) => {
        if (record.key === editingKey) {
          return (
            <Input
              placeholder="Input Description"
              value={tempRow.description}
              onChange={(e) => setTempRow({ ...tempRow, description: e.target.value })}
            />
          );
        }
        return text;
      }
    },
    {
      title: "ACTION",
      align: "center",
      width: 120,
      render: (_, record) => {
        if (record.key === editingKey) {
          return (
            <div className="flex gap-2 justify-center">
              <Button size="small" onClick={handleCancel}>Cancel</Button>
              <Button size="small" type="primary" onClick={handleSave}>Save</Button>
            </div>
          );
        }
        return (
          <div className="flex gap-3 justify-center text-primary cursor-pointer">
            <EditOutlined style={{ fontSize: "16px" }} onClick={() => handleEdit(record)} />
            <Popconfirm
              title="Hapus GL Account?"
              description="Yakin ingin menghapus data ini?"
              onConfirm={() => handleDelete(record.key)}
              okText="Hapus"
              cancelText="Batal"
            >
              <DeleteOutlined style={{ fontSize: "16px", color: "#D90000" }} className="text-red-500" />
            </Popconfirm>
          </div>
        );
      }
    }
  ];

  const tableData = editingKey === 'new' ? [...data, tempRow] : data;

  const renderHeader = (title) => (
    <div className="flex -my-4 justify-between items-center">
      <p className="w-full mt-[15px] text-primary font-bold">{title.toUpperCase()}</p>
      <Button type="primary" onClick={handleCreateNew} disabled={editingKey !== ''}>+ Create</Button>
    </div>
  );

  return (
    <div className="w-full mb-5">
      <CardContainer header={renderHeader("GL ACCOUNT INFORMATION")}>
        <TableRBI
          idTable="gl-account-table"
          columns={columns}
          dataSource={tableData}
          useSelect={false}
          usePagination={false}
          tableScrolled={{ x: "max-content" }}
        />
      </CardContainer>
    </div>
  );
};

export default GLAccountCreate;