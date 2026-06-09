import { Fragment, useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { Button, Checkbox, Popconfirm, Tooltip } from "antd";

import {
  getSrPrerequisiteTemplate,
  saveCreateSrFormData,
  saveCreateSrAttachments,
  removeCreateSrPrerequisite,
  removeEditedApiPrerequisite,
} from "../../../../../../../../../redux/slices/account_management/detailAccount/ServiceRequestSlice";
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
  const {
    create_sr,
    edited_api_prerequisites = {},
    detail_serviceRequest,
  } = useSelector((state) => state.serviceRequest);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPrerequisite, setSelectedPrerequisite] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const serviceRequestId = location?.state?.id;
  const accountId = account?.accountInformation?.accountId;

  const [prereqData, setPrereqData] = useState([]);

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
    if (!accountId) return;
    const body = {
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
    const promise = dispatch(getSrPrerequisiteTemplate({ accountId, body, isLoadMore: false }));
    return () => { promise.abort(); };
  }, [sort, search, filters, filterRules, accountId]); // eslint-disable-line react-hooks/exhaustive-deps

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

  useEffect(() => {
    if (!detail_serviceRequest) return;
    const items = mapItems(detail_serviceRequest?.preRequisites || [], 0);
    setPrereqData(items);
    form?.setFieldsValue({ srFormPreRequisites: items });
  }, [detail_serviceRequest, mapItems]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = useCallback(
    (record) => {
      if (record._isCreated) {
        dispatch(removeCreateSrPrerequisite(record.key));
        return;
      }
      setPrereqData((prev) => {
        const updated = prev.filter((item) => item.key !== record.key);
        form?.setFieldsValue({ srFormPreRequisites: updated });
        return updated;
      });
      dispatch(removeEditedApiPrerequisite(record.key));
    },
    [dispatch, form],
  );

  // Track which template rows the user has checked
  const [selectedTemplateKeys, setSelectedTemplateKeys] = useState(new Set());

  // Inject `selected` flag into the template data so the table reflects check state
  const templateDisplayData = useMemo(() => {
    const items = list_prerequisiteTemplate || [];
    return items.map((item) => {
      const key = item.key ?? item.id ?? `tmpl-${item.prerequisiteId}`;
      return { ...item, key, selected: selectedTemplateKeys.has(key), _isTemplate: true };
    });
  }, [list_prerequisiteTemplate, selectedTemplateKeys]);

  const tableDataSource = useMemo(() => {
    const created = (create_sr?.prerequisites ?? []).map((item) => ({ ...item, _isCreated: true }));
    const existing = prereqData.map((item) => ({
      ...item,
      ...(edited_api_prerequisites[item.key] ?? {}),
    }));
    return [...templateDisplayData, ...existing, ...created];
  }, [templateDisplayData, prereqData, create_sr?.prerequisites, edited_api_prerequisites]);

  const allSelected = templateDisplayData.length > 0 && templateDisplayData.every((item) => item.selected);
  const someSelected = templateDisplayData.some((item) => item.selected) && !allSelected;

  const handleSelectAll = useCallback(
    (checked) => {
      const nextKeys = checked ? new Set(templateDisplayData.map((item) => item.key)) : new Set();
      setSelectedTemplateKeys(nextKeys);
      const selected = checked ? templateDisplayData : [];
      form?.setFieldsValue({ srFormSelectedPreRequisites: selected });
    },
    [templateDisplayData, form],
  );

  const handleSelectOne = useCallback(
    (record, checked) => {
      setSelectedTemplateKeys((prev) => {
        const next = new Set(prev);
        if (checked) next.add(record.key);
        else next.delete(record.key);
        const selected = templateDisplayData.filter((item) => next.has(item.key));
        form?.setFieldsValue({ srFormSelectedPreRequisites: selected });
        return next;
      });
    },
    [templateDisplayData, form],
  );

  const columnMain = [
    {
      title: (
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected}
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      ),
      dataIndex: "select",
      key: "select",
      width: 50,
      align: "center",
      render: (_, record) =>
      record._isTemplate ? (
        <Checkbox
          checked={record.selected || false}
          onChange={(e) => handleSelectOne(record, e.target.checked)}
        />
      ) : record._isCreated ? (
        <Checkbox checked disabled />
      ) : null,
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
          <Tooltip title="Edit">
            <Button type="table-action" onClick={() => handleEditClick(record)}>
              <SVGIcon name="IconEdit" width={20} />
            </Button>
          </Tooltip>
          {!record._isTemplate && (
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
          )}
        </div>
      ),
    },
  ];

  const buildNavState = (extra = {}) => {
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
    return {
      path: `${basePath}/service-requests/pre-requisites/create`,
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
        ...extra,
      },
    };
  };

  const handleCreateClick = () => {
    const { path, state } = buildNavState();
    navigate(path, { state });
  };

  const handleEditClick = useCallback((record) => {
    const extra = record._isTemplate
      ? { editData: record, editKey: null }  // template: save as new created item
      : { editData: record, editKey: record.key ?? record.id };
    const { path, state } = buildNavState(extra);
    navigate(path, { state });
  }, [form, dispatch, attachments, location, account, customer, serviceRequestId, accountId, currentStep, navigate]);

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
            useInfiniteScroll={false}
            hasMore={false}
            useSelect={true}
            dataSource={tableDataSource}
            columnMain={columnMain}
            fontSize={"medium"}
            loading={false}
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
