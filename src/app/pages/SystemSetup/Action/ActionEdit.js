import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import { Spin, Table, Checkbox, Tooltip, Tree, Popover } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import BaseContainer from "../../../../components/BaseContainer";
import ButtonComponent from "../../../../components/ButtonComponent";
import {
  DownloadOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  EditOutlined,
  CloseCircleOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { NavLink, useNavigate } from "react-router-dom";
import StatusComponent from "../../../../components/StatusComponent";
import SVGIcon from "../../../../assets/Icon/index";
import React, { useEffect, useState } from "react";
import DetailText from "../../../../components/DetailText";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import GridLayout from "../../../../components/GridLayout";
import InputComponent from "../../../../components/InputComponent";

const ActionEdit = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [previewAction, setPreviewAction] = useState(false);

  const navigate = useNavigate();

  const clearStateAction = () => {
    setName("");
    setDescription("");
  };

  const saveAction = () => {
    const body = {
      name: name,
      description: description,
    };
    console.log(body);
  };

  const previewActionConfirm = () => {
    setPreviewAction(true);
  };

  const content = (
    <span className="text-[11px] font-bold  text-[#3C6DB2]">
      Please fill mandatory form
    </span>
  );

  return (
    <LayoutMenu>
      <Spin spinning={false} className={"w-full top-20"} tip={"Loading..."}>
        <BreadCrumb pageName={["System Setup", "Action", "Edit Action"]} />
        <NavLink onClick={() => navigate(-1)}>
          <div className="flex align-middle gap-x-2 mb-4">
            <ArrowLeftOutlined
              style={{ fontSize: "24px", color: "#3C6DB2" }}
            ></ArrowLeftOutlined>
            <span className="text-dg-blue">Back</span>
          </div>
        </NavLink>
        <BaseContainer header={"EDIT ACTION"}>
          <div className="grid grid-cols-2 w-full gap-10">
            <InputComponent
              type="text"
              label={"Action Name"}
              mandatory
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={true}
            ></InputComponent>
            <div></div>
            <InputComponent
              type="text"
              label={"Remark"}
              // mandatory
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></InputComponent>
            <div className="flex justify-end mt-20">
              <ButtonComponent
                icon={<DeleteOutlined style={{ fontSize: "16px" }} />}
                onClick={() => clearStateAction()}
                type="default"
              >
                Clear
              </ButtonComponent>
              {name ? (
                <ButtonComponent
                  onClick={() => previewActionConfirm()}
                  type="submit"
                >
                  Save
                </ButtonComponent>
              ) : (
                <Popover placement="top" content={content} trigger="hover">
                  <div>
                    <ButtonComponent
                      disabled
                      onClick={() => previewActionConfirm()}
                      type="submit"
                    >
                      Save
                    </ButtonComponent>
                  </div>
                </Popover>
              )}
            </div>
          </div>
        </BaseContainer>
      </Spin>

      <ModalCustom
        isOpen={previewAction}
        handleCancel={() => setPreviewAction(false)}
        header={"CONFIRMATION"}
        width={1000}
      >
        <div className="flex flex-col w-full gap-y-10">
          <div className="grid grid-cols-2 gap-y-2.5">
            <DetailText label={"Action name"}>{name}</DetailText>
            <div></div>
            <DetailText label={"Remark"}>{description}</DetailText>
          </div>
        </div>

        <div className="flex justify-end">
          <ButtonComponent
            onClick={() => setPreviewAction(false)}
            type="default"
          >
            Cancel
          </ButtonComponent>
          <ButtonComponent
            // icon={<PlusCircleFilled style={{ fontSize: "16px" }} />}
            onClick={() => saveAction()}
            type="submit"
          >
            Submit
          </ButtonComponent>
        </div>
      </ModalCustom>
    </LayoutMenu>
  );
};

export default ActionEdit;
