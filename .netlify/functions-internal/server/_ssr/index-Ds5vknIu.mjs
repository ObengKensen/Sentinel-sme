import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-BjSzN4sD.mjs";
import { c as cn } from "./utils-B-5jxtHY.mjs";
import { f as ShieldAlert, g as ArrowRight, W as Wallet, S as ShieldCheck, F as FileCheckCorner, C as Cog, B as Bell, h as Lightbulb, T as TrendingDown, i as Leaf } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
const FEATURE_STAGGER_DELAYS = ["delay-0", "delay-200", "delay-400", "delay-600"];
const TRIANGLE_CLIP = "[clip-path:polygon(50%_100%,0%_0%,100%_0%)]";
function TriangleIconBadge({
  icon: Icon,
  iconClassName
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-[5.75rem] w-[6.25rem]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("absolute inset-0 top-2 bg-muted shadow-[0_8px_18px_rgba(32,32,32,0.35)]", TRIANGLE_CLIP), "aria-hidden": "true" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("relative flex h-full w-full items-center justify-center bg-white shadow-[0_6px_16px_rgba(32,32,32,0.28)]", TRIANGLE_CLIP), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("h-8 w-8 -translate-y-1", iconClassName) }) })
  ] }) });
}
function Landing() {
  const featuresRef = reactExports.useRef(null);
  const featuresHasInteractedRef = reactExports.useRef(false);
  const [featuresVisible, setFeaturesVisible] = reactExports.useState(false);
  const [featuresHasInteracted, setFeaturesHasInteracted] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const el = featuresRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFeaturesVisible(true);
      setFeaturesHasInteracted(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!featuresHasInteractedRef.current) {
          featuresHasInteractedRef.current = true;
          setFeaturesHasInteracted(true);
        }
        setFeaturesVisible(true);
      } else if (featuresHasInteractedRef.current) {
        setFeaturesVisible(false);
      }
    }, {
      threshold: 0.15,
      rootMargin: "0px 0px -5% 0px"
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen overflow-x-hidden bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-50 border-b bg-background shadow-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-18 w-full min-w-0 items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "min-w-0 shrink font-montserrat text-xl font-extrabold tracking-tight sm:text-2xl lg:text-3xl", children: "Risk Sentinel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden md:flex flex-1 items-center justify-center gap-7 text-base", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#features", className: "font-semibold text-foreground/90 transition-colors hover:text-primary", children: "Features" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#benefits", className: "font-semibold text-foreground/90 transition-colors hover:text-primary", children: "Benefits" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#about", className: "font-semibold text-foreground/90 transition-colors hover:text-primary", children: "About" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex shrink-0 items-center gap-1.5 sm:gap-3 md:ml-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "h-9 px-3 text-sm sm:h-10 sm:px-4 sm:text-base", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: "Login" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "h-9 px-3 text-sm sm:h-10 sm:px-5 sm:text-base", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register", children: "Get started" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 py-16 sm:px-6 sm:py-20 md:py-28", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex w-full max-w-4xl flex-col items-center text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl", children: [
        "Stay Ahead of Business Risks with",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "Early Detection" }),
        " and Actionable Insight"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 w-full rounded-2xl border bg-card p-6 shadow-xl md:p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5", children: [
        [{
          label: "Financial",
          value: "Low",
          tone: "bg-success"
        }, {
          label: "Cyber",
          value: "Medium",
          tone: "bg-warning"
        }, {
          label: "Compliance",
          value: "Low",
          tone: "bg-success"
        }, {
          label: "Operational",
          value: "High",
          tone: "bg-destructive"
        }].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-[7.5rem] flex-col rounded-xl border p-5 md:min-h-[8.5rem] md:p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-muted-foreground md:text-base", children: c.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-2xl font-semibold md:text-3xl", children: c.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-auto pt-4 h-2 rounded-full ${c.tone}` })
        ] }, c.label)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 flex items-center justify-between rounded-xl bg-primary p-5 text-primary-foreground md:col-span-4 md:p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-primary-foreground/80 md:text-base", children: "Overall risk score" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-semibold md:text-4xl", children: "58%" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-10 w-10 opacity-80 md:h-12 md:w-12" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-10 max-w-2xl text-lg text-muted-foreground", children: "SME Risk Sentinel helps small and medium-sized businesses monitor financial, operational, compliance, and cybersecurity risks through intelligent dashboards, automated alerts, and real-time risk assessment." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 flex flex-wrap justify-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/register", children: [
        "Start monitoring ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-1 h-4 w-4" })
      ] }) }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "features", className: "border-t bg-secondary/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-6 py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-2xl mx-auto mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl font-semibold tracking-tight", children: "Four risk categories. One dashboard." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "A focused monitoring suite built for the realities of running a small business." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: featuresRef, className: "grid gap-10 pt-8 md:grid-cols-2 md:gap-12 lg:grid-cols-4", children: [{
        icon: Wallet,
        title: "Financial Monitoring",
        desc: "Track income, expenses and outstanding payments. Get warned about cash-flow risk."
      }, {
        icon: ShieldCheck,
        title: "Cybersecurity Monitoring",
        desc: "Watch passwords, antivirus and suspicious activity across your team."
      }, {
        icon: FileCheckCorner,
        title: "Compliance Monitoring",
        desc: "Tax and license deadline countdowns so you never miss a filing."
      }, {
        icon: Cog,
        title: "Operational Monitoring",
        desc: "Staffing, equipment status and delivery health in one place."
      }].map((f, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("relative overflow-visible rounded-xl border bg-card px-5 pb-5 pt-14 text-center", featuresVisible && cn("animate-in fade-in-0 slide-in-from-bottom-6 duration-700 ease-out fill-mode-forwards", FEATURE_STAGGER_DELAYS[index]), !featuresVisible && featuresHasInteracted && "animate-out fade-out-0 slide-out-to-bottom-6 duration-500 ease-out fill-mode-forwards", !featuresVisible && !featuresHasInteracted && "opacity-0", "motion-reduce:animate-none motion-reduce:opacity-100"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleIconBadge, { icon: f.icon, iconClassName: "text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold", children: f.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm text-muted-foreground", children: f.desc })
      ] }, f.title)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "benefits", className: "max-w-6xl mx-auto px-6 py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-10 pt-8 md:grid-cols-4 md:gap-12", children: [{
      icon: Bell,
      title: "Early warning alerts",
      desc: "Risk thresholds trigger plain-language alerts and recommended actions."
    }, {
      icon: Lightbulb,
      title: "Better decision-making",
      desc: "Quantified risk scores help you prioritize what matters today."
    }, {
      icon: TrendingDown,
      title: "Reduced losses",
      desc: "Catch issues before they escalate into costly disruptions."
    }, {
      icon: Leaf,
      title: "Improved sustainability",
      desc: "Build resilience and long-term stability for your business."
    }].map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-visible rounded-xl border bg-card px-5 pb-5 pt-14 text-center shadow-md transition-shadow hover:shadow-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleIconBadge, { icon: b.icon, iconClassName: "text-accent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold", children: b.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm text-muted-foreground", children: b.desc })
    ] }, b.title)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { id: "about", className: "border-t bg-primary text-primary-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-6 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-montserrat text-2xl font-bold", children: "Risk Sentinel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-primary-foreground/75", children: "An SME-focused early warning system for business risks." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-semibold mb-2", children: "About" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary-foreground/75", children: "Helping SMEs detect and manage business risks before they become costly problems." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-semibold mb-2", children: "Contact" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary-foreground/75", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "mailto:smerisksentinel@gmail.com", className: "text-primary-foreground/75 hover:text-primary-foreground", children: "smerisksentinel@gmail.com" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary-foreground/75 text-sm", children: "Accra, Ghana" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-semibold mb-2", children: "Account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-primary-foreground/75 hover:text-primary-foreground", children: "Login" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register", className: "text-primary-foreground/75 hover:text-primary-foreground", children: "Register" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-primary-foreground/20 py-4 text-center text-sm text-primary-foreground/75", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Risk Sentinel. All rights reserved."
      ] })
    ] })
  ] });
}
export {
  Landing as component
};
