import React, { useState, useMemo, useRef } from 'react';
import { useMonitoringList } from './useMonirotingList';
import { useDispatch } from 'react-redux';
import { clearUpdated, saveSubmitData } from '../../../../redux/slices/rating_billing_invoice/monitoring_usage';
import TableRBI from '../../../../components/TableRBI'; // GANTI IMPORT
import { applyFixedColumns } from '../../../../utils/applyFixedColumns'; // TAMBAH IMPORT
import { openNotification } from '../../../../utils';
import ModalApproveOrReject from '../../../../components/Modal/ModalApproveOrReject';
import ButtonComponent from '../../../../components/ButtonComponent';

const SummaryTable = ({ visible, onClose, batchId, apphierId, updatedData, deletedData, isSubmit }) => {
    const { columns } = useMonitoringList();
    const dispatch = useDispatch();
    const searchInput = useRef(null); // TAMBAH REF

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sort, setSort] = useState(""); // TAMBAH STATE SORT

    // TAMBAH STATE FIXED COLUMNS
    const [fixedColumns, setFixedColumns] = useState(() => ({
        left: [],
        right: [],
    }));

    const handleClose = () => {
        onClose();
    };

    const handleReset = () => {
        dispatch(clearUpdated());
    };

    const parsedApphierId = parseInt(apphierId, 10);

    const handleSubmit = () => {
        if (apphierId === null || apphierId === undefined || isNaN(apphierId)) {
            openNotification("warning", "Warning", "Please fill form approval first before save & submit");
            return;
        }
        const payload = {
            batchId,
            apphierId: parsedApphierId,
            updatesData: updatedData,
            deletesData: deletedData.map(item => item.recordId),
            isSubmit,
        };
        dispatch(saveSubmitData(payload));
        onClose();
        dispatch(clearUpdated());
    };

    // TAMBAH FUNCTION ONSORT
    const onSort = (_, __, sorter) => {
        const dataSort =
            sorter && sorter.order !== undefined
                ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
                : "";
        setSort(dataSort);
    };

    // Handle Change Page
    const handleChangePage = (pageChange, pageSizeChange) => {
        const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
        setPage(tempPage);
        setPageSize(pageSizeChange);
    };

    // BASE COLUMNS DENGAN USEMEMO
    const baseColumns = useMemo(() => {
        const columnsWithKeys = columns.map((col) => ({
            ...col,
            key: col.key || col.dataIndex || col.title,
        }));
        return columnsWithKeys;
    }, [columns]);

    // PROCESSED COLUMNS
    const processedColumns = useMemo(() => {
        return applyFixedColumns(baseColumns, fixedColumns);
    }, [baseColumns, fixedColumns]);

    // COLUMN DEFINITIONS
    const columnDefinitions = useMemo(() => {
        return baseColumns.map((col) => ({
            key: col.key || col.dataIndex || col.title,
            title: col.title,
        }));
    }, [baseColumns]);

    return (
        <ModalApproveOrReject
            isOpen={visible}
            header="Summary table usage update & delete"
            width={1000}
            onCancel={handleClose}
            message={"Are you sure to submit this updated & deleted data usage?"}
            footer={
                <div className='w-full flex mb-5 mt-2'>
                    <div className='w-full justify-start'>
                        <ButtonComponent 
                            className='float-left bg-orange-500' 
                            type={"reject"} 
                            key="reset" 
                            onClick={handleReset}
                        >
                            Reset
                        </ButtonComponent>
                    </div>
                    <div className='flex w-full justify-end gap-5'>
                        <ButtonComponent key="cancel" onClick={handleClose}>
                            Cancel
                        </ButtonComponent>
                        <ButtonComponent 
                            className="ant-btn ant-btn-submit" 
                            type={"submit"} 
                            key="submit" 
                            onClick={handleSubmit}
                        >
                            Submit
                        </ButtonComponent>
                    </div>
                </div>
            }
        >
            <div>
                <p className="text-primary uppercase font-bold">Updated Data</p>
                {/* GANTI DENGAN TableRBI */}
                <TableRBI
                    dataSource={updatedData}
                    columns={processedColumns}
                    current={page}
                    pageSize={pageSize}
                    onChange={handleChangePage}
                    onSizeChanger={handleChangePage}
                    totalData={updatedData?.length || 0}
                    tableScrolled={{ x: 5000, y: 600 }}
                    onSort={onSort}
                    showExport={false}
                    columnDefinitions={columnDefinitions}
                    fixedColumns={fixedColumns}
                    setFixedColumns={setFixedColumns}
                    loading={false}
                />
            </div>
            <div className='mt-10'>
                <p className="text-primary uppercase font-bold">Deleted Data</p>
                {/* GANTI DENGAN TableRBI */}
                <TableRBI
                    dataSource={deletedData}
                    columns={processedColumns}
                    current={page}
                    pageSize={pageSize}
                    onChange={handleChangePage}
                    onSizeChanger={handleChangePage}
                    totalData={deletedData?.length || 0}
                    tableScrolled={{ x: 5000, y: 600 }}
                    onSort={onSort}
                    showExport={false}
                    columnDefinitions={columnDefinitions}
                    fixedColumns={fixedColumns}
                    setFixedColumns={setFixedColumns}
                    loading={false}
                />
            </div>
        </ModalApproveOrReject>
    );
};

export { SummaryTable };