import React, { useState } from "react";
import { toast } from "react-toastify";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = currentState === "Login" ? "user/login" : "user/register";
    const requestBody = currentState === "Login"
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await fetch(`${VITE_BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");

    toast.success("User has been authenticated successfully.");
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mt-10 mb-2">
        <p className="text-3xl prata-regular">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState === "Sign Up" && (
        <input
          type="text"
          name="name"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Parina Kaji"
          required
          value={formData.name}
          onChange={handleChange}
        />
      )}

      <input
        type="email"
        name="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="aayush@gmail.com"
        required
        value={formData.email}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        required
        value={formData.password}
        onChange={handleChange}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-between w-full text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password?</p>
        <p
          onClick={() => setCurrentState(currentState === "Login" ? "Sign Up" : "Login")}
          className="cursor-pointer"
        >
          {currentState === "Login" ? "Create a new account" : "Login here"}
        </p>
      </div>

      <button className="px-8 py-2 mt-4 font-light text-white bg-black" disabled={loading}>
        {loading ? "Processing..." : currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

export default Login;
