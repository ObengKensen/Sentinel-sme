import { c as createServerRpc } from "./createServerRpc-DDGXgg5L.mjs";
import { createServerFn } from "./server-DpwYz346.mjs";
import { s as signAuthToken, v as verifyAuthToken } from "./jwt.server-sVP2l4Gx.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, e as enumType, s as stringType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "node:crypto";
import "./jwt.shared-gMsek6D_.mjs";
import "node:process";
const tokenClaimsInput = objectType({
  userId: stringType().min(1),
  email: stringType().transform((value) => value.trim().toLowerCase()).pipe(stringType().email()),
  role: enumType(["SME_OWNER", "SUPER_ADMIN"])
});
const issueAuthTokenFn_createServerFn_handler = createServerRpc({
  id: "92ba317f8c696bd3af31aa139ed9c1f6740732c08f6c083c502d2813c9dfeaa0",
  name: "issueAuthTokenFn",
  filename: "src/lib/api/auth.functions.ts"
}, (opts) => issueAuthTokenFn.__executeServer(opts));
const issueAuthTokenFn = createServerFn({
  method: "POST"
}).validator(tokenClaimsInput).handler(issueAuthTokenFn_createServerFn_handler, async ({
  data
}) => {
  const token = await signAuthToken(data);
  return {
    token
  };
});
const verifyAuthTokenFn_createServerFn_handler = createServerRpc({
  id: "2cc65e98fefcdd3523289cc8a671abdf44e90f757943b5409842ee4a91125820",
  name: "verifyAuthTokenFn",
  filename: "src/lib/api/auth.functions.ts"
}, (opts) => verifyAuthTokenFn.__executeServer(opts));
const verifyAuthTokenFn = createServerFn({
  method: "POST"
}).validator(objectType({
  token: stringType().min(1)
})).handler(verifyAuthTokenFn_createServerFn_handler, async ({
  data
}) => {
  const claims = await verifyAuthToken(data.token);
  if (!claims) return {
    ok: false
  };
  return {
    ok: true,
    userId: claims.sub,
    email: claims.email,
    role: claims.role,
    expiresAt: claims.exp * 1e3
  };
});
export {
  issueAuthTokenFn_createServerFn_handler,
  verifyAuthTokenFn_createServerFn_handler
};
