import { Badge, Button, Checkbox, Tooltip } from "antd";
import SVGIcon from "../../../../../../../assets/Icon/index";
import { Link, useNavigate } from "react-router-dom";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import { useColumnActionPermission } from "../../../../../../../components/ColumnActionPermission";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import Toolbar from "../../../../../../../components/Toolbar";
import NxTable from "../../../../../../../components/Nx/NxTable";
import { Fragment, useEffect, useMemo, useState } from "react";
import { applyFixedColumns } from "../../../../../../../utils/applyFixedColumns";
import { getPaymentRelationColumns } from "./getPaymentRelationColumns";

const PaymentRelationTable = ({
  data = [],
  idAccount = 0,
  idCustomer = 0,
  totalElement = 0,
  page = 0,
  onSort = () => {},
  rowSelection,
  isApproval = false,
  handleInactivateModal = () => {},
  handleApprovalHistoryModal = () => {},
  handleIsApproval = () => {},
  handleDownload = () => {},
  setIsApproval = () => {},
  handleLoadMore = () => {},
  hasMore = false,
  searchText="",
  search="",
  searchedColumn={},
  searchInput="",
  handleSearch=() => {},
  loading = false 
}) => {
  const navigate = useNavigate();

  const itemGrantAccess = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconButtonDownload" width={20} />}
          type="submit"
          onClick={handleDownload}
        >
          Download List
        </ButtonComponent>
      )
    },
    {
      action: "Approve",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconRequestApproval" width={20} color="#FFF" />}
          type="submit"
          onClick={() => handleIsApproval(true)}
        >
          Approval
        </ButtonComponent>
      )
    },
    {
      action: "Create",
      render: (
        <Link to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_PAYMENT_RELATION} state={{
          idAccount,
          idCustomer,
        }}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={20} />}
            type={"submit"}
            border={false}
          >
            Create Calculation
          </ButtonComponent>
        </Link>
      )
    },
    {
      action: 'View',
      type: 'table',
      render: (r, actionLength, index) => {
        return (
          <Link
            to={ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_PAYMENT_RELATION}
            state={{
              idPr: r.id,
              idAccount,
              idCustomer,
            }}
            key={`table-action-${index}`}
          >
            <Tooltip title="Detail">
              <SVGIcon name="IconDetail" width={20} />
            </Tooltip>
          </Link>
        )
      }
    },
    {
      action: 'Update',
      type: 'table',
      render: (record, actionLength, index) => {
        const isEditable =
          record.statusApproval === "DRAFT" ||
          record.statusApproval === "REJECTED";

        const content = actionLength > 3 ?
          (
            <ButtonComponent
              icon={<SVGIcon name="IconEdit" color={!isEditable ? "#8D91A0" : "#ACC424"} width={20} />}
              border={false}
              disabled={!isEditable}
              onClick={() => navigate(ACCOUNT_MANAGEMENT_ROUTES.UPDATE_PAYMENT_RELATION, {
                state: {
                  idPr: record.id,
                  idAccount,
                  idCustomer,
                }
              })}
            >
              <span className={"text-black ml-3"}>Update</span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Update">
              <SVGIcon
                name="IconEdit"
                width={20}
                color={!isEditable ? "#8D91A0" : "#ACC424"}
                className={!isEditable ? "cursor-not-allowed" : undefined}
                onClick={
                  isEditable ?
                    () => navigate(ACCOUNT_MANAGEMENT_ROUTES.UPDATE_PAYMENT_RELATION, {
                      state: {
                        idPr: record.id,
                        idAccount,
                        idCustomer,
                      }
                    }) :
                    () => {}
                }
              />
            </Tooltip>
          );

        return (
          <Fragment key={`table-action-${index}`}>{content}</Fragment>          
        )
      }
    },
    {
      action: 'Inactivate',
      type: 'table',
      render: (record, actionLength, index) => {
        const isActive = record.status === "ACTIVE";

        const content = actionLength > 3 ?
          (
            <ButtonComponent
              icon={
                <Checkbox
                  className="inactive-check"
                  disabled={isActive ? false : true}
                  checked={isActive ? false : true}
                  style={{ transform: "scale(0.9)" }}
                />
              }
              border={false}
              disabled={!isActive}
              onClick={() => handleInactivateModal(true, record?.id, record?.appHierId, record?.relatedAccountNumber)}
            >
              <span className={"text-black ml-3"}>Inactivate</span>
            </ButtonComponent>
          ) : (
            <Tooltip
              title="Inactivate"
            >
              <Checkbox
                className="inactive-check"
                disabled={isActive ? false : true}
                checked={isActive ? false : true}
                onClick={() => handleInactivateModal(true, record?.id, record?.appHierId, record?.relatedAccountNumber)}
                style={{ transform: "scale(0.9)" }}
              />
            </Tooltip>
          );

        return <Fragment key={`table-action-${index}`}>{content}</Fragment>
      }
    },
    {
      action: 'History',
      type: 'table',
      render: (record, actionLength, index) => {
        const content = (actionLength > 3) ?
          (
            <ButtonComponent
              icon={
                <SVGIcon name="IconLogHistory" color={"#0075bf"} width={20} />
              }
              border={false}
              onClick={() => handleApprovalHistoryModal(true, record?.id)}
            >
              <span className={"text-black ml-3"}>Approval History</span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Approval History">
              <SVGIcon
                name="IconLogHistory"
                color={"#0075bf"}
                width={20}
                onClick={() => handleApprovalHistoryModal(true, record?.id)}
              />
            </Tooltip>
          );

        return <Fragment key={`table-action-${index}`}>{content}</Fragment>
      }
    }
  ];

  const [fixedColumns, setFixedColumns] = useState(() => ({
    statusApproval: "right",
    status: "right",
    action: "right",
  }));

  const actionCols = useColumnActionPermission(["Inactivate", "View", "Update", "History"], itemGrantAccess, "View", "table").map(
    (col) => ({
      ...col,
      width: 70,
      align: "center",
    })
  );

  const baseColumns = useMemo(() =>
    getPaymentRelationColumns(
      search,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  [search, searchText, searchedColumn]);

  const allColumns = useMemo(() => {
    const columnsWithKeys = [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns, actionCols]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  return (
    <div className="flex flex-col gap-y-6">
      {isApproval ? (
        <div className="flex justify-end gap-5 mb-5">
          <ButtonComponent
            type="reject"
            onClick={() => setIsApproval(false)}
          >
            Cancel
          </ButtonComponent>
        </div>
      ) : (
        <Toolbar items={itemGrantAccess} type="detail" />
      )}
      <NxTable
        idTable="payment-relation-table"
        dataSource={data}
        totalData={totalElement}
        current={page}
        tableScrolled={{ y: 400, x: "max-content" }}
        onSort={onSort}
        columns={processedColumns}
        rowSelection={rowSelection}
        usePagination={false}
        useInfiniteScroll={true}
        hasMore={hasMore}
        handleLoadMore={handleLoadMore}
        loadMoreThreshold={20}
        setFixedColumns={setFixedColumns}
        columnDefinitions={columnDefinitions}
        loading={loading}
      />
    </div>
  );
};

export default PaymentRelationTable;
