import { Fragment, useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Button, Popconfirm, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import accountManagementService from "../../../../../../../../../redux/services/account_management/accountManagementService";
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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPrerequisite, setSelectedPrerequisite] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const PAGE_SIZE = 10;
  const [prereqData, setPrereqData] = useState([]);
  const [prereqPage, setPrereqPage] = useState(0);
  const [prereqHasMore, setPrereqHasMore] = useState(true);
  const [prereqLoading, setPrereqLoading] = useState(false);
  const loadingRef = useRef(false);

  const getPrerequisiteOptions = useCallback(() => {
    const source = dropdowns?.serviceRequestPrerequisites;
    if (Array.isArray(source)) return source;
    if (Array.isArray(source?.data)) return source.data;
    return [];
  }, [dropdowns]);

  const getPrerequisiteLabel = useCallback(
    (prerequisiteId) => {
      const options = getPrerequisiteOptions();
      const matched = options.find(
        (item) =>
          item?.glbTypeValId?.toString() === prerequisiteId?.toString() ||
          item?.id?.toString() === prerequisiteId?.toString(),
      );

      return matched?.name || matched?.glbTypeValName || prerequisiteId || "-";
    },
    [getPrerequisiteOptions],
  );

  // Spring Page → 0-based. page=0 adalah halaman pertama.
  // Endpoint: GET /v1/dbs/api/prerequisites/lists?page={page}&size={size}
  const fetchPrerequisites = useCallback(async (page) => {
    const url = `/v1/dbs/api/prerequisites/lists?page=${page}&size=${PAGE_SIZE}`;
    const response = await accountManagementService.getAll(url);
    const payload = response?.data || response;
    const content = payload?.content || [];
    const items = content.map((item, idx) => ({
      ...item,
      key: item.id ?? `${page}-${idx}`,
      type: getPrerequisiteLabel(item.prerequisiteId),
      name: getPrerequisiteLabel(item.prerequisiteId),
      description: item.prerequisiteComments || item.prerequisiteValue || "-",
      status: item.prerequisiteStatus || "-",
      dueDateLabel: item.dueDate || "-",
      completedDateLabel: item.completedDate || "-",
      assignedToLabel: item.assignedTo || "-",
    }));
    const total = payload?.totalElements ?? content.length;
    const hasMore = (page + 1) * PAGE_SIZE < total;
    return { items, hasMore };
  }, [PAGE_SIZE, getPrerequisiteLabel]);

  useEffect(() => {
    setPrereqData([]);
    setPrereqPage(0);
    setPrereqHasMore(true);
    setPrereqLoading(true);
    loadingRef.current = false;
    fetchPrerequisites(0)
      .then(({ items, hasMore }) => {
        setPrereqData(items);
        setPrereqHasMore(hasMore);
      })
      .finally(() => {
        setPrereqLoading(false);
      });
  }, [fetchPrerequisites]);

  const handleLoadMore = useCallback(() => {
    if (loadingRef.current || !prereqHasMore) return Promise.resolve();
    loadingRef.current = true;
    const nextPage = prereqPage + 1;
    return fetchPrerequisites(nextPage)
      .then(({ items, hasMore }) => {
        setPrereqData((prev) => [...prev, ...items]);
        setPrereqPage(nextPage);
        setPrereqHasMore(hasMore);
      })
      .finally(() => {
        loadingRef.current = false;
      });
  }, [prereqPage, prereqHasMore, fetchPrerequisites]);

  const columnMain = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      filter: true,
      render: (text, record, index) => {
        // If you want to show numbers considering pagination:
        // current and pageSize should be available in your component scope
        const current = 1; // Replace with actual current page from state
        const pageSize = 10; // Replace with actual pageSize
        
        // With pagination:
        // return (current - 1) * pageSize + index + 1;
        
        // Without pagination (just sequential):
        return index + 1;
      },
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
          <Tooltip title="Edit">
            <Button type="table-action" onClick={() => console.log("edit")}>
              <SVGIcon name="IconEdit" width={20} />
            </Button>
          </Tooltip>

          <Popconfirm
            title="Are you sure?"
            onConfirm={() => console.log("delete")}
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
    // Use getFieldsValue(true) to get ALL fields, not just touched ones
    const currentFormData = form?.getFieldsValue(true);
    // Check if required service request fields are filled
    const requiredFields = [
      "type",
      "category",
      "subCategory",
      "channel",
      "priority",
      "requestSource",
      "requestDate",
    ];
    const missingFields = requiredFields.filter(
      (field) => !currentFormData?.[field],
    );

    const serializedData = {
      ...currentFormData,
      // Moment objects have toISOString() method, use it to convert to string
      requestDate:
        currentFormData?.requestDate &&
        currentFormData.requestDate._isAMomentObject
          ? currentFormData.requestDate.toISOString()
          : currentFormData?.requestDate,
    };

    navigate(
      "/account-management/account-standard/service-requests/pre-requisites/create",
      {
        state: {
          account,
          customer,
          serviceRequestData: serializedData,
          fromWizard: true,
          returnPath: window.location.pathname,
          returnToStep: currentStep || 2, // Pass the current step index (PreRequisite is step 2)
          // Pass original wizard state so it can be restored
          id: location?.state?.id,
          idAccount: location?.state?.idAccount,
          idCustomer: location?.state?.idCustomer,
          type: location?.state?.type,
        },
      },
    );
  };

  return (
    <Fragment>
      <NxCardContainer header={"PREREQUISITE LIST"}>
        <NxBaseContainer border>
        {/* Create Button */}
        <div className="w-full flex justify-end items-center gap-2.5 mb-5">
          <ButtonComponent
            type={"submit"}
            onClick={handleCreateClick}
            icon={
              <PlusOutlined
                style={{
                  color: "#fff",
                  fontSize: 20,
                }}
              />
            }
            style={{
              backgroundColor: "#0075bf",
              color: "#fff",
              borderColor: "#0075bf",
              border: "1px solid #0075bf",
              borderRadius: "5px",
              height: "48px",
            }}
          >
            Create
          </ButtonComponent>
        </div>

        {/* Prerequisite Table */}
        <NxTable
          idTable="prerequisite-table"
          usePagination={false}
          useInfiniteScroll={true}
          onLoadMore={handleLoadMore}
          hasMore={prereqHasMore}
          useSelect={true}
          dataMain={prereqData}
          columnMain={columnMain}
          fontSize={"medium"}
          loading={prereqLoading}
          tableScrolled={{ x: "max-content", y: 400 }}
          border="true"
        />
        </NxBaseContainer>
      </NxCardContainer>

      <ModalPreRequisiteDetail
        isOpen={isOpen}
        data={selectedPrerequisite}
        footer={null}
        handleCancel={() => {
          setIsOpen(false);
        }}
        handleOk={() => {
          setIsOpen(false);
        }}
      />
    </Fragment>
  );
}
