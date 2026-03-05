import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import CardContainer from "../../../../../../components/CardContainer";
import TableRBI from "../../../../../../components/TableRBI";
import ButtonComponent from "../../../../../../components/ButtonComponent";

const MutationInfoSection = ({
  mutationDataInfo,
  columnMutation,
  setIsModalMutationOpen
}) => {
  return (
    <CardContainer header="MUTATION INFORMATION">
      <div className="flex justify-end mb-4">
        <ButtonComponent type="submit" icon={<PlusOutlined />} onClick={() => setIsModalMutationOpen(true)}>
          Create
        </ButtonComponent>
      </div>
      <TableRBI
          dataSource={mutationDataInfo}
          columns={columnMutation(1, 10)}
          current={1}
          pageSize={10}
          totalData={mutationDataInfo.length}
          showExport={false}
          showAdvanceSearch={true}
          showSearchBar={true}
      />
    </CardContainer>
  );
};

export default MutationInfoSection;
