import React, { useEffect, useRef, useState } from "react";
import { Input } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TablePagination from "../../../../../../components/TablePagination";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import ColumnSettings from "../../../../../../components/ColumnSettings/ColumnSettings";
import SVGIcon from "../../../../../../assets/Icon/index";
import { columnVAAccount } from "./TableVAAccount";
import { getVAAccountList, approveVaActivation } from "../../../../../../redux/slices/receipt_collection/bankSlice";
import ModalApprovalActivation from "../ModalApprovalActivation";
import ModalConfirmApprovalActivation from "../ModalConfirmApprovalActivation";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../../routes/Receipt&Collection/rc_routes";

const FunctionalTableVAAccount = ({ id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dataVAAccount } = useSelector((state) => state.bank);
  const [approveLoading, setApproveLoading] = useState(false);

  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchContent, setSearchContent] = useState("");
  const [optionSelectedCol, setOptionSelectedCol] = useState([]);
  const [fixedColumns, setFixedColumns] = useState({ left: [], right: [] });

  // Approval modal state
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [approvalSelectedRows, setApprovalSelectedRows] = useState([]);
  const [approvalAttachment, setApprovalAttachment] = useState([]);

  const columns = columnVAAccount(
    page,
    pageSize,
    searchInput,
    searchedColumn,
    searchText,
    (selectedKeys, confirm, dataIndex) => {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
      setSearch((prev) => ({ ...prev, [dataIndex]: selectedKeys[0] }));
    }
  );

  const visibleColumns = columns.filter(
    (col) => !optionSelectedCol.includes(col.key)
  );

  useEffect(() => {
    if (!id) return;
    let tempSearch = "";
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const tempSearchText = search[dataIndex];
        if (tempSearchText) {
          tempSearch += `${dataIndex}~${tempSearchText},`;
        }
      }
    }
    if (searchContent) {
      tempSearch += `searchContent~${searchContent},`;
    }
    tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    dispatch(
      getVAAccountList({
        id,
        page,
        pageSize,
        sort,
        search: tempSearch,
      })
    );
  }, [id, page, pageSize, sort, search, searchContent, dispatch]);

  const handleChange = (p, ps) => {
    setPage(p);
    setPageSize(ps);
  };

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  return (
    <>
      <div className="my-3">
        <div className="flex justify-between items-center mb-3 gap-2">
          <div className="flex items-center gap-2">
            <ColumnSettings
              columns={columns}
              hiddenColumns={optionSelectedCol}
              onHiddenColumnsChange={setOptionSelectedCol}
              fixedColumns={fixedColumns}
              onFixedColumnsChange={setFixedColumns}
              buttonText="Column Settings"
              buttonStyle={{ height: "32px", fontSize: "12px" }}
            />
          </div>
          <div className="flex items-center gap-2">
            <ButtonComponent
              type="submit"
              onClick={() => setApprovalModalOpen(true)}
              icon={<SVGIcon name="IconApproval" width={16} />}
            >
              Approval
            </ButtonComponent>
            <ButtonComponent
              type="submit"
              onClick={() => {}}
              icon={<SVGIcon name="IconDownload" width={16} />}
            >
              Download
            </ButtonComponent>
            <ButtonComponent
              type="default"
              onClick={() => {}}
              icon={<FilterOutlined style={{ fontSize: "14px" }} />}
            >
              Advanced Search
            </ButtonComponent>
            <Input
              placeholder="Search Content"
              style={{ width: 200, height: 32, fontSize: 12 }}
              value={searchContent}
              onChange={(e) => {
                setSearchContent(e.target.value);
                setPage(1);
              }}
              allowClear
            />
          </div>
        </div>
        <TablePagination
          dataSource={dataVAAccount?.result}
          pageSize={pageSize}
          columns={visibleColumns}
          current={page}
          onChange={handleChange}
          onSizeChanger={handleChange}
          totalData={dataVAAccount?.page?.totalElements}
          onSort={onSort}
          tableScrolled={{ x: "max-content" }}
        />
      </div>

      <ModalApprovalActivation
        isOpen={approvalModalOpen}
        onCancel={() => setApprovalModalOpen(false)}
        onNext={(rows, attachments) => {
          setApprovalSelectedRows(rows);
          setApprovalAttachment(attachments);
          setApprovalModalOpen(false);
          setConfirmModalOpen(true);
        }}
        dataVAAccount={dataVAAccount}
      />

      <ModalConfirmApprovalActivation
        isOpen={confirmModalOpen}
        onCancel={() => setConfirmModalOpen(false)}
        loading={approveLoading}
        onConfirm={() => {
          const vaNumbers = approvalSelectedRows.map((r) => r.vaNumber);
          const attachments = approvalAttachment.map((a) => ({
            fileName: a.fileName,
            fileSize: a.size ?? 0,
            fileCategoryId: a.fileCategoryId,
            fileType: a.fileType,
            base64: a.base64,
          }));
          setApproveLoading(true);
          dispatch(approveVaActivation({ bankId: id, vaNumbers, attachments }))
            .unwrap()
            .then(() => {
              setConfirmModalOpen(false);
              setApprovalSelectedRows([]);
              setApprovalAttachment([]);
              dispatch(getVAAccountList({ id, page: 1, pageSize, sort, search: "" }));
              navigate(RECEIPT_AND_COLLECTION_ROUTES.DETAIL_MASTER_BANK, {
                state: { id },
              });
            })
            .finally(() => setApproveLoading(false));
        }}
        selectedRows={approvalSelectedRows}
        listAttachment={approvalAttachment}
      />
    </>
  );
};

export default FunctionalTableVAAccount;
