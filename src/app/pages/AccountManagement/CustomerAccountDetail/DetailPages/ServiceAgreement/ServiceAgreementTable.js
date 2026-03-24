import { Fragment, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Checkbox, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import NxTable from "../../../../../../components/Nx/NxTable";
import { nxApplyFixedColumns } from "../../../../../../utils/Nx/nxApplyFixedColumns";
import { getServiceAgreementColumns } from "./getServiceAgreementColumns";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import SVGIcon from "../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { useColumnActionPermissionAccount } from "../../../ComponentAccount/ColumnActionPermissionAccount";
import { nxGetAccountActions } from "../../../../../../components/Nx/NxGetAccountActions";

const ServiceAgreementTable = ({
    data = [],
    idAccount = 0,
    idCustomer = 0,
    type = "",
    totalElement = 0,
    page = 0,
    onSort = () => { },
    handleOpenDeleteDraft = () => { },
    handleOpenInactivate = () => { },
    handleApprovalHistory = () => { },
    handleLoadMore = () => { },
    hasMore = false,
    searchText = "",
    search = {},
    searchedColumn = "",
    searchInput = null,
    handleSearch = () => { },
    loading = false,
    filteredArray = {},
}) => {
    const navigate = useNavigate();

    const [fixedColumns, setFixedColumns] = useState(() => ({
        right: ["approvalStatus", "status", "action"],
        left: [],
    }));

    // Map standard actions via nxGetAccountActions and add SA-specific actions
    const itemActions = [
        ...nxGetAccountActions({
            handleDelete: handleOpenDeleteDraft,
            handleView: ({ id: idSA }) => {
                navigate(ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_SERVICE_AGREEMENT, {
                    state: { idSA, idAccount, idCustomer, type }
                });
            },
            handleUpdate: (record) => {
                navigate(ACCOUNT_MANAGEMENT_ROUTES.UPDATE_SERVICE_AGREEMENT, {
                    state: {
                        idSa: record.id,
                        idAccount: record.accountId,
                        approvalStatus: record.approvalStatus,
                        status: record.status,
                        saType: record.saType?.value,
                        isMain: record.isMain,
                        saReferenceNumber: record.saReference,
                        idCustomer,
                        type
                    }
                });
            },
            handleApprovalHistory: ({ id }) => handleApprovalHistory(id),
        }).map(actionDef => {
            // Apply custom disable logic for SA Update/Delete that differ slightly from default generic ones
            if (actionDef.action === 'Update') {
                return {
                    ...actionDef,
                    render: (record, actionLength, index) => {
                        const isEditable = record?.approvalStatus !== "WAITING APPROVAL" && record?.status !== "INACTIVE";

                        const linkState = {
                            idSa: record?.id,
                            idAccount: record?.accountId,
                            approvalStatus: record?.approvalStatus,
                            status: record?.status,
                            saType: record?.saType?.value,
                            isMain: record?.isMain,
                            saReferenceNumber: record?.saReference,
                            idCustomer: idCustomer,
                            type: type,
                        };

                        const content = actionLength > 2 ? (
                            isEditable ? (
                                <Link to={ACCOUNT_MANAGEMENT_ROUTES.UPDATE_SERVICE_AGREEMENT} state={linkState}>
                                    <ButtonComponent icon={<SVGIcon name="IconEdit" color="#ACC424" width={20} />} border={false}>
                                        <span className="text-black ml-3">Update</span>
                                    </ButtonComponent>
                                </Link>
                            ) : (
                                <ButtonComponent icon={<SVGIcon name="IconEdit" color="#8D91A0" width={20} />} border={false} disabled>
                                    <span className="text-black ml-3">Update</span>
                                </ButtonComponent>
                            )
                        ) : isEditable ? (
                            <Link to={ACCOUNT_MANAGEMENT_ROUTES.UPDATE_SERVICE_AGREEMENT} state={linkState}>
                                <Tooltip title="Update"><SVGIcon name="IconEdit" width={20} color="#ACC424" /></Tooltip>
                            </Link>
                        ) : (
                            <Tooltip title="Update"><SVGIcon name="IconEdit" width={20} color="#8D91A0" className="cursor-not-allowed" /></Tooltip>
                        );
                        return <Fragment key={`table-action-update-${index}`}>{content}</Fragment>;
                    }
                };
            }
            if (actionDef.action === 'Delete') {
                return {
                    ...actionDef,
                    render: (record, actionLength, index) => {
                        const canDelete = record?.status === "DRAFT" && (record?.approvalStatus === "DRAFT" || record?.approvalStatus === "REJECTED");
                        const content = actionLength > 2 ? (
                            <ButtonComponent icon={<SVGIcon name="IconDelete" width={20} color={canDelete ? "#be3036" : "#c2cad2"} />} border={false} disabled={!canDelete} onClick={canDelete ? () => handleOpenDeleteDraft(record?.id) : undefined}>
                                <span className="text-black ml-3">Delete</span>
                            </ButtonComponent>
                        ) : (
                            <Tooltip title={canDelete ? "Delete" : ""}>
                                <SVGIcon name="IconDelete" width={20} color={canDelete ? "#be3036" : "#c2cad2"} className={canDelete ? undefined : "disabled cursor-not-allowed"} onClick={canDelete ? () => handleOpenDeleteDraft(record?.id) : undefined} />
                            </Tooltip>
                        );
                        return <Fragment key={`table-action-delete-${index}`}>{content}</Fragment>;
                    }
                };
            }
            return actionDef;
        }),

        // --- Custom SA Actions ---
        {
            action: "CreateAddon",
            type: "table",
            render: (record, actionLength, index) => {
                const isCreate = record?.isMain === "Y" && record?.status === "ACTIVE" && (record?.approvalStatus === "APPROVED" || record?.approvalStatus === "REJECTED");
                const linkState = { saReferenceNumber: record?.saNumber, serviceType: record?.serviceType?.id, saType: record?.saType?.id, pjbgType: record?.pjbgType?.id, saDate: record?.saDate, billingCycle: record?.billingCycle?.id, startDate: record?.startDate, endDate: record?.endDate, termOfPayment: record?.termOfPayment?.id, invoiceTemplate: record?.invoiceTemplate?.id, typeSa: "addon", idAccount, idCustomer, type, isMain: false, productTypeId: 287, idSa: record?.id };
                const content = actionLength > 2 ? (
                    isCreate ? (
                        <Link to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_SERVICE_AGREEMENT_ADDON} state={linkState}>
                            <ButtonComponent icon={<PlusCircleOutlined style={{ fontSize: "20px", color: "#0075BF" }} />} border={false}>
                                <span className="text-black ml-3">Create Child</span>
                            </ButtonComponent>
                        </Link>
                    ) : (
                        <ButtonComponent icon={<PlusCircleOutlined style={{ fontSize: "20px", color: "#8D91A0" }} />} border={false} disabled>
                            <span className="text-black ml-3">Create Child</span>
                        </ButtonComponent>
                    )
                ) : isCreate ? (
                    <Tooltip title="Create Child"><Link to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_SERVICE_AGREEMENT_ADDON} state={linkState}><PlusCircleOutlined style={{ fontSize: "20px", color: "#bbce4b" }} /></Link></Tooltip>
                ) : (
                    <Tooltip title="Create Child"><PlusCircleOutlined style={{ fontSize: "20px", color: "#c2cad2" }} className="cursor-not-allowed" /></Tooltip>
                );
                return <Fragment key={`table-action-addon-${index}`}>{content}</Fragment>;
            },
        },
        {
            action: "CreateAmendment",
            type: "table",
            render: (record, actionLength, index) => {
                const isCreate = record?.isMain === "Y" && record?.status === "ACTIVE" && (record?.approvalStatus === "APPROVED" || record?.approvalStatus === "REJECTED");
                const linkState = { saReferenceNumber: record?.saNumber, serviceType: record?.serviceType?.id, saType: record?.saType?.id, pjbgType: record?.pjbgType?.id, saDate: record?.saDate, billingCycle: record?.billingCycle?.id, startDate: record?.startDate, endDate: record?.endDate, termOfPayment: record?.termOfPayment?.id, invoiceTemplate: record?.invoiceTemplate?.id, typeSa: "Amendment", idAccount, idCustomer, type, isMain: false, idSa: record?.id };
                const content = actionLength > 2 ? (
                    isCreate ? (
                        <Link to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_SERVICE_AGREEMENT_AMANDEMEN} state={linkState}>
                            <ButtonComponent icon={<PlusCircleOutlined style={{ fontSize: "20px", color: "#0075BF" }} />} border={false}>
                                <span className="text-black ml-3">Create Amendment</span>
                            </ButtonComponent>
                        </Link>
                    ) : (
                        <ButtonComponent icon={<PlusCircleOutlined style={{ fontSize: "20px", color: "#8D91A0" }} />} border={false} disabled>
                            <span className="text-black ml-3">Create Amendment</span>
                        </ButtonComponent>
                    )
                ) : isCreate ? (
                    <Tooltip title="Create Amendment"><Link to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_SERVICE_AGREEMENT_AMANDEMEN} state={linkState}><PlusCircleOutlined style={{ fontSize: "20px", color: "#0075BF" }} /></Link></Tooltip>
                ) : (
                    <Tooltip title="Create Amendment"><PlusCircleOutlined style={{ fontSize: "20px", color: "#c2cad2" }} className="cursor-not-allowed" /></Tooltip>
                );
                return <Fragment key={`table-action-amendment-${index}`}>{content}</Fragment>;
            },
        },
        {
            action: "Activate",
            type: "table",
            render: (record, actionLength, index) => {
                const isActive = record?.status === "ACTIVE";
                const canInactivate = isActive && (record?.approvalStatus === "APPROVED" || record?.approvalStatus === "REJECTED" || record?.approvalStatus === "DRAFT");
                const content = actionLength > 2 ? (
                    <ButtonComponent icon={<Checkbox className="inactive-check" disabled={!canInactivate} checked={!isActive} style={{ transform: "scale(0.9)" }} />} border={false} disabled={!canInactivate} onClick={canInactivate ? () => handleOpenInactivate(record?.id, record?.saNumber) : undefined}>
                        <span className="text-black ml-3">{isActive ? "Inactivate" : "Activate"}</span>
                    </ButtonComponent>
                ) : (
                    <Tooltip title={isActive ? "Inactivate" : "Activate"}>
                        <Checkbox className="inactive-check" disabled={!canInactivate} checked={!isActive} onClick={canInactivate ? () => handleOpenInactivate(record?.id, record?.saNumber) : undefined} style={{ transform: "scale(0.9)" }} />
                    </Tooltip>
                );
                return <Fragment key={`table-action-activate-${index}`}>{content}</Fragment>;
            },
        }
    ];

    const actionCols = useColumnActionPermissionAccount(
        ["Delete", "View", "CreateAddon", "CreateAmendment", "Update", "Activate", "History"],
        itemActions,
        filteredArray,
        "View",
        { CreateAddon: "Update", CreateAmendment: "Update" } // Map these actions to Update permission
    ).map((col) => ({
        ...col,
        width: 70,
        align: "center",
    }));

    const baseColumns = useMemo(
        () =>
            getServiceAgreementColumns(
                search,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
        [search, searchText, searchedColumn]
    );

    const allColumns = useMemo(() => {
        const columnsWithKeys = [...baseColumns, ...actionCols].map((col) => ({
            ...col,
            key: col.key || col.dataIndex || col.title,
        }));
        return columnsWithKeys;
    }, [baseColumns, actionCols]);

    const processedColumns = useMemo(() => {
        return nxApplyFixedColumns(allColumns, fixedColumns);
    }, [allColumns, fixedColumns]);

    const columnDefinitions = useMemo(() => {
        return allColumns.map((col) => ({
            key: col.key || col.dataIndex || col.title,
            title: col.title,
        }));
    }, [allColumns]);

    return (
        <NxTable
            idTable="service-agreement-table"
            dataSource={data}
            totalData={totalElement}
            current={page}
            tableScrolled={{ y: 400, x: "max-content" }}
            onSort={onSort}
            columns={processedColumns}
            usePagination={false}
            useInfiniteScroll={true}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            loadMoreThreshold={2}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            columnDefinitions={columnDefinitions}
            loading={loading}
        />
    );
};

export default ServiceAgreementTable;
