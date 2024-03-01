import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { Button } from "@chakra-ui/button";
import axios from "../../api/axios";
import FormField from "../../components/FormField/FormField";

import "./Login.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [picLoading, setPicLoading] = useState(false);
  const [emailError, setemailError] = useState("");
  const [passwordError, setpasswordError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      navigate("/about");
    }
  }, []);

  const [formValid, setFormValid] = useState(false);

  const navigate = useNavigate();

  const handleValidation = (event) => {
    let formIsValid = true;

    if (!email) {
      formIsValid = false;
      setemailError("Please enter your email address");
      return false;
    }
    if (!validator.isEmail(email)) {
      formIsValid = false;
      setemailError("Email Not Valid");
      return false;
    } else {
      setemailError("");
      formIsValid = true;
    }

    if (!password) {
      formIsValid = false;
      setpasswordError(
        "Must contain 8 characters, one uppercase letter, one lowercase letter, one number, and one special symbol"
      );
      return false;
    }
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      formIsValid = false;
      setpasswordError(
        "Must contain 8 characters, one uppercase letter, one lowercase letter, one number, and one special symbol"
      );
      return false;
    } else {
      setpasswordError("");
      formIsValid = true;
    }
    setFormValid(formIsValid);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    handleValidation();
    if (formValid) {
      setPicLoading(true);
      if (!email || !password) {
        toast.warning("Please enter all the Details");
        setPicLoading(false);
        return;
      }

      console.log(email, password);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const { data } = await axios.post(
          "http://localhost:5000/api/v1/user/login",
          {
            email,
            password,
          },
          config
        );
        console.log(data);
        toast.success("Login Successful");
        localStorage.setItem("userInfo", JSON.stringify(data));
        setPicLoading(false);
        navigate("/about");
      } catch (error) {
        toast.error("Error Occured");
        setPicLoading(false);
      }
    }
  };

  return (
    !localStorage.getItem("userInfo") && (
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-md-4">
            <form
              id="loginform"
              onSubmit={submitHandler}
              className="register-form"
            >
              <h3 className="text-center register-header">Sign In</h3>
              <div className="form-group mt-2">
                <h5>Email address</h5>
                <FormField
                  type="email"
                  placeholder="Enter Email"
                  setFunc={setEmail}
                  value={email}
                />
                <small id="emailError" className="text-danger form-text mt-2">
                  {emailError}
                </small>
              </div>
              <div className="form-group mt-4">
                <h5>Password</h5>
                <FormField
                  type="password"
                  placeholder="Enter Password"
                  setFunc={setPassword}
                  value={password}
                />
                <small id="passworderror" className="text-danger form-text">
                  {passwordError}
                </small>
              </div>

              <div className="text-center submit-btn">
                <Button
                  colorScheme="black"
                  className="btn btn-dark px-4 mt-4"
                  onClick={submitHandler}
                  isLoading={picLoading}
                  type="submit"
                >
                  Submit
                </Button>
                <Button
                  variant="solid"
                  colorScheme="black"
                  className="btn btn-primary px-4 mt-4"
                  width="100%"
                  onClick={() => {
                    setEmail("guestuser@gmail.com");
                    setPassword("Guest123@");
                  }}
                >
                  Get Guest User Credentials
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
};

export default Login;
