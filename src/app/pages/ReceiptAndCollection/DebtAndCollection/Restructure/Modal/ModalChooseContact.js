import React, { useState } from "react";
import { Button } from "antd";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import SectionCard from "../../../../../../components/SectionCard";
import TableRBI from "../../../../../../components/TableRBI";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";

const ModalChooseContact = ({ isOpen, handleCancel, onSelect }) => {
  const [selectedKeys, setSelectedKeys] = useState([]);

  // Reset selection when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedKeys([]);
    }
  }, [isOpen]);

  const toggleSelect = (id) => {
    if (selectedKeys.includes(id)) {
      setSelectedKeys(selectedKeys.filter((k) => k !== id));
    } else {
      setSelectedKeys([...selectedKeys, id]);
    }
  };

  const subColumns = [
    { title: "NO", dataIndex: "key", width: 50, align: "center", render: (_, __, i) => i + 1 },
    { title: "TYPE", dataIndex: "type", width: 450 },
    { title: "VALUE", dataIndex: "value" },
  ];

  const columns = [
    { title: "NO", dataIndex: "key", width: 50, align: "center", render: (_, __, i) => i + 1 },
    { title: "FIRST NAME", dataIndex: "firstName", width: 180 },
    { title: "MIDDLE NAME", dataIndex: "middleName", width: 150 },
    { title: "LAST NAME", dataIndex: "lastName", width: 180 },
    { title: "JOB", dataIndex: "job", width: 150 },
    { title: "POSITION", dataIndex: "position", width: 150 },
    {
      title: "ACTION",
      align: "center",
      width: 80,
      render: (_, record) => {
        const isSelected = selectedKeys.includes(record.key);
        return (
          <div 
            className="cursor-pointer text-xl flex justify-center items-center"
            onClick={() => toggleSelect(record.key)}
          >
            {isSelected ? (
              <MinusCircleOutlined style={{ color: "#0075BF" }} />
            ) : (
              <PlusCircleOutlined style={{ color: "#0075BF" }} />
            )}
          </div>
        );
      },
    },
  ];

  const data = [
    {
      key: 1,
      firstName: "Rendy",
      middleName: "Fatih",
      lastName: "Setiawan",
      job: "Finance",
      position: "{value}",
      criteria: [
        { key: 1, type: "Whatsapp", value: "IDN - 628768789439" },
        { key: 2, type: "Email", value: "rendyfath@gmail.com" },
        { key: 3, type: "PGN Mobile", value: "IDN - 628768789439" },
      ],
    },
    {
      key: 2,
      firstName: "-",
      middleName: "Daniel Irza Kurniawan",
      lastName: "Staff Engineer",
      job: "Finance",
      position: "JL. ANGKASA, AA NO. 12, Y, RT..",
    },
    {
      key: 3,
      firstName: "-",
      middleName: "Supratman",
      lastName: "Staff Engineer 2",
      job: "Finance",
      position: "JL. ANGKASA, AA NO. 12, Y, RT..",
    },
    {
      key: 4,
      firstName: "-",
      middleName: "Donny Malaka",
      lastName: "Staff Engineer 3",
      job: "Finance",
      position: "JL. ANGKASA, AA NO. 12, Y, RT..",
    },
  ];

  const expandable = {
    expandedRowRender: (record) => (
      <div style={{ paddingLeft: "3.5em" }}>
        <TableRBI
          idTable={`sub-table-choose-${record.key}`}
          columns={subColumns}
          dataSource={record.criteria || []}
          usePagination={false}
          showSearchBar={false}
          showAdvanceSearch={false}
          useSelect={false}
          headerBg={true}
        />
      </div>
    ),
    rowExpandable: (record) => !!record.criteria,
  };

  return (
    <ModalCustom
      isOpen={isOpen}
      handleCancel={handleCancel}
      header="CHOOSE CONTACT"
      width={1300}
      footer={
        <div className="flex w-full justify-between items-center p-4 border-t border-[#D6E1F0]">
          <ButtonComponent
            onClick={handleCancel}
            className="!border-[#0075BF] !text-[#0075BF] px-8"
          >
            cancel
          </ButtonComponent>
          <Button
            type="primary"
            onClick={() => {
              const selectedData = data.filter((item) => selectedKeys.includes(item.key));
              if (selectedData.length > 0) {
                onSelect(selectedData);
                handleCancel();
              }
            }}
            style={{
              backgroundColor: "#0075BF",
              borderColor: "#0075BF",
              color: "#fff",
              borderRadius: "6px",
              height: "32px",
              fontSize: "12px",
            }}
            className="px-8"
          >
            Submit
          </Button>
        </div>
      }
    >
      <div className="p-4">
        <SectionCard title="CONTACT INFORMATION">
          <TableRBI
            idTable="choose-contact-table"
            columns={columns}
            dataSource={data}
            expandable={expandable}
            showAdvanceSearch={true}
            showSearchBar={true}
            usePagination={false}
            headerBg={true}
          />
          <div className="flex justify-end gap-4 mt-2 text-[11px] text-gray-400 font-normal">
            <span>Showing {data.length} of {data.length} entries</span>
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              All data showed
            </span>
          </div>
        </SectionCard>
      </div>
    </ModalCustom>
  );
};

export default ModalChooseContact;
