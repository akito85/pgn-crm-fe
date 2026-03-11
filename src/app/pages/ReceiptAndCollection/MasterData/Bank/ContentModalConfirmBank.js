import { Fragment, useState } from "react";
import { Tag } from "antd";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import DetailText from "../../../../../components/DetailText";
import RadioTabs from "../../../../../components/RadioTabs";
import TableRBI from "../../../../../components/TableRBI"; 
import { intToNPWP } from "../../../../../utils/npwp";
// --- UBAH IMPORT ATTACHMENT KE KOMPONEN YANG PUNYA PREVIEW ---
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent"; 

const dummyJobs = [
  { label: "Manager", value: 1 },
  { label: "Staff Engineer", value: 2 },
  { label: "Staff Engineer 2", value: 3 },
  { label: "Director", value: 4 },
];

const dummyPositions = [
  { label: "Finance", value: 1 },
  { label: "IT Support", value: 2 },
  { label: "Human Resources", value: 3 },
];

const dummyTypes = [
  { label: "Email", value: 1 },
  { label: "Phone", value: 2 },
  { label: "PGN Mobile", value: 3 },
  { label: "Whatsapp", value: 4 },
];

const dummyInputTypes = [
  { label: "Email", value: 750 },
  { label: "Phone", value: 751 },
  { label: "Mobile Phone", value: 752 },
];

const dummyPrefixes = [
  { label: "IDN (+62)", value: 1 },
  { label: "SGP (+65)", value: 2 },
  { label: "USA (+1)", value: 3 },
];

// --- PINDAHKAN TABS KE LUAR KOMPONEN BIAR GAK BUG 2X KLIK ---
const defaultTabs = [
  { label: "Bank", value: "BANK" },
  { label: "Approval", value: "APPROVAL" },
  { label: "Attachment", value: "ATTACHMENT" }
];

