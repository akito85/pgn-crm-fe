import {
  LeftOutlined,
  UnorderedListOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import DetailText from "../../../../components/DetailText";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import { useDispatch, useSelector } from "react-redux";
import {
  getDetailGroupAccess,
  getDetailUser,
} from "../../../../redux/slices/user_management/user";
import { USER_ROUTES } from "../../../../routes/user_management/user_routes";
import moment from "moment";
import { ModalConfirm } from "../../../../components/Modal/ModalPopUp";
import DetailGroupAccessLayout from "./DetailGroupAccessLayout";
import {
  dateFormatting,
  hasValue,
  renderColumn,
  renderDateColumn,
  toTitleCase,
} from "../../../../utils";
import { useRef } from "react";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import { getColumnSearchProps } from "../../../../utils/getColumnSearchProps";
import { sorterFunction } from "../../../../utils/sorterFunction";
import { columnChangeAuthHistory } from "./ColumnDetail/ColumnChangeAuthHistory";
import { columnGenerateHistory } from "./ColumnDetail/ColumnGenerateHistroy";
import TablePaginationNew from "../../../../components/TablePaginationNew";

const DetailUser = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const { data_user, loading, data_detail } = useSelector(
    (state) => state.user,
  );
  const location = useLocation();
  const datas = data_user?.data;
  const [currentTax, setCurrentTax] = useState(1);
  const [sizeTax, setSizeTax] = useState(10);
  const [currentGenerate, setCurrentGenerate] = useState(1);
  const [sizeGenerate, setSizeGenerate] = useState(10);
  const [currentChangeAuth, setCurrentChangeAuth] = useState(1);
  const [sizeChangeAuth, setSizeChangeAuth] = useState(10);
  const [modalBack, setModalBack] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchTextGenerate, setSearchTextGenerate] = useState("");
  const [searchTextChangeAuth, setSearchTextChangeAuth] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchedColumnChangeAuth, setSearchedColumnChangeAuth] = useState("");
  const [searchedColumnGenerate, setSearchedColumnGenerate] = useState("");
  const searchInput = useRef(null);
  const searchInputChangeAuth = useRef(null);
  const searchInputGenerate = useRef(null);
  const [search, setSearch] = useState({});
  const [searchChangeAuth, setSearchChangeAuth] = useState({});
  const [searchGenerate, setSearchGenerate] = useState({});
  const [body, setBody] = useState({});
  const [typeColumn, setTypeColumn] = useState("string");
  const [typeColumnChangeAuth, setTypeColumnChangeAuth] = useState("string");
  const [typeColumnGenerate, setTypeColumnGenerate] = useState("string");

  useEffect(() => {
    if (hasValue(location.state.id)) {
      dispatch(getDetailUser(location?.state?.id));
    }
  }, [location.state.id, dispatch]);

  // handle cancel modals
  const handleCancel = () => {
    setOpenModal(false);
  };

  const handleDataPagination = (pageChange, pageSizeChange) => {
    setCurrentTax(sizeTax !== pageSizeChange ? 1 : pageChange);
    setSizeTax(pageSizeChange);
  };
  const handleDataPaginationGenerate = (currentTax, sizeTax) => {
    setCurrentChangeAuth(sizeChangeAuth !== sizeTax ? 1 : currentTax);
    setSizeChangeAuth(sizeTax);
  };
  const handleDataPaginationChangeAuth = (
    currentChangeAuthChange,
    sizeChangeAuthChange,
  ) => {
    setCurrentChangeAuth(
      sizeChangeAuth !== sizeChangeAuthChange ? 1 : currentChangeAuthChange,
    );
    setSizeChangeAuth(sizeChangeAuthChange);
  };

  // handle detail ga
  const handleDetail = async (object) => {
    try {
      setBody(object?.gaId);
      await dispatch(getDetailGroupAccess(object?.gaId))?.unwrap();
      setOpenModal(true);
    } catch (error) {
      handleCancel();
    }
  };

  // handle search
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    switch (dataIndex) {
      case "startDate":
      case "endDate":
        setTypeColumn("dateCapital");
        break;
      case "operation":
        setTypeColumn("status");
        break;
      default:
        setTypeColumn("string");
        break;
    }
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setCurrentTax(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };
  const handleSearchChangeAuth = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTextChangeAuth(selectedKeys[0]);
    switch (dataIndex) {
      case "createdDate":
        setTypeColumnChangeAuth("date");
        break;
      default:
        setTypeColumnChangeAuth("string");
        break;
    }
    setSearchedColumnChangeAuth(dataIndex);
    setSearchChangeAuth((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setCurrentChangeAuth(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };
  const handleSearchGenerate = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTextGenerate(selectedKeys[0]);
    switch (dataIndex) {
      case "startDate":
      case "endDate":
        setTypeColumnGenerate("dateCapital");
        break;
      case "operation":
        setTypeColumnGenerate("status");
        break;
      default:
        setTypeColumnGenerate("string");
        break;
    }
    setSearchedColumnGenerate(dataIndex);
    setSearchGenerate((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setCurrentGenerate(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const coloumnsGA = [
    {
      title: "NO",
      dataIndex: "key",
      key: "key",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "GROUP ACCESS",
      dataIndex: "groupAccess",
      key: "groupAccess",
      width: 350,
      sorter: (a, b) => sorterFunction("groupAccess", a, b),
      ...getColumnSearchProps(
        "groupAccess",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
      ),
      render: (text) =>
        renderColumn(
          "groupAccess",
          searchedColumn,
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      align: "center",
      width: 150,
      sorter: (a, b) => sorterFunction("startDate", a, b, "date"),
      ...getColumnSearchProps(
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "dateCapital",
      ),
      render: (text) =>
        renderDateColumn(
          "startDate",
          hasValue(search["startDate"]),
          searchText,
          text,
          "dateCapital",
          search,
        ),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      align: "center",
      width: 150,
      sorter: (a, b) => sorterFunction("endDate", a, b, "date"),
      ...getColumnSearchProps(
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "dateCapital",
      ),
      render: (v) =>
        renderDateColumn(
          "endDate",
          hasValue(search["endDate"]),
          searchText,
          v,
          "dateCapital",
          search,
        ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      sorter: (a, b) => sorterFunction("status", a, b),
      ...getColumnSearchProps(
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        "status",
      ),
      fixed: "right",
      render: (text) =>
        renderColumn(
          "status",
          searchedColumn,
          searchText,
          text,
          false,
          "status",
          search,
        ),
    },
    {
      title: "ACTION",
      dataIndex: "action",
      key: "action",
      width: 100,
      fixed: "right",
      render: (v, r) => {
        return (
          <div className={"w-full flex justify-center"}>
            <ButtonComponent
              icon={<UnorderedListOutlined style={{ fontSize: 24 }} />}
              border={false}
              onClick={() => {
                handleDetail(r);
              }}
            />
          </div>
        );
      },
    },
  ];

  const routes = [
    {
      path: "",
      breadcrumbName: "User Management",
    },
    {
      path: USER_ROUTES.VIEW_USER,
      breadcrumbName: "List User",
    },
    {
      path: "",
      breadcrumbName: "Detail User",
    },
  ];
  const handleOk = () => {
    navigate(USER_ROUTES.VIEW_USER);
  };

  // handle retry
  const handleRetry = () => {
    handleCancelTryAgain();
    dispatch(getDetailUser(location.state.id));
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);
  return (
    <LayoutMenu>
      <div>
        <BreadCrumb routes={routes} />
        <Spin spinning={loading}>
          <BaseContainer header={"USER INFORMATION"}>
            <div className={"w-full grid grid-cols-4"}>
              <DetailText label={"User Type"}>{datas?.userType}</DetailText>
              <DetailText label={"User Level"}>{datas?.userLevel}</DetailText>
              <DetailText label={"Employee"}>{datas?.employee}</DetailText>
              <DetailText label={"Username"}>{datas?.username}</DetailText>
              <DetailText label={"Email"}>{datas?.email}</DetailText>
              <DetailText label={"Mobile Phone"}>{datas?.phone}</DetailText>
              <DetailText label={"Start Date"}>
                {moment(datas?.startDate).format(dateFormatting.dateCapital)}
              </DetailText>
              <DetailText label={"End Date"}>
                {datas?.endDate &&
                  moment(datas?.endDate).format(dateFormatting.dateCapital)}
              </DetailText>
              <DetailText label={"Status"}>
                {toTitleCase(datas?.status)}
              </DetailText>
              <DetailText label={"Auth Type"}>{datas?.authType}</DetailText>
              <DetailText label={"Description"}>
                {datas?.description}
              </DetailText>
            </div>
          </BaseContainer>
          <BaseContainer header={"HISTORY LOG INFORMATION"}>
            <div className={"w-full grid grid-cols-5"}>
              <DetailText label={"Record Id"}>{datas?.userId}</DetailText>
              <DetailText label={"Created Date"}>
                {hasValue(datas?.createdDate) &&
                  moment(datas?.createdDate).format(dateFormatting.dateTime)}
              </DetailText>
              <DetailText label={"Created By"}>{datas?.createdBy}</DetailText>
              <DetailText label={"Updated Date "}>
                {hasValue(datas?.updatedDate) &&
                  moment(datas?.updatedDate).format(dateFormatting.dateTime)}
              </DetailText>
              <DetailText label={"Updated By"}>{datas?.updatedBy}</DetailText>
            </div>
          </BaseContainer>
          <BaseContainer header={"GROUP ACCESS HISTORY"}>
            <TablePaginationNew
              type="FE"
              dataSource={datas?.tUserGroupAccess}
              columns={coloumnsGA}
              current={currentTax}
              pageSize={sizeTax}
              onChange={handleDataPagination}
              onShowSizeChange={handleDataPagination}
              tableScrolled={{ x: 1200, y: 550 }}
            />
          </BaseContainer>
          <BaseContainer header={"GENERATE LINK PASSWORD HISTORY"}>
            <TablePaginationNew
              type="FE"
              dataSource={datas?.generateLinkHistory}
              columns={columnGenerateHistory(
                searchGenerate,
                currentGenerate,
                sizeGenerate,
                searchInputGenerate,
                searchedColumnGenerate,
                searchTextGenerate,
                handleSearchGenerate,
              )}
              current={currentGenerate}
              pageSize={sizeGenerate}
              onChange={handleDataPaginationGenerate}
              tableScrolled={{ x: 1200, y: 550 }}
            />
          </BaseContainer>
          <BaseContainer header={"CHANGE AUTHENTICATION HISTORY"}>
            <TablePaginationNew
              type="FE"
              dataSource={datas?.changeAuthTpeHistory}
              columns={columnChangeAuthHistory(
                searchChangeAuth,
                currentChangeAuth,
                sizeChangeAuth,
                searchInputChangeAuth,
                searchedColumnChangeAuth,
                searchTextChangeAuth,
                handleSearchChangeAuth,
              )}
              current={currentChangeAuth}
              pageSize={sizeChangeAuth}
              onChange={handleDataPaginationChangeAuth}
              tableScrolled={{ x: 1200, y: 550 }}
            />
          </BaseContainer>

          {/* back */}
          <div className="mt-[30px] flex mb-5">
            <ButtonComponent
              type={"submit"}
              onClick={() => navigate(-1)}
              icon={
                <LeftOutlined
                  style={{
                    color: "#fff",
                    fontSize: 16,
                    justifyItems: "left",
                  }}
                ></LeftOutlined>
              }
            >
              Back
            </ButtonComponent>
          </div>
        </Spin>
      </div>
      <ModalCustom
        isOpen={openModal}
        handleCancel={handleCancel}
        header={"DETAIL GROUP ACCESS"}
        footer={
          <ButtonComponent
            // type={"submit"}
            onClick={handleCancel}
            border={true}
          >
            Back
          </ButtonComponent>
        }
        width={850}
      >
        <Spin spinning={loading}>
          <DetailGroupAccessLayout data={data_detail?.data} />
        </Spin>
      </ModalCustom>

      {/* modal back */}
      <ModalConfirm
        isOpen={modalBack}
        handleCancel={() => setModalBack(false)}
        handleOk={() => navigate(-1)}
        width={400}
      >
        <div className="flex justify-center mt-5 gap-[20px]">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <p className="text-[18px] font-bold">
            Are you sure you want to back?
          </p>
        </div>
      </ModalConfirm>

      {/* modal try again */}
      {renderModal()}
    </LayoutMenu>
  );
};

export default DetailUser;
