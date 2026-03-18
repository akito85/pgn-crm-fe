import { Image, Spin } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { React, useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { detailAnnouncement } from "./Table/TableDetailInformation";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import { getAnnouncementDetail } from "../../../../redux/slices/system_setup/announcement";
import { dateFormatting } from "../../../../utils";
import moment from "moment";
import BaseContainer from "../../../../components/BaseContainer";
import DetailText from "../../../../components/DetailText";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import TablePaginationNew from "../../../../components/TablePaginationNew";

const AnnouncementDetail = () => {
  const { loading, detail_Announcement } = useSelector(
    (state) => state.announcement
  );

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const navigate = useNavigate();
  const id = useLocation().state.id;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [typeColumn, setTypeColumn] = useState("string")


  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_ANNOUNCEMENT,
      breadcrumbName: "Announcement",
    },
    {
      path: SYSTEM_SETUP_ROUTES.DETAIL_ANNOUNCEMENT,
      breadcrumbName: "Detail Announcement",
    },
  ];

  useEffect(() => {
    if (id) {
      dispatch(getAnnouncementDetail(id));
    }
  }, [dispatch, id]);

  const renderDateTime = (date) => {
    if (date === null || date === "" || date === undefined) {
      return "";
    } else {
      return `${moment(date).format(dateFormatting.dateTime)}`;
    }
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    switch (dataIndex) {
      case 'createdDate':
        setTypeColumn('datetime')
        break;
      case 'operation':
        setTypeColumn('status')
        break;
    
      default:
        setTypeColumn('string')
        break;
    }
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  return (
    <div>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <BaseContainer header={"ANNOUNCEMENT INFORMATION"}>
          <div className="w-full grid grid-cols-4 gap-4">
            <DetailText label="Name">{detail_Announcement?.annName}</DetailText>
            <DetailText label="Start Date">
              {moment(detail_Announcement?.startDate).format(
                dateFormatting.date
              )}
            </DetailText>
            <DetailText label="End Date">
              {detail_Announcement.endDate
                ? moment(detail_Announcement?.endDate).format(
                    dateFormatting.date
                  )
                : ""}
            </DetailText>
            <DetailText label="Status">
              {detail_Announcement.status
                ? `${detail_Announcement?.status
                    .charAt(0)
                    .toUpperCase()}${detail_Announcement?.status
                    .slice(1)
                    .toLowerCase()}`
                : ""}
            </DetailText>
            <div className="col-span-4">
              <DetailText label="Description">
                {detail_Announcement?.description || ""}
              </DetailText>
            </div>
            <div className="col-span-4">
              {detail_Announcement.contentType === "HTML" ? (
                <DetailText label={"Content"}>
                  {detail_Announcement.annContent}
                </DetailText>
              ) : (
                <DetailText label={"Content"}>
                  <Image
                    width={300}
                    src={detail_Announcement?.urlLogo2}
                    className="my-2"
                  />
                </DetailText>
              )}
            </div>
          </div>
        </BaseContainer>
        <BaseContainer header={"History Log Information"}>
          <div className="w-full grid grid-cols-5 gap-5">
            <DetailText label="Record Id">
              {detail_Announcement?.announcementId}
            </DetailText>
            <DetailText label="Created Date">
              {renderDateTime(detail_Announcement?.createdDate)}
            </DetailText>
            <DetailText label="Created By">
              {detail_Announcement?.createdBy}
            </DetailText>
            <DetailText label="Update Date">
              {renderDateTime(detail_Announcement?.updatedDate)}
            </DetailText>
            <DetailText label="Updated By">
              {detail_Announcement?.updatedBy}
            </DetailText>
          </div>
        </BaseContainer>
        <BaseContainer header={"ACTIVATE/INACTIVE LOG INFORMATION"}>
          <div className={"w-full"}>
            <TablePaginationNew
              type="FE"
              dataSource={detail_Announcement?.activeInactiveLog}
              columns={detailAnnouncement(
                search,
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
              )}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              // totalData={updatePagination(detail_Announcement?.activeInactiveLog, 'length', searchedColumn, searchText, page, pageSize, typeColumn)}
              onSort={onSort}
              tableScrolled={{ y: 525, x: 1000 }}
            />
          </div>
        </BaseContainer>
        <div className="flex my-[30px]">
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
    </div>
  );
};

export default AnnouncementDetail;
