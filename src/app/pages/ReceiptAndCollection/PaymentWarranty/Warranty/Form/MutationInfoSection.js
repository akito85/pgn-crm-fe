import React from "react";
import { PlusOutlined } from "@ant-design/icons";
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
  isApprover = false
}) => {
  return (
    <CardContainer header="MUTATION INFORMATION">
      <div className="flex justify-end mb-4">
        {!disabled && !isApprover && (
          <ButtonComponent type="submit" icon={<PlusOutlined />} onClick={() => setIsModalMutationOpen(true)}>
            Create
          </ButtonComponent>
        )}
      </div>
      <TableRBI
          idTable="table-mutation"
          dataSource={mutationDataInfo}
          columns={columnMutation(1, 10, null, null, "", () => {}, {}, handleEdit, handleDelete, isCreate, disabled, isApprover)}
          current={1}
          pageSize={10}
          totalData={mutationDataInfo.length}
          showExport={false}
          showAdvanceSearch={true}
          showSearchBar={true}
          tableScrolled={{ x: 1200, y: 525 }}
      />
    </CardContainer>
  );
};

export default MutationInfoSection;
