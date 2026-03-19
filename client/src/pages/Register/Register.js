import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../../JS/Actions/user";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuth = useSelector((state) => state.userReducer.isAuth);
  const errors = useSelector((state) => state.userReducer.errors);

  const [newUser, setNewUser] = useState({
    firstname: "",
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isAuth) {
      navigate("/listfood");
    }
  }, [isAuth, navigate]);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(register(newUser));
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleRegister}>
        <h1>Register</h1>

        <input
          type="text"
          name="firstname"
          placeholder="Enter your firstname"
          value={newUser.firstname}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={newUser.name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={newUser.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={newUser.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Register
        </button>

        {errors && (
          <div style={{ color: "red", marginTop: "10px" }}>
            {errors.map((error, index) => (
              <p key={index}>{error.msg}</p>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "300px",
    gap: "15px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default Register;