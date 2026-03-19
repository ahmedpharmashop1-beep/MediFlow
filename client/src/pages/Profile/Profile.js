import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user, isAuth, loadUser } = useSelector(
    (state) => state.userReducer
  );

  if (loadUser) return <h2>Loading...</h2>;
  if (!isAuth) return <h2>Please login first</h2>;
  if (!user) return <h2>No user data</h2>;

  return (
    <div>
      <h1>Profile Page</h1>

      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Phone:</b> {user.isAdmin ? "Admin" : "User"}</p>

     
    </div>
  );
};

export default Profile;