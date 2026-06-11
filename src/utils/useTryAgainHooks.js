import { useEffect, useState } from "react"
import { ModalError } from "../components/Modal/ModalPopUp"
import SVGIcon from '../../src/assets/Icon/index';
import { useDispatch, useSelector } from "react-redux";
import { clearBodyMessage } from "../redux/slices/general_slice";
import { errorCode, errorMessage } from ".";
import { getProfile } from "../redux/slices/user_management/profile";
import { checkGrantedAccess } from "../redux/slices/user_management/auth";
import { useLocation } from "react-router-dom";


export const useTryAgainHooks = (handleTryAgain) => {
    const dispatch = useDispatch()
    const { bodyError } = useSelector(state => state?.general)
    const location = useLocation()
    // state
    const [modalError, setModalError] = useState(false);

    // use effect
    useEffect(() => {
        if (errorCode(bodyError) === 500) {
            setModalError(true);
        }
    }, [bodyError])

    // handle cancel modal
    const handleCancelTryAgain = () => {
        dispatch(clearBodyMessage());
        setModalError(false);
        if (errorMessage(bodyError)?.toLowerCase() === 'network error' || bodyError?.action === 'CHECK_GRANTED_ACCESS') {
            dispatch(getProfile())
            dispatch(checkGrantedAccess(location?.pathname))
        } else if (bodyError?.action === 'GET_PROFILE') {
            dispatch(getProfile())
        }
    }

    const handleRetry = () => {
        if (errorMessage(bodyError)?.toLowerCase() === 'network error') {
            handleCancelTryAgain()
        } else {
            handleTryAgain()
        }
    };


    const renderModal = () => {
        return (
            <ModalError
                isOpen={modalError}
                handleOk={handleRetry}
                handleCancel={handleCancelTryAgain}
                customText={"Try Again"}
            >
                <div className="px-5 pt-5 pb-[10px] justify-center">
                    <div className="w-full flex gap-[20px]">
                        <SVGIcon name="IconFailed" width={48} />
                        <p className="text-[18px] font-bold">{"Failed"}</p>
                    </div>
                    <p className="pl-[70px]">{errorMessage(bodyError)}</p>
                    <span className="pl-[70px]">
                        Please Contact Administrator
                    </span>
                </div>
            </ModalError>
        )
    }

    return { renderModal, handleCancelTryAgain }
}