// src/app/pages/SystemSetup/ActivityTemplate/Details/ActivityTemplateDetail.js
import { Button, Spin } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import NxBreadCrumb from "../../../../../components/Nx/NxBreadCrumb";
import NxBaseContainer from "../../../../../components/Nx/NxBaseContainer";
import NxCardContainer from "../../../../../components/Nx/NxCardContainer";
import NxDetailText from "../../../../../components/Nx/NxDetailText";
import NxTable from "../../../../../components/Nx/NxTable";
import SVGIcon from "../../../../../assets/Icon/index";
import { SYSTEM_SETUP_ROUTES } from "../../../../../routes/system_setup/setup_routes";
import { getDetailActivityTemplate } from "../../../../../redux/slices/system_setup/activityTemplate";

const activityListColumns = [
    {
        key: "no",
        title: "NO",
        width: 60,
        align: "center",
        render: (_, __, index) => index + 1,
    },
    {
        key: "name",
        title: "NAME",
        dataIndex: "name",
        width: 300,
    },
];

const routes = [
    { path: "", breadcrumbName: "System Setup" },
    { path: SYSTEM_SETUP_ROUTES.VIEW_ACTIVITY_TEMPLATE, breadcrumbName: "Activity Template" },
    { path: "", breadcrumbName: "Detail Activity Template" },
];

const ActivityTemplateDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const id = location?.state?.id;

    const { loading_detail_at: isLoading, detail_at: detail } = useSelector(
        (state) => state.activityTemplate
    );

    useEffect(() => {
        if (!id) {
            navigate(SYSTEM_SETUP_ROUTES.VIEW_ACTIVITY_TEMPLATE, { replace: true });
            return;
        }
        dispatch(getDetailActivityTemplate(id));
    }, [id, dispatch, navigate]);

    return (
        <Spin spinning={isLoading} className="w-full top-20">
            <div className="flex flex-col gap-y-4">
                <NxBreadCrumb routes={routes} />

                {/* SECTION 1: Activity Template Information */}
                <NxCardContainer header={"ACTIVITY TEMPLATE INFORMATION"}>
                    <NxBaseContainer border>
                        <div className="w-full grid grid-cols-2 gap-4">
                            <NxDetailText label="Name">{detail?.name}</NxDetailText>
                            <NxDetailText label="Work Order Category">{detail?.workOrderCategoryName}</NxDetailText>
                            <NxDetailText label="Work Order Type">{detail?.workOrderTypeName}</NxDetailText>
                            <NxDetailText label="SR Sub-Category">{detail?.srSubCategoryName}</NxDetailText>
                        </div>
                    </NxBaseContainer>
                </NxCardContainer>

                {/* SECTION 2: Activity Template List */}
                <NxCardContainer header={"ACTIVITY TEMPLATE LIST"}>
                    <NxBaseContainer border>
                        <NxTable
                            idTable="activity-list-detail-table"
                            dataSource={detail?.activityList || []}
                            totalData={detail?.activityList?.length || 0}
                            tableScrolled={{ x: "max-content" }}
                            usePagination={false}
                            useInfiniteScroll={false}
                            columns={activityListColumns}
                        />
                    </NxBaseContainer>
                </NxCardContainer>

                {/* SECTION 3: History Log */}
                <NxCardContainer header={"HISTORY LOG INFORMATION"}>
                    <NxBaseContainer border>
                        <div className="w-full grid grid-cols-5 gap-4">
                            <NxDetailText label="Record ID">{detail?.id}</NxDetailText>
                            <NxDetailText label="Created Date">{detail?.createdDate}</NxDetailText>
                            <NxDetailText label="Created By">{detail?.createdBy}</NxDetailText>
                            <NxDetailText label="Updated Date">{detail?.updatedDate}</NxDetailText>
                            <NxDetailText label="Updated By">{detail?.updatedBy}</NxDetailText>
                        </div>
                    </NxBaseContainer>
                </NxCardContainer>

                {/* Footer */}
                <NxBaseContainer border>
                    <div className="flex justify-between">
                        <Button
                            type="menu"
                            icon={<SVGIcon name="IconChevronLeft" width={14} />}
                            onClick={() => navigate(-1)}
                        >
                            Back
                        </Button>
                    </div>
                </NxBaseContainer>
            </div>
        </Spin>
    );
};

export default ActivityTemplateDetail;
