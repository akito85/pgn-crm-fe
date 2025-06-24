import React, { useState } from 'react';
import { Modal, Table, Button } from 'antd';
import { useMonitoringList } from './useMonirotingList';
import { useDispatch } from 'react-redux';
import { clearUpdated, saveSubmitData } from '../../../../redux/slices/rating_billing_invoice/monitoring_usage';
import TablePagination from '../../../../components/TablePagination';
import { openNotification } from '../../../../utils';
import ModalApproveOrReject from '../../../../components/Modal/ModalApproveOrReject';
import ButtonComponent from '../../../../components/ButtonComponent';

const SummaryTable = ({ visible, onClose, batchId, apphierId, updatedData, deletedData, isSubmit }) => {
    const { columns } = useMonitoringList();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const dispatch = useDispatch();

    const handleClose = () => {
        // dispatch(clearUpdated())
        onClose();
    }

    const handleReset = () => {
        dispatch(clearUpdated())
    }
    const parsedApphierId = parseInt(apphierId, 10); 
    
    const handleSubmit = () => {
        if (apphierId === null || apphierId === undefined || isNaN(apphierId)) {
            openNotification("warning","Warning", "Please fill form approval first before save & submit");
            return;
        }
        const payload = {
            batchId,
            apphierId : parsedApphierId,
            updatesData: updatedData,
            deletesData: deletedData.map(item => item.recordId),
            isSubmit,
        };
        dispatch(saveSubmitData(payload))
        onClose()
        dispatch(clearUpdated())
    }
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
                    <ButtonComponent className='float-left bg-orange-500'  type={"reject"} key="reset" onClick={handleReset}>
                        Reset
                    </ButtonComponent>
                </div>
                <div className=' flex w-full justify-end gap-5'>
                    <ButtonComponent key="cancel" onClick={handleClose}>
                        Cancel
                    </ButtonComponent>
                    <ButtonComponent className="ant-btn ant-btn-submit" type={"submit"} key="submit" onClick={handleSubmit}>
                        Submit
                    </ButtonComponent>
                </div>
            </div>
            
        }
        >
        <div>
            <p className="text-primary uppercase font-bold">Updated Data</p>
            <TablePagination
                columns={columns}
                dataSource={updatedData}
                current={page}
                pageSize={pageSize}
                tableScrolled={{ x: 5000, y: 600 }}
            />
        </div>
        <div className='mt-10'>
            <p className="text-primary uppercase font-bold">Deleted Data</p>
            <TablePagination
                columns={columns}
                dataSource={deletedData}
                current={page}
                pageSize={pageSize}
                tableScrolled={{ x: 5000, y: 600 }}
            />
        </div>
    </ModalApproveOrReject>
  );
};

export { SummaryTable };