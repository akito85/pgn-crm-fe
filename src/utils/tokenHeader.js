export const tokenHeader = () => {
  const token = JSON.parse(
    localStorage.getItem("token") || window.sessionStorage.getItem("token"),
  );
  // JSON.parse(window.sessionStorage.getItem("token"));
  return { Authorization: token?.accessToken };
};
