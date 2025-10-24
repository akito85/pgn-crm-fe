const HeaderText = ({ text, className = "text-sm" }) => {
  return (
    <div className={`text-primary ${className} font-bold uppercase`}>
      {text}
    </div>
  );
};

export default HeaderText;
