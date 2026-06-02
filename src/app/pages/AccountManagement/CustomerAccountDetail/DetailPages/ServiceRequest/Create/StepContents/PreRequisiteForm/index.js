import { Fragment, useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { Button, Popconfirm, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import {
  getServiceRequestPreRequisites,
  deleteSrPrerequisite,
  saveCreateSrFormData,
  saveCreateSrAttachments,
  removeCreateSrPrerequisite,
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
  attachments = [],
}) {
  const dispatch = useDispatch();
  const { create_sr } = useSelector((state) => state.serviceRequest);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPrerequisite, setSelectedPrerequisite] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const serviceRequestId = location?.state?.id;
  const accountId = account?.accountInformation?.accountId;
  const isCreateFlow = !serviceRequestId; // TRUE = SR baru, belum punya ID

  const PAGE_SIZE = 10;
  // Remote data (UPDATE flow: serviceRequestId ada)
  const [prereqData, setPrereqData] = useState([]);
  const [prereqPage, setPrereqPage] = useState(1);
  const [prereqHasMore, setPrereqHasMore] = useState(false);
  const [prereqLoading, setPrereqLoading] = useState(false);
  const loadingRef = useRef(false);

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
      if (!accountId || !serviceRequestId) return;
      const result = await dispatch(
        getServiceRequestPreRequisites({ accountId, serviceRequestId }),
      ).unwrap();

      const payload = result?.data ?? result;
      const content = payload?.content ?? payload?.result ?? [];
      const totalElements = payload?.totalElements ?? payload?.page?.totalElements ?? 0;
      const hasMore = page * PAGE_SIZE < totalElements;

      return { items: mapItems(content, page), hasMore };
    },
    [dispatch, accountId, serviceRequestId, mapItems],
  );

  const loadFirst = useCallback(() => {
    if (!accountId || !serviceRequestId) return;
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
  }, [fetchPage, accountId, serviceRequestId]);

  useEffect(() => {
    loadFirst();
  }, [loadFirst]);

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
        dispatch(removeCreateSrPrerequisite(record.key));
        return;
      }
      await dispatch(
        deleteSrPrerequisite({ accountId, serviceRequestId, id: record.id }),
      );
      loadFirst();
    },
    [dispatch, accountId, serviceRequestId, isCreateFlow, loadFirst],
  );

  const columnMain = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      render: (_, __, index) => index + 1,
    },
    {
      title: "TYPE",
      dataIndex: "type",
      key: "type",
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
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "DUE DATE",
      dataIndex: "dueDateLabel",
      key: "dueDate",
    },
    {
      title: "COMPLETED DATE",
      dataIndex: "completedDateLabel",
      key: "completedDate",
    },
    {
      title: "ASSIGNED TO",
      dataIndex: "assignedToLabel",
      key: "assignedTo",
    },
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

    dispatch(saveCreateSrFormData(serializedData));
    dispatch(saveCreateSrAttachments(attachments));

    const basePath = location?.pathname?.includes("account-standard")
      ? "/account-management/account-standard"
      : "/account-management/account-onetime";

    navigate(`${basePath}/service-requests/pre-requisites/create`, {
      state: {
        account,
        customer,
        serviceRequestData: serializedData,
        srId: serviceRequestId,
        accountId,
        type: location?.state?.type,
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
            usePagination={false}
            useInfiniteScroll={!isCreateFlow}
            onLoadMore={handleLoadMore}
            hasMore={isCreateFlow ? false : prereqHasMore}
            useSelect={true}
            dataMain={isCreateFlow ? (create_sr?.prerequisites ?? []) : prereqData}
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
