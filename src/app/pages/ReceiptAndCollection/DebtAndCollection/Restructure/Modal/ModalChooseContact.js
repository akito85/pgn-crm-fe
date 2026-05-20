import React, { useState, useEffect } from "react";
import { Button, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import SectionCard from "../../../../../../components/SectionCard";
import TableRBI from "../../../../../../components/TableRBI";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { getContactsByAccount, getAllContactsRestructure } from "../../../../../../redux/slices/receipt_collection/restructure";

const ModalChooseContact = ({ isOpen, handleCancel, onSelect, accountNumber, selectedContactIds = [] }) => {
  const dispatch = useDispatch();
  const { restructureContacts, allContacts, loading } = useSelector((state) => state.restructure);
  const [selectedKeys, setSelectedKeys] = useState([]);

  // Use account-specific contacts if available, otherwise show all
  const rawData = accountNumber ? restructureContacts : allContacts;
  const data = (rawData || []).filter(item => !selectedContactIds.includes(item.contactId));

  useEffect(() => {
    if (isOpen) {
      setSelectedKeys([]);
      if (accountNumber) {
        dispatch(getContactsByAccount(accountNumber));
      } else {
        dispatch(getAllContactsRestructure());
      }
    }
  }, [isOpen, accountNumber, dispatch]);

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
    // { title: "CONTACT NAME", dataIndex: "contactName", width: 250 },
    { title: "JOB", dataIndex: "job", width: 150 },
    { title: "POSITION", dataIndex: "position", width: 150 },
    {
      title: "ACTION",
      align: "center",
      width: 80,
      render: (_, record) => {
        const isSelected = selectedKeys.includes(record.contactId);
        return (
          <div 
            className="cursor-pointer text-xl flex justify-center items-center"
            onClick={() => toggleSelect(record.contactId)}
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


  const expandable = {
    expandedRowRender: (record) => (
      <div style={{ paddingLeft: "3.5em" }}>
        <TableRBI
          idTable={`sub-table-choose-${record.contactId}`}
          columns={subColumns}
          dataSource={record.contactDetails || []}
          usePagination={false}
          showSearchBar={false}
          showAdvanceSearch={false}
          useSelect={false}
          headerBg={true}
        />
      </div>
    ),
    rowExpandable: (record) => !!record.contactDetails && record.contactDetails.length > 0,
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
              const selectedData = data.filter((item) => selectedKeys.includes(item.contactId));
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
        <Spin spinning={loading}>
          <SectionCard title="CONTACT INFORMATION">
            <TableRBI
              idTable="choose-contact-table"
              columns={columns}
              dataSource={data || []}
              expandable={expandable}
              showAdvanceSearch={true}
              showSearchBar={true}
              usePagination={false}
              headerBg={true}
              rowKey="contactId"
            />
            <div className="flex justify-end gap-4 mt-2 text-[11px] text-gray-400 font-normal">
              <span>Showing {data?.length || 0} of {data?.length || 0} entries</span>
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                All data showed
              </span>
            </div>
          </SectionCard>
        </Spin>
      </div>
    </ModalCustom>
  );
};

export default ModalChooseContact;
