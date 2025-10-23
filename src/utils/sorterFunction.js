import moment from "moment";
import { hasValue, renderDateConverter } from ".";

// extracting size 
const extractSize = (fileSize) => {
    if (fileSize.includes('KB')) {
        return parseFloat(fileSize.replace(' KB', '')) * 1024;
    } else if (fileSize.includes('MB')) {
        return parseFloat(fileSize.replace(' MB', '')) * 1024 * 1024;
    }
    return parseFloat(fileSize);

}

export const sorterFunction = (fieldSort, a, b, type = "string") => {
    
    const handleDataSort = (obj) => {
        switch (type) {
            case "date":
                const date = obj[fieldSort]
                    ? moment(obj[fieldSort]).format("DD MMM YYYY")
                    : "";
                return date.toString().toLowerCase();
            case "datetime":
                const datetime = hasValue(obj[fieldSort]) ? renderDateConverter(obj[fieldSort], 'datetime') : ''
                return datetime.toString().toLowerCase();
            case "file_size":
                return extractSize(obj[fieldSort]);
            case "number":
                return obj[fieldSort];
            case "select":
                return obj;
            default:
                return obj[fieldSort]?.toString()?.toLowerCase();
        }
    };
    let fa = handleDataSort(a);
    let fb = handleDataSort(b);
    if (type === 'file_size' || type === 'number') {
        return fa - fb;
    } else {
        return fa?.localeCompare(fb);
    }
};