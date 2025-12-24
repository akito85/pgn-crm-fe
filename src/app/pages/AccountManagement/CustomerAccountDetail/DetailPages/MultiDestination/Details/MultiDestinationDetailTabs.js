import { Fragment } from "react";
import RadioTabs from "../../../../../../../components/RadioTabs";
import MultiDestinationDetailAttch from "./MultiDestinationDetailAttch";
import MultiDestinationDetailInfo from "./MultiDestinationDetailInfo";

const dataTabs = {
  mdi: "Multi Destination Information",
  attch: "Attachment",
};

const MultiDestinationDetailTabs = ({
  subjectAccountNumber,
  dataDetail = {},
  dataAttachment = [],
  section = "",
  options = [],
  handleChangeOption = () => {},
}) => {
  // Use provided options or fall back to default tabs
  const tabOptions = options.length > 0 ? options : [
    { value: "mdi", label: "Multi Destination Information" },
    { value: "attch", label: "Attachment" },
  ];

  const AccountType = () => {
    // Path form URL
    const path = window.location.pathname

    // Strict whitelist (prevents XSS, traversal, unicode injections)
    const allowed = /^[a-zA-Z0-9-_]+$/;

    // Match only your known route structure:
    // /account-management/<dynamic>/view
    const match = path.match(/^\/account-management\/([a-zA-Z0-9-_]+)\/view\/?$/);

    if (!match) return null;

    const dynamicPart = match[1];

    return allowed.test(dynamicPart) ? dynamicPart : null;
  }

  const renderSection = () => {
    switch (section) {
      case dataTabs.mdi:
        return <MultiDestinationDetailInfo subjectAccountNumber={subjectAccountNumber} dataDetail={dataDetail} type={AccountType}/>;
      case dataTabs.attch:
        return <MultiDestinationDetailAttch dataAttachment={dataAttachment} />;
      default:
        return <MultiDestinationDetailInfo />;
    }
  };

  return (
    <Fragment>
      <div className="flex flex-col gap-4">
        {/* Wrapper div to ensure proper styling */}
        <div className="self-stretch inline-flex justify-start items-center gap-2.5">
          <div className="w-full">
            <RadioTabs
              currentPosition={section}
              data={tabOptions}
              onChange={handleChangeOption}
            />
          </div>
        </div>
        {renderSection()}
      </div>
    </Fragment>
  );
};

export default MultiDestinationDetailTabs;
