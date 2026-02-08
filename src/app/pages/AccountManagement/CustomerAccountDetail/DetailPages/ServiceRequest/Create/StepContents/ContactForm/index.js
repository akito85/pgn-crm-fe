import { Fragment, useState, useEffect } from "react"
import { PlusOutlined } from "@ant-design/icons"

import ButtonComponent from "../../../../../../../../../components/ButtonComponent"
import NxTable from "../../../../../../../../../components/Nx/NxTable"
import NxPanel from "../../../../../../../../../components/Nx/NxPanel"

import ModalInformationContactDetail from "./ModalInformationContactDetail"
import ModalListContact from "./ModalListContact"
import ModalConfirmationContactDetail from "./ModalConfirmationContactDetail"

const MOCK_CONTACT_LIST = []

export default function ContactForm({ form }) {
  // --------------------------------------------------------------------------
  // STATE MANAGEMENT - Only modal visibility and main contact list
  // --------------------------------------------------------------------------
  const [isOpen, setIsOpen] = useState(false)
  const [isSelectContactModal, setIsSelectContactModal] = useState(false)
  const [isConfirmationContactModal, setIsConfirmationContactModal] = useState(false)
  const [contactList, setContactList] = useState(MOCK_CONTACT_LIST)
  const [selectedContact, setSelectedContact] = useState(null)

  // Sync local state with form data on mount (for persistence across step navigation)
  useEffect(() => {
    if (form) {
      const formData = form.getFieldValue('srFormContacts');
      if (formData && formData.length > 0) {
        setContactList(formData);
      }
    }
  }, [form]);

  const columnMain = [
    {
      title: 'NO',
      dataIndex: 'no',
      key: 'no',
      filter: true,
    },
    {
      title: 'PRIMARY',
      dataIndex: 'primary',
      key: 'primary',
    },
    {
      title: 'NAME',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'JOB',
      dataIndex: 'job',
      key: 'job',
    },
    {
      title: 'POSITION',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'CONTACT ADDRESS',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'CONTACT ADDRESS ADDITIONAL NOTE',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: 'DESCRIPTION',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
    },
  ]

  const handleEdit = (record) => {
    console.log("edit", record)
  }

  const handleDelete = (record) => {
    console.log("delete", record)
  }

  const handleOpenCreateContact = () => {
    setIsOpen(true)
  }

  const handleCloseCreateContact = () => {
    setIsOpen(false)
  }

  const handleOpenSelectContact = () => {
    setIsSelectContactModal(true)
  }

  const handleCloseSelectContact = () => {
    setIsSelectContactModal(false)
  }

  const handleSelectContact = (contact) => {
    setSelectedContact(contact)
    setIsSelectContactModal(false)
    setIsConfirmationContactModal(true)
  }

  const handleCloseConfirmation = () => {
    setIsConfirmationContactModal(false)
    setSelectedContact(null)
  }

  const handleConfirmContact = (contactData) => {
    console.log("Contact confirmed:", contactData)
    // Add confirmed contact to main contact list
    const newContact = {
      key: `contact-${Date.now()}`,
      no: contactList.length + 1,
      ...contactData,
    }
    const updatedList = [...contactList, newContact];
    setContactList(updatedList);

    // Sync with parent form for persistence across steps
    if (form) {
      form.setFieldsValue({ srFormContacts: updatedList });
    }

    setIsConfirmationContactModal(false)
    setSelectedContact(null)
  }

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------
  return (
    <Fragment>
      <NxPanel title={"CONTACT LIST"}>
        {/* Create Contact Button */}
        <div className="w-full flex justify-end items-center gap-2.5 mb-5">
          <ButtonComponent
            type={"submit"}
            onClick={handleOpenCreateContact}
            icon={
              <PlusOutlined
                style={{
                  color: "#fff",
                  fontSize: 20,
                }}
              />
            }
            style={{
              backgroundColor: "#0075bf",
              color: "#fff",
              borderColor: "#0075bf",
              border: "1px solid #0075bf",
              borderRadius: "5px",
              height: "48px"
            }}
          >
            Create Contact
          </ButtonComponent>
        </div>

        {/* Main Contact Table */}
        <NxTable
          className="border-[0.5px] border-[#c8cdd4] border-solid "
          usePagination={true}
          useSelect={true}
          dataMain={contactList}
          columnMain={columnMain}
        />

        <ModalInformationContactDetail
          isOpen={isOpen}
          onBack={handleCloseCreateContact}
          onClear={() => console.log("Clear form")}
          onSave={() => console.log("Save contact")}
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
      </NxPanel>
    </Fragment>
  )
}

// Export form values getter for wizard step retrieval
export const getContactFormValues = () => {
  // This would typically get form values from the modal
  // For now, return null as form is inside modal
  return null
}
