import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { Button } from "@chakra-ui/button";
import axios from "../../api/axios";
import { registerRoute } from "../../api/routes";
import FormField from "../../components/FormField/FormField";

import "./Register.scss";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setemailError] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [picError, setpicError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      navigate("/about");
    }
  }, []);

  const [formValid, setFormValid] = useState(false);

  const navigate = useNavigate();

  const handleValidation = (event) => {
    let formIsValid = true;
    if (!name) {
      formIsValid = false;
      setNameError("Please enter your name");
      return false;
    }
    if (!validator.isAlpha(name)) {
      formIsValid = false;
      setNameError("Name Not Valid");
      return false;
    } else {
      setNameError("");
      formIsValid = true;
    }

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

    if (!pic) {
      formIsValid = false;
      setpicError("Please upload a picture");
      return false;
    }
    setFormValid(formIsValid);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    handleValidation();
    if (formValid) {
      setPicLoading(true);
      if (!name || !email || !password) {
        toast.warning("Please enter all the Details");
        setPicLoading(false);
        return;
      }

      console.log(name, email, password, pic);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const { data } = await axios.post(
          "http://localhost:5000/api/v1/user/",
          {
            name,
            email,
            password,
            pic,
          },
          config
        );
        console.log(data);
        toast.success("Registration Successful");
        localStorage.setItem("userInfo", JSON.stringify(data));
        setPicLoading(false);
        navigate("/about");
      } catch (error) {
        toast.error("Error Occured");
        setPicLoading(false);
      }
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      // toast.warning("Please select an Image");
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chatapp");
      data.append("cloud_name", "dyq0wgvry");
      fetch("https://api.cloudinary.com/v1_1/dyq0wgvry/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      // toast.warning("Please select an Image");
      setPicLoading(false);
      return;
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
              <h3 className="text-center register-header">Register</h3>
              <div className="form-group mt-2">
                <h5>Name</h5>
                <FormField
                  type="text"
                  placeholder="Enter Name"
                  setFunc={setName}
                />
                <small id="nameError" className="text-danger form-text mt-2">
                  {nameError}
                </small>
              </div>
              <div className="form-group mt-2">
                <h5>Email address</h5>
                <FormField
                  type="email"
                  placeholder="Enter Email"
                  setFunc={setEmail}
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
                />
                <small id="passworderror" className="text-danger form-text">
                  {passwordError}
                </small>
              </div>
              <div className="form-group mt-4">
                <h5>Upload your picture</h5>
                <input
                  type="file"
                  className="form-control"
                  id="fileInput"
                  name="fileInput"
                  accept="image/*"
                  placeholder="Upload Picture"
                  onChange={(e) => postDetails(e.target.files[0])}
                />
                <small id="passworderror" className="text-danger form-text">
                  {picError}
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
                  Sign Up
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
};

export default Register;
