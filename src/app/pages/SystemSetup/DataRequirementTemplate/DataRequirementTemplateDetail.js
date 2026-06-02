import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Spin } from "antd";

import NxBreadCrumb from "../../../../components/Nx/NxBreadCrumb";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxDetailText from "../../../../components/Nx/NxDetailText";
import NxStatusComponent from "../../../../components/Nx/NxStatusComponent";
import NxTable from "../../../../components/Nx/NxTable";

import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import {
  getDataRequirementTemplateDetail,
  resetDataRequirementTemplate,
  activeInactiveDataRequirementTemplate,
} from "../../../../redux/slices/system_setup/dataRequirementTemplate";

const DataRequirementTemplateDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { data_detail, loading } = useSelector(
    (state) => state.dataRequirementTemplate
  );

  const id = location?.state?.id;

  useEffect(() => {
    if (id) dispatch(getDataRequirementTemplateDetail(id));
    return () => { dispatch(resetDataRequirementTemplate()); };
  }, [dispatch, id]);

  const isActive = data_detail?.isActive === 1 || data_detail?.isActive === true;

  const handleActiveInactive = () => {
    dispatch(activeInactiveDataRequirementTemplate(id))
      .unwrap()
      .then(() => dispatch(getDataRequirementTemplateDetail(id)));
  };

  const routes = [
    { path: "", breadcrumbName: "System Setup" },
    { path: SYSTEM_SETUP_ROUTES.VIEW_DATA_REQUIREMENT_TEMPLATE, breadcrumbName: "Data Requirement Template" },
    { path: "", breadcrumbName: "Detail" },
  ];

  const detailColumns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      align: "center",
      width: 8,
    },
    { title: "Type", dataIndex: "type", key: "type" },
  ];

  const detailData = (data_detail?.details || []).map((item, index) => ({
    ...item,
    no: index + 1,
  }));

  return (
    <>
      <NxBreadCrumb routes={routes} />

      {loading && !data_detail ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      ) : data_detail ? (
        <div className="flex flex-col gap-y-4">
          {/* Template Information */}
          <NxCardContainer
            header="TEMPLATE INFORMATION"
            actionElement={
              <div className="flex gap-2 -my-1">
                <Button
                  type={isActive ? "reject" : "submit"}
                  onClick={handleActiveInactive}
                  loading={loading}
                >
                  {isActive ? "Inactivate" : "Activate"}
                </Button>
                <Button
                  type="secondary"
                  onClick={() =>
                    navigate(
                      SYSTEM_SETUP_ROUTES.UPDATE_DATA_REQUIREMENT_TEMPLATE.replace(":id", id),
                      { state: { id } }
                    )
                  }
                >
                  Edit
                </Button>
              </div>
            }
          >
            <NxBaseContainer border>
              <div className="w-full grid grid-cols-3 gap-4">
                <NxDetailText label="Name">{data_detail.name || "-"}</NxDetailText>
                <NxDetailText label="Source Type">{data_detail.sourceType || "-"}</NxDetailText>
                <NxDetailText label="Type">{data_detail.typeName || data_detail.type || "-"}</NxDetailText>
                <NxDetailText label="Category">{data_detail.categoryName || data_detail.category || "-"}</NxDetailText>
                <NxDetailText label="Sub Category">{data_detail.subCategoryName || data_detail.subCategory || "-"}</NxDetailText>
                <NxDetailText label="Status">
                  <NxStatusComponent colour={isActive ? "active" : "inactive"}>
                    {isActive ? "ACTIVE" : "INACTIVE"}
                  </NxStatusComponent>
                </NxDetailText>
              </div>
              <NxDetailText label="Description">{data_detail.description || "-"}</NxDetailText>
            </NxBaseContainer>
          </NxCardContainer>

          {/* Detail Items */}
          <NxCardContainer header="DATA REQUIREMENT">
            <NxBaseContainer border>
              <NxTable
                idTable="detail-items-table"
                dataSource={detailData}
                columns={detailColumns}
                rowKey="id"
                usePagination={false}
                useSelect={false}
                showAdvanceSearch={false}
                tableScrolled={{ y: 400, x: "max-content" }}
              />
            </NxBaseContainer>
          </NxCardContainer>

          {/* Action Bar */}
          <NxBaseContainer border>
            <div className="flex justify-start">
              <Button
                type="menu"
                onClick={() => navigate(SYSTEM_SETUP_ROUTES.VIEW_DATA_REQUIREMENT_TEMPLATE)}
              >
                Back
              </Button>
            </div>
          </NxBaseContainer>
        </div>
      ) : (
        <NxBaseContainer border>
          <div className="text-center py-10 text-gray-500">No data available</div>
        </NxBaseContainer>
      )}

    </>
  );
};

export default DataRequirementTemplateDetail;
