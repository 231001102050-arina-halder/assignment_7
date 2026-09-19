import React, {
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    loginUser
} from "./api";


function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const [rememberMe, setRememberMe] = useState(false);

    const [usernameError, setUsernameError] = useState(false);

    const [passwordError, setPasswordError] = useState(false);

    const [loginError, setLoginError] = useState("");

    const [loading, setLoading] = useState(false);


    function getPasswordStrength(password) {

        if (!password) {
            return {
                text: "",
                className: ""
            };
        }

        let score = 0;

        if (password.length >= 8) {
            score++;
        }

        if (/[A-Z]/.test(password)) {
            score++;
        }

        if (/[a-z]/.test(password)) {
            score++;
        }

        if (/[0-9]/.test(password)) {
            score++;
        }

        if (/[^A-Za-z0-9]/.test(password)) {
            score++;
        }


        if (score <= 2) {

            return {
                text: "Weak",
                className: "weak"
            };

        }


        if (score <= 4) {

            return {
                text: "Medium",
                className: "medium"
            };

        }


        return {
            text: "Strong",
            className: "strong"
        };
    }


    const strength = getPasswordStrength(password);


    function handleLogin(event) {

        event.preventDefault();

        setLoginError("");

        let valid = true;


        if (!username.trim()) {

            setUsernameError(true);

            valid = false;

        } else {

            setUsernameError(false);

        }


        if (!password) {

            setPasswordError(true);

            valid = false;

        } else {

            setPasswordError(false);

        }


        if (!valid) {

            setLoginError(
                "Username and password are required."
            );

            return;
        }


        setLoading(true);


        setTimeout(() => {

            const result = loginUser(
                username.trim(),
                password,
                rememberMe
            );


            if (result.success) {

                navigate("/dashboard");

            } else {

                setLoginError(
                    result.message
                );

            }


            setLoading(false);

        }, 500);
    }


    return (

        <div className="page-container">

            <div className="login-card">

                <div className="brand">

                    <div className="brand-icon">
                        🔐
                    </div>

                    <h1>
                        Arina's Auth System
                    </h1>

                    <p>
                        Assignment 7
                    </p>

                </div>


                <form
                    onSubmit={handleLogin}
                    className="login-form"
                >

                    <div className="form-group">

                        <label>
                            Username
                        </label>

                        <input
                            type="text"
                            value={username}
                            placeholder="Enter username"
                            className={
                                usernameError
                                    ? "input-error"
                                    : ""
                            }
                            onChange={(event) => {

                                setUsername(
                                    event.target.value
                                );

                                if (
                                    event.target.value.trim()
                                ) {

                                    setUsernameError(false);

                                }

                                setLoginError("");

                            }}
                        />

                        {usernameError && (

                            <span className="field-error">
                                Username is required.
                            </span>

                        )}

                    </div>


                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            placeholder="Enter password"
                            className={
                                passwordError
                                    ? "input-error"
                                    : ""
                            }
                            onChange={(event) => {

                                setPassword(
                                    event.target.value
                                );

                                if (
                                    event.target.value
                                ) {

                                    setPasswordError(false);

                                }

                                setLoginError("");

                            }}
                        />


                        {password && (

                            <div className="password-strength">

                                <span>
                                    Password strength:
                                </span>

                                <strong
                                    className={
                                        strength.className
                                    }
                                >
                                    {strength.text}
                                </strong>

                            </div>

                        )}


                        {passwordError && (

                            <span className="field-error">
                                Password is required.
                            </span>

                        )}

                    </div>


                    <div className="remember-row">

                        <label className="remember-label">

                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(event) =>
                                    setRememberMe(
                                        event.target.checked
                                    )
                                }
                            />

                            <span>
                                Remember Me
                            </span>

                        </label>

                    </div>


                    {loginError && (

                        <div className="login-error">
                            {loginError}
                        </div>

                    )}


                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"
                        }

                    </button>

                </form>


                <div className="demo-box">

                    <h3>
                        Demo Credentials
                    </h3>

                    <p>
                        <strong>
                            Username:
                        </strong>{" "}
                        arina
                    </p>

                    <p>
                        <strong>
                            Password:
                        </strong>{" "}
                        Arina@123
                    </p>

                </div>


                <div className="footer-text">

                    Assignment 7 • Authentication System

                </div>

            </div>

        </div>
    );
}


export default Login;