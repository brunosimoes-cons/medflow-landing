"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// ─── UTM Helpers ───
function getUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utms: Record<string, string> = {};
  for (const key of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ]) {
    const val = params.get(key);
    if (val) utms[key] = val;
  }
  return utms;
}

function buildWhatsAppLink(): string {
  const base = "https://wa.me/5531997750330";
  const msg = "Oi! Quero saber mais sobre o MedFlow";
  const utms = getUtmParams();
  const utmStr = Object.entries(utms)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
  const text = utmStr ? `${msg} [${utmStr}]` : msg;
  return `${base}?text=${encodeURIComponent(text)}`;
}

// ─── Tracking ───
function trackEvent(event: string, data?: Record<string, string>) {
  if (typeof window !== "undefined" && "dataLayer" in window) {
    (window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer.push({
      event,
      ...data,
    });
  }
}

// ─── Intersection Observer for sections ───
function useInView(threshold = 0.3) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// ─── Scroll Depth Tracker ───
function ScrollTracker() {
  useEffect(() => {
    const thresholds = [25, 50, 75, 100];
    const fired = new Set<number>();

    function handleScroll() {
      const scrollPct = Math.round(
        ((window.scrollY + window.innerHeight) /
          document.documentElement.scrollHeight) *
          100
      );
      for (const t of thresholds) {
        if (scrollPct >= t && !fired.has(t)) {
          fired.add(t);
          trackEvent("scroll_depth", { depth: `${t}%` });
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
}

// ─── Components ───

function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-panel py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="MedFlow"
            width={48}
            height={48}
            className="h-10 w-10"
            priority
          />
          <span className="text-xl font-bold gradient-text">MedFlow</span>
        </div>
        <a
          href={buildWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("cta_click", { location: "nav" })}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-background-dark transition-all hover:bg-primary-light hover:shadow-[0_0_20px_rgba(61,217,208,0.4)]"
        >
          Falar com a gente
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  const waLink = buildWhatsAppLink();

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[#0066ff]/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-20 text-center">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary animate-fade-up">
            Automação com IA para clínicas
          </p>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-fade-up [animation-delay:100ms] opacity-0">
            Sua clínica{" "}
            <span className="gradient-text">perde leads</span> todo dia.
            <br />A gente resolve.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted sm:text-xl animate-fade-up [animation-delay:200ms] opacity-0">
            Atendimento inteligente no WhatsApp, qualificação automática, agendamento
            sem fricção e nurturing 24/7. Tudo rodando enquanto você cuida dos pacientes.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-fade-up [animation-delay:300ms] opacity-0">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent("cta_click", { location: "hero" });
                trackEvent("whatsapp_click", { location: "hero" });
              }}
              className="group flex items-center gap-3 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-background-dark transition-all hover:bg-primary-light hover:shadow-[0_0_30px_rgba(61,217,208,0.4)] animate-pulse-glow"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Quero automatizar minha clínica
              <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const { ref, inView } = useInView(0.5);

  const stats = [
    { value: "2.400+", label: "mensagens processadas" },
    { value: "200+", label: "leads qualificados" },
    { value: "340+", label: "agendamentos criados" },
    { value: "24/7", label: "operando sem parar" },
  ];

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      className="relative border-y border-border/50"
    >
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center transition-all duration-500 ${
                inView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <p className="text-3xl font-bold text-primary sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const { ref, inView } = useInView();

  const problems = [
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Resposta lenta",
      description:
        "Lead manda mensagem às 22h. Sua recepção responde às 9h do dia seguinte. Até lá, o lead já agendou com o concorrente.",
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
      title: "Leads desperdiçados",
      description:
        "Você paga caro por cada lead do Meta Ads. Sem follow-up automático, 70% esfria e nunca mais responde.",
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
      ),
      title: "Zero visibilidade",
      description:
        "Quanto cada campanha gera de receita? Qual recepcionista converte melhor? Sem dados, é achismo.",
    },
  ];

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      id="problema"
      className="py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            O problema
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Cada minuto sem resposta é um paciente perdido
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {problems.map((p, i) => (
            <div
              key={p.title}
              className={`glass-panel rounded-2xl p-8 transition-all duration-500 hover:border-primary/30 ${
                inView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                {p.icon}
              </div>
              <h3 className="text-xl font-semibold">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const { ref, inView } = useInView();

  const steps = [
    {
      step: "01",
      title: "Captação",
      description:
        "Lead chega pelo Meta Ads, Instagram ou indicação. MedFlow responde em segundos no WhatsApp.",
      color: "from-[#3dd9d0] to-[#00d9ff]",
    },
    {
      step: "02",
      title: "Qualificação",
      description:
        "A IA faz perguntas inteligentes, entende a necessidade e atribui um score de prioridade.",
      color: "from-[#00d9ff] to-[#0066ff]",
    },
    {
      step: "03",
      title: "Agendamento",
      description:
        "Lead qualificado é guiado direto para agendar. Sem link, sem formulário. Conversacional.",
      color: "from-[#0066ff] to-[#6366f1]",
    },
    {
      step: "04",
      title: "Nurturing",
      description:
        "Quem não agendou recebe follow-ups automáticos. Quem agendou recebe lembretes anti no-show.",
      color: "from-[#6366f1] to-[#a855f7]",
    },
  ];

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      id="como-funciona"
      className="py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Como funciona
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Do clique ao agendamento, sem humano no meio
          </h2>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.step}
              className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-background-dark/50 p-8 transition-all duration-500 hover:border-primary/30 hover:-translate-y-1 ${
                inView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Gradient top border */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.color}`}
              />
              <span
                className={`text-5xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent opacity-20`}
              >
                {s.step}
              </span>
              <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {s.description}
              </p>
            </div>
          ))}
        </div>

        {/* Connection line for desktop */}
        <div className="mt-8 hidden items-center justify-center gap-2 lg:flex">
          <div className="h-0.5 w-16 bg-gradient-to-r from-[#3dd9d0] to-[#00d9ff]" />
          <svg className="h-4 w-4 text-[#00d9ff]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          <div className="h-0.5 w-16 bg-gradient-to-r from-[#00d9ff] to-[#0066ff]" />
          <svg className="h-4 w-4 text-[#0066ff]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          <div className="h-0.5 w-16 bg-gradient-to-r from-[#0066ff] to-[#6366f1]" />
          <svg className="h-4 w-4 text-[#6366f1]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          <div className="h-0.5 w-16 bg-gradient-to-r from-[#6366f1] to-[#a855f7]" />
        </div>
      </div>
    </section>
  );
}

function Results() {
  const { ref, inView } = useInView();

  const metrics = [
    {
      value: "< 30s",
      label: "Tempo médio de primeira resposta",
      detail: "vs 4+ horas com atendimento humano",
    },
    {
      value: "85%",
      label: "Taxa de qualificação automática",
      detail: "Leads classificados sem intervenção humana",
    },
    {
      value: "-40%",
      label: "Redução de no-show",
      detail: "Com lembretes automatizados e confirmação",
    },
    {
      value: "3x",
      label: "Mais agendamentos por campanha",
      detail: "Mesmo orçamento, mais conversões",
    },
  ];

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      id="resultados"
      className="relative py-24"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Resultados reais
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Números que clínicas estão atingindo
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Dados de clínicas reais usando MedFlow em produção.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className={`gradient-border rounded-2xl bg-background-dark/80 p-8 transition-all duration-500 ${
                inView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <p className="text-4xl font-bold gradient-text sm:text-5xl">
                {m.value}
              </p>
              <p className="mt-3 text-lg font-semibold">{m.label}</p>
              <p className="mt-1 text-sm text-muted">{m.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ForWho() {
  const { ref, inView } = useInView();

  const checks = [
    "Investe em Meta Ads ou Google Ads para captação",
    "Tem recepção sobrecarregada com WhatsApp",
    "Sofre com no-show e cancelamentos de última hora",
    "Não sabe qual campanha gera mais receita",
    "Quer crescer sem aumentar equipe de atendimento",
    "Perde leads fora do horário comercial",
  ];

  const funnel = [
    { label: "Lead chega", icon: "📱", width: "w-full" },
    { label: "IA qualifica", icon: "🤖", width: "w-5/6" },
    { label: "Agendamento", icon: "📅", width: "w-4/6" },
    { label: "Paciente", icon: "✅", width: "w-3/6" },
  ];

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      id="para-quem"
      className="py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Para quem é
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            MedFlow é pra clínica que quer escalar
          </h2>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          {/* Checklist */}
          <div
            className={`transition-all duration-500 ${
              inView ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
            }`}
          >
            <h3 className="mb-6 text-xl font-semibold">
              Se sua clínica se identifica, MedFlow é pra você:
            </h3>
            <ul className="space-y-4">
              {checks.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      className="h-4 w-4 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </span>
                  <span className="text-muted">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Funnel */}
          <div
            className={`transition-all duration-500 ${
              inView ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
            }`}
          >
            <h3 className="mb-6 text-xl font-semibold">
              Funil automatizado de ponta a ponta:
            </h3>
            <div className="flex flex-col items-center gap-3">
              {funnel.map((f, i) => (
                <div
                  key={f.label}
                  className={`${f.width} glass-panel flex items-center justify-center gap-3 rounded-xl py-4 text-center transition-all duration-300`}
                  style={{
                    background: `rgba(61, 217, 208, ${0.05 + i * 0.05})`,
                    borderColor: `rgba(61, 217, 208, ${0.1 + i * 0.1})`,
                  }}
                >
                  <span className="text-2xl">{f.icon}</span>
                  <span className="font-semibold">{f.label}</span>
                </div>
              ))}
              {/* Arrows between */}
            </div>
            <p className="mt-6 text-center text-sm text-muted">
              Todo o funil roda automaticamente, 24 horas por dia.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTAFinal() {
  const waLink = buildWhatsAppLink();

  return (
    <section id="contato" className="relative py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
          Pronto pra{" "}
          <span className="gradient-text">parar de perder pacientes</span>?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
          Em 15 minutos a gente entende sua operação e mostra como o MedFlow
          pode transformar seus resultados. Sem compromisso.
        </p>

        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackEvent("cta_click", { location: "final" });
            trackEvent("whatsapp_click", { location: "final" });
          }}
          className="group mt-10 inline-flex items-center gap-3 rounded-xl bg-primary px-10 py-5 text-lg font-bold text-background-dark transition-all hover:bg-primary-light hover:shadow-[0_0_40px_rgba(61,217,208,0.5)] animate-pulse-glow"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Falar no WhatsApp agora
          <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
        </a>

        <p className="mt-4 text-sm text-muted/60">
          Sem formulário. Sem chatbot genérico. Conversa direta.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/30 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="MedFlow"
              width={32}
              height={32}
              className="h-8 w-8 opacity-60"
            />
            <span className="text-lg font-semibold text-muted/60">MedFlow</span>
          </div>
          <p className="text-sm text-muted/60">
            &copy; {new Date().getFullYear()} MedFlow. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  const waLink = buildWhatsAppLink();

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackEvent("cta_click", { location: "floating" });
        trackEvent("whatsapp_click", { location: "floating" });
      }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-all hover:scale-110 hover:shadow-[0_0_20px_rgba(37,211,102,0.5)] animate-float"
      aria-label="Falar no WhatsApp"
    >
      <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  );
}

// ─── Main Page ───
export default function Home() {
  return (
    <>
      <ScrollTracker />
      <Nav />
      <main>
        <Hero />
        <StatsBar />
        <ProblemSection />
        <HowItWorks />
        <Results />
        <ForWho />
        <CTAFinal />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
