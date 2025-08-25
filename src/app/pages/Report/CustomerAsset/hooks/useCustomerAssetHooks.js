import { useCallback, useMemo, useRef, useState } from "react";
import CustomerAssetColumn from "../columns/CustomerAssetColumn";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { DownloadOutlined } from "@ant-design/icons";

const useCustomerAssetHooks = () => {

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [sort, setSort] = useState("");
    const [search, setSearch] = useState({});
    const searchInput = useRef(null);




    const handleSearch = useCallback(() => {

    }, []);


    const columns = useMemo(() => {
        return CustomerAssetColumn(page, pageSize, searchInput, searchedColumn, searchText, handleSearch)
    }, [handleSearch, page, pageSize, searchText, searchedColumn]);


    const handleDownload = useCallback(() => {

    }, []);


    const handleSort = useCallback(() => {

    }, [])

    const itemActions = useMemo(() => {
        return [
            {
                action: 'Download',
                render: (
                    <ButtonComponent
                        icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
                        type={"submit"}
                        onClick={handleDownload}
                    >
                        Download List
                    </ButtonComponent>

                )
            },
        ];
    }, [handleDownload]);

    const handleChange = useCallback(() => {

    }, []);


    return {
        itemActions,
        page,
        pageSize,
        handleSort,
        handleChange,
        columns
    }

}

export default useCustomerAssetHooks;