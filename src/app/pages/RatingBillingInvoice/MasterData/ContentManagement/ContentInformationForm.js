import React, { useState, useRef, useEffect } from "react";
import { Form, Input, Tabs } from "antd";
import Editor, {
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnStrikeThrough,
  BtnNumberedList,
  BtnBulletList,
  BtnLink,
  BtnUndo,
  BtnRedo,
  BtnStyles,
  Separator,
  Toolbar,
  EditorProvider,
} from "react-simple-wysiwyg";
import BaseContainer from "../../../../../components/BaseContainer";
import SVGIcon from "../../../../../assets/Icon/index";

const { TabPane } = Tabs;

const ContentInformationForm = ({ form, type, status, statusApproval }) => {
  const [activeTab, setActiveTab] = useState("content");
  const [bodyContent, setBodyContent] = useState("");
  const editorRef = useRef(null);

  const variables = [
    { label: "invoiceNumber", value: "{invoiceNumber}" },
    { label: "customerName", value: "{customerName}" },
    { label: "customerAddress", value: "{customerAddress}" },
    { label: "linkPetunjuk", value: "{linkPetunjuk}" },
    { label: "pwBalance", value: "{pwBalance}" },
    { label: "totalAmountEqvUsd", value: "{totalAmountEqvUsd}" },
    { label: "dueDate", value: "{dueDate}" },
    { label: "pwRule", value: "{pwRule}" },
    { label: "billingPeriod", value: "{billingPeriod}" },
  ];

  useEffect(() => {
    const formBody = form.getFieldValue("body");
    if (formBody && formBody !== bodyContent) {
      setBodyContent(formBody);
    }
  }, [form]);

  const handleBodyChange = (e) => {
    const content = e.target.value;
    setBodyContent(content);
    form.setFieldsValue({ body: content });
  };

  // Insert variable ke posisi cursor
  const handleInsertVariable = (variable) => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        // Buat element span untuk variable dengan styling
        const span = document.createElement('span');
        span.style.backgroundColor = '#fef3c7';
        span.style.color = '#92400e';
        span.style.padding = '2px 6px';
        span.style.borderRadius = '3px';
        span.style.fontWeight = '500';
        span.textContent = variable.value;
        
        // Insert span di posisi cursor
        range.deleteContents();
        range.insertNode(span);
        
        // Pindahkan cursor setelah variable
        range.setStartAfter(span);
        range.setEndAfter(span);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Update content
        const newContent = editorRef.current.innerHTML;
        setBodyContent(newContent);
        form.setFieldsValue({ body: newContent });
      }
    }
  };

  return (
    <BaseContainer header={"Content Information"}>
      <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-4">
        <TabPane tab="Content" key="content">
          <div className="grid grid-cols-1 gap-4">
            {/* Subject Field */}
            <Form.Item
              label={
                <span className="font-medium">
                  Subject <span className="text-red-500">*</span>
                </span>
              }
              name="subject"
              rules={[
                {
                  required: true,
                  message: "Please input subject!",
                },
              ]}
            >
              <Input
                placeholder="Billing Suvidha {billingPeriod}: {customerName}: {customerNumber}"
                disabled={status === "view" || statusApproval === "view"}
                className="rounded-md"
                size="large"
              />
            </Form.Item>

            {/* Body Field with Rich Text Editor and Variable Sidebar */}
            <div className="flex gap-4">
              {/* Rich Text Editor with Custom Toolbar */}
              <div className="flex-1">
                <Form.Item
                  label={
                    <span className="font-medium">
                      Body <span className="text-red-500">*</span>
                    </span>
                  }
                  name="body"
                  rules={[
                    {
                      required: true,
                      message: "Please input body content!",
                    },
                  ]}
                >
                  <EditorProvider>
                    <Editor
                      value={bodyContent}
                      onChange={handleBodyChange}
                      disabled={status === "view" || statusApproval === "view"}
                      containerProps={{
                        style: {
                          minHeight: "400px",
                          border: "1px solid #d9d9d9",
                          borderRadius: "6px",
                          overflow: "hidden",
                        }
                      }}
                      style={{
                        minHeight: "350px",
                        maxHeight: "500px",
                        overflowY: "auto",
                      }}
                      placeholder="Start typing your content here..."
                      ref={editorRef}
                    >
                      <Toolbar>
                        <BtnUndo />
                        <BtnRedo />
                        <Separator />
                        <BtnBold />
                        <BtnItalic />
                        <BtnUnderline />
                        <BtnStrikeThrough />
                        <Separator />
                        <BtnNumberedList />
                        <BtnBulletList />
                        <Separator />
                        <BtnLink />
                        <Separator />
                        <BtnStyles />
                      </Toolbar>
                    </Editor>
                  </EditorProvider>
                </Form.Item>

                {/* Helper text */}
                <div className="text-xs text-gray-500 mt-2 space-y-1">
                  <p>
                    1. Informasi tagihan PGN dapat diakses di aplikasi PGN Mobile
                    atau dapat diunduh melalui tagihan PGN.
                  </p>
                  <p>
                    2. Apabila status tagihan pada saat jatuh tempo belum terbayar,
                    maka Anda dapat melakukan pembayaran tagihan melalui channel pembayaran yang tersedia.
                  </p>
                </div>
              </div>

              {/* Variable Sidebar - FIXED STYLING */}
              <div className="w-64 bg-blue-600 rounded-lg shadow-lg overflow-hidden flex flex-col" style={{ height: 'fit-content' }}>
                {/* Header */}
                <div className="bg-blue-600 px-4 py-3 flex items-center justify-between border-b border-blue-500">
                  <h3 className="font-bold text-sm text-white uppercase tracking-wide">
                    VARIABLE
                  </h3>
                  <button 
                    type="button"
                    className="bg-blue-700 hover:bg-blue-800 rounded-full p-1.5 transition-colors"
                  >
                    <SVGIcon name="IconInfo" width={14} className="text-white" />
                  </button>
                </div>

                {/* Variable List */}
                <div className="bg-white p-3 space-y-1.5 max-h-96 overflow-y-auto variable-scrollbar">
                  {variables.map((variable, index) => (
                    <button
                      key={variable.value}
                      type="button"
                      onClick={() => handleInsertVariable(variable)}
                      disabled={status === "view" || statusApproval === "view"}
                      className={`
                        w-full text-left px-3 py-2.5 text-sm font-normal
                        transition-colors duration-150
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${index % 2 === 0 
                          ? 'bg-blue-50 hover:bg-blue-100' 
                          : 'bg-white hover:bg-blue-50'
                        }
                        text-gray-700 hover:text-blue-600
                        rounded border border-transparent hover:border-blue-200
                      `}
                    >
                      {variable.label}
                    </button>
                  ))}
                </div>

                {/* Footer Info */}
                <div className="bg-blue-600 px-4 py-3 border-t border-blue-500">
                  <p className="text-xs text-white leading-relaxed opacity-90">
                    Click on a variable to insert it at cursor position in the editor
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabPane>

        <TabPane tab="Criteria" key="criteria">
          <div className="p-8 text-center text-gray-500">
            <div className="max-w-md mx-auto">
              <p className="text-base font-medium mb-2">
                Criteria configuration will be displayed here
              </p>
              <p className="text-sm">
                Similar to BillingBucket criteria table
              </p>
            </div>
          </div>
        </TabPane>
      </Tabs>

      <style jsx>{`
        /* Variable Sidebar Scrollbar */
        .variable-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .variable-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        
        .variable-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        
        .variable-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Custom Editor Styling */
        :global(.rsw-toolbar) {
          background: #fafafa;
          border-bottom: 1px solid #d9d9d9;
          padding: 8px;
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }

        :global(.rsw-btn) {
          padding: 6px 10px;
          border: 1px solid #d9d9d9;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }

        :global(.rsw-btn:hover) {
          background: #e6f7ff;
          border-color: #1890ff;
        }

        :global(.rsw-btn[data-active="true"]) {
          background: #1890ff;
          color: white;
          border-color: #1890ff;
        }

        :global(.rsw-separator) {
          width: 1px;
          background: #d9d9d9;
          margin: 0 4px;
        }

        :global(.rsw-ce) {
          padding: 12px;
          min-height: 350px;
          outline: none;
        }

        :global(.rsw-ce:focus) {
          outline: none;
        }

        /* List styling fix */
        :global(.rsw-ce ul) {
          list-style: disc;
          padding-left: 2em;
          margin: 0.5em 0;
        }

        :global(.rsw-ce ol) {
          list-style: decimal;
          padding-left: 2em;
          margin: 0.5em 0;
        }

        :global(.rsw-ce li) {
          margin: 0.25em 0;
        }

        /* Link styling */
        :global(.rsw-ce a) {
          color: #1890ff;
          text-decoration: underline;
        }

        :global(.rsw-ce a:hover) {
          color: #40a9ff;
        }

        /* Dropdown styles */
        :global(.rsw-dd) {
          padding: 6px 10px;
          border: 1px solid #d9d9d9;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        :global(.rsw-dd:hover) {
          background: #e6f7ff;
          border-color: #1890ff;
        }
      `}</style>
    </BaseContainer>
  );
};

export default ContentInformationForm;