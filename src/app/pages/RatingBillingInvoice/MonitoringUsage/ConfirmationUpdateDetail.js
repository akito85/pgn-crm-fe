import React, { useState } from 'react';
import ModalCustom from '../../../../components/Modal/ModalCustom';
import RadioTabs from '../../../../components/RadioTabs';
import UploadLayout from './UploadLayout';
import ApprovalLayout from './ApprovalLayout';
import ButtonComponent from '../../../../components/ButtonComponent';
import { openNotification } from '../../../../utils';
import { useDispatch } from 'react-redux';
import { clearUpdated, clearUpdatedDeleted, saveSubmitData } from '../../../../redux/slices/rating_billing_invoice/monitoring_usage';

const ConfirmationUpdateDetail = ({
    isOpen,
    handleCancel = () => { },
    handleOk = () => { },
    data,
    detail_batch,
    setApphierId = () => { },
    apphierId,
    batchId,
    updatedData,
    deletedData,
    isSubmit,
    dataTable,
    setDataTable = () => { }
}) => {
    const dispatch = useDispatch();
    const [tabHeader, setTabHeader] = useState('Upload');
    const [dataTabs] = useState([
        {
            key: "upload",
            value: "Upload",
        },
        {
            key: "approval",
            value: "Approval",
        },
    ]);

    // change tabs
    const changeTabHeader = (e) => {
        setTabHeader(e.target.value);
    }

    const parsedApphierId = parseInt(apphierId, 10);

    // handle save
    const handleSave = () => {
        if (apphierId === null || apphierId === undefined || isNaN(apphierId)) {
            openNotification("warning", "Warning", "Please fill form approval first before save & submit");
            return;
        }

        const updatedDataParse = updatedData?.map(item => {
            return {
                ...item,
                engMeasured: parseFloat(item.engMeasured) || null,
                temperature: parseFloat(item.temperature) || null,
                pressure: parseFloat(item.pressure) || null,
                correctionFactor: parseFloat(item.correctionFactor) || null,
                beginStand: parseFloat(item.beginStand) || null,
                endStand: parseFloat(item.endStand) || null,
                volMeasured27: parseFloat(item.volMeasured27) || null,
                volMeasured60: parseFloat(item.volMeasured60) || null,
                calorie: parseFloat(item.calorie) || null,
                uncorrectedValue: parseFloat(item?.uncorrectedValue) || null,
                ghv: parseFloat(item?.ghv) || null,
                volMscf: parseFloat(item?.volMscf) || null,
                taxationRowId: parseFloat(item?.taxationRowId) || null
            }
        });

        const payload = {
            batchId,
            apphierId: parsedApphierId,
            updatesData: updatedDataParse,
            deletesData: deletedData.map(item => item.recordId),
            isSubmit,
        };
        dispatch(saveSubmitData(payload))
        handleCancel()
        dispatch(clearUpdated())
        dispatch(clearUpdatedDeleted())
    }
    return (
        <ModalCustom
            isOpen={isOpen}
            handleCancel={handleCancel}
            width={1000}
            header={'Confirmation'}
            type={'confirmation'}
            footer={[
                <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
                    <ButtonComponent
                        onClick={handleCancel}
                        type="default"
                    >
                        Cancel
                    </ButtonComponent>
                    <ButtonComponent
                        onClick={handleSave}
                        type={'submit'}
                    >
                        Confirm
                    </ButtonComponent>
                </div>
            ]}
        >
            <div className={'w-full flex justify-start'}>
                <RadioTabs data={dataTabs} onChange={changeTabHeader} />
            </div>
            {tabHeader === 'Upload' ? <UploadLayout dataHeader={detail_batch} dataTable={dataTable} setDataTable={setDataTable} type={'detail-confirmation'} tabHeader={tabHeader} /> : <ApprovalLayout type={'approval-confirmation'} onApprovalChange={setApphierId} selectedAppHierId={apphierId} />}
        </ModalCustom>
    );
}

export default ConfirmationUpdateDetail;
