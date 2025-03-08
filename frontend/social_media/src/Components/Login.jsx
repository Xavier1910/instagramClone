import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser, checkUsernameAvailability } from "./AxiosService";
import _ from "lodash"; 
import "../assets/css/Form.css";
import { FaSpinner, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify"; // Import Toast
import "react-toastify/dist/ReactToastify.css";
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    isLogin: true,
  });

  const [errors, setErrors] = useState({});
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [loading, setLoading] = useState(false); 
  const validateField = (name, value) => {
    let tempErrors = { ...errors };

    switch (name) {
      case "username":
        if (!value && !formData.isLogin)
          tempErrors.username = "Username is required";
        else delete tempErrors.username;
        break;

      case "email":
        if (!value) tempErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          tempErrors.email = "Invalid email format";
        else delete tempErrors.email;
        break;

      case "password":
        if (!value) tempErrors.password = "Password is required";
        else if (value.length < 6)
          tempErrors.password = "Password must be at least 6 characters";
        else delete tempErrors.password;
        break;

      case "confirmPassword":
        if (!formData.isLogin && value !== formData.password)
          tempErrors.confirmPassword = "Passwords do not match";
        else delete tempErrors.confirmPassword;
        break;

      default:
        break;
    }

    setErrors(tempErrors);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkUsername = useCallback(
    _.debounce(async (username) => {
      console.log(username);
      setLoading(true);
      if (username.trim().length > 2) {
        const exists = await checkUsernameAvailability(username);
        setUsernameAvailable(!exists);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } else {
        setUsernameAvailable(null);
      }
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }, 500), 
    []
  );

  useEffect(() => {
    if (!formData.isLogin && formData.username) {
      checkUsername(formData.username);
    }
  }, [formData.username, formData.isLogin, checkUsername]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [e.target.name]: e.target.value });
    validateField(name, value);
  };
  const validateForm = () => {
    let tempErrors = {};
    if (!formData.isLogin && !formData.username)
      tempErrors.username = "Username is required";
    if (!formData.email) tempErrors.email = "Email is required";
    if (!formData.password) tempErrors.password = "Password is required";
    if (!formData.isLogin && formData.password !== formData.confirmPassword)
      tempErrors.confirmPassword = "Passwords do not match";
    if (!formData.isLogin && usernameAvailable === false)
      tempErrors.username = "Username is already taken";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let loginData={
      email:formData.email,
      password:formData.password,
    }
    if(validateForm()){
      try {
        let response;
        if (formData.isLogin) {
          response = await loginUser(loginData);
        } else {
          response = await registerUser(formData);
        }      
        if (response.userId) {
          toast.success(`${formData.isLogin ? "Login" : "Registration"} successful!`, {
            position: "top-right",
            autoClose: 3000,
          });
          sessionStorage.setItem("isLoggedIn", "true");
          sessionStorage.setItem("userId", response.userId);        
          setTimeout(() => {
            navigate("/dashboard");
            window.location.reload();
          }, 2000);
        } else {
          toast.error(response.error || "Something went wrong", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.log(error);
        toast.error("An error occurred. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };



  return (
    <>
    <div className="LoginHead">
      <img src="/images/Logo1_fav.png" alt="" />
      <h1 className="LoginTitleHead">Show<span>S<span><span className="LoginTitleHead-He">he</span></span></span>
      </h1>
    </div>
    <div className="authContainer">
            <ToastContainer />
      <form onSubmit={handleSubmit} className="authForm">
        <h2 className="formTitle">{formData.isLogin ? "Login" : "Register"}</h2>
        {!formData.isLogin && (
          <>
            <label className="inputLabel">Username</label>
            <div className="inputContainer">
              <input
              className="inputField"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
              {loading && <FaSpinner className="UserNameIcon spinner" />}
              {usernameAvailable === true && loading==false && <FaCheckCircle className="UserNameIcon success" />}
              {usernameAvailable === false && loading==false && <FaTimesCircle className="UserNameIcon error" />}
            </div>
            {errors.username && <span className="error">{errors.username}</span>}
          </>
        )}

        <label className="inputLabel">Email</label>
        <input className="inputField" type="email" name="email" value={formData.email} onChange={handleChange} />
        {errors.email && <span className="error">{errors.email}</span>}

        <label className="inputLabel">Password</label>
        <input className="inputField" type="password" name="password" value={formData.password} onChange={handleChange} />
        {errors.password && <span className="error">{errors.password}</span>}

        {!formData.isLogin && (
          <>
            <label className="inputLabel">Confirm Password</label>
            <input className="inputField" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
          </>
        )}

        <button className="submitButton" type="submit">{formData.isLogin ? "Login" : "Register"}</button>

        <p>
          {formData.isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setFormData({ ...formData, isLogin: !formData.isLogin })} className="toggleText">
            {formData.isLogin ? "Register" : "Login"}
          </span>
        </p>
      </form>
    </div>
    </>
  );
};

export default Login;  
