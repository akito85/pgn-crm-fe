import React from "react";
import CardContainerNoBorder from "../../../../../components/CardContainerNoBorder";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TableRBI from "../../../../../components/TableRBI";
import SubSectionCard from "../../../../../components/SubSectionCard";
import SVGIcon from "../../../../../assets/Icon";

const ReceiptInfoSection = ({ 
    receiptList, 
    columnsReceipt, 
    handleSearchReceipt, 
    page, 
    pageSize, 
    handlePageChange, 
    handleSizeChange,
    handleGlobalSearch
}) => {
    return (
        <CardContainerNoBorder 
            header={"RECEIPT INFORMATION"}
            collapsible={true}
        >
            <div className="mx-2 mb-4 mt-2">
                <SubSectionCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-end">
                            <ButtonComponent
                                type="primary"
                                onClick={handleSearchReceipt}
                            >
                                Search Receipt
                            </ButtonComponent>
                        </div>
                        
                        <TableRBI
                            idTable="receiptTable"
                            columns={columnsReceipt}
                            dataSource={receiptList}
                            pagination={false}
                            tableScrolled={{ x: 3500 }}
                            totalData={receiptList?.length || 0}
                            current={page}
                            pageSize={pageSize}
                            showSearchBar={true}
                            showAdvanceSearch={true}
                            onSearch={handleGlobalSearch}
                            onChange={handlePageChange}
                            onSizeChanger={handleSizeChange}
                        />
                    </div>
                </SubSectionCard>
            </div>
        </CardContainerNoBorder>
    );
};

export default ReceiptInfoSection;
