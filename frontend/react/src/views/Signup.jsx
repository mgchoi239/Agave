import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client.js";

export default function Signup() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();

  const [errors, setErrors] = useState(null);
  const { setUser, setToken } = useStateContext();

  const onSubmit = (ev) => {
    ev.preventDefault();
    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    };
    axiosClient
      .post("/signup", payload)
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.token);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  return (
    <div>
      <h1>Signup</h1>
      <h2>Nail your registration</h2>
      <form onSubmit={onSubmit}>
        <input ref={nameRef} placeholder="Full Name" />
        <input ref={emailRef} type="email" placeholder="Email Address" />
        <input ref={passwordRef} type="password" placeholder="Password" />
        <input
          ref={passwordConfirmationRef}
          type="password"
          placeholder="Password Confirmation"
        />
        <button className="outline green-transition">Signup</button>
        {errors && (
          <div>
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        <p>Already have an Account?</p>
        <Link to="/login" className="text-green-transition">
          Sign in
        </Link>
      </form>
    </div>
  );
}
