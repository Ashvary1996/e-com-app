export const setToken = (token) => localStorage.setItem("jwt-token", token);
export const getToken = () => localStorage.getItem("jwt-token");
export const removeToken = () => localStorage.removeItem("jwt-token");

export const setUserID = (userID) =>
  localStorage.setItem("ecom-userID", userID);
export const getUserID = () => localStorage.getItem("ecom-userID");
export const removeUserID = () => localStorage.removeItem("ecom-userID ");
