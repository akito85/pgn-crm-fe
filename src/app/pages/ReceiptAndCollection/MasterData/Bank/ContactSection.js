import React, { useState } from "react";
import { Button, Form, Collapse, Input, Tag, message, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CardContainer from "../../../../../components/CardContainer";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import SelectComponent from "../../../../../components/SelectComponent";
import TableRBI from "../../../../../components/TableRBI";

const { Panel } = Collapse;

const ContactSection = ({
  mainData,
  setMainData,
  jobOptions = [],
  positionOptions = [],
  typeOptions = [],
  inputTypeOptions = [],
  prefixOptions = [],
  zoneOptions = [],
  // --- PROPS UNTUK CHOOSE CONTACT ---
  allContactData = [], 
  loadingContact = false,
  totalContactData = 0,
  contactPage = 1,
  contactPageSize = 10,
  onChangeContactPage,
  addressOptions = [] // <-- TERIMA PROPS DARI BAPAK DI SINI
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactForm] = Form.useForm();
  const [editingContactKey, setEditingContactKey] = useState(null);
  const [criteriaData, setCriteriaData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [tempRow, setTempRow] = useState({});

  // State Modal Choose Contact
  const [isChooseModalOpen, setIsChooseModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); 
  const [selectedContacts, setSelectedContacts] = useState([]);

  // ==========================================
  // LOGIKA CREATE / EDIT MANUAL CONTACT
  // ==========================================
  const handleModalSubmit = async () => {
    try {
      const values = await contactForm.validateFields();

      if (criteriaData.length === 0) {
        message.error("Criteria Information tidak boleh kosong! Silakan tambahkan minimal 1 data.");
        return;
      }

      if (editingKey !== '') {
        message.warning("Silakan Save atau Cancel baris Criteria Information yang sedang aktif terlebih dahulu.");
        return;
      }

      const updatedContact = {
        key: editingContactKey ? editingContactKey : Date.now(),
        primary: editingContactKey ? mainData.find(item => item.key === editingContactKey)?.primary : mainData.length === 0,
        name: `${values.firstName} ${values.middleName || ''} ${values.lastName || ''}`.replace(/\s+/g, ' ').trim(),
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        job: values.job,
        position: values.position,
        address: values.contactAddress,
        note: values.additionalNote,
        desc: values.description,
        criteriaList: criteriaData,
      };

      if (editingContactKey) {
        setMainData(mainData.map(item => item.key === editingContactKey ? updatedContact : item));
      } else {
        setMainData([...mainData, updatedContact]);
      }

      handleModalClose();
    } catch (e) {
      message.error("Mohon lengkapi semua field yang wajib diisi!");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    contactForm.resetFields();
    setCriteriaData([]);
    setEditingKey('');
    setEditingContactKey(null);
  };

  const handleEditContact = (record) => {
    setEditingContactKey(record.key);
    contactForm.setFieldsValue({
      firstName: record.firstName,
      middleName: record.middleName,
      lastName: record.lastName,
      job: record.job,
      position: record.position,
      contactAddress: record.address,
      additionalNote: record.note,
      description: record.desc,
    });
    setCriteriaData(record.criteriaList || []);
    setIsModalOpen(true);
  };

  const handleDeleteContact = (key) => {
    const filteredData = mainData.filter(item => item.key !== key);
    if (filteredData.length > 0 && mainData.find(item => item.key === key)?.primary) {
      filteredData[0].primary = true;
    }
    setMainData(filteredData);
  };

  const handleSetPrimary = (key) => {
    const updatedData = mainData.map(item => ({
      ...item,
      primary: item.key === key
    }));
    setMainData(updatedData);
    message.success("Primary contact berhasil diubah!");
  };

  // ==========================================
  // LOGIKA CRITERIA
  // ==========================================
  const handleCreateCriteria = () => {
    setEditingKey('new');
    setTempRow({ key: 'new', type: null, inputType: null, valuePrefix: null, valueText: '' });
  };

  const autoFillMap = {
    "741": 748, "742": 750, "743": 750, "744": 752, "745": 751, "746": 749, "747": 749,
  };

  const handleSaveCriteria = () => {

    if (!tempRow.type || !tempRow.inputType || !tempRow.valueText || tempRow.valueText.trim() === '') {
      message.error("Type, Input Type, dan Value Text wajib diisi!");
      return;
    }

    if (editingKey === 'new') {
      setCriteriaData([...criteriaData, { ...tempRow, key: Date.now() }]);
    } else {
      setCriteriaData(criteriaData.map(item => item.key === editingKey ? tempRow : item));
    }
    setEditingKey('');
  };

  const criteriaColumns = [
    { title: "NO", width: 60, align: "center", render: (_, __, index) => index + 1 },
    {
      title: "TYPE",
      dataIndex: "type",
      width: 200,
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
        return typeOptions.find(item => String(item.value) === String(text))?.label || text;
      }
    },
    {
      title: "INPUT TYPE",
      dataIndex: "inputType",
      width: 200,
      render: (text, record) => {
        if (record.key === editingKey) {
          return (
            <SelectComponent
              placeholder="Select Input"
              value={tempRow.inputType}
              onChange={(val) => setTempRow({ ...tempRow, inputType: val })}
              options={inputTypeOptions}
            />
          );
        }
        return inputTypeOptions.find(item => String(item.value) === String(text))?.label || text;
      }
    },
    {
      title: "VALUE",
      dataIndex: "value",
      render: (_, record) => {
        if (record.key === editingKey) {
          return (
            <Input 
              placeholder="Input Value" 
              value={tempRow.valueText} 
              onChange={(e) => setTempRow({ ...tempRow, valueText: e.target.value })} 
            />
          );
        }
        return record.valueText;
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
              <Button size="small" onClick={() => setEditingKey('')}>Cancel</Button>
              <Button size="small" type="primary" onClick={handleSaveCriteria}>Save</Button>
            </div>
          );
        }
        return (
          <div className="flex gap-3 justify-center text-primary cursor-pointer">
            <EditOutlined style={{ fontSize: "16px" }} onClick={() => { setTempRow({ ...record }); setEditingKey(record.key); }} />
            <DeleteOutlined style={{ fontSize: "16px", color: "#D90000" }} className="text-red-500" onClick={() => setCriteriaData(criteriaData.filter(i => i.key !== record.key))} />
          </div>
        );
      }
    }
  ];

  const tableDataCriteria = editingKey === 'new' ? [...criteriaData, tempRow] : criteriaData;

  // ==========================================
  // LOGIKA CHOOSE CONTACT MODAL
  // ==========================================
  const handleOpenChooseModal = () => {
    setIsChooseModalOpen(true);
    setSelectedRowKeys([]); 
    setSelectedContacts([]);
  };

  const handleCloseChooseModal = () => {
    setIsChooseModalOpen(false);
    setSelectedRowKeys([]);
    setSelectedContacts([]);
  };

  const onRowSelectChange = (newSelectedRowKeys, selectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedContacts(selectedRows);
  };

  const mappedAllContacts = (allContactData || []).map((item) => ({
    ...item,
    key: item.id,
    name: item.contactName, 
    job: item.jobId,
    position: item.positionId,
    address: item.address || "-", 
    desc: item.description || "-",
    criteriaList: (item.contactDetails || []).map(detail => ({
      key: detail.contactDetailsId,
      type: detail.type,
      inputType: detail.inputType,
      valueText: detail.fullValue 
    }))
  }));

  const handleSubmitChooseContact = () => {
    if (selectedContacts.length === 0) {
      message.warning("Pilih minimal 1 kontak!");
      return;
    }

    const mappedSelectedContacts = selectedContacts.map((contact, index) => {
      const isExist = mainData.find(m => m.id === contact.id); 
      if(isExist) return null;

      return {
        ...contact,
        key: contact.id || Date.now() + index, 
        primary: mainData.length === 0 && index === 0, 
      };
    }).filter(Boolean); 

    if(mappedSelectedContacts.length === 0) {
      message.warning("Kontak yang dipilih sudah ada di list!");
      return;
    }

    setMainData([...mainData, ...mappedSelectedContacts]);
    
    handleCloseChooseModal();
    handleModalClose(); 
    message.success("Berhasil menambahkan kontak pilihan.");
  };

  const chooseColumns = [
    { title: "CONTACT NAME", dataIndex: "name", width: 200 },
    { title: "JOB", dataIndex: "job", width: 150, render: (val) => jobOptions.find(item => item.value === val)?.label || val },
    { title: "POSITION", dataIndex: "position", width: 150, render: (val) => positionOptions.find(item => item.value === val)?.label || val },
    { title: "ADDRESS", dataIndex: "address", width: 250 },
    { title: "DESCRIPTION", dataIndex: "desc", width: 250 },
  ];

  // ==========================================
  // RENDER KOLOM UTAMA & HEADER
  // ==========================================
  const mainColumns = [
    { title: "NO", width: 60, align: "center", render: (_, __, i) => i + 1 },
    {
      title: "PRIMARY",
      dataIndex: "primary",
      width: 120,
      align: "center",
      render: (isPrimary, record) => {
        if (isPrimary) {
          return <Tag color="blue">Primary</Tag>;
        }
        return (
          <Popconfirm
            title="Set as Primary"
            description="Kontak primary sebelumnya akan dinonaktifkan. Lanjutkan?"
            onConfirm={(e) => {
              e.stopPropagation();
              handleSetPrimary(record.key);
            }}
            onCancel={(e) => e.stopPropagation()}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" size="small" onClick={(e) => e.stopPropagation()}>
              Set Primary
            </Button>
          </Popconfirm>
        );
      }
    },
    { title: "CONTACT NAME", dataIndex: "name", width: 200 },
    {
      title: "JOB",
      dataIndex: "job",
      width: 150,
      render: (val) => jobOptions.find(item => item.value === val)?.label || val
    },
    {
      title: "POSITION",
      dataIndex: "position",
      width: 150,
      render: (val) => positionOptions.find(item => item.value === val)?.label || val
    },
    { 
      title: "ADDRESS", 
      dataIndex: "address", 
      width: 250,
      // Tampilkan alamat di tabel sesuai label dari addressOptions kalau ketemu
      render: (val) => addressOptions.find(item => item.value === val)?.label || val 
    },
    { title: "ADDITIONAL NOTE", dataIndex: "note", width: 200 },
    { title: "DESCRIPTION", dataIndex: "desc", width: 250 },
    { title: "STATUS", dataIndex: "status", width: 100, align: "center", render: () => <Tag color="green">Active</Tag> },
    {
      title: "ACTION",
      width: 120,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <div className="flex gap-3 justify-center text-primary cursor-pointer">
          <EditOutlined style={{ fontSize: "16px" }} onClick={(e) => { e.stopPropagation(); handleEditContact(record); }} />
          <DeleteOutlined style={{ fontSize: "16px", color: "#D90000" }} className="text-red-500" onClick={(e) => { e.stopPropagation(); handleDeleteContact(record.key); }} />
        </div>
      )
    },
  ];

  const expandedRowRender = (record) => {
    const expandCols = [
      { title: "NO", width: 60, align: "center", render: (_, __, i) => i + 1 },
      {
        title: "TYPE",
        dataIndex: "type",
        width: 200,
        render: (val) => typeOptions.find(item => String(item.value) === String(val))?.label || val
      },
      {
        title: "VALUE",
        render: (_, rec) => rec.valueText
      },
    ];
    return (
      <TableRBI
        idTable={`expanded-contact-${record.key}`}
        columns={expandCols}
        dataSource={record.criteriaList || []}
        useSelect={false}
        usePagination={false}
      />
    );
  };

  const renderHeader = (title) => (
    <div className="flex -my-4 justify-between items-center">
      <p className="w-full mt-[15px] text-primary font-bold">{title.toUpperCase()}</p>
      <Button type="primary" onClick={() => {
        contactForm.resetFields();
        setCriteriaData([]);
        setEditingContactKey(null);
        setIsModalOpen(true);
      }}>+ Create</Button>
    </div>
  );

  return (
    <div className="w-full mb-5">
      <CardContainer header={renderHeader("CONTACT INFORMATION")}>
        <TableRBI
          idTable="main-contact-table"
          columns={mainColumns}
          dataSource={mainData}
          useSelect={false}
          usePagination={false}
          expandable={{ expandedRowRender }}
          tableScrolled={{ x: "max-content" }}
        />
      </CardContainer>

      {/* ========================================= */}
      {/* MODAL 1: CREATE / EDIT MANUAL CONTACT       */}
      {/* ========================================= */}
      <ModalCustom
        isOpen={isModalOpen}
        handleCancel={handleModalClose}
        header={editingContactKey ? "EDIT CONTACT" : "CREATE NEW CONTACT"}
        width={1300}
      >
        <div className="p-4">
          {!editingContactKey && (
            <div className="flex justify-end mb-4">
              <Button type="default" onClick={handleOpenChooseModal}>
                Choose Contact
              </Button>
            </div>
          )}
          
          <Form layout="vertical" form={contactForm}>
            <Collapse defaultActiveKey={['1', '2']} className="bg-white">
              <Panel header="CONTACT INFORMATION" key="1" className="font-bold text-primary">
                <div className="grid grid-cols-5 gap-4 font-normal text-black mt-2">
                  <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Wajib diisi' }]}><Input placeholder="Input.." /></Form.Item>
                  <Form.Item label="Middle Name" name="middleName"><Input placeholder="Input.." /></Form.Item>
                  <Form.Item label="Last Name" name="lastName"><Input placeholder="Input.." /></Form.Item>
                  <Form.Item label="Job" name="job" rules={[{ required: true, message: 'Wajib diisi' }]}><SelectComponent placeholder="Select Job" options={jobOptions} /></Form.Item>
                  <Form.Item label="Position" name="position" rules={[{ required: true, message: 'Wajib diisi' }]}><SelectComponent placeholder="Select Position" options={positionOptions} /></Form.Item>
                  
                  {/* --- GANTI OPTIONS DI SINI MENGGUNAKAN PROPS DARI BAPAK --- */}
                  <Form.Item label="Contact Address" name="contactAddress">
                    <SelectComponent 
                      placeholder="Select Address" 
                      options={addressOptions} 
                      showSearch 
                      optionFilterProp="label" 
                    />
                  </Form.Item>
                  {/* ---------------------------------------------------------- */}
                  
                  <Form.Item label="Contact Address Additional Note" name="additionalNote"><Input placeholder="Input Note.." /></Form.Item>

                  <div className="col-span-5">
                    <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Wajib diisi' }]}><Input.TextArea rows={3} placeholder="Input.." /></Form.Item>
                  </div>
                </div>
              </Panel>

              <Panel header="CRITERIA INFORMATION" key="2" className="font-bold text-primary mt-4">
                <div className="flex justify-end mb-2">
                  <Button
                    type="primary"
                    onClick={handleCreateCriteria}
                    disabled={editingKey !== ''}
                  >
                    + Create
                  </Button>
                </div>
                <TableRBI
                  idTable="criteria-table-modal"
                  columns={criteriaColumns}
                  dataSource={tableDataCriteria}
                  useSelect={true}
                  showAdvanceSearch={true}
                  showSearchBar={true}
                  usePagination={false}
                  tableScrolled={{ x: "max-content" }}
                />
              </Panel>
            </Collapse>
          </Form>

          <div className="flex justify-between mt-6">
            <Button onClick={handleModalClose}>Cancel</Button>
            <div className="flex gap-2">
              {!editingContactKey && (
                <Button danger onClick={() => { contactForm.resetFields(); setCriteriaData([]); }}>Clear Data</Button>
              )}
              <Button type="primary" onClick={handleModalSubmit}>Submit</Button>
            </div>
          </div>
        </div>
      </ModalCustom>

      {/* ========================================= */}
      {/* MODAL 2: CHOOSE CONTACT DARI LIST API       */}
      {/* ========================================= */}
      <ModalCustom
        isOpen={isChooseModalOpen}
        handleCancel={handleCloseChooseModal}
        header="CHOOSE CONTACT"
        width={1300}
      >
        <div className="p-4">
          <p className="mb-4 text-gray-500">Select one or more contacts to add to the bank.</p>
          
          <TableRBI
            idTable="choose-contact-table"
            columns={chooseColumns}
            dataSource={mappedAllContacts} 
            loading={loadingContact}
            useSelect={true} 
            rowSelection={{
              selectedRowKeys,
              onChange: onRowSelectChange,
            }}
            showAdvanceSearch={true}
            showSearchBar={true}
            expandable={{ expandedRowRender }} 
            tableScrolled={{ x: "max-content", y: 400 }}
            usePagination={true} 
            current={contactPage}
            pageSize={contactPageSize}
            totalData={totalContactData}
            onChange={(page, pageSize) => {
              if (onChangeContactPage) onChangeContactPage(page, pageSize);
            }}
            onSizeChanger={(current, size) => {
              if (onChangeContactPage) onChangeContactPage(current, size);
            }}
          />

          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={handleCloseChooseModal}>Cancel</Button>
            <Button type="primary" onClick={handleSubmitChooseContact}>Add Selected</Button>
          </div>
        </div>
      </ModalCustom>

    </div>
  );
};

export default ContactSection;