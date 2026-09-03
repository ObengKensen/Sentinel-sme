import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldAlert,
  Wallet,
  ShieldCheck,
  FileCheck2,
  Cog,
  Bell,
  TrendingDown,
  Lightbulb,
  Leaf,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FEATURE_STAGGER_DELAYS = ["delay-0", "delay-200", "delay-400", "delay-600"] as const;

const TRIANGLE_CLIP = "[clip-path:polygon(50%_100%,0%_0%,100%_0%)]";

function TriangleIconBadge({
  icon: Icon,
  iconClassName,
}: {
  icon: LucideIcon;
  iconClassName?: string;
}) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
      <div className="relative h-[5.75rem] w-[6.25rem]">
        <div
          className={cn(
            "absolute inset-0 top-2 bg-muted shadow-[0_8px_18px_rgba(32,32,32,0.35)]",
            TRIANGLE_CLIP,
          )}
          aria-hidden="true"
        />
        <div
          className={cn(
            "relative flex h-full w-full items-center justify-center bg-white shadow-[0_6px_16px_rgba(32,32,32,0.28)]",
            TRIANGLE_CLIP,
          )}
        >
          <Icon className={cn("h-8 w-8 -translate-y-1", iconClassName)} />
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SME Risk Sentinel — Early Detection of Business Risks" },
      {
        name: "description",
        content:
          "A rule-based decision support platform that helps SMEs detect financial, cybersecurity, compliance and operational risks early.",
      },
      { property: "og:title", content: "SME Risk Sentinel" },
      {
        property: "og:description",
        content: "Detect SME business risks early with a clear, rule-based monitoring dashboard.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const featuresRef = useRef<HTMLDivElement>(null);
  const featuresHasInteractedRef = useRef(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [featuresHasInteracted, setFeaturesHasInteracted] = useState(false);

  useEffect(() => {
    const el = featuresRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFeaturesVisible(true);
      setFeaturesHasInteracted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!featuresHasInteractedRef.current) {
            featuresHasInteractedRef.current = true;
            setFeaturesHasInteracted(true);
          }
          setFeaturesVisible(true);
        } else if (featuresHasInteractedRef.current) {
          setFeaturesVisible(false);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background shadow-md">
        <div className="flex h-18 w-full min-w-0 items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="min-w-0 shrink font-montserrat text-xl font-extrabold tracking-tight sm:text-2xl lg:text-3xl"
          >
            Risk Sentinel
          </Link>
          <nav className="hidden md:flex flex-1 items-center justify-center gap-7 text-base">
            <a
              href="#features"
              className="font-semibold text-foreground/90 transition-colors hover:text-primary"
            >
              Features
            </a>
            <a
              href="#benefits"
              className="font-semibold text-foreground/90 transition-colors hover:text-primary"
            >
              Benefits
            </a>
            <a
              href="#about"
              className="font-semibold text-foreground/90 transition-colors hover:text-primary"
            >
              About
            </a>
          </nav>
          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-3 md:ml-0">
            <Button variant="ghost" className="h-9 px-3 text-sm sm:h-10 sm:px-4 sm:text-base" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button className="h-9 px-3 text-sm sm:h-10 sm:px-5 sm:text-base" asChild>
              <Link to="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="px-4 py-16 sm:px-6 sm:py-20 md:py-28">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
            Stay Ahead of Business Risks with{" "}
            <span className="text-accent">Early Detection</span> and Actionable Insight
          </h1>

          <div className="mt-10 w-full rounded-2xl border bg-card p-6 shadow-xl md:p-8">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
              {[
                { label: "Financial", value: "Low", tone: "bg-success" },
                { label: "Cyber", value: "Medium", tone: "bg-warning" },
                { label: "Compliance", value: "Low", tone: "bg-success" },
                { label: "Operational", value: "High", tone: "bg-destructive" },
              ].map((c) => (
                <div
                  key={c.label}
                  className="flex min-h-[7.5rem] flex-col rounded-xl border p-5 md:min-h-[8.5rem] md:p-6"
                >
                  <div className="text-sm font-medium text-muted-foreground md:text-base">{c.label}</div>
                  <div className="mt-2 text-2xl font-semibold md:text-3xl">{c.value}</div>
                  <div className={`mt-auto pt-4 h-2 rounded-full ${c.tone}`} />
                </div>
              ))}
              <div className="col-span-2 flex items-center justify-between rounded-xl bg-primary p-5 text-primary-foreground md:col-span-4 md:p-6">
                <div>
                  <div className="text-sm text-primary-foreground/80 md:text-base">Overall risk score</div>
                  <div className="text-3xl font-semibold md:text-4xl">58%</div>
                </div>
                <ShieldAlert className="h-10 w-10 opacity-80 md:h-12 md:w-12" />
              </div>
            </div>
          </div>

          <p className="mt-10 max-w-2xl text-lg text-muted-foreground">
            SME Risk Sentinel helps small and medium-sized businesses monitor financial, operational,
            compliance, and cybersecurity risks through intelligent dashboards, automated alerts, and
            real-time risk assessment.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link to="/register">
                Start monitoring <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="border-t bg-secondary/40">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-4xl font-semibold tracking-tight">
              Four risk categories. One dashboard.
            </h2>
            <p className="mt-3 text-muted-foreground">
              A focused monitoring suite built for the realities of running a small business.
            </p>
          </div>
          <div ref={featuresRef} className="grid gap-10 pt-8 md:grid-cols-2 md:gap-12 lg:grid-cols-4">
            {[
              {
                icon: Wallet,
                title: "Financial Monitoring",
                desc: "Track income, expenses and outstanding payments. Get warned about cash-flow risk.",
              },
              {
                icon: ShieldCheck,
                title: "Cybersecurity Monitoring",
                desc: "Watch passwords, antivirus and suspicious activity across your team.",
              },
              {
                icon: FileCheck2,
                title: "Compliance Monitoring",
                desc: "Tax and license deadline countdowns so you never miss a filing.",
              },
              {
                icon: Cog,
                title: "Operational Monitoring",
                desc: "Staffing, equipment status and delivery health in one place.",
              },
            ].map((f, index) => (
              <div
                key={f.title}
                className={cn(
                  "relative overflow-visible rounded-xl border bg-card px-5 pb-5 pt-14 text-center",
                  featuresVisible &&
                    cn(
                      "animate-in fade-in-0 slide-in-from-bottom-6 duration-700 ease-out fill-mode-forwards",
                      FEATURE_STAGGER_DELAYS[index],
                    ),
                  !featuresVisible &&
                    featuresHasInteracted &&
                    "animate-out fade-out-0 slide-out-to-bottom-6 duration-500 ease-out fill-mode-forwards",
                  !featuresVisible && !featuresHasInteracted && "opacity-0",
                  "motion-reduce:animate-none motion-reduce:opacity-100",
                )}
              >
                <TriangleIconBadge icon={f.icon} iconClassName="text-primary" />
                <div className="text-lg font-semibold">{f.title}</div>
                <div className="mt-1 text-sm text-muted-foreground">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="benefits" className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid gap-10 pt-8 md:grid-cols-4 md:gap-12">
          {[
            {
              icon: Bell,
              title: "Early warning alerts",
              desc: "Risk thresholds trigger plain-language alerts and recommended actions.",
            },
            {
              icon: Lightbulb,
              title: "Better decision-making",
              desc: "Quantified risk scores help you prioritize what matters today.",
            },
            {
              icon: TrendingDown,
              title: "Reduced losses",
              desc: "Catch issues before they escalate into costly disruptions.",
            },
            {
              icon: Leaf,
              title: "Improved sustainability",
              desc: "Build resilience and long-term stability for your business.",
            },
          ].map((b) => (
            <div
              key={b.title}
              className="relative overflow-visible rounded-xl border bg-card px-5 pb-5 pt-14 text-center shadow-md transition-shadow hover:shadow-lg"
            >
              <TriangleIconBadge icon={b.icon} iconClassName="text-accent" />
              <div className="text-lg font-semibold">{b.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{b.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <footer id="about" className="border-t bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-6 text-sm">
          <div>
            <div className="font-montserrat text-2xl font-bold">Risk Sentinel</div>
            <p className="mt-2 text-primary-foreground/75">
              An SME-focused early warning system for business risks.
            </p>
          </div>
          <div>
            <div className="text-base font-semibold mb-2">About</div>
            <p className="text-primary-foreground/75">
              Helping SMEs detect and manage business risks before they become costly problems.
            </p>
          </div>
          <div>
            <div className="text-base font-semibold mb-2">Contact</div>
            <p className="text-primary-foreground/75">
              <a
                href="mailto:smerisksentinel@gmail.com"
                className="text-primary-foreground/75 hover:text-primary-foreground"
              >
                smerisksentinel@gmail.com
              </a>
            </p>
            <p className="text-primary-foreground/75 text-sm">Accra, Ghana</p>
          </div>
          <div>
            <div className="text-base font-semibold mb-2">Account</div>
            <div className="flex flex-col gap-1">
              <Link
                to="/login"
                className="text-primary-foreground/75 hover:text-primary-foreground"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-primary-foreground/75 hover:text-primary-foreground"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 py-4 text-center text-sm text-primary-foreground/75">
          © {new Date().getFullYear()} Risk Sentinel. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
