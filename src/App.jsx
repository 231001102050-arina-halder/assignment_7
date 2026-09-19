import React from "react";

import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./Login";
import Dashboard from "./Dashboard";

import {
    validateToken
} from "./api";


function ProtectedRoute({ children }) {

    const authenticated = validateToken();

    if (!authenticated) {

        return <Navigate to="/" replace />;

    }

    return children;
}


function App() {

    return (

        <Routes>

            <Route
                path="/"
                element={<Login />}
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="*"
                element={
                    <Navigate
                        to="/"
                        replace
                    />
                }
            />

        </Routes>

    );
}


export default App;