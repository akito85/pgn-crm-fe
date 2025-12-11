// path: src/pages/RatingBillingInvoice/MasterData/ContentManagement/Form/Modal/ConfirmationContentManagement.jsx
import React from "react";
import { Modal, Divider } from "antd";
import moment from "moment";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { dateFormatting } from "../../../../../../utils";

const ConfirmationContentManagement = ({
  isOpen,
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
  handleCancel,
  handleConfirm,
}) => {
  // Get label from value
  const getFormatLabel = (value) => {
    return apiFormat?.find((item) => item.value === value)?.name || value;
  };

  const getCategoryLabel = (value) => {
    return apiCategory?.find((item) => item.value === value)?.name || value;
  };

  const getMediaLabel = (value) => {
    return apiMedia?.find((item) => item.value === value)?.name || value;
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
    <Modal
      open={isOpen}
      onCancel={handleCancel}
      width={800}
      footer={null}
      centered
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Confirmation
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Are you sure you want to submit this content management?
        </p>

        <Divider />

        {/* Content Information Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">
            Content Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{data?.name || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Format</p>
              <p className="font-medium">{getFormatLabel(data?.format)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium">{getCategoryLabel(data?.category)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Media</p>
              <p className="font-medium">{getMediaLabel(data?.media)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="font-medium">
                {data?.startDate
                  ? moment(data?.startDate).format(dateFormatting.dateFormal)
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">End Date</p>
              <p className="font-medium">
                {data?.endDate
                  ? moment(data?.endDate).format(dateFormatting.dateFormal)
                  : "-"}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Criteria</p>
              <p className="font-medium">
                {getCriteriaLabels(criteriaValues)}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Description</p>
              <p className="font-medium">{data?.description || "-"}</p>
            </div>
          </div>
        </div>

        <Divider />

        {/* Content Detail Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">
            Content Detail
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Subject</p>
              <p className="font-medium">{data?.subject || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Body</p>
              <div
                className="font-medium p-3 bg-gray-50 rounded border border-gray-200 max-h-40 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: data?.body || "-" }}
              />
            </div>
          </div>
        </div>

        <Divider />

        {/* Criteria Data Section */}
        {listDataCriteria && listDataCriteria.length > 0 && (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-600">
                Criteria Data
              </h3>
              <p className="text-sm text-gray-600">
                Total Records: {listDataCriteria.length}
              </p>
            </div>
            <Divider />
          </>
        )}

        {/* Approval Information Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">
            Approval Information
          </h3>
          <div>
            <p className="text-sm text-gray-500">Approval Hierarchy</p>
            <p className="font-medium">
              {getApprovalName(selectedHierarchy)}
            </p>
          </div>
          {listDataAppHierDetail && listDataAppHierDetail.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-500 mb-2">Approval Levels</p>
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
                        {level.employeeDetail
                          .map((emp) => emp.employeeName)
                          .join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Divider />

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <ButtonComponent type="default" onClick={handleCancel}>
            Cancel
          </ButtonComponent>
          <ButtonComponent type="primary" onClick={handleConfirm}>
            Confirm & Submit
          </ButtonComponent>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationContentManagement;