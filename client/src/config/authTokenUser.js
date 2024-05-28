export const setUserID = (userID) =>
  localStorage.setItem("ecom-userID", userID);

export const getUserID = () => localStorage.getItem("ecom-userID");
 