import React, { useState } from "react";
import { Form, Input, Checkbox, Collapse, Button, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import SelectComponent from "../../../../../../components/SelectComponent";
import TableRBI from "../../../../../../components/TableRBI";
import SectionCard from "../../../../../../components/SectionCard";
import SVGIcon from "../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import {
  CONTACT_INPUT_TYPE_OPTIONS,
  CONTACT_PHONE_INPUT_TYPES,
  COUNTRY_CODE_OPTIONS,
  JOB_OPTIONS,
  POSITION_OPTIONS,
  CONTACT_ADDRESS_OPTIONS,
} from "../../../../../../constants/restructure";

const ModalCreateContact = ({ isOpen, handleCancel, onAddContacts, onOpenChooseModal }) => {
  const [form] = Form.useForm();
  const [criteriaData, setCriteriaData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [tempRow, setTempRow] = useState({});
  const [valueError, setValueError] = useState("");

  const handleSelectContact = (selection) => {
    // Selection can be a single object (legacy) or an array (multi-select)
    const selectedList = Array.isArray(selection) ? selection : [selection];

    if (selectedList.length === 1) {
      const contact = selectedList[0];
      form.setFieldsValue({
        firstName: contact.firstName !== "-" ? contact.firstName : "",
        middleName: contact.middleName !== "-" ? contact.middleName : "",
        lastName: contact.lastName !== "-" ? contact.lastName : "",
        job: contact.job,
        position: contact.position,
      });

      if (contact.criteria) {
        setCriteriaData(contact.criteria.map(c => {
          // Attempt to split if it's a phone type and contains '-'
          const isPhone = ["Phone", "Mobile Phone"].includes(c.inputType);
          let countryCode = "IDN (+62)";
          let valueText = c.value || c.valueText;
          
          if (isPhone && valueText.includes("-")) {
            const parts = valueText.split("-");
            countryCode = parts[0].trim();
            valueText = parts.slice(1).join("-").trim();
          }

          return {
            ...c,
            countryCode,
            valueText
          };
        }));
      } else {
        setCriteriaData([]);
      }
    } else if (selectedList.length > 1) {
      // If multiple, send directly to parent and close modals
      onAddContacts(selectedList);
      handleCancel();
    }
  };

  const handleCreateCriteria = () => {
    setEditingKey("new");
    setTempRow({ key: "new", type: null, inputType: null, countryCode: "IDN (+62)", valueText: "" });
    setValueError("");
  };

  const handleSaveCriteria = () => {
    if (!tempRow.type || !tempRow.inputType) {
      message.error("Type and Input Type are required!");
      return;
    }
    if (!tempRow.valueText) {
      setValueError("Value Text is required!");
      return;
    }

    if (editingKey === "new") {
      setCriteriaData([...criteriaData, { ...tempRow, key: Date.now() }]);
    } else {
      setCriteriaData(criteriaData.map((item) => (item.key === editingKey ? tempRow : item)));
    }
    setEditingKey("");
  };

  const criteriaColumns = [
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
              options={[
                { label: "Phone", value: "Phone" },
                { label: "Email", value: "Email" },
                { label: "PGN Mobile (Phone)", value: "PGN Mobile (Phone)" },
              ]}
            />
          );
        }
        return text;
      },
    },
    {
      title: "INPUT TYPE",
      dataIndex: "inputType",
      width: 150,
      render: (text, record) => {
        if (record.key === editingKey) {
          return (
            <SelectComponent
              placeholder="Select Type"
              value={tempRow.inputType}
              onChange={(val) => setTempRow({ ...tempRow, inputType: val })}
              options={CONTACT_INPUT_TYPE_OPTIONS}
            />
          );
        }
        return text;
      },
    },
    {
      title: "VALUE",
      dataIndex: "value",
      width: 500,
      render: (_, record) => {
        if (record.key === editingKey) {
          const isPhone = CONTACT_PHONE_INPUT_TYPES.includes(tempRow.inputType);
          return (
            <div className="p-1">
              <div className="flex gap-2">
                {isPhone && (
                  <div style={{ width: "120px" }}>
                    <SelectComponent
                      placeholder="(value)"
                      value={tempRow.countryCode}
                      onChange={(val) => setTempRow({ ...tempRow, countryCode: val })}
                      options={COUNTRY_CODE_OPTIONS}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    placeholder="(value)"
                    value={tempRow.valueText}
                    status={valueError ? "error" : ""}
                    inputMode={isPhone ? "numeric" : "text"}
                    onChange={(e) => {
                      const val = isPhone
                        ? e.target.value.replace(/\D/g, "")
                        : e.target.value;
                      setTempRow({ ...tempRow, valueText: val });
                      setValueError("");
                    }}
                  />
                </div>
              </div>
              {valueError && <p style={{ color: "#ff4d4f", fontSize: "12px", margin: "4px 0 0" }}>{valueError}</p>}
            </div>
          );
        }
        const isPhone = CONTACT_PHONE_INPUT_TYPES.includes(record.inputType);
        return isPhone && record.countryCode 
          ? `${record.countryCode}-${record.valueText}` 
          : record.valueText;
      },
    },
    {
      title: "ACTION",
      align: "center",
      width: 150,
      render: (_, record) => {
        if (record.key === editingKey) {
          return (
            <div className="flex gap-1 justify-center">
              <Button 
                size="small" 
                onClick={() => setEditingKey("")}
                style={{ height: "24px", fontSize: "11px", padding: "0 8px", borderRadius: "4px" }}
              >
                cancel
              </Button>
              <Button 
                size="small" 
                type="primary" 
                onClick={handleSaveCriteria}
                style={{ height: "24px", fontSize: "11px", padding: "0 8px", borderRadius: "4px", backgroundColor: "#0075BF", borderColor: "#0075BF" }}
              >
                save
              </Button>
            </div>
          );
        }
        return (
          <div className="flex gap-4 justify-center py-2">
            <EditOutlined 
              style={{ fontSize: "20px", color: "#0075BF", cursor: "pointer" }}
              onClick={() => { setTempRow({ ...record }); setEditingKey(record.key); }} 
            />
            <DeleteOutlined 
              style={{ fontSize: "20px", color: "#BE3036", cursor: "pointer" }} 
              onClick={() => setCriteriaData(criteriaData.filter((i) => i.key !== record.key))} 
            />
          </div>
        );
      },
    },
  ];

  const tableDataCriteria = editingKey === "new" ? [...criteriaData, tempRow] : criteriaData;

  const handleOnCancel = () => {
    form.resetFields();
    setCriteriaData([]);
    setEditingKey("");
    handleCancel();
  };

  return (
    <ModalCustom
      isOpen={isOpen}
      handleCancel={handleOnCancel}
      header="CREATE NEW CONTACT"
      width={1300}
      footer={
        <div className="flex w-full justify-between items-center p-4 border-t border-[#D6E1F0]">
          <ButtonComponent
            onClick={handleOnCancel}
            className="!border-[#0075BF] !text-[#0075BF] px-8"
          >
            Cancel
          </ButtonComponent>
          <div className="flex gap-3">
            <Button
              icon={<SVGIcon name="IconButtonClear" width={18} />}
              onClick={() => {
                form.resetFields();
                setCriteriaData([]);
              }}
              style={{
                backgroundColor: "#BE3036",
                borderColor: "#BE3036",
                color: "#fff",
                borderRadius: "6px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                fontSize: "12px",
              }}
            >
              Clear Data
            </Button>
            <Button
              type="primary"
              onClick={() => {
                form.validateFields().then((values) => {
                  const newContact = {
                    key: Date.now(),
                    isPrimary: values.isPrimary || false,
                    cpName: [values.firstName, values.middleName, values.lastName]
                      .filter(Boolean)
                      .join(" "),
                    job: values.job,
                    position: values.position,
                    address: values.contactAddress,
                    details: criteriaData.map((c) => ({
                      ...c,
                      type: c.type,
                      value: c.countryCode ? `${c.countryCode}-${c.valueText}` : c.valueText,
                    })),
                  };
                  onAddContacts([newContact]);
                  form.resetFields();
                  setCriteriaData([]);
                  handleCancel();
                }).catch(() => {});
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
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <Form layout="vertical" form={form} className="modal-contact-form">
          <SectionCard title="CONTACT INFORMATION">
            <div className="flex justify-end mb-2">
              <Button 
                type="primary" 
                className="rounded-md"
                onClick={onOpenChooseModal}
              >
                Choose Contact
              </Button>
            </div>
            <div className="grid grid-cols-5 gap-x-3 gap-y-1 font-normal text-black">
              <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}><Input placeholder="Input.." /></Form.Item>
              <Form.Item label="Middle Name" name="middleName"><Input placeholder="Input.." /></Form.Item>
              <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}><Input placeholder="Input.." /></Form.Item>
              <Form.Item label="Job" name="job" rules={[{ required: true }]}>
                <SelectComponent placeholder="Select Job" options={JOB_OPTIONS} />
              </Form.Item>
              <Form.Item label="Position" name="position" rules={[{ required: true }]}>
                <SelectComponent placeholder="Select Position" options={POSITION_OPTIONS} />
              </Form.Item>
              
              <Form.Item label="Contact Address" name="contactAddress" rules={[{ required: true }]} className="col-span-1">
                <SelectComponent placeholder="Select Contact Address" options={CONTACT_ADDRESS_OPTIONS} />
              </Form.Item>
              <Form.Item label="Contact Address Additional Note" name="additionalNote" rules={[{ required: true }]} className="col-span-1">
                <Input placeholder="Input..." />
              </Form.Item>
              <div className="col-span-2" /> {/* Spacer */}

              <div className="col-span-5 mb-2">
                <Form.Item name="isPrimary" valuePropName="checked" className="mb-0">
                  <Checkbox>
                    <div className="flex flex-col -mt-0.5">
                      <span className="font-semibold text-sm leading-tight">Primary Contact</span>
                      <span className="text-[11px] text-gray-400 font-normal leading-tight">
                        Click or tap this checkbox if data is a branch
                      </span>
                    </div>
                  </Checkbox>
                </Form.Item>
              </div>

              <div className="col-span-5">
                <Form.Item label="Description" name="description" rules={[{ required: true }]}><Input.TextArea rows={3} placeholder="Input.." /></Form.Item>
              </div>
            </div>
          </SectionCard>

          <div className="mt-4">
            <SectionCard title="CRITERIA INFORMATION">
              <div className="flex justify-end mb-4">
                <Button type="primary" className="rounded-md" onClick={handleCreateCriteria}>+ Create</Button>
              </div>
              <TableRBI
                idTable="criteria-table-modal"
                columns={criteriaColumns}
                dataSource={tableDataCriteria}
                useSelect={true}
                showAdvanceSearch={true}
                showSearchBar={true}
                usePagination={false}
              />
              <div className="flex justify-end gap-4 mt-2 text-[11px] text-gray-400 font-normal">
                <span>Showing {tableDataCriteria.length} of {tableDataCriteria.length} entries</span>
                <span className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  All data showed
                </span>
              </div>
            </SectionCard>
          </div>
        </Form>
      </div>
    </ModalCustom>
  );
};

export default ModalCreateContact;
