const NxDetailText = ({ label, children, className = "", classTextAdditional ="" }) => {
  return (
    <div className={`flex flex-col gap-y-2 ${className}`}>
      <label className="text-xs font-semibold">{label}</label>
      <p className={`mb-0 text-xs ${classTextAdditional}`}>{children}</p>
    </div>
  );
};

export default NxDetailText;
