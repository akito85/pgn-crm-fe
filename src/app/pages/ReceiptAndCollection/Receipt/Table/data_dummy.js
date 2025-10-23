import moment from "moment";
import { dateFormatting } from "../../../../../utils";

export const dataDummy = () => {
    let data_dummy_allocation = [];
    for (let i = 1; i <= 100; i++) {
        data_dummy_allocation.push({
            key: i,
            allocationCode: null,
            allocationNumber: null,
            item: `Item ${i}`,
            allocationDate: null,
            invoiceNo: `INV${i}`,
            invoiceCurrency: `1000${i}`,
            billingCycle: `BLL00${i}`,
            billingPeriod: moment().format(dateFormatting?.datePeriod),
            billingItemAmount: `10002${i}`,
            type: 'STANDARD',
            allocationAmount: `50${i}`,
            billingItemBalance: `900${i}`,
            allocationStatus: 'PARTIAL',
            convertedCurrency: 'USD',
            eqvAmount: null,
            createdDate: moment()?.format(dateFormatting?.dateCapital),
            createdBy: `USER ${i}`
        });
    }
    return data_dummy_allocation;
}