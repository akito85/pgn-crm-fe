import { Fragment, useState } from "react";
import moment from "moment";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import RadioTabs from "../../../../../components/RadioTabs";
import TableRBI from "../../../../../components/TableRBI";
import { getCustomerListColumns } from "./CustomerColumns";

const ContentModalConfirmOffset = ({
    data,
    offsetEntries = [],
    listDataAttachment = [],
    appHierOptions = [],
    appHierDataDetail = [],
    selectedHierarchy,
}) => {
    const tabData = [
        { value: "Offset" },
        { value: "Approval" },
        { value: "Attachment" },
    ];
    const [valuePage, setValuePage] = useState(tabData[0].value);

    const customerColumns = getCustomerListColumns({
        page: 1,
        pageSize: 10,
    });

    const offsetColumns = [
        { title: "NO", dataIndex: "key", width: 50, render: (t, r, i) => i + 1 },
        { title: "REFERENCE", dataIndex: "reference" },
        { title: "REFERENCY CURRENCY", dataIndex: "currency" },
        {
            title: "AMOUNT",
            dataIndex: "amount",
            render: (val) => val?.toLocaleString("id-ID"),
            align: "right"
        },
        {
            title: "RATE",
            dataIndex: "rate",
            render: (val) => val?.toLocaleString("id-ID"),
            align: "right"
        },
        {
            title: "RATE DATE",
            dataIndex: "rateDate",
            render: (val) => val ? moment(val).format("DD MMM YYYY") : "",
            align: "center"
        },
    ];

    const showSection = () => {
        switch (valuePage) {
            case "Offset":
                return (
                    <div className="flex flex-col gap-5 w-full">
                        <div>
                            <div className="text-primary text-xs font-bold uppercase mb-3">
                                CUSTOMER INFORMATION
                            </div>
                            <TableRBI
                                dataSource={data?.selectedCustomers || []}
                                columns={customerColumns}
                                usePagination={false}
                                showAdvanceSearch={false}
                                showSearchBar={false}
                            />
                        </div>

                        <div>
                            <div className="text-primary text-xs font-bold uppercase mb-3">
                                OFFSET INFORMATION
                            </div>
                            <TableRBI
                                dataSource={offsetEntries}
                                columns={offsetColumns}
                                usePagination={false}
                                showAdvanceSearch={false}
                                showSearchBar={false}
                            />
                        </div>
                    </div>
                );
            case "Approval":
                return (
                    <ApprovalComponentGeneral
                        showSelect={false}
                        disableSelect={true}
                        approvalName={(appHierOptions || []).find(opt => opt.value === selectedHierarchy)?.name || ""}
                        dataTable={appHierDataDetail}
                        selectedHierarchy={selectedHierarchy}
                    />
                );
            case "Attachment":
                return (
                    <div className="flex flex-col gap-3">
                        <div className="text-primary text-xs font-bold uppercase">ATTACHMENT LIST</div>
                        <TableRBI
                            columns={[
                                { title: "NO", dataIndex: "key", width: 50, render: (t, r, i) => i + 1 },
                                { title: "FILE NAME", dataIndex: "fileName" },
                                { title: "CATEGORY", dataIndex: "fileCategoryName" },
                            ]}
                            dataSource={listDataAttachment}
                            usePagination={false}
                        />
                    </div>
                );
            default:
                return <Fragment />;
        }
    };

    return (
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
            <RadioTabs data={tabData} onChange={(e) => setValuePage(e.target.value)} currentPosition={valuePage} />
            <div className="flex flex-col gap-4 mt-2">
                {showSection()}
            </div>
        </div>
    );
};

export default ContentModalConfirmOffset;
