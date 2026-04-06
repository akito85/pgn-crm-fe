import { useCallback, useEffect, useMemo } from "react";
import { useState } from "react";
import { useSelector } from "react-redux"

const useGrantAccessHooks = (type = 'page') => {
    const { data_grant_access, grant_access_detail } = useSelector((state) => state.general);
    const [isGranted, setIsGranted] = useState(true);
    const actions = useMemo(() => {
        if (type === 'page') {
            return data_grant_access?.actionList?.map((item) => item?.name);
        } else {
            return grant_access_detail?.actionList?.map((item) => item?.name);

        }
    }, [data_grant_access, grant_access_detail, type])

    const hasGranted = useCallback((type) => {
        if (type === 'page') {
            data_grant_access?.isGranted === false && setIsGranted(false)
        } else {
            grant_access_detail?.isGranted === false && setIsGranted(false)
        }
    }, [data_grant_access, grant_access_detail])
    
    useEffect(() => {
        hasGranted(type)
    }, [hasGranted, type])


    const loading = data_grant_access === null && grant_access_detail === null;

    return { isGranted, actions, loading };
}

export default useGrantAccessHooks;