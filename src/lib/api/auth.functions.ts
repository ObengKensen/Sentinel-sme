import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { signAuthToken, verifyAuthToken } from "../auth/jwt.server";

const tokenClaimsInput = z.object({
  userId: z.string().min(1),
  email: z
    .string()
    .transform((value) => value.trim().toLowerCase())
    .pipe(z.string().email()),
  role: z.enum(["SME_OWNER", "SUPER_ADMIN"]),
});

export const issueAuthTokenFn = createServerFn({ method: "POST" })
  .validator(tokenClaimsInput)
  .handler(async ({ data }) => {
    const token = await signAuthToken(data);
    return { token };
  });

export const verifyAuthTokenFn = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string().min(1) }))
  .handler(async ({ data }) => {
    const claims = await verifyAuthToken(data.token);
    if (!claims) return { ok: false as const };
    return {
      ok: true as const,
      userId: claims.sub,
      email: claims.email,
      role: claims.role,
      expiresAt: claims.exp * 1000,
    };
  });
