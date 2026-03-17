import React, { useRef, useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "antd";
import moment from "moment";
import CollapsibleCardContainer from "../../../../components/CollapsibleCardContainer";
import CardContainer from "../../../../components/CardContainer";
import DetailText from "../../../../components/DetailText";
import ButtonComponent from "../../../../components/ButtonComponent";
import TableRBI from "../../../../components/TableRBI";
import SVGIcon from "../../../../assets/Icon/index";
import { columnsMutationSummary } from "./Table/TableMutationSummary";
import { columnsMutationDetail } from "./Table/TableMutationDetail";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import {
  getMutationSummaryPaginate,
  getMutationDetailPaginate,
  getAllGasDepositPaginate,
} from "../../../../redux/slices/rating_billing_invoice/gasDeposit";
import ModalCreateMutationSummary from "./Modal/ModalCreateMutationSummary";
import ModalCreateMutationDetail from "./Modal/ModalCreateMutationDetail";

const GasDepositDetail = ({ selectedData, onClose }) => {
  const detailRef = useRef(null);
  const dispatch = useDispatch();

  // Modal state
  const [modalCreateMS, setModalCreateMS] = useState(false);
  const [modalCreateMD, setModalCreateMD] = useState(false);

  const {
    data_mutation_summary,
    data_mutation_detail,
    loading_mutation_summary,
    loading_mutation_detail,
  } = useSelector((state) => state.gasDeposit);

  const dataSourceMutationSummary = data_mutation_summary?.result;
  const dataSourceMutationDetail = data_mutation_detail?.result;

  // ===================== Mutation Summary State =====================
  const searchInputMS = useRef(null);
  const [searchedColumnMS, setSearchedColumnMS] = useState("");
  const [searchTextMS, setSearchTextMS] = useState("");
  const [searchMS, setSearchMS] = useState({});
  const [sortMS, setSortMS] = useState("");
  const [fixedColumnsMS, setFixedColumnsMS] = useState(() => ({
    left: ["no"],
    right: ["action"],
  }));

  // ===================== Mutation Detail State =====================
  const searchInputMD = useRef(null);
  const [searchedColumnMD, setSearchedColumnMD] = useState("");
  const [searchTextMD, setSearchTextMD] = useState("");
  const [searchMD, setSearchMD] = useState({});
  const [sortMD, setSortMD] = useState("");
  const [fixedColumnsMD, setFixedColumnsMD] = useState(() => ({
    left: ["no"],
    right: ["action"],
  }));

  // ===================== Fetch data when selectedData changes =====================
  useEffect(() => {
    if (selectedData?.gasDepositId) {
      dispatch(
        getMutationSummaryPaginate({
          gasDepositId: selectedData.gasDepositId,
          page: 1,
          pageSize: 100,
          search: "",
          sort: "",
        }),
      );
      dispatch(
        getMutationDetailPaginate({
          gasDepositId: selectedData.gasDepositId,
          page: 1,
          pageSize: 100,
          search: "",
          sort: "",
        }),
      );
    }
  }, [dispatch, selectedData?.gasDepositId]);

  // ===================== Scroll to detail =====================
  useEffect(() => {
    if (selectedData && detailRef.current) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          detailRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        });
      });
    }
  }, [selectedData?.gasDepositId]);

  // ===================== Mutation Summary Handlers =====================
  const handleSearchMS = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTextMS(selectedKeys[0]);
    setSearchedColumnMS(selectedKeys[0] ? dataIndex : "");
    setSearchMS((prev) => ({ ...prev, [dataIndex]: selectedKeys[0] }));
  };

  const onSortMS = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSortMS(dataSort);
  };

  // Action column for Mutation Summary
  const itemGrantAccessMS = [
    {
      action: "View",
      type: "table",
      render: (record) => (
        <Tooltip title="View Detail">
          <div
            onClick={(e) => {
              e.stopPropagation();
              // TODO: handle view mutation summary detail
            }}
            style={{ cursor: "pointer", display: "inline-block", lineHeight: 0 }}
          >
            <SVGIcon name="IconDetail" color={"#0075bf"} width={20} />
          </div>
        </Tooltip>
      ),
    },
  ];

  const actionColsMS = useColumnActionPermission(["view"], itemGrantAccessMS).map((col) => ({
    ...col,
    width: 25,
    align: "center",
  }));

  const baseColumnsMS = useMemo(() => {
    return columnsMutationSummary(0, 0, searchInputMS, searchedColumnMS, searchTextMS, handleSearchMS, searchMS);
  }, [searchedColumnMS, searchTextMS, searchMS]);

  const allColumnsMS = useMemo(() => {
    return [...baseColumnsMS, ...actionColsMS].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [baseColumnsMS, actionColsMS]);

  const processedColumnsMS = useMemo(
    () => applyFixedColumns(allColumnsMS, fixedColumnsMS),
    [allColumnsMS, fixedColumnsMS],
  );

  const columnDefinitionsMS = useMemo(
    () => allColumnsMS.map((col) => ({ key: col.key || col.dataIndex || col.title, title: col.title })),
    [allColumnsMS],
  );

  const dataSourceMS = useMemo(
    () => dataSourceMutationSummary?.map((item) => ({ ...item, key: item.id })),
    [dataSourceMutationSummary],
  );

  // ===================== Mutation Detail Handlers =====================
  const handleSearchMD = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTextMD(selectedKeys[0]);
    setSearchedColumnMD(selectedKeys[0] ? dataIndex : "");
    setSearchMD((prev) => ({ ...prev, [dataIndex]: selectedKeys[0] }));
  };

  const onSortMD = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSortMD(dataSort);
  };

  // Action column for Mutation Detail
  const itemGrantAccessMD = [
    {
      action: "View",
      type: "table",
      render: (record) => (
        <Tooltip title="View Detail">
          <div
            onClick={(e) => {
              e.stopPropagation();
              // TODO: handle view mutation detail
            }}
            style={{ cursor: "pointer", display: "inline-block", lineHeight: 0 }}
          >
            <SVGIcon name="IconDetail" color={"#0075bf"} width={20} />
          </div>
        </Tooltip>
      ),
    },
  ];

  const actionColsMD = useColumnActionPermission(["view"], itemGrantAccessMD).map((col) => ({
    ...col,
    width: 25,
    align: "center",
  }));

  const baseColumnsMD = useMemo(() => {
    return columnsMutationDetail(0, 0, searchInputMD, searchedColumnMD, searchTextMD, handleSearchMD, searchMD);
  }, [searchedColumnMD, searchTextMD, searchMD]);

  const allColumnsMD = useMemo(() => {
    return [...baseColumnsMD, ...actionColsMD].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [baseColumnsMD, actionColsMD]);

  const processedColumnsMD = useMemo(
    () => applyFixedColumns(allColumnsMD, fixedColumnsMD),
    [allColumnsMD, fixedColumnsMD],
  );

  const columnDefinitionsMD = useMemo(
    () => allColumnsMD.map((col) => ({ key: col.key || col.dataIndex || col.title, title: col.title })),
    [allColumnsMD],
  );

  const dataSourceMD = useMemo(
    () => dataSourceMutationDetail?.map((item) => ({ ...item, key: item.id })),
    [dataSourceMutationDetail],
  );

  // ===================== Render =====================
  return (
    <div ref={detailRef} className="scroll-mt-4">
      {/* ========== SECTION 1: Detail ========== */}
      <CollapsibleCardContainer header={"Detail"} defaultOpen={true}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-2">
          <DetailText label={"Customer Number"}>
            {selectedData?.customerNumber || "-"}
          </DetailText>
          <DetailText label={"Customer Name"}>
            {selectedData?.customerName || "-"}
          </DetailText>
          <DetailText label={"Account Number"}>
            {selectedData?.accountNumber || "-"}
          </DetailText>
          <DetailText label={"Account Name"}>
            {selectedData?.accountName || "-"}
          </DetailText>
          <DetailText label={"Account Group Type"}>
            {selectedData?.accountGroupType || "-"}
          </DetailText>
          <DetailText label={"Payment Guarantee Code"}>
            {selectedData?.paymentGuaranteeCode || "-"}
          </DetailText>
          <DetailText label={"SOR"}>
            {selectedData?.sor || "-"}
          </DetailText>
          <DetailText label={"Cost Center"}>
            {selectedData?.costCenter || "-"}
          </DetailText>
          <DetailText label={"Account Segment"}>
            {selectedData?.accountSegment || "-"}
          </DetailText>
          <DetailText label={"Meter Reading Code"}>
            {selectedData?.meterReadingCode || "-"}
          </DetailText>
          <DetailText label={"Currency"}>
            {selectedData?.currency || "-"}
          </DetailText>
          <DetailText label={"UOM"}>
            {selectedData?.uom || "-"}
          </DetailText>
          <DetailText label={"Period"}>
            {selectedData?.period || "-"}
          </DetailText>
          <DetailText label={"Current Period Volume"}>
            {selectedData?.currentPeriodVolume ?? "-"}
          </DetailText>
          <DetailText label={"Current Period Amount"}>
            {selectedData?.currentPeriodAmount ?? "-"}
          </DetailText>
          <DetailText label={"Account Type"}>
            {selectedData?.accountType || "-"}
          </DetailText>
          <DetailText label={"Classification Type"}>
            {selectedData?.classificationType || "-"}
          </DetailText>
        </div>
      </CollapsibleCardContainer>

      {/* ========== SECTION 2: Mutation Summary ========== */}
      <CollapsibleCardContainer header={"Mutation Summary"} defaultOpen={true}>
        <div className="flex justify-end mb-3">
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={20} />}
            type="submit"
            onClick={() => setModalCreateMS(true)}
          >
            Create
          </ButtonComponent>
        </div>
        <TableRBI
          idTable="mutation-summary-table"
          dataSource={dataSourceMS}
          columns={processedColumnsMS}
          totalData={data_mutation_summary?.page?.totalElements || 0}
          tableScrolled={{ x: 2000, y: 400 }}
          onSort={onSortMS}
          columnDefinitions={columnDefinitionsMS}
          fixedColumns={fixedColumnsMS}
          setFixedColumns={setFixedColumnsMS}
          loading={loading_mutation_summary}
          showExport={false}
          usePagination={false}
        />
      </CollapsibleCardContainer>

      {/* ========== SECTION 3: Mutation Detail ========== */}
      <CollapsibleCardContainer header={"Mutation Detail"} defaultOpen={true}>
        <div className="flex justify-end mb-3">
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={20} />}
            type="submit"
            onClick={() => {
              setModalCreateMD(true);
            }}
          >
            Create
          </ButtonComponent>
        </div>
        <TableRBI
          idTable="mutation-detail-table"
          dataSource={dataSourceMD}
          columns={processedColumnsMD}
          totalData={data_mutation_detail?.page?.totalElements || 0}
          tableScrolled={{ x: 2000, y: 400 }}
          onSort={onSortMD}
          columnDefinitions={columnDefinitionsMD}
          fixedColumns={fixedColumnsMD}
          setFixedColumns={setFixedColumnsMD}
          loading={loading_mutation_detail}
          showExport={false}
          usePagination={false}
        />
      </CollapsibleCardContainer>

      {/* ========== SECTION 4: History Log Information ========== */}
      <CardContainer header={"History Log Information"}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DetailText label={"Created Date"}>
            {selectedData?.createdDate
              ? moment(selectedData?.createdDate).format("DD MMM YYYY HH:mm:ss")
              : "-"}
          </DetailText>
          <DetailText label={"Created By"}>
            {selectedData?.createdBy || "-"}
          </DetailText>
          <DetailText label={"Updated Date"}>
            {selectedData?.updatedDate
              ? moment(selectedData?.updatedDate).format("DD MMM YYYY HH:mm:ss")
              : "-"}
          </DetailText>
          <DetailText label={"Updated By"}>
            {selectedData?.updatedBy || "-"}
          </DetailText>
        </div>
      </CardContainer>

      {/* ========== MODAL: Create Mutation Summary ========== */}
      <ModalCreateMutationSummary
        isOpen={modalCreateMS}
        handleCancel={() => setModalCreateMS(false)}
        handleRefresh={() => {
          dispatch(
            getAllGasDepositPaginate({
              page: 1,
              pageSize: 100,
              search: "",
              sort: "",
            }),
          );
          onClose();
        }}
        selectedData={selectedData}
      />

      {/* ========== MODAL: Create Mutation Detail ========== */}
      <ModalCreateMutationDetail
        isOpen={modalCreateMD}
        handleCancel={() => setModalCreateMD(false)}
        handleRefresh={() => {
          dispatch(
            getAllGasDepositPaginate({
              page: 1,
              pageSize: 100,
              search: "",
              sort: "",
            }),
          );
          onClose();
        }}
        selectedData={selectedData}
      />
    </div>
  );
};

export default GasDepositDetail;
