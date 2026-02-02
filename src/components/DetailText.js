const DetailText = ({ label, children, className = "", classTextAdditional ="" }) => {
  return (
    <div className={className}>
      <label className="text-xs font-semibold">{label}</label>
      <p className={`mb-0 text-xs ${classTextAdditional}`}>{children}</p>
    </div>
  );
};

export default DetailText;
