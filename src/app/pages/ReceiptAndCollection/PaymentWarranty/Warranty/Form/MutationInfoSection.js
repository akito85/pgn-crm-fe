import React from "react";
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
  const currentPage = mutationPage || 1;
  const currentPageSize = mutationPageSize || 10;
  const totalData = mutationTotalData !== undefined ? mutationTotalData : (mutationDataInfo?.length || 0);

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
            dataSource={mutationDataInfo}
            columns={columnMutation(currentPage, currentPageSize, null, null, "", () => {}, {}, handleEdit, handleDelete, () => {}, () => {}, () => {}, isCreate, disabled, isApprover)}
            current={currentPage}
            pageSize={currentPageSize}
            totalData={totalData}
            onChange={onMutationPageChange}
            showExport={false}
            showAdvanceSearch={true}
            showSearchBar={true}
            tableScrolled={{ x: 1200, y: 525 }}
        />
      </Spin>
    </CardContainer>
  );
};

export default MutationInfoSection;
