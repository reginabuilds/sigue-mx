"use client";

import { useMemo, useState } from "react";
import {
  BARRIERS,
  COST_OPTIONS,
  emptyForm,
  FOLLOW_UP_STATES,
  INSURANCE_OPTIONS,
  SCREENING_TYPES,
  TIME_OPTIONS,
  TRANSPORT_OPTIONS,
  type Barrier,
  type FollowUpState,
  type GuidanceResponse,
  type ScreeningForm,
} from "@/lib/types";

type Step = "landing" | "form" | "result";

const FORM_STEPS = [
  { id: "screening", title: "Tu screening", blurb: "Qué prueba y qué te dijeron." },
  { id: "context", title: "Tu contexto", blurb: "Dónde y con qué cobertura." },
  { id: "access", title: "Tus límites", blurb: "Tiempo, transporte y costo." },
] as const;

function FieldLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
      {children}
    </label>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Selecciona",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <select
        id={id}
        className="mt-1.5 w-full rounded-2xl border border-line bg-white px-4 py-3 text-ink shadow-sm transition focus:border-brand"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        type={type}
        className="mt-1.5 w-full rounded-2xl border border-line bg-white px-4 py-3 text-ink shadow-sm transition focus:border-brand"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-2xl bg-brand px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function GhostButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-2xl border border-line bg-white px-5 py-3.5 text-sm font-semibold text-ink-soft transition hover:border-brand hover:text-brand"
    >
      {children}
    </button>
  );
}

function DisclaimerBar() {
  return (
    <div
      role="note"
      className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-md"
    >
      <p className="mx-auto max-w-3xl px-5 py-2.5 text-center text-[11px] leading-relaxed text-mute sm:text-xs">
        Demo académica · No diagnostica · No prescribe · No verifica disponibilidad
        real · Recursos simulados
      </p>
    </div>
  );
}

