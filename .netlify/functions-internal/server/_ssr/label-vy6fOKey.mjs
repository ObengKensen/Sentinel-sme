import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { a as getCsrfToken, c as CSRF_FIELD_NAME } from "./csrf-C3jkS9Bv.mjs";
import { R as Root } from "../_libs/radix-ui__react-label.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { c as cn } from "./utils-B-5jxtHY.mjs";
function CsrfTokenField() {
  const token = getCsrfToken();
  if (!token) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "hidden", name: CSRF_FIELD_NAME, id: CSRF_FIELD_NAME, value: token });
}
const labelVariants = cva(
  "text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { ref, className: cn(labelVariants(), className), ...props }));
Label.displayName = Root.displayName;
export {
  CsrfTokenField as C,
  Label as L
};
