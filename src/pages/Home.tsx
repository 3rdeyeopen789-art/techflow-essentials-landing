// Auth and tRPC removed for static deployment
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Download, Sparkles, Star, Shield, Clock, Zap, TrendingUp, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

/* ─────────────────────────────────────────────
   Design: Conversion-focused lead magnet page
   Primary: Cyan #00B4DC → Blue #2563EB gradient
   Secondary: Slate #1E293B
   Font: Poppins (headings), Inter (body)
   Style: Modern, clean, urgency-driven
   ───────────────────────────────────────────── */

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Set deadline to end of today + 24 hours (always shows ~24h countdown, resets daily)
    const getDeadline = () => {
      const now = new Date();
      const deadline = new Date(now);
      deadline.setHours(23, 59, 59, 999);
      // If less than 2 hours left in the day, extend to next day
      if (deadline.getTime() - now.getTime() < 2 * 60 * 60 * 1000) {
        deadline.setDate(deadline.getDate() + 1);
      }
      return deadline;
    };

    const deadline = getDeadline();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = deadline.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-1 font-mono font-bold text-white text-lg" role="timer" aria-label="Time remaining for offer">
      <span className="bg-white/20 rounded px-2 py-1">{pad(timeLeft.hours)}</span>
      <span className="text-yellow-300">:</span>
      <span className="bg-white/20 rounded px-2 py-1">{pad(timeLeft.minutes)}</span>
      <span className="text-yellow-300">:</span>
      <span className="bg-white/20 rounded px-2 py-1">{pad(timeLeft.seconds)}</span>
    </div>
  );
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);

  const scrollToForm = useCallback(() => {
    document.getElementById("email-form")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Trigger Klaviyo popup form when form section is scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && window._klOnsite) {
          // Trigger the working Klaviyo popup form
          window._klOnsite.push(['openForm', 'VwjPMb']);
          observer.disconnect(); // Only trigger once
        }
      });
    }, { threshold: 0.5 });

    const formSection = document.getElementById("email-form");
    if (formSection) {
      observer.observe(formSection);
    }

    return () => observer.disconnect();
  }, []);

  const subscribeMutation = trpc.klaviyo.subscribe.useMutation({
    onSuccess: () => {
      toast.success("Check your email! Your free guide is on the way!");
      setEmail("");
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to subscribe. Please try again.");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    subscribeMutation.mutate({ email });
  };

  const benefits = [
    {
      icon: "https://private-us-east-1.manuscdn.com/sessionFile/UrHQ6vaV3c9rHF92FoWThf/sandbox/jgrivL1zASmY7BqLIxYZ88-img-1_1771907690000_na1fn_YmVuZWZpdC10aW1lLXNhdmluZw.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVXJIUTZ2YVYzYzlySEY5MkZvV1RoZi9zYW5kYm94L2pncml2TDF6QVNtWTdCcUxJeFlaODgtaW1nLTFfMTc3MTkwNzY5MDAwMF9uYTFmbl9ZbVZ1WldacGRDMTBhVzFsTFhOaGRtbHVady5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=BpF5d9FhOKtf1trkr2l8rmktw4Wz2J3Rt~NyLk4MxZB9P1EiQTFFyndXt6hX2btjZEg8SN1o1o~ck4~gLyurNa1jCaRtP85dD~yM3JvpNystZz9R06FgvkrE3wPTDXKOjl~7MBwpcxtXFKTqxItEixnSTPMO~EQK~nKj9W7DiiSodnbolIgYt99pZY3vC1f3h62py5zpbP1kV7HcJavQzpvLgtr9hqCJXg4Q~iN4MCMVDg4MhQc97hHoeOonNNL7RkN~TAeK0Dsohgvz4HpKvfEJPynT5BaEbeDXbA1LWwUa~DDR7QC0tG4SQztq6fnQrKBtqhG4nLL~RIi5kZD9aA__",
      title: "Save Time",
      description: "Automate repetitive tasks like email writing, content creation, and customer support in minutes instead of hours.",
    },
    {
      icon: "https://private-us-east-1.manuscdn.com/sessionFile/UrHQ6vaV3c9rHF92FoWThf/sandbox/jgrivL1zASmY7BqLIxYZ88-img-2_1771907699000_na1fn_YmVuZWZpdC1hdXRvbWF0aW9u.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVXJIUTZ2YVYzYzlySEY5MkZvV1RoZi9zYW5kYm94L2pncml2TDF6QVNtWTdCcUxJeFlaODgtaW1nLTJfMTc3MTkwNzY5OTAwMF9uYTFmbl9ZbVZ1WldacGRDMWhkWFJ2YldGMGFXOXUucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=mcg~KpPSHxSh4CRvxlAe6m0KvxesDNQiVprZkCZS7p9qHTrQMyi1opbL~gGUuTyvnpl7o06HAeyWUFF1JpmSX2qP~2jveTjZxMJmELlPvnnMSZJ1uAgdLydtKh6q~fBh4zjReI1Z9TqORcgOP00~GMzmQA60-AslNmCpn8I-YgI-u~jE53v-V~FEjq7akAonVnbEmnlr6edeldcHr0qJtfPj2v7soWh2lwO-tIRUJG-os-Jb8gmGeqbf8yzn4XbdgRlBYFLPakd2mbRFRzub0kIu5y7UVN0wKAp1A65MbrKzmcp9VESwTqtq9Onva-5sCHbTtJcQL~KVZSHsDUmebg__",
      title: "Boost Productivity",
      description: "Get more done in less time with AI-powered workflows that handle the busywork so you can focus on growth.",
    },
    {
      icon: "https://private-us-east-1.manuscdn.com/sessionFile/UrHQ6vaV3c9rHF92FoWThf/sandbox/jgrivL1zASmY7BqLIxYZ88-img-3_1771907697000_na1fn_YmVuZWZpdC1ncm93dGg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVXJIUTZ2YVYzYzlySEY5MkZvV1RoZi9zYW5kYm94L2pncml2TDF6QVNtWTdCcUxJeFlaODgtaW1nLTNfMTc3MTkwNzY5NzAwMF9uYTFmbl9ZbVZ1WldacGRDMW5jbTkzZEdnLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=dZrhX1yUkl8Kw9rBaINdfWDRyHqirxRddxfVqtJMqB0sonMgHO7LGozMv4V62xnkVbD8Q8uy6cDMWvnNs6EVYmDcMqyG8fFxVGsZNV2Epz9HDzvXuYqCOSRPu6ecTPbhNgQMamyIJMyleP5QiQxmv28U9CKazmMfbRQuySfJukQRseL40f2oZ-znwGpY2mYEqJtpFsqz8CaPVET7OnN3lAsRa1TKC3v0B2NYO33w3rAC~LwH~n7p6B2HasPDwnZTvzhpgG3ifX5bYtpoeE3EzRKS2X7o7DQWlgtT9U82gyfXO2POqPXcW1-P69ObVz4mpFcDDjqR14erl4mhmqb7zw__",
      title: "Grow Faster",
      description: "Make data-driven decisions, create better content, and serve customers faster with AI as your co-pilot.",
    },
  ];

  return (
    <>
      {/* ══════════════ URGENCY BANNER ══════════════ */}
      {bannerVisible && (
        <div className="sticky top-0 z-50 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white animate-pulse-slow" role="alert">
          <div className="container py-3 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 relative">
            <div className="flex items-center gap-2 text-sm sm:text-base font-semibold">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 animate-spin-slow" aria-hidden="true" />
              <span>LIMITED TIME: Free guide + 10% discount expires in</span>
            </div>
            <CountdownTimer />
            <button
              onClick={() => setBannerVisible(false)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
        {/* ══════════════ HERO SECTION ══════════════ */}
        <header>
          <section className="container py-12 md:py-24" aria-label="Hero">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Copy */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>Free AI Automation Guide</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight font-[Poppins]">
                  Save 10-30 Hours Per Week with{" "}
                  <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                    AI Automation
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                  Get our <strong>FREE guide</strong> with 10 powerful ChatGPT prompts designed specifically for small business owners. No experience needed — just copy, paste, and watch your productivity soar.
                </p>

                {/* Benefits List */}
                <ul className="space-y-3" aria-label="Key benefits">
                  {[
                    "Automate repetitive tasks in minutes",
                    "Generate content 10x faster",
                    "Make smarter business decisions with AI",
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-slate-700">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={scrollToForm}
                  className="h-14 px-10 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03]"
                  aria-label="Get your free AI prompt guide"
                >
                  Get My Free Guide →
                </Button>

                {/* Social Proof */}
                <div className="flex items-center gap-6 pt-2">
                  <div className="flex -space-x-3" aria-hidden="true">
                    {["bg-cyan-400", "bg-blue-500", "bg-teal-400", "bg-indigo-500"].map((color, i) => (
                      <div
                        key={i}
                        className={`w-10 h-10 rounded-full ${color} border-2 border-white`}
                      />
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                      ))}
                    </div>
                    <p className="text-sm text-slate-600"><strong className="text-slate-900">500+</strong> business owners already using AI to grow</p>
                  </div>
                </div>
              </div>

              {/* Right: Hero Image */}
              <div className="lg:pl-8">
                <div className="relative">
                  <img
                    src="https://private-us-east-1.manuscdn.com/sessionFile/UrHQ6vaV3c9rHF92FoWThf/sandbox/hWzaOAa4NSwXbRt2KdDfuL-img-1_1771907598000_na1fn_aGVyby1haS1hdXRvbWF0aW9u.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVXJIUTZ2YVYzYzlySEY5MkZvV1RoZi9zYW5kYm94L2hXemFPQWE0TlN3WGJSdDJLZERmdUwtaW1nLTFfMTc3MTkwNzU5ODAwMF9uYTFmbl9hR1Z5YnkxaGFTMWhkWFJ2YldGMGFXOXUucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=BgX2vT2TUirHHkXAVCYpBTPsZ0LzxIaQYWQIxz5glYal6XV~nnIX-DgI~D~oydvXbob5S5SX9HoGQ2FnObwHuJYnzX4w1PuJv3DTltqIDWX6JL0BRhyfEGpRcgFDEZYTuTlte1AswGcsS37NTOXtGbQVAG2JUTWAap8ixWmT950sesiC9ZuX3kbH4s0YV3jtjYAVVTGe7kyLO6v8CTyVOFOKAPZd8jjzApkld-tpKE6FSUbezrfnW6xw6DPyVVoKz7fFfnmZyYaZbzcvnfJ5RE~IxkLOlCU7FFA3hURR2OdqS85Knbm9Pp-yJGLElSVhFkSx3BbWRgj6zJ0XQaDAgg__"
                    alt="Modern workspace with AI automation tools, holographic brain interface, and business professionals collaborating with artificial intelligence"
                    className="rounded-2xl shadow-2xl w-full"
                    loading="eager"
                    width={960}
                    height={540}
                  />
                  {/* Floating badge */}
                  <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg px-4 py-3 border border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Downloads today</p>
                        <p className="text-sm font-bold text-slate-900">47 guides sent</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </header>

        {/* ══════════════ EMAIL CAPTURE FORM ══════════════ */}
        <main>
          <section id="email-form" className="py-16 bg-white" aria-label="Download free guide">
            <div className="container max-w-2xl">
              <div className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl shadow-2xl p-8 md:p-10 border-2 border-cyan-200">
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-4">
                      <Download className="w-8 h-8 text-white" aria-hidden="true" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-[Poppins]">
                      Get Your Free Guide Now
                    </h2>
                    <p className="text-slate-600">
                      Enter your email and we'll send you the guide instantly — no strings attached
                    </p>
                  </div>

                  {/* Email Capture Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 h-12 px-4 text-base border-2 border-slate-300 focus:border-cyan-500 focus:ring-cyan-500"
                        required
                        disabled={isSubmitting}
                        aria-label="Email address"
                      />
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-12 px-8 text-base font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {isSubmitting ? "Sending..." : "Get Free Guide"}
                      </Button>
                    </div>
                  </form>

                  {/* Trust signals */}
                  <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3" aria-hidden="true" /> No spam</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" aria-hidden="true" /> Instant delivery</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" aria-hidden="true" /> Unsubscribe anytime</span>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-200">
                    <p className="text-sm font-semibold text-slate-900 text-center">
                      BONUS: Get 10% off The Agent Playbook
                    </p>
                    <p className="text-xs text-slate-500 text-center">
                      Use code <span className="font-mono bg-cyan-100 text-cyan-700 px-2 py-1 rounded font-semibold">WELCOME10</span> at checkout
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════ BENEFITS SECTION ══════════════ */}
          <section className="py-20 bg-gradient-to-br from-slate-50 to-white" aria-label="What you will get">
            <div className="container">
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-[Poppins]">
                  What You'll Get Inside
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  10 battle-tested ChatGPT prompts that small business owners use every day to save time and grow faster
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {benefits.map((benefit, i) => (
                  <article
                    key={i}
                    className="group p-8 rounded-2xl bg-white border border-slate-200 hover:border-cyan-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-20 h-20 mb-6 group-hover:scale-110 transition-transform duration-300">
                      <img
                        src={benefit.icon}
                        alt={`${benefit.title} - AI automation benefit illustration`}
                        className="w-full h-full object-contain"
                        loading="lazy"
                        width={80}
                        height={80}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* ══════════════ SOCIAL PROOF ══════════════ */}
          <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white" aria-label="Testimonials">
            <div className="container">
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold font-[Poppins]">
                  Join 500+ Business Owners Mastering AI
                </h2>
                <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                  See how AI automation is transforming small businesses
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {[
                  {
                    quote: "These prompts saved me 15 hours last week alone. Game changer for my e-commerce store!",
                    author: "Sarah Chen",
                    role: "E-commerce Owner",
                    stars: 5,
                  },
                  {
                    quote: "I went from spending 3 hours on emails to 30 minutes. My clients are impressed.",
                    author: "Marcus Johnson",
                    role: "Marketing Consultant",
                    stars: 5,
                  },
                  {
                    quote: "Finally, AI that actually works for small businesses. Simple, practical, and free!",
                    author: "Emily Rodriguez",
                    role: "Freelance Designer",
                    stars: 5,
                  },
                ].map((testimonial, i) => (
                  <blockquote
                    key={i}
                    className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-colors"
                  >
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: testimonial.stars }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                      ))}
                    </div>
                    <p className="text-slate-100 mb-4 italic">"{testimonial.quote}"</p>
                    <footer className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500" aria-hidden="true" />
                      <div>
                        <cite className="font-semibold text-white not-italic">{testimonial.author}</cite>
                        <p className="text-sm text-slate-400">{testimonial.role}</p>
                      </div>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </section>

          {/* ══════════════ FINAL CTA ══════════════ */}
          <section className="py-20 bg-gradient-to-br from-cyan-500 to-blue-600" aria-label="Final call to action">
            <div className="container text-center">
              <div className="max-w-3xl mx-auto space-y-8">
                <h2 className="text-3xl md:text-5xl font-bold text-white font-[Poppins]">
                  Ready to Save 10+ Hours Per Week?
                </h2>
                <p className="text-lg md:text-xl text-cyan-50">
                  Get your free guide now and start automating your business today. No credit card required.
                </p>

                <div className="max-w-md mx-auto">
                  {/* Email Capture Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 h-12 px-4 text-base border-2 border-slate-300 focus:border-cyan-500 focus:ring-cyan-500"
                        required
                        disabled={isSubmitting}
                        aria-label="Email address"
                      />
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-12 px-8 text-base font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {isSubmitting ? "Sending..." : "Get Free Guide"}
                      </Button>
                    </div>
                  </form>
                </div>

                <p className="text-sm text-cyan-100">
                  Instant access · No spam · Unsubscribe anytime
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* ══════════════ FOOTER ══════════════ */}
        <footer className="py-8 bg-slate-900 text-slate-400 text-center" role="contentinfo">
          <div className="container space-y-2">
            <p className="text-sm font-semibold text-slate-300">TechFlow Essentials</p>
            <p className="text-xs">
              © {new Date().getFullYear()} TechFlow Essentials. All rights reserved.
            </p>
            <nav aria-label="Footer links">
              <a href="https://techflowessentials.com" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                Visit Our Store
              </a>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
