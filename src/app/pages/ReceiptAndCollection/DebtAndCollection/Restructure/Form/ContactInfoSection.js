import React, { useState } from "react";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import CardContainerNoBorder from "../../../../../../components/CardContainerNoBorder";
import TableRBI from "../../../../../../components/TableRBI";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SubSectionCard from "../../../../../../components/SubSectionCard";
import StatusComponent from "../../../../../../components/StatusComponent";
import ModalCreateContact from "../Modal/ModalCreateContact";
import ModalChooseContact from "../Modal/ModalChooseContact";

const ContactInfoSection = ({ onContactsChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChooseModalOpen, setIsChooseModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleOpenChooseModal = () => {
    setIsModalOpen(false);
    setIsChooseModalOpen(true);
  };
  const dummyColumns = [
    { title: "NO", dataIndex: "key", width: 50, align: "center", render: (_, __, i) => i + 1 },
    { 
      title: "PRIMARY", 
      dataIndex: "isPrimary", 
      width: 120,
      render: (val) => val 
        ? <StatusComponent colour="primary">Primary</StatusComponent>
        : "-" 
    },
    { title: "CONTACT NAME", dataIndex: "cpName", width: 250 },
    { title: "JOB", dataIndex: "job", width: 150 },
    { title: "POSITION", dataIndex: "position", width: 150 },
    { title: "ADDRESS", dataIndex: "address" },
  ];

  const subColumns = [
    { title: "NO", dataIndex: "key", width: 50, align: "center", render: (_, __, i) => i + 1 },
    { title: "TYPE", dataIndex: "type", width: 150 },
    { title: "VALUE", dataIndex: "value", width: 150 },
  ];

  const [contacts, setContacts] = useState([]);

  React.useEffect(() => {
    if (onContactsChange) onContactsChange(contacts);
  }, [contacts, onContactsChange]);

  const handleAddContacts = (newContactsList) => {
    const formattedContacts = newContactsList.map(item => ({
      key: Date.now() + Math.random(),
      isPrimary: item.isPrimary || false,
      cpName: item.cpName
        ? item.cpName
        : [item.firstName, item.middleName, item.lastName].filter(Boolean).join(" "),
      job: item.job,
      position: item.position,
      address: item.address || item.contactAddress || item.position || "-",
      details: item.details || item.criteria || []
    }));
    setContacts([...formattedContacts, ...contacts]);
  };

  const expandable = {
    expandedRowRender: (record) => (
      <div style={{ paddingLeft: "2.5em" }}>
        <TableRBI
          idTable={`expanded-contact-${record.key}`}
          columns={subColumns}
          dataSource={record.details || []}
          useSelect={false}
          usePagination={false}
          showAdvanceSearch={false}
          showSearchBar={false}
        />
      </div>
    ),
    rowExpandable: (record) => !!record.details,
    expandIcon: ({ expanded, onExpand, record }) =>
      record.details ? (
        expanded ? (
          <MinusOutlined className="cursor-pointer" onClick={(e) => onExpand(record, e)} />
        ) : (
          <PlusOutlined className="cursor-pointer" onClick={(e) => onExpand(record, e)} />
        )
      ) : (
        <span className="ml-4" />
      ),
  };

  return (
    <CardContainerNoBorder header="CONTACT INFORMATION" collapsible={true}>
      <SubSectionCard>
        <div className="flex justify-end mb-4">
          <ButtonComponent
            type="submit"
            border={false}
            icon={<PlusOutlined />}
            onClick={handleOpenModal}
          >
            Create
          </ButtonComponent>
        </div>
        <TableRBI
          idTable="contact-main-table"
          columns={dummyColumns}
          dataSource={contacts}
          expandable={expandable}
          usePagination={false}
          showAdvanceSearch={false}
          showSearchBar={false}
          useSelect={false}
          tableScrolled={{ x: "max-content" }}
        />
        <div className="flex justify-end gap-4 mt-2 text-[11px] text-gray-400">
          <span>Showing {contacts.length} of {contacts.length} entries</span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            All data showed
          </span>
        </div>
      </SubSectionCard>

      <ModalCreateContact
        isOpen={isModalOpen}
        handleCancel={handleCloseModal}
        onAddContacts={handleAddContacts}
        onOpenChooseModal={handleOpenChooseModal}
      />

      <ModalChooseContact
        isOpen={isChooseModalOpen}
        handleCancel={() => setIsChooseModalOpen(false)}
        onSelect={handleAddContacts}
      />
    </CardContainerNoBorder>
  );
};

export default ContactInfoSection;
