import TablePaginationNew from "../TablePaginationNew";
import { ModalConfirm } from "./ModalPopUp";

const ModalConfirmationApproval = ({
  dataSource = [],
  columns = [],
  isOpen = false,
  handleOk = () => {},
  handleCancel = () => {},
  page = 1,
  pageSize = 10,
  handleChangeDetail = () => {},
}) => {
  return (
    <ModalConfirm
      isOpen={isOpen}
      handleCancel={handleCancel}
      handleOk={handleOk}
      width={1000}
    >
      <TablePaginationNew
        dataSource={dataSource}
        pageSize={pageSize}
        totalData={dataSource.length}
        columns={columns}
        onChange={handleChangeDetail}
        current={page}
      />
    </ModalConfirm>
  )
}

export default ModalConfirmationApproval;
