import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import ViewListIcon from "../../../../assets/Icon/Nx/IconViewList";
import IconEditNx from "../../../../assets/Icon/Nx/IconEdit";
import IconPower from "../../../../assets/Icon/Nx/IconPower";
import SVGIcon from "../../../../assets/Icon/index";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import { TableLoginBackground } from "./Table/TableLoginBackground";
import {
  getPagingBackground,
  inactiveBackground,
  downloadLoginBackground,
} from "../../../../redux/slices/system_setup/login_background";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import ModalApproveOrReject from "../../../../components/Modal/ModalApproveOrReject";
import { ModalError } from "../../../../components/Modal/ModalPopUp";

const LoginBackgroundPage = () => {
  const rawToken = useSelector((state) => state.auth?.token);
  const userId = useMemo(() => {
    try {
      const t = JSON.parse(rawToken || "{}");
      return t?.userId || t?.id || t?.username || null;
    } catch {
      return null;
    }
  }, [rawToken]);

  const dispatch = useDispatch();

  // Filter state
  const [pageSize] = useState(30);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [fixedColumns, setFixedColumns] = useState({ left: [], right: [] });

  // Local data state — avoids Redux loading flash
  const [allData, setAllData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Refs for safe callback access without stale closures
  const pageRef = useRef(0);
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(false);

  // Modal state
  const [activeOrInactive, setActiveOrInactive] = useState(false);
  const [modalInactive, setModalInactive] = useState(false);
  const [chooseId, setChooseId] = useState();
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  // Store last dispatch args so handleRetry can re-dispatch with correct body
  const lastInactiveArgsRef = useRef(null);

  const fetchPage = useCallback(
    async (page, replace = false, signal = null) => {
      if (isFetchingRef.current) return;
      if (signal?.aborted) return;
      isFetchingRef.current = true;
      setIsLoading(true);
      try {
        const result = await dispatch(
          getPagingBackground({
            page: page + 1,
            pageSize,
            sort,
            search: encodeURIComponent(JSON.stringify(search)),
          })
        ).unwrap();
        if (signal?.aborted) return;
        const rows = result?.result ?? [];
        const pageInfo = result?.page ?? {};
        const nextHasMore = page < (pageInfo.totalPages ?? 0) - 1;
        setAllData((prev) => (replace ? rows : [...prev, ...rows]));
        setTotalElements(pageInfo.totalElements ?? 0);
        setHasMore(nextHasMore);
        hasMoreRef.current = nextHasMore;
        pageRef.current = page;
      } catch (e) {
        if (!signal?.aborted) console.error("fetchPage error", e);
      } finally {
        isFetchingRef.current = false;
        if (!signal?.aborted) setIsLoading(false);
      }
    },
    [search, sort, pageSize, dispatch]
  );

  // Reset and reload whenever filters or sort change
  useEffect(() => {
    const signal = { aborted: false };
    pageRef.current = 0;
    setAllData([]);
    setHasMore(false);
    setIsLoading(true);
    fetchPage(0, true, signal);
    return () => {
      signal.aborted = true;
      isFetchingRef.current = false;
    };
  }, [search, sort, pageSize]); // intentionally exclude fetchPage to avoid loop

  const onLoadMore = useCallback(() => {
    if (!hasMoreRef.current || isFetchingRef.current) return;
    return fetchPage(pageRef.current + 1, false);
  }, [fetchPage]);

  const onSort = (_, __, sortInfo) => {
    const dataSort =
      sortInfo.order !== undefined
        ? `${sortInfo.field}~${sortInfo.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleCancel = () => {
    setChooseId();
    setModalInactive(false);
  };

  const handleInactive = (data) => {
    setChooseId(data);
    setModalInactive(true);
    setActiveOrInactive(data?.status);
  };

  const handleConfirm = (e, handleClear) => {
    const args = {
      body: { id: chooseId?.loginBackgroundId, remark: e?.remark },
      action: chooseId?.status,
    };
    lastInactiveArgsRef.current = args;
    dispatch(inactiveBackground(args))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancel();
        const signal = { aborted: false };
        pageRef.current = 0;
        setAllData([]);
        setHasMore(false);
        fetchPage(0, true, signal);
      })
      .catch((error) => {
        if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            error?.toString();
          setBodyError({ message, value: {} });
          setModalError(true);
          handleCancel();
        }
      });
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  const handleRetry = () => {
    if (lastInactiveArgsRef.current) {
      dispatch(inactiveBackground(lastInactiveArgsRef.current))
        .unwrap()
        .then(() => {
          setModalError(false);
          setBodyError({});
          const signal = { aborted: false };
          pageRef.current = 0;
          setAllData([]);
          setHasMore(false);
          fetchPage(0, true, signal);
        })
        .catch(() => {
          setModalError(false);
          setBodyError({});
        });
    } else {
      setModalError(false);
      setBodyError({});
    }
  };

  const handleDownload = () => {
    let tempSearch = "";
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const tempSearchText = search[dataIndex];
        if (tempSearchText) {
          tempSearch += `${dataIndex}~${tempSearchText},`;
        }
      }
    }
    tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    dispatch(
      downloadLoginBackground({ page: 1, pageSize, sort, search: tempSearch })
    );
  };

  const routes = [
    { path: "", breadcrumbName: "System Setup" },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_LOGIN_BACKGROUND,
      breadcrumbName: "Login Background",
    },
  ];

  // Memoized so NxTable column computation is stable across unrelated re-renders
  const itemActions = useMemo(
    () => [
      {
        action: "Download",
        render: (
          <ButtonComponent
            type="submit"
            icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
            onClick={() => handleDownload()}
          >
            Download List
          </ButtonComponent>
        ),
      },
      {
        action: "Create",
        render: (
          <NavLink to={SYSTEM_SETUP_ROUTES.CREATE_LOGIN_BACKGROUND}>
            <ButtonComponent
              icon={<PlusOutlined style={{ fontSize: "24px" }} />}
              type="submit"
            >
              Create Login Background
            </ButtonComponent>
          </NavLink>
        ),
      },
      {
        action: "View",
        type: "table",
        render: (record) => (
          <Link
            to={SYSTEM_SETUP_ROUTES.DETAIL_LOGIN_BACKGROUND}
            state={{ id: record?.loginBackgroundId }}
            className="flex items-center justify-center"
            style={{ color: "#1976D2" }}
          >
            <ViewListIcon />
          </Link>
        ),
      },
      {
        action: "Update",
        type: "table",
        render: (record) => {
          const active = record?.status === "ACTIVE";
          const color = active ? "#1976D2" : "#C0BEC6";
          return (
            <Link
              to={active ? SYSTEM_SETUP_ROUTES.UPDATE_LOGIN_BACKGROUND : undefined}
              state={active ? { id: record?.loginBackgroundId } : undefined}
              style={{ pointerEvents: active ? "auto" : "none", color }}
              className="flex items-center justify-center"
            >
              <IconEditNx color={color} width="18" height="18" />
            </Link>
          );
        },
      },
      {
        action: "Activate",
        type: "table",
        render: (record) => {
          const color = "#1976D2";
          return (
            <span
              className="flex items-center justify-center cursor-pointer"
              style={{ color }}
              onClick={() => handleInactive(record)}
            >
              <IconPower color={color} width="18" height="18" />
            </span>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <>
      <BreadCrumb routes={routes} />

      <NxCardContainer
        header="LOGIN BACKGROUND LIST"
        className="mt-4"
        actions={itemActions}
      >
        <div className="w-full">
          <TableLoginBackground
            userId={userId}
            dataSource={allData}
            loading={isLoading}
            totalData={totalElements}
            current={pageRef.current + 1}
            pageSize={pageSize}
            onSort={onSort}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            useInfiniteScroll={true}
            onLoadMore={onLoadMore}
            hasMore={hasMore}
            itemActions={itemActions}
          />
        </div>
      </NxCardContainer>

      <ModalApproveOrReject
        isOpen={modalInactive}
        handleCloseModal={handleCancel}
        onFinish={handleConfirm}
        header={activeOrInactive === "INACTIVE" ? "activate" : "inactivate"}
        approveOrReject={
          activeOrInactive === "INACTIVE" ? "activate" : "inactivate"
        }
        menu="Login Background"
        named={chooseId?.backgroundName}
      />

      <ModalError
        isOpen={modalError}
        handleOk={handleRetry}
        handleCancel={handleCloseModalError}
        customText="Try Again"
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">Failed</p>
          </div>
          <p className="pl-[70px]">{`Your data was not inactivated. ${bodyError.message}.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </>
  );
};

export default LoginBackgroundPage;
