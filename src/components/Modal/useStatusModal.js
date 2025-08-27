import { message } from "../../constants/message";

const useStatusModal = (typeModal ="", isSuccess, isFailed, status) => {
    let textHead;
    let textDesc;
    if (isSuccess === true) {
        switch (typeModal) {
            case "delete":
                textHead = message.TEXT_HEAD.SUCCESS_DELETE;
                textDesc =message.TEXT_DECS.SUCCESS_DELETE;
                break;
            case "update":
                textHead = message.TEXT_HEAD.SUCCESS_UPDATE;
                textDesc =message.TEXT_DECS.SUCCESS_UPDATE;
                break;
            case "create":
                textHead = message.TEXT_HEAD.SUCCESS_CREATE;
                textDesc =message.TEXT_DECS.SUCCESS_CREATE;
                break;
            default:
                if (status === "ACTIVE" || status === true) {
                    textHead = message.TEXT_HEAD.SUCCESS_INACTIVATION;
                    textDesc = message.TEXT_DECS.FAILED_INACTIVATION;
                } else {
                    textHead = message.TEXT_HEAD.SUCCESS_ACTIVATION;
                    textDesc = message.TEXT_DECS.SUCCESS_ACTIVATION;
                }
                break;
        } 
    } else {
        switch (typeModal) {
            case "delete":
                textHead = message.TEXT_HEAD.FAILED_DELETE;
                textDesc = message.TEXT_DECS.FAILED_DELETE;
                break;
            case "update":
                textHead = message.TEXT_HEAD.FAILED_UPDATE;
                textDesc = message.TEXT_DECS.FAILED_UPDATE;
                break;
            case "create":
                textHead = message.TEXT_HEAD.FAILED_CREATE;
                textDesc = message.TEXT_DECS.FAILED_CREATE;
                break;
            default:
                if (status === "ACTIVE" || status === true) {
                    textHead = message.TEXT_HEAD.FAILED_INACTIVATION;
                    textDesc = message.TEXT_DECS.FAILED_INACTIVATION;
                } else {
                    textHead = message.TEXT_HEAD.FAILED_ACTIVATION;
                    textDesc = message.TEXT_DECS.FAILED_ACTIVATION;
                }
                break;
        }
    }
    return {typeModal, textHead, textDesc, status, isFailed, isSuccess}
}

export default useStatusModal;
