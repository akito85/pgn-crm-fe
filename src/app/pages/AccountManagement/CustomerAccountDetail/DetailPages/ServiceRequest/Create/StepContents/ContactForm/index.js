import { Fragment, useMemo, useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { PlusOutlined } from "@ant-design/icons"

import ButtonComponent from "../../../../../../../../../components/ButtonComponent"
import NxTable from "../../../../../../../../../components/Nx/NxTable"
import NxCardContainer from "../../../../../../../../../components/Nx/NxCardContainer"
import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer"

import ModalInformationContactDetail from "./ModalInformationContactDetail"
import ModalListContact from "./ModalListContact"
import ModalConfirmationContactDetail from "./ModalConfirmationContactDetail"

// Map raw account contact API item to the contactList row format
const mapAccountContact = (item, idx) => ({
  key: item.id ?? `account-contact-${idx}`,
  no: idx + 1,
  primary: item.primaryContact || item.isPrimary ? "Primary" : "Non-Primary",
  name:
    item.contactName ||
    item.name ||
    [item.firstName, item.middleName, item.lastName].filter(Boolean).join(" ") ||
    "-",
  job: item.job || item.jobTitle || item.jobPosition || "-",
  position: item.position || "-",
  address: item.address || item.contactAddress || "-",
  note: item.note || item.addressNote || "-",
  description: item.description || "-",
  status: item.status || "Active",
});

export default function ContactForm({ form, idAccount }) {
  const { data: accountContactsData } = useSelector((state) => state.accountContact);

  const [isOpen, setIsOpen] = useState(false);
  const [isSelectContactModal, setIsSelectContactModal] = useState(false);
  const [isConfirmationContactModal, setIsConfirmationContactModal] = useState(false);
  const [contactList, setContactList] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const initializedRef = useRef(false);

  // On mount: restore from form field first, otherwise pre-load from Redux account contacts
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const formData = form?.getFieldValue("srFormContacts");
    if (formData && formData.length > 0) {
      setContactList(formData);
      return;
    }

    const rawList =
      accountContactsData?.content ??
      accountContactsData?.result ??
      (Array.isArray(accountContactsData) ? accountContactsData : []);

    if (rawList.length > 0) {
      setContactList(rawList.map(mapAccountContact));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Always keep srFormContacts in sync with contactList
  useEffect(() => {
    form?.setFieldsValue({ srFormContacts: contactList });
  }, [contactList, form]);

  const columnMain = [
    { title: "NO", dataIndex: "no", key: "no" },
    { title: "PRIMARY", dataIndex: "primary", key: "primary" },
    { title: "NAME", dataIndex: "name", key: "name" },
    { title: "JOB", dataIndex: "job", key: "job" },
    { title: "POSITION", dataIndex: "position", key: "position" },
    { title: "CONTACT ADDRESS", dataIndex: "address", key: "address" },
    { title: "CONTACT ADDRESS ADDITIONAL NOTE", dataIndex: "note", key: "note" },
    { title: "DESCRIPTION", dataIndex: "description", key: "description" },
    { title: "STATUS", dataIndex: "status", key: "status" },
  ];

  const tableColumns = useMemo(
    () =>
      columnMain.map((col) => ({
        ...col,
        key: col.key || col.dataIndex || col.title,
      })),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleOpenCreateContact = () => setIsOpen(true);
  const handleCloseCreateContact = () => setIsOpen(false);
  const handleOpenSelectContact = () => setIsSelectContactModal(true);
  const handleCloseSelectContact = () => setIsSelectContactModal(false);

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setIsSelectContactModal(false);
    setIsConfirmationContactModal(true);
  };

  const handleCloseConfirmation = () => {
    setIsConfirmationContactModal(false);
    setSelectedContact(null);
  };

  // Called from ModalInformationContactDetail with collected form data
  const handleSaveNewContact = (contactData) => {
    const newContact = {
      key: `contact-${Date.now()}`,
      no: contactList.length + 1,
      ...contactData,
    };
    setContactList((prev) => [...prev, newContact]);
    setIsOpen(false);
  };

  // Called from ModalConfirmationContactDetail after user confirms a selected contact
  const handleConfirmContact = (contactData) => {
    const newContact = {
      key: `contact-${Date.now()}`,
      no: contactList.length + 1,
      primary: contactData.primary || "Non-Primary",
      name: contactData.name || "-",
      job: contactData.job || "-",
      position: contactData.position || "-",
      address: contactData.address || "-",
      note: contactData.note || "-",
      description: contactData.description || "-",
      status: contactData.status || "Active",
      ...contactData,
    };
    setContactList((prev) => [...prev, newContact]);
    setIsConfirmationContactModal(false);
    setSelectedContact(null);
  };

  return (
    <Fragment>
      <NxCardContainer header={"CONTACT LIST"}>
        <NxBaseContainer border>
          <div className="w-full flex justify-end items-center gap-2.5 mb-5">
            <ButtonComponent
              type={"submit"}
              onClick={handleOpenCreateContact}
              icon={<PlusOutlined style={{ color: "#fff", fontSize: 20 }} />}
              style={{
                backgroundColor: "#0075bf",
                color: "#fff",
                borderColor: "#0075bf",
                border: "1px solid #0075bf",
                borderRadius: "5px",
                height: "48px",
              }}
            >
              Create Contact
            </ButtonComponent>
          </div>

          <div className="flex flex-col gap-y-4">
            <NxTable
              idTable="create-service-request-contact-table"
              className="border-[0.5px] border-[#c8cdd4] border-solid"
              dataSource={contactList}
              columns={tableColumns}
              tableScrolled={{ y: 400, x: "max-content" }}
              usePagination={true}
              useSelect={true}
            />
          </div>
        </NxBaseContainer>
      </NxCardContainer>

      <ModalInformationContactDetail
        isOpen={isOpen}
        onBack={handleCloseCreateContact}
        onSave={handleSaveNewContact}
        onOpenSelectContact={handleOpenSelectContact}
      />

      <ModalListContact
        isOpen={isSelectContactModal}
        onBack={handleCloseSelectContact}
        onSelectContact={handleSelectContact}
      />

      <ModalConfirmationContactDetail
        isOpen={isConfirmationContactModal}
        selectedContact={selectedContact}
        onBack={handleCloseConfirmation}
        onConfirm={handleConfirmContact}
      />
    </Fragment>
  );
}
