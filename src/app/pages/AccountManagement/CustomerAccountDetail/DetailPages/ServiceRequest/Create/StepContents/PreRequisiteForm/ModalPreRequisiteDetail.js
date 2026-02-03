import NxModal from "../../../../../../../../../components/Nx/NxModal";
import NxCollapse from "../../../../../../../../../components/Nx/NxCollapse";

const ModalPreRequisiteDetail = (props) => {
  const { isOpen, footer, handleCancel, handleOk } = props;

  return (
    <NxModal
      isOpen={isOpen}
      width={1300}
      title={"Pre-Requisite Information"}
      footer={footer}
      className={"head-no-bg-modal"}
      handleCancel={handleCancel}
      handleOk={handleOk}
    >
      <NxCollapse title={"Pre-Requisite Information"} defaultOpen={true}>
        <div className="w-full grid grid-cols-2 gap-5">
          <div class="flex flex-col">
            <label className="mb-2 font-extrabold">Type</label>
            <label className="mb-2 font-medium">Administrative</label>
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-extrabold">Name</label>
            <label className="mb-2 font-medium">Penerbitan SPK</label>
          </div>
        </div>
        <div className="w-full flex flex-col mt-5">
          <label className="mb-2 font-extrabold">Description</label>
          <label className="mb-2 font-medium">Description</label>
        </div>
      </NxCollapse>
      <div className="w-full mt-5 p-5 bg-sky-100 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex flex-col justify-start items-start gap-5">
        <div className="self-stretch inline-flex justify-start items-center gap-5">
          <div className="flex-1 justify-start text-sky-600 text-sm font-bold">
            HISTORY LOG INFORMATION
          </div>
        </div>
        <div className="self-stretch inline-flex justify-start items-start gap-10 flex-wrap content-start">
          <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
            <div className="self-stretch justify-start text-zinc-900 text-base font-extrabold">
              Record Id
            </div>
            <div className="self-stretch justify-start text-zinc-900 text-base font-normal">
              491
            </div>
          </div>
          <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
            <div className="self-stretch justify-start text-zinc-900 text-base font-extrabold">
              Created Date
            </div>
            <div className="self-stretch justify-start text-zinc-900 text-base font-normal">
              21 Dec 2021 23:11:09
            </div>
          </div>
          <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
            <div className="self-stretch justify-start text-zinc-900 text-base font-extrabold">
              Created By
            </div>
            <div className="self-stretch justify-start text-zinc-900 text-base font-normal">
              Annisa
            </div>
          </div>
          <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
            <div className="self-stretch justify-start text-zinc-900 text-base font-extrabold">
              Updated Date
            </div>
            <div className="self-stretch justify-start text-zinc-900 text-base font-normal">
              28 Dec 2021 23:11:09
            </div>
          </div>
          <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
            <div className="self-stretch justify-start text-zinc-900 text-base font-extrabold">
              Updated By
            </div>
            <div className="self-stretch justify-start text-zinc-900 text-base font-normal">
              Aldri
            </div>
          </div>
        </div>
      </div>
    </NxModal>
  );
};

export default ModalPreRequisiteDetail;
