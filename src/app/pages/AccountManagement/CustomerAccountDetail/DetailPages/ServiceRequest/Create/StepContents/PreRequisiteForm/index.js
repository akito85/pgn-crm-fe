import { Fragment, useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { Button, Popconfirm, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import {
  getSrPrerequisites,
  deleteSrPrerequisite,
  getSrPrerequisiteTemplate,
} from "../../../../../../../../../redux/slices/account_management/detailAccount/ServiceRequestSlice";
import ButtonComponent from "../../../../../../../../../components/ButtonComponent";
import NxTable from "../../../../../../../../../components/Nx/NxTable";
import NxCardContainer from "../../../../../../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer";
import SVGIcon from "../../../../../../../../../assets/Icon/index";

import ModalPreRequisiteDetail from "./ModalPreRequisiteDetail";

export default function PreRequisiteForm({
  form,
  account,
  customer,
  dropdowns,
  currentStep,
}) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPrerequisite, setSelectedPrerequisite] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const srId = location?.state?.id;
  const accountId = account?.accountInformation?.accountId;
  const isCreateFlow = !srId; // TRUE = SR baru, belum punya ID

  const PAGE_SIZE = 10;
  // Remote data (UPDATE flow: srId ada)
  const [prereqData, setPrereqData] = useState([]);
  const [prereqPage, setPrereqPage] = useState(1);
  const [prereqHasMore, setPrereqHasMore] = useState(false);
  const [prereqLoading, setPrereqLoading] = useState(false);
  const loadingRef = useRef(false);
  const newPrerequisiteProcessed = useRef(false);
  const [page, setPage] = useState(0);
  const [loadMoreSize] = useState(20);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [filters, setFilters] = useState([]);
  const [filterRules, setFilterRules] = useState([]);

  const {
    loading_prerequisiteTemplate,
    list_prerequisiteTemplate,
    pagination_prerequisiteTemplate,
  } = useSelector((state) => state.serviceRequest);

  useEffect(() => {
    const body = {
      accountId,
      srTypeId: form?.getFieldValue("type"),
      srCategoryId: form?.getFieldValue("category"),
      srSubCategoryId: form?.getFieldValue("subCategory"),
      page: 0,
      size: loadMoreSize,
      sort,
      filters,
      filterRules,
      searchs: search,
    };
    setPage(0);
    const promise = dispatch(getSrPrerequisiteTemplate({ body, isLoadMore: false }));
    return () => { promise.abort(); };
  }, [sort, search, filters, filterRules]);

  // Local data (CREATE flow: belum ada srId, simpan di form field)
  const [localPrereqs, setLocalPrereqs] = useState(() =>
    form?.getFieldValue("srFormPreRequisites") || []
  );

  const getPrerequisiteLabel = useCallback(
    (prerequisiteId) => {
      const source = dropdowns?.serviceRequestPrerequisites;
      const options = Array.isArray(source) ? source : Array.isArray(source?.data) ? source.data : [];
      const matched = options.find(
        (item) =>
          item?.glbTypeValId?.toString() === prerequisiteId?.toString() ||
          item?.id?.toString() === prerequisiteId?.toString(),
      );
      return matched?.name || matched?.glbTypeValName || prerequisiteId || "-";
    },
    [dropdowns],
  );

  const mapItems = useCallback(
    (content = [], page) =>
      content.map((item, idx) => ({
        ...item,
        key: item.id ?? `${page}-${idx}`,
        type: getPrerequisiteLabel(item.prerequisiteId),
        name: item.prerequisiteName || getPrerequisiteLabel(item.prerequisiteId),
        description: item.prerequisiteComments || item.prerequisiteValue || "-",
        status: item.prerequisiteStatus || "-",
        dueDateLabel: item.dueDate || "-",
        completedDateLabel: item.completedDate || "-",
        assignedToLabel: item.assignedTo || "-",
      })),
    [getPrerequisiteLabel],
  );

  const fetchPage = useCallback(
    async (page) => {
      if (!accountId || !srId) return;
      const result = await dispatch(
        getSrPrerequisites({ accountId, srId, page, size: PAGE_SIZE }),
      ).unwrap();

      const payload = result?.data ?? result;
      const content = payload?.content ?? payload?.result ?? [];
      const totalElements = payload?.totalElements ?? payload?.page?.totalElements ?? 0;
      const hasMore = page * PAGE_SIZE < totalElements;

      return { items: mapItems(content, page), hasMore };
    },
    [dispatch, accountId, srId, mapItems],
  );

  const loadFirst = useCallback(() => {
    if (!accountId || !srId) return;
    setPrereqData([]);
    setPrereqPage(1);
    setPrereqHasMore(false);
    setPrereqLoading(true);
    loadingRef.current = false;
    fetchPage(1)
      .then(({ items, hasMore }) => {
        setPrereqData(items);
        setPrereqHasMore(hasMore);
      })
      .catch(() => {})
      .finally(() => setPrereqLoading(false));
  }, [fetchPage, accountId, srId]);

  useEffect(() => {
    loadFirst();
  }, [loadFirst]);

  // Tangkap prerequisite baru dari Create page (CREATE flow)
  // Ref guard untuk React StrictMode double-mount; window.history.replaceState
  // untuk mencegah duplikat saat komponen unmount+remount (user pindah step lalu kembali)
  useEffect(() => {
    const newPrerequisite = location?.state?.newPrerequisite;
    if (newPrerequisite && isCreateFlow && !newPrerequisiteProcessed.current) {
      newPrerequisiteProcessed.current = true;

      // Hapus newPrerequisite dari history state agar tidak diproses ulang saat remount
      window.history.replaceState(
        { ...window.history.state, usr: { ...location.state, newPrerequisite: undefined } },
        "",
      );

      const mapped = {
        ...newPrerequisite,
        key: `local-${Date.now()}`,
        type: getPrerequisiteLabel(newPrerequisite.prerequisiteId),
        name: newPrerequisite.prerequisiteName || getPrerequisiteLabel(newPrerequisite.prerequisiteId),
        description: newPrerequisite.prerequisiteComments || "-",
        status: "-",
        dueDateLabel: "-",
        completedDateLabel: "-",
        assignedToLabel: "-",
      };
      setLocalPrereqs((prev) => {
        const updated = [...prev, mapped];
        form?.setFieldsValue({ srFormPreRequisites: updated });
        return updated;
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadMore = useCallback(() => {
    if (loadingRef.current || !prereqHasMore) return Promise.resolve();
    loadingRef.current = true;
    const nextPage = prereqPage + 1;
    return fetchPage(nextPage)
      .then(({ items, hasMore }) => {
        setPrereqData((prev) => [...prev, ...items]);
        setPrereqPage(nextPage);
        setPrereqHasMore(hasMore);
      })
      .catch(() => {})
      .finally(() => {
        loadingRef.current = false;
      });
  }, [prereqPage, prereqHasMore, fetchPage]);

  const handleDelete = useCallback(
    async (record) => {
      if (isCreateFlow) {
        setLocalPrereqs((prev) => {
          const updated = prev.filter((item) => item.key !== record.key);
          form?.setFieldsValue({ srFormPreRequisites: updated });
          return updated;
        });
        return;
      }
      await dispatch(
        deleteSrPrerequisite({ accountId, srId, id: record.id }),
      );
      loadFirst();
    },
    [dispatch, accountId, srId, isCreateFlow, form, loadFirst],
  );

  const columnMain = [
    // TODO: tambahkan mekanisme checkbox saat di next maka yang di centang akan disimpan dalam state untuk di bawa ke step berikutnya
    {
      title: "Select", // TODO: rubah jadi icon checkbox
      dataIndex: "select",
      key: "select",
      width: 50,
      align: "center",
      render: (_, record) => (
        <input
          type="checkbox"
          checked={record.selected || false}
          onChange={(e) => {
            const checked = e.target.checked;
            if (isCreateFlow) {
              setLocalPrereqs((prev) =>
                prev.map((item) =>
                  item.key === record.key ? { ...item, selected: checked } : item,
                ),
              );
            } else {
              setPrereqData((prev) =>
                prev.map((item) =>
                  item.key === record.key ? { ...item, selected: checked } : item,
                ),
              );
            }
          }}
        />
      ),
    },
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "TYPE",
      dataIndex: "typeName",
      key: "typeName",
    },
    {
      title: "PREREQUISITE NAME",
      dataIndex: "name",
      key: "name",
      filter: true,
      align: 'left',
      ellipsis: { maxChars: 50 },
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
    },
    // {
    //   title: "STATUS",
    //   dataIndex: "status",
    //   key: "status",
    // },
    // {
    //   title: "DUE DATE",
    //   dataIndex: "dueDateLabel",
    //   key: "dueDate",
    // },
    // {
    //   title: "COMPLETED DATE",
    //   dataIndex: "completedDateLabel",
    //   key: "completedDate",
    // },
    // {
    //   title: "ASSIGNED TO",
    //   dataIndex: "assignedToLabel",
    //   key: "assignedTo",
    // },
    {
      title: "ACTIONS",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <div className="flex justify-center align-middle gap-2 py-1">
          <Tooltip title="Detail">
            <Button
              type="table-action"
              onClick={() => {
                setSelectedPrerequisite(record);
                setIsOpen(true);
              }}
            >
              <SVGIcon name="IconDetail" width={20} />
            </Button>
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this prerequisite?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button type="table-action">
                <SVGIcon name="IconDelete" width={20} />
              </Button>
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleCreateClick = () => {
    const currentFormData = form?.getFieldsValue(true);
    const serializedData = {
      ...currentFormData,
      requestDate: currentFormData?.requestDate?._isAMomentObject
        ? currentFormData.requestDate.toISOString()
        : currentFormData?.requestDate,
    };

    // Simpan ke sessionStorage agar tidak hilang saat halaman remount
    try {
      sessionStorage.setItem("srWizardFormData", JSON.stringify(serializedData));
    } catch (_) {}

    const basePath = location?.pathname?.includes("account-standard")
      ? "/account-management/account-standard"
      : "/account-management/account-onetime";

    navigate(`${basePath}/service-requests/pre-requisites/create`, {
      state: {
        account,
        customer,
        serviceRequestData: serializedData,
        srId,
        accountId,
        fromWizard: true,
        returnPath: location?.pathname,
        returnToStep: currentStep ?? 2,
      },
    });
  };

  return (
    <Fragment>
      <NxCardContainer header={"PREREQUISITE LIST"}>
        <NxBaseContainer border>
          {/* Create Button */}
          <div className="w-full flex justify-end items-center">
            <Button
              icon={<SVGIcon name="IconButtonCreate" width={14} />}
              type={"submit"}
              border={false}
              onClick={handleCreateClick}
            >
              Create
            </Button>
          </div>

          {/* Prerequisite Table */}
          <NxTable
            idTable="prerequisite-table"
            dataSource={list_prerequisiteTemplate}
            usePagination={false}
            useInfiniteScroll={!isCreateFlow}
            onLoadMore={handleLoadMore}
            hasMore={isCreateFlow ? false : prereqHasMore}
            useSelect={true}
            dataMain={isCreateFlow ? localPrereqs : prereqData}
            columnMain={columnMain}
            fontSize={"medium"}
            loading={isCreateFlow ? false : prereqLoading}
            tableScrolled={{ x: "max-content", y: 400 }}
            border="true"
          />
        </NxBaseContainer>
      </NxCardContainer>

      <ModalPreRequisiteDetail
        isOpen={isOpen}
        data={selectedPrerequisite}
        handleCancel={() => setIsOpen(false)}
        handleOk={() => setIsOpen(false)}
      />
    </Fragment>
  );
}
