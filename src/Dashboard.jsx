import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    getUsername,
    validateToken,
    logoutUser
} from "./api";


function Dashboard() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");


    useEffect(() => {

        const user = validateToken();

        if (!user) {

            navigate("/", {
                replace: true
            });

            return;
        }


        setUsername(
            getUsername() || user.username
        );

    }, [navigate]);


    function handleLogout() {

        logoutUser();

        navigate("/", {
            replace: true
        });

    }


    return (

        <div className="dashboard-page">

            <nav className="navbar">

                <div className="nav-logo">

                    🔐 AuthSystem

                </div>


                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </nav>


            <main className="dashboard-content">

                <div className="welcome-card">

                    <div className="success-icon">
                        ✓
                    </div>


                    <h1>
                        Welcome, {username}!
                    </h1>


                    <p className="dashboard-subtitle">

                        You have successfully logged in.

                    </p>


                    <div className="status-box">

                        <div className="status-item">

                            <span>
                                Authentication
                            </span>

                            <strong className="status-success">
                                ✓ Valid
                            </strong>

                        </div>


                        <div className="status-item">

                            <span>
                                JWT Token
                            </span>

                            <strong className="status-success">
                                ✓ Valid
                            </strong>

                        </div>


                        <div className="status-item">

                            <span>
                                Protected Route
                            </span>

                            <strong className="status-success">
                                ✓ Active
                            </strong>

                        </div>


                        <div className="status-item">

                            <span>
                                Remember Me
                            </span>

                            <strong className="status-success">

                                {localStorage.getItem("token")
                                    ? "✓ Enabled"
                                    : "Session"
                                }

                            </strong>

                        </div>

                    </div>


                    <div className="assignment-info">

                        <h2>
                            React Assign 7
                        </h2>

                        <p>
                            Authentication System
                        </p>


                        <div className="feature-list">

                            <div>
                                ✓ Login
                            </div>

                            <div>
                                ✓ Logout
                            </div>

                            <div>
                                ✓ Protected Dashboard
                            </div>

                            <div>
                                ✓ Remember User
                            </div>

                            <div>
                                ✓ JWT Token Simulation
                            </div>

                            <div>
                                ✓ Username Required
                            </div>

                            <div>
                                ✓ Password Required
                            </div>

                            <div>
                                ✓ Password Strength
                            </div>

                        </div>

                    </div>


                    <button
                        className="dashboard-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </main>

        </div>
    );
}


export default Dashboard;