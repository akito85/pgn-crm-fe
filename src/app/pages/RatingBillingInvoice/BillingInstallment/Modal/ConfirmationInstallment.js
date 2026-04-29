import React, { useState } from "react";
import { Form, Input, Table } from "antd";
import ButtonComponent from "../../../../../components/ButtonComponent";
import RadioTabs from "../../../../../components/RadioTabs";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";

const { TextArea } = Input;

const ConfirmationInstallment = ({
  isOpen,
  data = {},
  selectedHierarchy,
  listDataAppHierDetail = [],
  listDataAttachment = [],
  listDataOpenItems = [],
  listDataDetails = [],
  handleCancel = () => {},
  handleConfirm = () => {},
  dataOption = [],
}) => {
  const [valuePage, setValuePage] = useState("Installment");

  const [tabPages, setTabPages] = useState([
    { value: "Installment" },
    { value: "Approval" },
    { value: "Attachment" },
  ]);

  const formatCurrency = (amount, currency) => {
    return `${currency} ${new Intl.NumberFormat("id-ID").format(amount || 0)}`;
  };

  const openItemColumns = [
    {
      title: "Invoice Number",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      width: 200,
    },
    {
      title: "Billing Period",
      dataIndex: "billingPeriod",
      key: "billingPeriod",
      width: 120,
    },
    {
      title: "Billing Item",
      dataIndex: "billingItemName",
      key: "billingItemName",
      width: 200,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      align: "right",
      render: (amount, record) => formatCurrency(amount, record.currency),
    },
  ];

  const detailColumns = [
    {
      title: "Sequence",
      dataIndex: "sequenceNo",
      key: "sequenceNo",
      width: 80,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Period",
      dataIndex: "period",
      key: "period",
      width: 120,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      align: "right",
      render: (amount, record) => formatCurrency(amount, data.currency || "IDR"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: () => (
        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
          Pending
        </span>
      ),
    },
  ];

  const totalOpenItems = (listDataOpenItems || []).reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );

  const totalDetails = (listDataDetails || []).reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );

  const renderSection = (valuePage) => {
    switch (valuePage) {
      case "Installment":
        return (
          <div>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"INSTALLMENT INFORMATION"}
            </p>
            <div className="w-full grid grid-cols-2 gap-4 pt-4">
              <div>
                <p className="text-gray-500 text-xs">Account Number</p>
                <p className="text-gray-800 text-sm font-medium">
                  {data.accountNumber || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Account Name</p>
                <p className="text-gray-800 text-sm font-medium">
                  {data.accountName || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Installment Type</p>
                <p className="text-gray-800 text-sm font-medium">
                  {data.installmentType || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Tenor</p>
                <p className="text-gray-800 text-sm font-medium">
                  {data.tenor ? `${data.tenor} Bulan` : "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Start Period</p>
                <p className="text-gray-800 text-sm font-medium">
                  {data.startPeriod || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Source</p>
                <p className="text-gray-800 text-sm font-medium">
                  {data.source || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Request Date</p>
                <p className="text-gray-800 text-sm font-medium">
                  {data.requestDate || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Currency</p>
                <p className="text-gray-800 text-sm font-medium">
                  {data.currency || "-"}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500 text-xs">Remark</p>
                <p className="text-gray-800 text-sm font-medium">
                  {data.remark || "-"}
                </p>
              </div>
            </div>

            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"SELECTED OPEN ITEMS"}
            </p>
            <div className="pt-4">
              <Table
                columns={openItemColumns}
                dataSource={(listDataOpenItems || []).map((item, idx) => ({
                  ...item,
                  key: idx,
                }))}
                pagination={false}
                size="small"
                bordered={true}
                scroll={{ y: 200 }}
                summary={() => (
                  <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={3} index={0}>
                      <strong>Total Selected</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right">
                      <strong>
                        {formatCurrency(totalOpenItems, data.currency || "IDR")}
                      </strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                )}
              />
            </div>

            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"INSTALLMENT CALCULATION DETAIL"}
            </p>
            <div className="pt-4">
              <Table
                columns={detailColumns}
                dataSource={(listDataDetails || []).map((item, idx) => ({
                  ...item,
                  key: idx,
                  sequenceNo: idx + 1,
                }))}
                pagination={false}
                size="small"
                bordered={true}
                scroll={{ y: 250 }}
                summary={() => (
                  <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={2} index={0}>
                      <strong>Total</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right">
                      <strong>
                        {formatCurrency(totalDetails, data.currency || "IDR")}
                      </strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} />
                  </Table.Summary.Row>
                )}
              />
            </div>
          </div>
        );
      case "Approval":
        return (
          <>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"APPROVAL INFORMATION"}
            </p>
            <ApprovalComponentGeneral
              showSelect={false}
              disableSelect={true}
              approvalName={
                (dataOption || []).filter(
                  (data) => data.value === selectedHierarchy
                )?.[0].name || ""
              }
              dataTable={listDataAppHierDetail}
              selectedHierarchy
            />
          </>
        );
      case "Attachment":
        return (
          <>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"ATTACHMENT INFORMATION"}
            </p>
            <AttachmentComponent
              type={"preview"}
              data={listDataAttachment}
              typeSelector="installment"
            />
          </>
        );
      default:
        return (
          <div>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"INSTALLMENT INFORMATION"}
            </p>
          </div>
        );
    }
  };

  return (
    <ModalCustom
      isOpen={isOpen}
      type={"confirmation"}
      header={"confirmation"}
      width={1000}
      handleCancel={handleCancel}
      handleConfirm={handleConfirm}
      footer={
        <div className={"w-full flex justify-end gap-2"}>
          <ButtonComponent type={"default"} onClick={handleCancel}>
            Cancel
          </ButtonComponent>
          <ButtonComponent
            type={"submit"}
            border={false}
            onClick={handleConfirm}
          >
            Confirm
          </ButtonComponent>
        </div>
      }
    >
      <RadioTabs
        data={tabPages}
        onChange={(e) => setValuePage(e.target.value)}
        currentPosition={valuePage}
      />
      {renderSection(valuePage)}
    </ModalCustom>
  );
};

export default ConfirmationInstallment;
