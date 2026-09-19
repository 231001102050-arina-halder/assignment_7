const DEMO_USERNAME = "arina";
const DEMO_PASSWORD = "Arina@123";


function createToken(username, rememberMe) {

    const header = {
        alg: "HS256",
        typ: "JWT"
    };

    const payload = {
        username: username,
        rememberMe: rememberMe,
        loginTime: Date.now(),
        expiresAt: Date.now() + (
            rememberMe
                ? 7 * 24 * 60 * 60 * 1000
                : 60 * 60 * 1000
        )
    };


    const encode = (object) => {

        return btoa(
            JSON.stringify(object)
        )
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=/g, "");

    };


    const encodedHeader = encode(header);

    const encodedPayload = encode(payload);

    const signature = btoa(
        "assignment7_simulated_signature"
    )
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");


    return (
        encodedHeader +
        "." +
        encodedPayload +
        "." +
        signature
    );
}


function decodeToken(token) {

    try {

        const parts = token.split(".");

        if (parts.length !== 3) {
            return null;
        }


        const base64 = parts[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");


        const json = atob(base64);


        return JSON.parse(json);

    } catch (error) {

        return null;

    }
}


export function loginUser(
    username,
    password,
    rememberMe
) {

    if (
        username !== DEMO_USERNAME ||
        password !== DEMO_PASSWORD
    ) {

        return {
            success: false,
            message: "Invalid username or password."
        };

    }


    const token = createToken(
        username,
        rememberMe
    );


    if (rememberMe) {

        localStorage.setItem(
            "token",
            token
        );

        localStorage.setItem(
            "username",
            username
        );


        sessionStorage.removeItem(
            "token"
        );

        sessionStorage.removeItem(
            "username"
        );

    } else {

        sessionStorage.setItem(
            "token",
            token
        );

        sessionStorage.setItem(
            "username",
            username
        );


        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "username"
        );

    }


    return {
        success: true,
        message: "Login successful.",
        username: username
    };
}


export function getToken() {

    return (
        localStorage.getItem("token") ||
        sessionStorage.getItem("token")
    );

}


export function getUsername() {

    return (
        localStorage.getItem("username") ||
        sessionStorage.getItem("username")
    );

}


export function validateToken() {

    const token = getToken();


    if (!token) {

        return false;

    }


    const payload = decodeToken(token);


    if (!payload) {

        logoutUser();

        return false;

    }


    if (
        !payload.username ||
        !payload.expiresAt
    ) {

        logoutUser();

        return false;

    }


    if (
        Date.now() > payload.expiresAt
    ) {

        logoutUser();

        return false;

    }


    return payload;

}


export function logoutUser() {

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "username"
    );


    sessionStorage.removeItem(
        "token"
    );

    sessionStorage.removeItem(
        "username"
    );

}


export function getDemoUsername() {

    return DEMO_USERNAME;

}