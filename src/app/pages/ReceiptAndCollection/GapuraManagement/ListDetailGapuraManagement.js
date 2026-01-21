import { LeftOutlined } from "@ant-design/icons";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import {
    getDetailGapuraManagement,
} from "../../../../redux/slices/receipt_collection/gapuraManagement";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../routes/Receipt&Collection/rc_routes";
import DetailGapuraManagement from "./DetailGapuraManagement";
import BaseContainer from "../../../../components/BaseContainer";
import TableRBI from "../../../../components/TableRBI";
import { historyJobColumns } from "./Columns";

const ListDetailGapuraManagement = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const id = location?.state?.id;

    const {
        loading,
        data_detail,
    } = useSelector((state) => state.gapuraManagement);

    // Table state 
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        if (id) {
            dispatch(getDetailGapuraManagement(id));
        }
    }, [dispatch, id]);

    const columnsHistory = useMemo(() => {
        return historyJobColumns(page, pageSize);
    }, [page, pageSize]);

    const onChangePage = (pageChange, pageSizeChange) => {
        setPage(pageChange);
        setPageSize(pageSizeChange);
    };

    const routes = [
        {
            path: "",
            breadcrumbName: "Receipt & Collection",
        },
        {
            path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_GAPURA_MANAGEMENT,
            breadcrumbName: "Gapura Management",
        },
        {
            path: RECEIPT_AND_COLLECTION_ROUTES.DETAIL_GAPURA_MANAGEMENT,
            breadcrumbName: "Detail Gapura Management",
        },
    ];

    return (
        <LayoutMenu>
            <Spin spinning={loading}>
                <BreadCrumb routes={routes} />

                <DetailGapuraManagement data_detail={data_detail?.gapuraManagement} />

                <div className="mt-5">
                    <BaseContainer header={"HISTORY JOB"}>
                        <TableRBI
                            columns={columnsHistory}
                            dataSource={data_detail?.historyJob || []}
                            pagination={false}
                            tableScrolled={{ x: 1500 }}
                            current={page}
                            pageSize={pageSize}
                            totalData={data_detail?.historyJob?.length || 0}
                            onChange={onChangePage}
                            onSizeChanger={onChangePage}
                        />
                    </BaseContainer>
                </div>

                <div className="flex mt-[30px] justify-between py-5">
                    <ButtonComponent
                        type={"submit"}
                        onClick={() => navigate(-1)}
                        icon={
                            <LeftOutlined
                                style={{
                                    color: "#fff",
                                    fontSize: 24,
                                    justifyItems: "center",
                                }}
                            />
                        }
                    >
                        Back
                    </ButtonComponent>
                </div>
            </Spin>
        </LayoutMenu>
    );
};

export default ListDetailGapuraManagement;
