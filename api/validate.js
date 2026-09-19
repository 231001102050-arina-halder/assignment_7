import { sendJson, verifyToken } from "./auth-utils";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return sendJson(response, 405, { message: "Method not allowed" });
  }

  const authHeader = request.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : request.body?.token;
  const result = verifyToken(token);

  if (!result.valid) {
    return sendJson(response, 401, {
      valid: false,
      message: result.reason
    });
  }

  return sendJson(response, 200, {
    valid: true,
    user: {
      username: result.payload.username
    }
  });
}