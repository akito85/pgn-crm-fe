import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux"

const useGrantAccessAccountInline = ({
    selector = "accountManagement",
    url = "",
}) => {
    const { access_account } = useSelector((state) => state[selector]);
    const [isGranted, setIsGranted] = useState(true);
    const actions = access_account?.actionList?.filter(
        (item) => item?.path?.includes(`${url}/`)
    )?.map((item) => item?.name);

    useEffect(() => {
        access_account?.isGranted === false && setIsGranted(false)
    }, [access_account])
    return {isGranted, actions};
}

export default useGrantAccessAccountInline;