const ContentModalConfirmBank = ({
  data,
  listDataAttachment = [],
  glAccounts = [],       
  bankContacts = [],     
  listDataAppHierDetail = [],
  dataBank,
  dataOption,
  selectedHierarchy,
}) => {
  const [valuePage, setValuePage] = useState(defaultTabs[0].value);

  const bankCode = (dataBank || []).filter(
    (item) => item.bankCode === data?.bankCode
  );

  const handleBankInfo = (e) => {
    // Pastikan menangkap value dari radio button
    setValuePage(e.target?.value || e); 
  };

  const glColumns = [
    { title: "NO", width: 60, align: "center", render: (_, __, index) => index + 1 },
    { title: "TYPE", dataIndex: "type", width: 150 },
    { title: "GL ACCOUNT NUMBER", dataIndex: "accountNumber", width: 250 },
    { title: "GL ACCOUNT DESCRIPTION", dataIndex: "accountName" },
  ];

  const contactColumns = [
    { title: "NO", width: 60, align: "center", render: (_, __, i) => i + 1 },
    { title: "PRIMARY", dataIndex: "isPrimary", width: 100, align: "center", render: (val) => val === "Y" ? <Tag color="blue">Primary</Tag> : "-" },
    { title: "CONTACT NAME", dataIndex: "contactName", width: 200 },
    { 
      title: "JOB", 
      dataIndex: "jobId", 
      width: 150,
      render: (val) => dummyJobs.find(item => item.value === val)?.label || val
    },
    { 
      title: "POSITION", 
      dataIndex: "positionId", 
      width: 150,
      render: (val) => dummyPositions.find(item => item.value === val)?.label || val
    }, 
    { title: "ADDRESS", dataIndex: "address", width: 250 },
    { title: "ADDITIONAL NOTE", dataIndex: "additionalNote", width: 200 },
    { title: "DESCRIPTION", dataIndex: "description", width: 250 },
  ];

  const expandedContactRender = (record) => {
    const expandCols = [
      { title: "NO", width: 60, align: "center", render: (_, __, i) => i + 1 },
      { 
        title: "TYPE", 
        dataIndex: "type", 
        width: 150,
        render: (val) => dummyTypes.find(item => item.value === val)?.label || val
      }, 
      { 
        title: "INPUT TYPE", 
        dataIndex: "inputType", 
        width: 150,
        render: (val) => dummyInputTypes.find(item => item.value === val)?.label || val
      }, 
      { 
        title: "VALUE", 
        render: (_, rec) => {
          const prefixLabel = dummyPrefixes.find(item => item.value === rec.prefix1)?.label || rec.prefix1;
          return prefixLabel ? `${prefixLabel} - ${rec.value}` : rec.value;
        }
      },
    ];
    return (
      <TableRBI
        idTable={`preview-expanded-${record.contactName}`}
        columns={expandCols}
        dataSource={record.viewDetails || []}
        useSelect={false}
        usePagination={false}
      />
    );
  };

  const showSection = () => {
    switch (valuePage) {
      case "BANK":
        return (
          <>
            <div className="grid grid-cols-4 w-full gap-5">
              <DetailText label={"Is Branch"}>
                {data?.isBranch === true ? "True" : "False"}
              </DetailText>
              <DetailText label={"Bank Code"}>
                 {data?.isBranch === true ? bankCode[0]?.bankName || "" : data?.bankCode}
              </DetailText>
              <DetailText label={"Bank Name"}>{data?.bankName}</DetailText>
              <DetailText label={"Short Bank Name"}>
                {data?.bankShortName}
              </DetailText>
            </div>
            
            <div className="w-full grid grid-cols-4 gap-5">
              {data?.isBranch === true ? (
                <DetailText label={"Branch Name"}>{data?.branchName}</DetailText>
              ) : null}
              <DetailText label={"Tax Identification Number (NPWP)"}>
                {intToNPWP(data?.npwp)}
              </DetailText>
              <DetailText label={"Phone Number"}>
                {data?.phoneNumber}
              </DetailText>
              <DetailText label={"Email"}>{data?.email}</DetailText>
            </div>
            
            <div className="grid grid-cols-1 w-full">
              <DetailText label={"Address"}>{data?.address}</DetailText>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <div className="text-primary text-xs font-bold uppercase">
                GL ACCOUNT INFORMATION
              </div>
              <TableRBI
                idTable="preview-gl-table"
                columns={glColumns}
                dataSource={glAccounts}
                useSelect={false}
                usePagination={false}
              />
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <div className="text-primary text-xs font-bold uppercase">
                CONTACT LIST INFORMATION
              </div>
              <TableRBI
                idTable="preview-contact-table"
                columns={contactColumns}
                dataSource={bankContacts}
                useSelect={false}
                usePagination={false}
                expandable={{ expandedRowRender: expandedContactRender }}
                tableScrolled={{ x: "max-content" }}
              />
            </div>
          </>
        );
      
      case "APPROVAL":
        return (
          <ApprovalComponentGeneral
            showSelect={false}
            disableSelect={true}
            approvalName={
              (dataOption || []).filter(
                (opt) => opt.value === selectedHierarchy
              )?.[0]?.name || ""
            }
            dataTable={listDataAppHierDetail}
            selectedHierarchy={selectedHierarchy}
          />
        );
      
      case "ATTACHMENT":
        return (
          // --- GUNAKAN ATTACHMENT COMPONENT UNTUK MUNCULIN PREVIEW ---
          <AttachmentComponent 
            type="preview" 
            data={listDataAttachment} 
            typeSelector="bank"
          />
        );
      
      default:
        return <Fragment></Fragment>;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <RadioTabs data={defaultTabs} value={valuePage} onChange={handleBankInfo} />
      <div className="flex flex-col gap-4 mt-2">
        <div className="text-primary text-xs font-bold uppercase">
          {`${valuePage} INFORMATION`}
        </div>
        {showSection()}
      </div>
    </div>
  );
};

export default ContentModalConfirmBank;