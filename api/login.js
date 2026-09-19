import { createToken, sendJson } from "./auth-utils";

const DEMO_USER = {
  username: "admin",
  password: "Admin@123"
};

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return sendJson(response, 405, { message: "Method not allowed" });
  }

  const { username, password } = request.body || {};

  if (!username || !password) {
    return sendJson(response, 400, {
      message: "Username and password are required."
    });
  }

  if (username !== DEMO_USER.username || password !== DEMO_USER.password) {
    return sendJson(response, 401, {
      message: "Invalid username or password."
    });
  }

  const token = createToken({
    sub: "user-001",
    username: DEMO_USER.username
  });

  return sendJson(response, 200, {
    message: "Login successful.",
    token,
    user: {
      username: DEMO_USER.username
    }
  });
}
