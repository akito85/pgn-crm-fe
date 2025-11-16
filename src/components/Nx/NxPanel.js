const NxPanel = ({ title, children }) => {
  // Don't fucking render the entire fucking div tag if title is not present
  // Like IDOTIC BaseContainer
  if (!title) {
    return null;
  }

  return (
    <div className="self-stretch p-5 bg-white rounded-lg shadow-[0px_4px_18px_0px_rgba(75,70,92,0.10)] inline-flex flex-col justify-start items-start gap-5">
      <div className="self-stretch p-4 flex flex-col justify-start items-start gap-5">
        <div className="flex-1 justify-start text-sky-600 text-sm font-bold">
          {title}
        </div>
        <div className="w-full flex flex-col justify-start items-start overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default NxPanel;
