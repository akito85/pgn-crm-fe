import React, { useState, useRef, useEffect } from "react";
import { Input } from "antd";
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
import SVGIcon from "../../../../../assets/Icon/index";

const ContentInformationForm = ({ 
  form, 
  type, 
  status, 
  statusApproval,
  // ✅ Terima props untuk subject & body
  subjectValue,
  setSubjectValue,
  bodyValue,
  setBodyValue
}) => {
  const [lastFocus, setLastFocus] = useState(null);
  const editorRef = useRef(null);
  const subjectInputRef = useRef(null);

  const variables = [
    { label: "invoiceNumber", value: "[invoiceNumber]" },
    { label: "customerName", value: "[customerName]" },
    { label: "customerAddress", value: "[customerAddress]" },
    { label: "linkPetunjuk", value: "[linkPetunjuk]" },
    { label: "pwBalance", value: "[pwBalance]" },
    { label: "totalAmountEqvUsd", value: "[totalAmountEqvUsd]" },
    { label: "dueDate", value: "[dueDate]" },
    { label: "pwRule", value: "[pwRule]" },
    { label: "billingPeriod", value: "[billingPeriod]" },
  ];

  const handleSubjectChange = (e) => {
    setSubjectValue(e.target.value);
  };

  const handleBodyChange = (e) => {
    setBodyValue(e.target.value);
  };

  const handleInsertVariableToBody = (variable) => {
    const editorEl = editorRef.current;
    if (!editorEl) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      editorEl.focus();
      const textNode = document.createTextNode(variable.value);
      editorEl.appendChild(textNode);
      const range = document.createRange();
      range.setStartAfter(textNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      const range = selection.getRangeAt(0);
      if (!editorEl.contains(range.commonAncestorContainer)) {
        editorEl.focus();
        const textNode = document.createTextNode(variable.value);
        editorEl.appendChild(textNode);
        const r = document.createRange();
        r.setStartAfter(textNode);
        r.collapse(true);
        selection.removeAllRanges();
        selection.addRange(r);
      } else {
        const textNode = document.createTextNode(variable.value);
        range.deleteContents();
        range.insertNode(textNode);
        const newRange = document.createRange();
        newRange.setStartAfter(textNode);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }

    try {
      editorEl.normalize && editorEl.normalize();
    } catch (err) {
      // ignore
    }

    const newContent = editorEl.innerHTML;
    setBodyValue(newContent);
    editorEl.focus();
    setLastFocus("body");
  };

  const handleInsertVariableToSubject = (variable) => {
    const input = subjectInputRef.current?.input;
    if (!input) return;

    const start = typeof input.selectionStart === "number" ? input.selectionStart : 0;
    const end = typeof input.selectionEnd === "number" ? input.selectionEnd : 0;

    const newValue =
      subjectValue.substring(0, start) +
      variable.value +
      subjectValue.substring(end);

    setSubjectValue(newValue);

    setTimeout(() => {
      const newPosition = start + variable.value.length;
      input.setSelectionRange(newPosition, newPosition);
      input.focus();
    }, 0);
    
    setLastFocus("subject");
  };

  const handleInsertVariable = (variable) => {
    if (lastFocus === "subject") {
      handleInsertVariableToSubject(variable);
    } else {
      handleInsertVariableToBody(variable);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Subject Field - TANPA Form.Item */}
      <div>
        <label className="block mb-2">
          <span className="font-medium">Subject</span>
          <span className="text-red-500 ml-1">*</span>
        </label>
        <Input
          ref={subjectInputRef}
          value={subjectValue}
          onChange={handleSubjectChange}
          placeholder="Billing {billingPeriod}: {customerName}: {customerNumber}"
          disabled={status === "view" || statusApproval === "view"}
          className="rounded-md"
          size="large"
          onFocus={() => setLastFocus("subject")}
        />
        {!subjectValue && (
          <div className="text-red-500 text-sm mt-1">Please input subject!</div>
        )}
      </div>

      {/* Body Field - TANPA Form.Item */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-2">
            <span className="font-medium">Body</span>
            <span className="text-red-500 ml-1">*</span>
          </label>
          <EditorProvider>
            <Editor
              value={bodyValue}
              onChange={handleBodyChange}
              disabled={status === "view" || statusApproval === "view"}
              containerProps={{
                style: {
                  minHeight: "400px",
                  border: "1px solid #d9d9d9",
                  borderRadius: "6px",
                  overflow: "hidden",
                },
              }}
              style={{
                minHeight: "350px",
                maxHeight: "500px",
                overflowY: "auto",
              }}
              placeholder="Start typing your content here..."
              ref={editorRef}
              onFocus={() => setLastFocus("body")}
            />
          </EditorProvider>
          {!bodyValue && (
            <div className="text-red-500 text-sm mt-1">Please input body content!</div>
          )}
        </div>

        {/* Variable Sidebar */}
        <div
          className="w-64 bg-blue-600 rounded-lg shadow-lg overflow-hidden flex flex-col"
          style={{ height: "fit-content" }}
        >
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

          <div className="bg-white p-3 space-y-1.5 max-h-96 overflow-y-auto variable-scrollbar">
            {variables.map((variable, index) => (
              <button
                key={variable.value}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleInsertVariable(variable)}
                disabled={status === "view" || statusApproval === "view"}
                className={`
                  w-full text-left px-3 py-2.5 text-sm font-normal
                  transition-colors duration-150
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${index % 2 === 0 ? "bg-blue-50 hover:bg-blue-100" : "bg-white hover:bg-blue-50"}
                  text-gray-700 hover:text-blue-600
                  rounded border border-transparent hover:border-blue-200
                `}
              >
                {variable.label}
              </button>
            ))}
          </div>

          <div className="bg-blue-600 px-4 py-3 border-t border-blue-500">
            <p className="text-xs text-white leading-relaxed opacity-90">
              Click on a variable to insert it at cursor position
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
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
        :global(.rsw-ce a) {
          color: #1890ff;
          text-decoration: underline;
        }
        :global(.rsw-ce a:hover) {
          color: #40a9ff;
        }
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
    </div>
  );
};

export default ContentInformationForm;