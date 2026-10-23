import { createAuthClient } from "better-auth/react";

/**
 * Omit baseURL in the browser so requests stay same-origin
 * (avoids localhost vs 127.0.0.1 / preview URL mismatches).
 */
export const authClient = createAuthClient();
