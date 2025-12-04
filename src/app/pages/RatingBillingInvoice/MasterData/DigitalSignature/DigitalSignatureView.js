// ====== ORIGINAL IMPORTS ======
import React, { useEffect, useState, useRef, useMemo } from "react";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { Checkbox, Spin, Tooltip, Modal, Button } from "antd";
import { Link, NavLink } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import { useDispatch, useSelector } from "react-redux";
import SVGIcon from "../../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import { columnsDigitalSignature } from "./Table/TableDigitalSignature";
import TableRBI from "../../../../../components/TableRBI";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import ModalInactivateWithHierarchy from "../../../../../components/Modal/ModalInactivateWithHierarchy";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import Toolbar from "../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import CardContainer from "../../../../../components/CardContainer";

// ====== ADD SIGNATURE CANVAS ======
import SignatureCanvas from "react-signature-canvas";

const DigitalSignatureView = () => {
  // Placeholder data
  const data = { result: [], page: { totalElements: 0 } };
  const loading = false;

  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // ==========================
  // ✨ SIGNATURE STATES (JS)
  // ==========================
  const [modalSignature, setModalSignature] = useState(false);
  const [modalPreview, setModalPreview] = useState(false);
  const [signatureBase64, setSignatureBase64] = useState(null);
  const signatureRef = useRef(null);

  const openSignatureModal = () => setModalSignature(true);
  const closeSignatureModal = () => setModalSignature(false);

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const handleSaveSignature = () => {
    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      Modal.warning({
        title: "Signature Required",
        content: "Please draw your signature before saving.",
      });
      return;
    }

    // ✔ Ambil base64 hasil TRIM seperti contoh resmi
    const base64 = signatureRef.current
      .getTrimmedCanvas()
      .toDataURL("image/png");

    setSignatureBase64(base64);
    setModalSignature(false);
  };

  // ==========================
  // END SIGNATURE STATES
  // ==========================

  const dataSource = data?.result;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");

  const [modalInactive, setModalInactive] = useState(false);
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});
  const [chooseId, setChooseId] = useState();

  // Fixed Columns
  const [fixedColumns, setFixedColumns] = useState(() => {
    const saved = localStorage.getItem("digitalSignatureFixedColumns");
    return saved ? JSON.parse(saved) : { left: ["no"], right: ["action"] };
  });

  useEffect(() => {
    localStorage.setItem(
      "digitalSignatureFixedColumns",
      JSON.stringify(fixedColumns)
    );
  }, [fixedColumns]);

  // Use Effect Fetch
  useEffect(() => {}, []);

  // Breadcrumbs
  const routes = [
    { path: "", breadcrumbName: "System Setup" },
    { path: "", breadcrumbName: "Master Data" },
    { path: RBI_ROUTES.DIGITAL_SIGNATURE, breadcrumbName: "Digital Signature" },
  ];

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) setPage(1);
      return { ...prevState, [dataIndex]: selectedKeys[0] };
    });
  };

  const handleChange = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const handleRetry = () => {
    setModalError(false);
    setBodyError({});
  };

  // Sort Handler
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const itemGrantAccess = [
    {
      action: "Create",
      render: (
        <NavLink to={RBI_ROUTES.DIGITAL_SIGNATURE_CREATE}>
          <ButtonComponent icon={<PlusOutlined />} type="submit">
            Create Digital Signature
          </ButtonComponent>
        </NavLink>
      ),
    },
  ];

  const actionColumns = useColumnActionPermission(
    ["view", "activate", "update", "history"],
    itemGrantAccess
  );

  const baseColumns = useMemo(() => {
    const cols = [
      ...columnsDigitalSignature(
        search,
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      ...actionColumns,
    ];
    return cols.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [search, page, pageSize, searchedColumn, searchText, actionColumns]);

  const columnDefinitions = useMemo(() => {
    return baseColumns.map((col) => ({
      key: col.key,
      title: col.title,
    }));
  }, [baseColumns]);

  const columns = useMemo(() => {
    const left = [];
    const right = [];
    const normal = [];

    baseColumns.forEach((col) => {
      const key = col.key;

      if (fixedColumns.left.includes(key)) left.push(col);
      else if (fixedColumns.right.includes(key)) right.push(col);
      else normal.push(col);
    });

    return [...left, ...normal, ...right].map((col) => {
      const key = col.key;
      const fixed = fixedColumns.left.includes(key)
        ? "left"
        : fixedColumns.right.includes(key)
        ? "right"
        : undefined;
      return { ...col, fixed };
    });
  }, [baseColumns, fixedColumns]);

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        {/* HEADER */}
        <CardContainer
          header={
            <div className="flex justify-between items-center">
              <p className="font-bold text-primary">DIGITAL SIGNATURE LIST</p>

              <div className="flex items-center gap-4">
                {/* ====== DRAW SIGNATURE BUTTON ====== */}
                <Button type="primary" onClick={openSignatureModal}>
                  Draw Signature
                </Button>

                {/* Uploaded Indicator */}
                {signatureBase64 && (
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-medium">Uploaded</span>

                    <Tooltip title="Preview Signature">
                      <EyeOutlined
                        style={{ fontSize: 20, cursor: "pointer" }}
                        onClick={() => setModalPreview(true)}
                      />
                    </Tooltip>
                  </div>
                )}

                <Toolbar items={itemGrantAccess} />
              </div>
            </div>
          }
        >
          <TableRBI
            dataSource={dataSource}
            columns={columns}
            current={page}
            pageSize={pageSize}
            onChange={handleChange}
            onSizeChanger={handleChange}
            totalData={data?.page?.totalElements || 0}
            onSort={onSort}
            tableScrolled={{ y: 525, x: 1000 }}
            columnDefinitions={columnDefinitions}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
          />
        </CardContainer>

        {/* SIGNATURE DRAW MODAL */}
        <Modal
          open={modalSignature}
          onCancel={closeSignatureModal}
          footer={null}
          title="Draw Your Signature"
          width={500}
        >
          <div className="flex flex-col items-center">
            <div
              style={{
                border: "1px solid #ccc",
                width: "100%",
                height: 200,
              }}
            >
              <SignatureCanvas
                ref={signatureRef}
                penColor="black"
                canvasProps={{ width: 450, height: 200 }}
              />
            </div>

            <div className="flex gap-3 mt-4">
              <Button onClick={handleClear}>Clear</Button>
              <Button type="primary" onClick={handleSaveSignature}>
                Save
              </Button>
            </div>
          </div>
        </Modal>

        {/* PREVIEW MODAL */}
        <Modal
          open={modalPreview}
          onCancel={() => setModalPreview(false)}
          footer={null}
          title="Preview Signature"
          width={400}
        >
          {signatureBase64 && (
            <img
              src={signatureBase64}
              alt="signature"
              style={{ width: "100%", border: "1px solid #ccc" }}
            />
          )}
        </Modal>

        <ModalError
          isOpen={modalError}
          handleOk={handleRetry}
          handleCancel={() => setModalError(false)}
          customText={"Try Again"}
        >
          <p>Failed</p>
        </ModalError>
      </Spin>
    </LayoutMenu>
  );
};

export default DigitalSignatureView;
