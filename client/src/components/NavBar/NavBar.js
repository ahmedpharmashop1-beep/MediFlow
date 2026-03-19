import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../JS/Actions/user";

const Navbar = () => {
  const isAuth = useSelector((state) => state.userReducer.isAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        backgroundColor: "#f4f4f4",
      }}
    >
      <h2>Food App</h2>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link to="/" style={styles.link}>
          Home
        </Link>

        <Link to="/foodlist" style={styles.link}>
          Food List
        </Link>

        {isAuth && (
          <Link to="/addfood" style={styles.link}>
            Add Food
          </Link>
        )}

        {/* 👇 If NOT connected */}
        {!isAuth && (
          <>
            <Link to="/login" style={styles.link}>
              Login
            </Link>

            <Link to="/register" style={styles.link}>
              Register
            </Link>
          </>
        )}

        {/* 👇 If connected */}
        {isAuth && (
          <>
            <Link to="/profile" style={styles.link}>
              Profile
            </Link>

            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  link: {
    textDecoration: "none",
    color: "black",
    fontWeight: "500",
  },
  button: {
    padding: "6px 12px",
    cursor: "pointer",
    border: "none",
    backgroundColor: "#ff4d4d",
    color: "white",
    borderRadius: "5px",
  },
};

export default Navbar;