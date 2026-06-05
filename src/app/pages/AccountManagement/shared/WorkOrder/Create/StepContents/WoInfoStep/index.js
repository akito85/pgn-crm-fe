import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Input, Select, DatePicker, Tooltip } from "antd";
import NxCardContainer from "../../../../../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import NxModal from "../../../../../../../../components/Nx/NxModal";
import NxTable from "../../../../../../../../components/Nx/NxTable";
import SVGIcon from "../../../../../../../../assets/Icon/index";
import { requiredMessage } from "../../../../../../../../utils";
import { getWoRefColumns } from "./getWoRefColumns";
import {
  getClosedWorkOrders,
  getWoActivitiesByCategory,
} from "../../../../../../../../redux/slices/account_management/detailAccount/WorkOrderSlice";
import InputComponent from "../../../../../../../../components/InputComponent";


const SOURCES = [
  { value: "SERVICE_REQUEST", label: "Service Request" },
  { value: "MANUAL",          label: "Manual" },
];

const WoInfoStep = ({ form, woContext, dropdowns, onAccountSelect, onCategoryChange }) => {
  const dispatch = useDispatch();

  const {
    list_woCategories,
    list_woTypes,
    list_woPriorities,
    list_woGroups,
    list_closedWorkOrders,
    pagination_closedWo,
    loading_closedWo,
  } = useSelector((state) => state.workOrder);

  const [showWoRefModal, setShowWoRefModal] = useState(false);
  const [showSrRefModal, setShowSrRefModal] = useState(false);
  const [selectedSource, setSelectedSource] = useState(
    woContext.type === "sr" ? "SERVICE_REQUEST" : undefined
  );
  const [woRefPage, setWoRefPage] = useState(1);
  const [woRefSort, setWoRefSort] = useState("");

  useEffect(() => {
    if (woContext.type === "sr") {
      form.setFieldsValue({
        source: "SERVICE_REQUEST",
        sourceReference: `${woContext.srNumber}${woContext.srCategory ? ` - ${woContext.srCategory}` : ""}`,
      });
      setSelectedSource("SERVICE_REQUEST");
    }
  }, [woContext, form]);

  const fetchClosedWo = (pg = 1, isLoadMore = false) => {
    dispatch(
      getClosedWorkOrders({
        body: { page: pg, size: 20, sort: woRefSort, filters: [], filterRules: [] },
        isLoadMore,
      })
    );
  };

  const handleOpenWoRefModal = () => {
    fetchClosedWo(1, false);
    setWoRefPage(1);
    setShowWoRefModal(true);
  };

  const handleSelectWoRef = (record) => {
    form.setFieldsValue({
      workOrderReference: record.woNumber,
      workOrderReferenceId: record.id,
    });
    setShowWoRefModal(false);
  };

  const handleSourceChange = (value) => {
    setSelectedSource(value);
    if (value === "MANUAL") {
      form.setFieldsValue({ sourceReference: undefined });
    }
  };

  const handleCategoryChange = (value) => {
    if (value) {
      dispatch(getWoActivitiesByCategory(value));
      onCategoryChange && onCategoryChange(value);
    }
  };

  const isSrContext = woContext.type === "sr";
  const isStandalone = woContext.type === "standalone";

  const makeOptions = (list) =>
    (Array.isArray(list) ? list : []).map((item) => ({
      value: item.id?.toString() || item.glbTypeValId?.toString(),
      label: item.name || item.glbTypeValName,
    }));

  return (
    <>
      <NxCardContainer header="WORK ORDER INFORMATION">
        <NxBaseContainer border header="WORK ORDER INFORMATION">
          {/* Account picker — standalone only */}
          {isStandalone && (
            <div className="mb-4">
              <Form.Item
                name="accountSearch"
                label="Account"
                className="no-margin-form"
              >
                <Select
                  showSearch
                  placeholder="Search and select account"
                  filterOption={false}
                  onSelect={(value, option) => {
                    onAccountSelect && onAccountSelect(option.accountId, option.accountType);
                    form.setFieldsValue({ accountId: option.accountId, accountType: option.accountType });
                  }}
                  notFoundContent="No accounts found"
                />
              </Form.Item>
              <Form.Item name="accountId" hidden><Input /></Form.Item>
              <Form.Item name="accountType" hidden><Input /></Form.Item>
            </div>
          )}

          <div className="grid grid-cols-3 gap-x-4">
            {/* WO Reference */}
            <Form.Item name="workOrderReferenceId" hidden><Input /></Form.Item>
            <Form.Item name="workOrderReference" label="Work Order Reference">
              <div className="flex gap-x-1">
                <Input disabled placeholder="Select Work Order Reference" />
                <Button type="submit" className="min-w-[120px]" onClick={handleOpenWoRefModal}>
                  Select
                </Button>
              </div>
            </Form.Item>

            {/* Source */}
            <Form.Item name="source" label="Source">
              <Select
                placeholder="Select Source"
                options={SOURCES}
                disabled={isSrContext}
                onChange={handleSourceChange}
              />
            </Form.Item>

            {/* Source Reference */}
            <Form.Item name="sourceReference" label="Source Reference">
              <Input
                disabled={isSrContext || selectedSource === "MANUAL" || !selectedSource}
                placeholder={
                  selectedSource === "MANUAL" || !selectedSource
                    ? "N/A (Manual source)"
                    : "Select Source Reference"
                }
                addonAfter={
                  !isSrContext && selectedSource === "SERVICE_REQUEST" ? (
                    <Button size="small" type="text" onClick={() => setShowSrRefModal(true)}>
                      Select
                    </Button>
                  ) : null
                }
              />
            </Form.Item>

            {/* Category */}
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: requiredMessage("Category") }]}
            >
              <Select
                placeholder="Select Category"
                options={makeOptions(list_woCategories)}
                onChange={handleCategoryChange}
              />
            </Form.Item>

            {/* Type */}
            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true, message: requiredMessage("Type") }]}
            >
              <Select placeholder="Select Type" options={makeOptions(list_woTypes)} />
            </Form.Item>

            {/* Priority */}
            <Form.Item
              name="priority"
              label="Priority"
              rules={[{ required: true, message: requiredMessage("Priority") }]}
            >
              <Select placeholder="Select Priority" options={makeOptions(list_woPriorities)} />
            </Form.Item>

            {/* Group */}
            <Form.Item
              name="group"
              label="Group"
              rules={[{ required: true, message: requiredMessage("Group") }]}
            >
              <Select placeholder="Select Group" options={makeOptions(list_woGroups)} />
            </Form.Item>

            {/* Request Date */}
            <Form.Item
              name="requestDate"
              label="Request Date"
              rules={[{ required: true, message: requiredMessage("Request Date") }]}
            >
              <DatePicker style={{ width: "100%" }} format="DD MMM YYYY" />
            </Form.Item>

            {/* Completion Plan Date */}
            <Form.Item
              name="completionPlanDate"
              label="Completion Plan Date"
              rules={[{ required: true, message: requiredMessage("Completion Plan Date") }]}
            >
              <DatePicker style={{ width: "100%" }} format="DD MMM YYYY" />
            </Form.Item>

            {/* Due Date */}
            <Form.Item
              name="dueDate"
              label="Due Date"
              rules={[{ required: true, message: requiredMessage("Due Date") }]}
            >
              <DatePicker style={{ width: "100%" }} format="DD MMM YYYY" />
            </Form.Item>
          </div>

          {/* Description — full width */}
          <Form.Item name="description" label="Description">
            <InputComponent type="textarea" />
          </Form.Item>
        </NxBaseContainer>
      </NxCardContainer>

      {/* WO Reference modal */}
      <NxModal
        isOpen={showWoRefModal}
        handleCancel={() => setShowWoRefModal(false)}
        title="SELECT WORK ORDER REFERENCE"
        width={900}
        footer={
          <div className="flex justify-end">
            <Button type="menu" key="close" onClick={() => setShowWoRefModal(false)}>
              Back
            </Button>
          </div>
        }
      >
        <div className="p-4">
          <NxBaseContainer border>
            <NxTable
              idTable="wo-ref-table"
              dataSource={list_closedWorkOrders.map((item, i) => ({ ...item, key: item.id ?? i }))}
              columns={[
                ...getWoRefColumns(),
                {
                  title: "ACTION",
                  align: "center",
                  width: 100,
                  fixed: "right",
                  render: (_, record) => (
                    <div className="flex w-full justify-center gap-4">
                      <Tooltip title="Select">
                        <div className="pt-1 cursor-pointer">
                          <SVGIcon
                            name="IconActionCreate"
                            color={"#0075bf"}
                            width={20}
                            onClick={() => handleSelectWoRef(record)}
                          />
                        </div>
                      </Tooltip>
                    </div>
                  ),
                },
              ]}
              usePagination={false}
              useInfiniteScroll={true}
              onLoadMore={() => {
                const next = woRefPage + 1;
                if (next <= (pagination_closedWo.totalPage || 0)) {
                  fetchClosedWo(next, true);
                  setWoRefPage(next);
                }
              }}
              hasMore={list_closedWorkOrders.length < (pagination_closedWo.totalElement || 0)}
              loading={loading_closedWo}
              tableScrolled={{ x: "max-content" }}
            />
          </NxBaseContainer>
        </div>
      </NxModal>

      {/* SR Reference modal — standalone + SOURCE=SERVICE_REQUEST only */}
      {showSrRefModal && (
        <NxModal
          isOpen={showSrRefModal}
          handleCancel={() => setShowSrRefModal(false)}
          title="SELECT SERVICE REQUEST"
          width={900}
          footer={
            <div className="flex justify-end">
              <Button onClick={() => setShowSrRefModal(false)}>Close</Button>
            </div>
          }
        >
          <div className="p-4">
            {/* SR list table — BE endpoint TBD */}
          </div>
        </NxModal>
      )}
    </>
  );
};

export default WoInfoStep;
