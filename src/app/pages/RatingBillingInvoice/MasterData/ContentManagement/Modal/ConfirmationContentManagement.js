// path: src/pages/RatingBillingInvoice/MasterData/ContentManagement/Form/Modal/ConfirmationContentManagement.jsx
import React from "react";
import { Divider } from "antd";
import moment from "moment";
import { dateFormatting } from "../../../../../../utils";

const ConfirmationContentManagement = ({
  // ❌ Hapus: isOpen, handleCancel, handleConfirm (sudah dihandle ModalCustom di parent)
  data,
  selectedHierarchy,
  apiFormat,
  apiCategory,
  apiMedia,
  apiCriteria,
  criteriaValues,
  listDataAppHierDetail,
  listDataCriteria,
  dataOption,
}) => {
  // Helper: Get label from value
  const getFormatLabel = (value) => {
    return apiFormat?.find((item) => item.value === value)?.name || value || "-";
  };

  const getCategoryLabel = (value) => {
    return apiCategory?.find((item) => item.value === value)?.name || value || "-";
  };

  const getMediaLabel = (value) => {
    return apiMedia?.find((item) => item.value === value)?.name || value || "-";
  };

  const getCriteriaLabels = (values) => {
    if (!values || values.length === 0) return "-";
    return values
      .map((val) => {
        const criteria = apiCriteria?.find((item) => item.id === val);
        return criteria?.text || val;
      })
      .join(", ");
  };

  const getApprovalName = (id) => {
    return dataOption?.find((item) => item.value === id)?.name || "-";
  };

  return (
    // ✅ Hanya konten - tidak perlu Modal wrapper karena sudah dibungkus ModalCustom di parent
    <div className="p-4">
      {/* Content Information Section */}
      <div className="mb-4">
        <h3 className="text-base font-semibold mb-3 text-blue-600 uppercase">
          Content Information
        </h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Name</p>
            <p className="font-medium text-sm">{data?.name || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Format</p>
            <p className="font-medium text-sm">{getFormatLabel(data?.format)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Category</p>
            <p className="font-medium text-sm">{getCategoryLabel(data?.category)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Media</p>
            <p className="font-medium text-sm">{getMediaLabel(data?.media)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Start Date</p>
            <p className="font-medium text-sm">
              {data?.startDate
                ? moment(data?.startDate).format(dateFormatting.date)
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">End Date</p>
            <p className="font-medium text-sm">
              {data?.endDate
                ? moment(data?.endDate).format(dateFormatting.date)
                : "-"}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-500 mb-1">Criteria</p>
            <p className="font-medium text-sm">{getCriteriaLabels(criteriaValues)}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-500 mb-1">Description</p>
            <p className="font-medium text-sm">{data?.description || "-"}</p>
          </div>
        </div>
      </div>

      <Divider className="my-3" />

      {/* Content Detail Section */}
      <div className="mb-4">
        <h3 className="text-base font-semibold mb-3 text-blue-600 uppercase">
          Content Detail
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Subject</p>
            <p className="font-medium text-sm">{data?.subject || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Body</p>
            {data?.body ? (
              <div
                className="text-sm font-medium p-3 bg-gray-50 rounded border border-gray-200 max-h-40 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: data.body }}
              />
            ) : (
              <p className="font-medium text-sm">-</p>
            )}
          </div>
        </div>
      </div>

      <Divider className="my-3" />

      {/* Criteria Data Section */}
      {listDataCriteria && listDataCriteria.length > 0 && (
        <>
          <div className="mb-4">
            <h3 className="text-base font-semibold mb-3 text-blue-600 uppercase">
              Criteria Data
            </h3>
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <p className="text-sm text-gray-600">
                Total Records:{" "}
                <span className="font-semibold text-gray-800">
                  {listDataCriteria.length}
                </span>
              </p>
            </div>
          </div>
          <Divider className="my-3" />
        </>
      )}

      {/* Approval Information Section */}
      <div className="mb-2">
        <h3 className="text-base font-semibold mb-3 text-blue-600 uppercase">
          Approval Information
        </h3>
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">Approval Hierarchy</p>
          <p className="font-medium text-sm">{getApprovalName(selectedHierarchy)}</p>
        </div>

        {listDataAppHierDetail && listDataAppHierDetail.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-2">Approval Levels</p>
            <div className="space-y-2">
              {listDataAppHierDetail.map((level, index) => (
                <div
                  key={index}
                  className="p-2 bg-gray-50 rounded border border-gray-200"
                >
                  <p className="text-sm font-medium">
                    Level {level.level}: {level.levelName}
                  </p>
                  {level.employeeDetail && level.employeeDetail.length > 0 && (
                    <p className="text-xs text-gray-600 mt-1">
                      Approvers:{" "}
                      {level.employeeDetail.map((emp) => emp.employeeName).join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmationContentManagement;