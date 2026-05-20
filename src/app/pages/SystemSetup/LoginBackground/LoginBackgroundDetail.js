import { React, useRef, useState, useEffect } from "react";
import moment from "moment";
import { LeftOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import DetailText from "../../../../components/DetailText";
import { dateFormatting, hasValue } from "../../../../utils";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import { columnsDetailLoginBackground } from "./Table/TableDetailBackground";
import { getDetailBackground } from "../../../../redux/slices/system_setup/login_background";
import { updatePagination } from "../../../../utils/updatePagination";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import { Spin } from "antd";

const LoginBackgroundDetail = () => {
  const { detail_Background, loading } = useSelector(
    (state) => state.login_background
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = useLocation().state.id;
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [typeColumn, setTypeColumn] = useState('string');
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [modalInactive, setModalInactive] = useState(false);
  const [chooseId, setChooseId] = useState();
  const [activeOrInactive, setActiveOrInactive] = useState("");

  useEffect(() => {
    // console.log("here 1");
    if (id) {
      // console.log("here id");
      dispatch(getDetailBackground(id));
    }
  }, [dispatch, id]);

  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_LOGIN_BACKGROUND,
      breadcrumbName: "Login Background",
    },
    {
      path: SYSTEM_SETUP_ROUTES.DETAIL_LOGIN_BACKGROUND,
      breadcrumbName: "Detail Login Background",
    },
  ];

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

  const handleInactive = (data) => {
    setChooseId(data);
    setModalInactive(true);
    setActiveOrInactive(data?.status);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  return (
    <>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading}>

        <BaseContainer header={"LOGIN BACKGROUND INFORMATION"}>
          <div className={"w-auto grid grid-cols-2 gap-10"}>
            <div className={"flex flex-col w-full"}>
              <DetailText label={"Login Background"}>
                {detail_Background?.backgroundName}
              </DetailText>
              <DetailText label={"Start Date"}>
                {hasValue(detail_Background?.startDate) && moment(detail_Background?.startDate).format(dateFormatting.date)}
              </DetailText>
              <DetailText label={"End Date"}>
                {detail_Background.endDate
                  ? moment(detail_Background?.endDate).format(dateFormatting.date)
                  : ""}
              </DetailText>
              <DetailText label={"Status"}>
                {detail_Background.status
                  ? `${detail_Background?.status
                    .charAt(0)
                    .toUpperCase()}${detail_Background?.status
                      .slice(1)
                      .toLowerCase()}`
                  : ""}
              </DetailText>
              <DetailText label={"Description"}>
                {detail_Background?.description}
              </DetailText>
            </div>
            <div className={"flex flex-col w-full"}>
              <img src={detail_Background?.urlLogo2} width={300} />
            </div>
          </div>
        </BaseContainer>
        <BaseContainer header={"HISTORY LOG INFORMATION"}>
          <div className="w-full grid grid-cols-5 gap-5">
            <DetailText label="Record Id">
              {detail_Background?.loginBackgroundId}
            </DetailText>
            <DetailText label="Created Date">
              {hasValue(detail_Background?.createdDate) &&
                renderDateTime(detail_Background?.createdDate)}
            </DetailText>
            <DetailText label="Created By">
              {detail_Background?.createdBy}
            </DetailText>
            <DetailText label="Updated Date">
              {hasValue(detail_Background?.updatedDate) &&
                renderDateTime(detail_Background?.updatedDate)}
            </DetailText>
            <DetailText label="Updated By">
              {detail_Background?.updatedBy}
            </DetailText>
          </div>
        </BaseContainer>
        <BaseContainer header={"ACTIVATE/INACTIVE LOG INFORMATION"}>
          <div className={"w-full"}>
            <TablePaginationNew
              type='FE'
              dataSource={detail_Background?.activeInactiveLog}
              columns={columnsDetailLoginBackground(
                search,
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                handleInactive
              )}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              totalData={updatePagination(detail_Background?.activeInactiveLog, 'length', searchedColumn, searchText, page, pageSize, typeColumn)}
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
    </>
  );
};

export default LoginBackgroundDetail;
