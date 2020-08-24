import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { register } from "../actions/userActions";

const RegisterScreen = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const userRegister = useSelector((state) => state.userRegister);
  const { loading, userInfo, error } = userRegister;

  const dispatch = useDispatch();
  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";

  useEffect(() => {
    if (userInfo) {
      props.history.push(redirect);
    }
    return () => {};
  }, [userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(register(name, email, password));
  };

  return (
    <div className="form">
      <form onSubmit={submitHandler}>
        <ul className="form-container">
          <li>
            <h2>Create Account</h2>
          </li>

          <li>
            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
          </li>

          <li>
            <label htmlFor="name">name</label>
            <input
              type="name"
              name="name"
              id="name"
              onChange={(e) => setName(e.target.value)}
            ></input>
          </li>

          <li>
            <label htmlFor="email">email</label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </li>

          <li>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </li>

          <li>
            <label htmlFor="rePassword">Re-Enter Password</label>
            <input
              type="rePassword"
              id="rePassword"
              name="rePassword"
              onChange={(e) => setRePassword(e.target.value)}
            ></input>
          </li>

          <li>
            <button type="submit" className="button primary">
              Register
            </button>
          </li>

          <li>
            <Link
              to={redirect === "/" ? "signin" : "signin?redirect=" + redirect}
              className="button text-center secondary"
            >
              Already have an account ?{" "}
            </Link>
          </li>
        </ul>
      </form>
    </div>
  );
};

export default RegisterScreen;
