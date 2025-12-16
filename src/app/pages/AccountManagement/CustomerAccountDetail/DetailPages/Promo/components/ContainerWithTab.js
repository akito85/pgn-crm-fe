const ContainerWithTab = ({ children, marginTop = "20px" }) => {
  return (
    <div 
      className="drop-shadow-lg bg-white rounded-lg w-full p-[20px]"
      style={{ marginTop }}
    >
      {children}
    </div>
  );
};

export default ContainerWithTab;