function ProgressDots({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2" aria-label="Progreso del formulario">
      {FORM_STEPS.map((s, i) => (
        <span
          key={s.id}
          className={`h-1.5 flex-1 rounded-full transition ${
            i <= current ? "bg-brand" : "bg-line"
          }`}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [step, setStep] = useState<Step>("landing");
  const [formStep, setFormStep] = useState(0);
  const [form, setForm] = useState<ScreeningForm>(emptyForm);
  const [guidance, setGuidance] = useState<GuidanceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [follow, setFollow] = useState<FollowUpState>("");
  const [barrier, setBarrier] = useState<Barrier | "">("");
  const [barrierNote, setBarrierNote] = useState("");
  const [altRouteShown, setAltRouteShown] = useState(false);

  const set = (key: keyof ScreeningForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const canNextScreening = Boolean(form.type && form.result.trim());
  const canNextContext = Boolean(form.municipality.trim() && form.insurance);
  const canSubmit = Boolean(
    canNextScreening &&
      canNextContext &&
      form.time &&
      form.transport &&
      form.cost
  );

  const needsBarrier =
    follow === "No pude acceder" || follow === "Necesito otra ruta";

  const alternateRoutes = useMemo(() => {
    if (!guidance) return [];
    return [...guidance.routes].reverse();
  }, [guidance]);

  async function submit() {
    setLoading(true);
    setError("");
    setFollow("");
    setBarrier("");
    setBarrierNote("");
    setAltRouteShown(false);
    try {
      const res = await fetch("/api/guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No se pudo generar la orientación.");
        return;
      }
      setGuidance(data);
      setStep("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  function resetAll() {
    setStep("landing");
    setFormStep(0);
    setForm(emptyForm);
    setGuidance(null);
    setFollow("");
    setBarrier("");
    setBarrierNote("");
    setAltRouteShown(false);
    setError("");
  }

  return (
    <>
      <DisclaimerBar />
      <main className="mx-auto min-h-screen max-w-3xl px-5 pb-16 pt-8 sm:pt-12">
        <header className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid h-10 w-10 place-items-center rounded-2xl bg-brand text-sm font-bold text-white shadow-sm"
            >
              S
            </span>
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">
                SIGUE MX
              </p>
              <p className="text-xs text-mute">Detección → Interpretación → Acción</p>
            </div>
          </div>
          <h1 className="font-display mt-6 text-[2rem] leading-[1.15] font-semibold tracking-tight text-ink sm:text-5xl">
            Del resultado al{" "}
            <span className="text-brand">siguiente paso.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
            Un resultado de screening es el comienzo, no el final. Te ayudamos a
            entenderlo —sin diagnosticar— y a elegir una ruta realista según tu
            contexto.
          </p>
        </header>

        {step === "landing" && (
          <section className="overflow-hidden rounded-[1.75rem] border border-line bg-card shadow-sm">
            <div className="border-b border-line bg-brand-soft/60 px-6 py-5 sm:px-8">
              <p className="text-xs font-semibold tracking-wider text-brand uppercase">
                Tesis del producto
              </p>
              <p className="font-display mt-2 text-xl text-ink sm:text-2xl">
                “Detectar con precisión no es automáticamente valor en salud.”
              </p>
            </div>
            <div className="space-y-5 px-6 py-7 sm:px-8">
              <p className="text-ink-soft">
                SIGUE MX acompaña el vacío entre detección y navegación del
                siguiente paso: interpretar el resultado, distinguir screening de
                diagnóstico, y preparar una acción posible.
              </p>
              <ul className="grid gap-3 sm:grid-cols-3">
                {[
                  ["1. Detectar", "Ya tienes un resultado."],
                  ["2. Interpretar", "Qué significa (y qué no)."],
                  ["3. Actuar", "Un plan realista para ti."],
                ].map(([t, d]) => (
                  <li
                    key={t}
                    className="rounded-2xl border border-line bg-paper/80 px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-brand">{t}</p>
                    <p className="mt-1 text-sm text-mute">{d}</p>
                  </li>
                ))}
              </ul>
              <div className="rounded-2xl border border-dashed border-brand/30 bg-brand-soft/40 px-4 py-3 text-sm text-ink-soft">
                No es un chequeador de síntomas. No diagnostica ni prescribe. Usa
                datos simulados para esta demo universitaria.
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <PrimaryButton
                  onClick={() => {
                    setStep("form");
                    setFormStep(0);
                  }}
                >
                  Ya tengo un resultado
                </PrimaryButton>
                <GhostButton
                  onClick={() => {
                    document
                      .getElementById("como-funciona")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Cómo funciona
                </GhostButton>
              </div>
            </div>
          </section>
        )}

        {step === "landing" && (
          <section id="como-funciona" className="mt-8 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Cómo funciona esta demo
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Ingresas un resultado de screening simulado (sin datos personales sensibles).",
                "Recibes una interpretación en español claro, con incertidumbre explícita.",
                "Ves un plan de siguiente paso y preguntas para tu cita.",
                "Eliges entre rutas simuladas según tus límites de acceso.",
              ].map((item, i) => (
                <p
                  key={item}
                  className="rounded-2xl border border-line bg-card px-4 py-4 text-sm leading-relaxed text-ink-soft"
                >
                  <span className="mr-2 font-semibold text-brand">{i + 1}.</span>
                  {item}
                </p>
              ))}
            </div>
          </section>
        )}

        {step === "form" && (
          <section className="rounded-[1.75rem] border border-line bg-card p-6 shadow-sm sm:p-8">
            <ProgressDots current={formStep} />
            <div className="mt-6">
              <p className="text-xs font-semibold tracking-wider text-brand uppercase">
                Paso {formStep + 1} de {FORM_STEPS.length}
              </p>
              <h2 className="font-display mt-1 text-2xl font-semibold text-ink">
                {FORM_STEPS[formStep].title}
              </h2>
              <p className="mt-1 text-sm text-mute">{FORM_STEPS[formStep].blurb}</p>
            </div>

            <div className="mt-6 space-y-4">
              {formStep === 0 && (
                <>
                  <SelectField
                    id="type"
                    label="Tipo de screening"
                    value={form.type}
                    onChange={(v) => set("type", v)}
                    options={SCREENING_TYPES}
                  />
                  <TextField
                    id="result"
                    label="Resultado o categoría (tal como te lo dijeron)"
                    value={form.result}
                    onChange={(v) => set("result", v)}
                    placeholder='Ej. "riesgo elevado", "fuera de rango", "positivo"'
                  />
                  <TextField
                    id="date"
                    label="Fecha del screening"
                    type="date"
                    value={form.date}
                    onChange={(v) => set("date", v)}
                  />
                </>
              )}

              {formStep === 1 && (
                <>
                  <TextField
                    id="municipality"
                    label="Municipio o alcaldía"
                    value={form.municipality}
                    onChange={(v) => set("municipality", v)}
                    placeholder="Ej. Coyoacán, Guadalajara, Monterrey"
                  />
                  <SelectField
                    id="insurance"
                    label="Cobertura / seguro"
                    value={form.insurance}
                    onChange={(v) => set("insurance", v)}
                    options={INSURANCE_OPTIONS}
                  />
                </>
              )}

              {formStep === 2 && (
                <>
                  <SelectField
                    id="time"
                    label="Disponibilidad de tiempo"
                    value={form.time}
                    onChange={(v) => set("time", v)}
                    options={TIME_OPTIONS}
                  />
                  <SelectField
                    id="transport"
                    label="Restricción de transporte"
                    value={form.transport}
                    onChange={(v) => set("transport", v)}
                    options={TRANSPORT_OPTIONS}
                  />
                  <SelectField
                    id="cost"
                    label="Restricción de costo"
                    value={form.cost}
                    onChange={(v) => set("cost", v)}
                    options={COST_OPTIONS}
                  />
                  <p className="rounded-2xl bg-warn-bg px-4 py-3 text-sm text-warn">
                    No pedimos datos clínicos sensibles. Esta orientación no
                    conoce tu estado de salud y no sustituye atención médica.
                  </p>
                </>
              )}
            </div>

            {error && (
              <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </p>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              {formStep > 0 ? (
                <GhostButton onClick={() => setFormStep((s) => s - 1)}>
                  Atrás
                </GhostButton>
              ) : (
                <GhostButton onClick={() => setStep("landing")}>
                  Volver
                </GhostButton>
              )}

              {formStep < FORM_STEPS.length - 1 ? (
                <PrimaryButton
                  disabled={
                    (formStep === 0 && !canNextScreening) ||
                    (formStep === 1 && !canNextContext)
                  }
                  onClick={() => setFormStep((s) => s + 1)}
                >
                  Continuar
                </PrimaryButton>
              ) : (
                <PrimaryButton disabled={loading || !canSubmit} onClick={submit}>
                  {loading ? "Preparando tu plan…" : "Ver mi siguiente paso"}
                </PrimaryButton>
              )}
            </div>
          </section>
        )}

        {step === "result" && guidance && (
          <section className="space-y-5">
            <div className="rounded-[1.75rem] border border-line bg-card p-6 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                  {guidance.framework}
                </span>
                <span className="rounded-full bg-warn-bg px-3 py-1 text-xs font-semibold text-warn">
                  Screening no es diagnóstico
                </span>
              </div>
              <h2 className="font-display mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                {guidance.title}
              </h2>
              <p className="mt-4 leading-relaxed text-ink-soft">
                {guidance.interpretation}
              </p>
              <div className="mt-5 rounded-2xl border border-line bg-paper px-4 py-4 text-sm leading-relaxed text-ink-soft">
                <p className="font-semibold text-ink">Screening vs. diagnóstico</p>
                <p className="mt-1">{guidance.screeningVsDiagnosis}</p>
              </div>
              <div className="mt-3 rounded-2xl border border-dashed border-warn/40 bg-warn-bg px-4 py-4 text-sm leading-relaxed text-warn">
                <p className="font-semibold">Sobre la incertidumbre</p>
                <p className="mt-1">{guidance.uncertainty}</p>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-line bg-card p-6 shadow-sm sm:p-8">
              <h3 className="font-display text-xl font-semibold text-ink">
                Siguiente paso realista
              </h3>
              <p className="mt-3 leading-relaxed text-ink-soft">
                {guidance.nextStep}
              </p>
              <h4 className="mt-6 text-sm font-semibold tracking-wide text-brand uppercase">
                Lista corta para prepararte
              </h4>
              <ol className="mt-3 space-y-2">
                {guidance.checklist.map((item, i) => (
                  <li
                    key={item}
                    className="flex gap-3 rounded-xl border border-line bg-paper/70 px-3 py-2.5 text-sm text-ink-soft"
                  >
                    <span className="font-semibold text-brand">{i + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
              <h4 className="mt-6 text-sm font-semibold tracking-wide text-brand uppercase">
                Preguntas para tu cita
              </h4>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-ink-soft">
                {guidance.questions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.75rem] border border-line bg-card p-6 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <h3 className="font-display text-xl font-semibold text-ink">
                  Rutas sugeridas
                </h3>
                <span className="rounded-full bg-warn-bg px-3 py-1 text-xs font-semibold text-warn">
                  Recursos simulados / demo
                </span>
              </div>
              <p className="mt-2 text-sm text-mute">
                Priorizadas según tus límites de acceso. No son proveedores
                verificados ni disponibilidad en vivo. Confirma siempre fuera de
                esta demo.
              </p>
              <div className="mt-5 space-y-3">
                {guidance.routes.map((route) => (
                  <article
                    key={route.id}
                    className="rounded-2xl border border-line bg-paper/60 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-brand text-xs font-bold text-white">
                        {route.priority}
                      </span>
                      <h4 className="font-semibold text-ink">{route.name}</h4>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                      {route.note}
                    </p>
                    <p className="mt-2 text-xs font-medium text-brand">
                      Por qué aparece aquí: {route.why}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {route.accessTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-line bg-white px-2.5 py-0.5 text-[11px] text-mute"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="rounded-full bg-warn-bg px-2.5 py-0.5 text-[11px] font-semibold text-warn">
                        Simulado
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-line bg-card p-6 shadow-sm sm:p-8">
              <h3 className="font-display text-xl font-semibold text-ink">
                Seguimiento
              </h3>
              <p className="mt-2 text-sm text-mute">
                ¿Qué pasó con tu siguiente paso? Tú decides el ritmo.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {FOLLOW_UP_STATES.map((state) => (
                  <button
                    key={state}
                    type="button"
                    onClick={() => {
                      setFollow(state);
                      if (
                        state === "No pude acceder" ||
                        state === "Necesito otra ruta"
                      ) {
                        setAltRouteShown(false);
                      } else {
                        setBarrier("");
                        setBarrierNote("");
                        setAltRouteShown(false);
                      }
                    }}
                    className={`rounded-2xl border px-4 py-2.5 text-sm font-medium transition ${
                      follow === state
                        ? "border-brand bg-brand text-white"
                        : "border-line bg-white text-ink-soft hover:border-brand"
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>

              {follow === "Lo hice" && (
                <p className="mt-4 rounded-2xl bg-brand-soft px-4 py-3 text-sm text-brand-deep">
                  Bien. Completar el siguiente paso es lo que convierte la
                  detección en valor potencial. Si surge un nuevo resultado,
                  puedes volver a interpretar y planear.
                </p>
              )}

              {follow === "Tengo cita" && (
                <p className="mt-4 rounded-2xl bg-brand-soft px-4 py-3 text-sm text-brand-deep">
                  Buen avance. Lleva tu resultado, la fecha y las preguntas de
                  preparación. Recuerda: el profesional confirma; esta demo no
                  diagnostica.
                </p>
              )}

              {needsBarrier && (
                <div className="mt-5 space-y-4 rounded-2xl border border-line bg-paper p-4">
                  <p className="text-sm font-semibold text-ink">
                    ¿Qué te impidió acceder?
                  </p>
                  <p className="text-sm text-mute">
                    Si la primera ruta falló, hace falta otra. Identificar la
                    barrera ayuda a priorizar una vía distinta —sin inventar
                    cupos ni precios.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {BARRIERS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBarrier(b)}
                        className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                          barrier === b
                            ? "border-accent bg-accent text-white"
                            : "border-line bg-white text-ink-soft"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                  <TextField
                    id="barrierNote"
                    label="Detalle opcional (sin datos personales)"
                    value={barrierNote}
                    onChange={setBarrierNote}
                    placeholder="Ej. pedían un documento que no tengo"
                  />
                  <PrimaryButton
                    disabled={!barrier}
                    onClick={() => setAltRouteShown(true)}
                  >
                    Ver otra ruta posible
                  </PrimaryButton>

                  {altRouteShown && barrier && (
                    <div className="space-y-3 border-t border-line pt-4">
                      <p className="text-sm leading-relaxed text-ink-soft">
                        Registramos la barrera{" "}
                        <strong className="text-ink">{barrier}</strong>
                        {barrierNote.trim()
                          ? ` (${barrierNote.trim()})`
                          : ""}
                        . Como no pudiste acceder por la primera vía, necesitas
                        otra ruta. Aquí reordenamos opciones simuladas para que
                        explores una alternativa —tú confirmas fuera de la demo.
                      </p>
                      {alternateRoutes.map((route, i) => (
                        <article
                          key={`alt-${route.id}`}
                          className="rounded-xl border border-accent/20 bg-white p-3"
                        >
                          <p className="text-sm font-semibold text-ink">
                            Alternativa {i + 1}: {route.name}
                          </p>
                          <p className="mt-1 text-sm text-ink-soft">{route.note}</p>
                          <p className="mt-2 text-[11px] font-semibold text-warn">
                            Recurso simulado · verificar fuera de esta demo
                          </p>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <PrimaryButton onClick={resetAll}>Empezar de nuevo</PrimaryButton>
              <GhostButton
                onClick={() => {
                  setStep("form");
                  setFormStep(0);
                  setGuidance(null);
                }}
              >
                Editar mis datos
              </GhostButton>
            </div>

            <p className="text-xs leading-relaxed text-mute">
              {guidance.disclaimer}
            </p>
          </section>
        )}

        <footer className="mt-12 border-t border-line pt-6 text-xs leading-relaxed text-mute">
          <p>
            <strong className="font-semibold text-ink-soft">SIGUE MX</strong> —
            demo universitaria. No es consejo médico. No diagnostica, no
            prescribe tratamiento, no afirma conocer tu estado de salud y no
            presenta recursos simulados como proveedores verificados.
          </p>
        </footer>
      </main>
    </>
  );
}
