import React, { useState } from 'react';
import { clearUpdated, clearUpdatedDeleted, saveSubmitData } from '../../../../redux/slices/rating_billing_invoice/monitoring_usage';
import ButtonComponent from '../../../../components/ButtonComponent';
import RadioTabs from '../../../../components/RadioTabs';
import ApprovalComponentGeneral from '../../../../components/Approval/ApprovalComponentGeneral';
import ModalCustom from '../../../../components/Modal/ModalCustom';
import DetailText from '../../../../components/DetailText';
import { toTitleCase } from '../../../../utils';
import TableRBI from '../../../../components/TableRBI';
import { useSelector } from 'react-redux';

const ConfirmationUsage = ({
    dispatcher = () => { },
    isOpen,
    data_detail,
    selectedHierarchy,
    setIsOpen = () => { },
    listDataAppHierDetail = [],
    dataOption = [],
    columns
}) => {
    const { updatedData, deletedData } = useSelector((state) => state?.monitoring_usage);

    // state
    const [valuePage, setValuePage] = useState("Upload");
    const [tabPages] = useState([
        { value: "Upload" },
        { value: "Approval" },
    ]);

    // change tabs
    const changeTabHeader = (e) => {
        setValuePage(e.target.value);
    };

    // handle save
    const handleConfirm = () => {
        const updatedDataParse = updatedData?.map(item => {
            return {
                ...item,
                engMeasured: parseFloat(item.engMeasured) || '0',
                temperature: parseFloat(item.temperature) || '0',
                pressure: parseFloat(item.pressure) || '0',
                correctionFactor: parseFloat(item.correctionFactor) || '0',
                beginStand: parseFloat(item.beginStand) || '0',
                endStand: parseFloat(item.endStand) || '0',
                volMeasured27: parseFloat(item.volMeasured27) || '0',
                volMeasured60: parseFloat(item.volMeasured60) || '0',
                calorie: parseFloat(item.calorie) || '0',
                uncorrectedValue: parseFloat(item?.uncorrectedValue) || '0',
                ghv: parseFloat(item?.ghv) || '0',
                volMscf: parseFloat(item?.volMscf) || '0',
                taxationRowId: parseFloat(item?.taxationRowId) || '0'
            }
        });

        const payload = {
            batchId: data_detail?.batchInformation?.batchId,
            apphierId: selectedHierarchy,
            updatesData: updatedDataParse,
            deletesData: deletedData.map(item => item.recordId),
            isSubmit: data_detail?.isSubmit,
        };

        dispatcher(saveSubmitData(payload))
        handleCancel()
        dispatcher(clearUpdated())
        dispatcher(clearUpdatedDeleted())
    }

    // handle cancel
    const handleCancel = () => setIsOpen(false);

    // Get usage list data - already loaded from parent component
    const usageListData = data_detail?.usageList || [];
    const totalElements = usageListData.length;

    // render section
    const renderSection = (valuePage) => {
        switch (valuePage) {
            case "Approval":
                return (
                    <>
                        <p className="text-primary text-xs font-bold uppercase pt-[30px]">
                            {"APPROVAL INFORMATION"}
                        </p>
                        <ApprovalComponentGeneral
                            showSelect={false}
                            disableSelect={true}
                            approvalName={
                                (dataOption || [])?.filter(
                                    (data) => data?.value === selectedHierarchy
                                )[0]?.name || ""
                            }
                            dataTable={listDataAppHierDetail}
                            selectedHierarchy
                        />
                    </>
                )
            default:
                return (
                    <>
                        <p className="text-primary text-xs font-bold uppercase pt-[30px]">
                            {"BATCH INFORMATION"}
                        </p>
                        <div className={'w-full grid grid-cols-4'}>
                            <DetailText label={'Batch ID'}>{data_detail?.batchInformation?.batchId}</DetailText>
                            <DetailText label={'Upload Type'}>{data_detail?.batchInformation?.uploadType}</DetailText>
                            <DetailText label={'Upload Date'}>{data_detail?.batchInformation?.uploadDate}</DetailText>
                            <DetailText label={'Upload By'}>{data_detail?.batchInformation?.uploadBy}</DetailText>
                        </div>
                        <div className={'w-full grid grid-cols-4'}>
                            <DetailText label={'Total Data'}>{data_detail?.batchInformation?.totalUsage}</DetailText>
                            <DetailText label={'Total Succeed'}>{data_detail?.batchInformation?.totalSucceed}</DetailText>
                            <DetailText label={'Total Progress'}>{data_detail?.batchInformation?.totalProgress}</DetailText>
                            <DetailText label={'Total Failed'}>{data_detail?.batchInformation?.totalFailed}</DetailText>
                        </div>
                        <div className={'w-full grid grid-cols-4'}>
                            <DetailText label={'Status'}>{toTitleCase(data_detail?.batchInformation?.status)}</DetailText>
                        </div>
                        <div className='my-10'>
                            <TableRBI
                                idTable="confirmation-usage-table"
                                columns={columns}
                                dataSource={usageListData}
                                totalData={totalElements}
                                tableScrolled={{ x: 8000, y: 600 }}
                                showExport={false}
                                usePagination={false}
                                useInfiniteScroll={false}
                            />
                        </div>
                    </>
                )
        }
    }

    return (
        <ModalCustom
            isOpen={isOpen}
            type={"confirmation"}
            header={"confirmation"}
            width={1000}
            handleCancel={handleCancel}
            handleConfirm={handleConfirm}
            footer={
                <div className={"w-full flex justify-end gap-5"}>
                    <ButtonComponent type={"default"} onClick={handleCancel}>
                        Cancel
                    </ButtonComponent>
                    <ButtonComponent
                        type={"submit"}
                        border={false}
                        onClick={handleConfirm}
                    >
                        Confirm
                    </ButtonComponent>
                </div>
            }
        >
            <div className={'w-full flex justify-start'}>
                <RadioTabs data={tabPages} onChange={changeTabHeader} currentPosition={valuePage} />
            </div>
            {renderSection(valuePage)}
        </ModalCustom>
    );
}

export default ConfirmationUsage;