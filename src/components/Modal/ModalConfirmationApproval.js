import TablePaginationNew from "../TablePaginationNew";
import { ModalConfirm } from "./ModalPopUp";

const ModalConfirmationApproval = ({
  dataSource = [],
  columns = [],
  isOpen = false,
  setIsOpen = (state) => {},
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleChangeDetail = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  return (
    <ModalConfirm
      isOpen={isOpen}
      handleCancel={setIsOpen(false)}
      handleOk={setIsOpen(false)}
      width={400}
    >
      <TablePaginationNew
        dataSource={dataSource}
        pageSize={10}
        totalData={dataSource.length}
        columns={columns}
        onChange={handleChangeDetail}
        current={page}
      />
    </ModalConfirm>
  )
}

export default ModalConfirmationApproval;
