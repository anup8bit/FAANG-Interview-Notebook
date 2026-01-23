import React, { useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import Input from "../../Components/Input";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
      e.preventDefault();
      const data = { email, password };
      try {
        const resp = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const result = await resp.json();
        localStorage.setItem('jwtToken', result.token);
        // handle result here (e.g., save token, redirect, show error)
        navigate("/dashboard");
        console.log(result);
      } catch (error) {
        console.error("Login failed:", error);
      }
  };

  return (
      <div className="container">
        <form onSubmit={onSubmit}>
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="enetr your email"
            label="Email"
            name="email"
            required
          />
          <Input
            type="password"
            value={password}
            label="Password"
            name="password"
            onChange={e => setPassword(e.target.value)}
            placeholder="enter your password"
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
  );
};

export default LoginPage;