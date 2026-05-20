import React, { useState, useMemo } from "react";
import PropTypes from 'prop-types';
import { PlusOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import CardContainer from "../../../../../../components/CardContainer";
import TableRBI from "../../../../../../components/TableRBI";
import ButtonComponent from "../../../../../../components/ButtonComponent";

const MutationInfoSection = ({
  mutationDataInfo,
  columnMutation,
  setIsModalMutationOpen,
  handleEdit,
  handleDelete,
  isCreate = false,
  disabled = false,
  isWaitingApproval = false,
  isApprover = false,
  mutationTotalData,
  mutationPage = 1,
  mutationPageSize = 10,
  onMutationPageChange,
  loadingMutation = false,
}) => {
  const [currentPage, setCurrentPage] = useState(mutationPage || 1);
  const [currentPageSize, setCurrentPageSize] = useState(mutationPageSize || 10);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * currentPageSize;
    const end = start + currentPageSize;
    return (mutationDataInfo || []).slice(start, end);
  }, [mutationDataInfo, currentPage, currentPageSize]);

  const totalData = mutationTotalData !== undefined ? mutationTotalData : (mutationDataInfo?.length || 0);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setCurrentPageSize(pageSize);
    if (onMutationPageChange) {
      onMutationPageChange(page, pageSize);
    }
  };

  return (
    <CardContainer header="MUTATION INFORMATION">
      <div className="flex justify-end mb-4">
        {!disabled && !isApprover && !isWaitingApproval && (
          <ButtonComponent type="submit" icon={<PlusOutlined />} onClick={() => setIsModalMutationOpen(true)}>
            Create
          </ButtonComponent>
        )}
      </div>
      <Spin spinning={loadingMutation}>
        <TableRBI
            idTable="table-mutation"
            dataSource={paginatedData}
            columns={columnMutation(currentPage, currentPageSize, null, null, "", () => {}, {}, handleEdit, handleDelete, () => {}, () => {}, () => {}, isCreate, disabled, isApprover, mutationDataInfo || [])}
            current={currentPage}
            pageSize={currentPageSize}
            totalData={totalData}
            onChange={handlePageChange}
            showExport={false}
            showAdvanceSearch={true}
            showSearchBar={true}
            tableScrolled={{ x: 1200, y: 525 }}
        />
      </Spin>
    </CardContainer>
  );
};

MutationInfoSection.propTypes = {
  mutationDataInfo: PropTypes.array,
  columnMutation: PropTypes.func.isRequired,
  setIsModalMutationOpen: PropTypes.func.isRequired,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  isCreate: PropTypes.bool,
  disabled: PropTypes.bool,
  isWaitingApproval: PropTypes.bool,
  isApprover: PropTypes.bool,
  mutationTotalData: PropTypes.number,
  mutationPage: PropTypes.number,
  mutationPageSize: PropTypes.number,
  onMutationPageChange: PropTypes.func,
  loadingMutation: PropTypes.bool,
};

export default MutationInfoSection;
