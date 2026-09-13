import type { GuidanceResponse, RouteOption, ScreeningForm } from "./types";

function typeContext(type: string): string {
  const map: Record<string, string> = {
    "Glucosa / diabetes":
      "En glucosa, un screening puede señalar que conviene una evaluación confirmatoria. No confirma por sí solo diabetes ni indica un tratamiento.",
    "Presión arterial":
      "Una medición de presión en screening puede indicar que conviene repetir o confirmar con un profesional. No es un diagnóstico de hipertensión.",
    "Salud visual":
      "Un screening visual puede sugerir que conviene una revisión oftalmológica. No prescribe lentes ni confirma una enfermedad ocular.",
    "Cáncer cervicouterino (Papanicolaou / HPV)":
      "Un resultado de Papanicolaou o HPV es una señal de seguimiento, no un diagnóstico de cáncer. La interpretación clínica corresponde a un profesional de salud.",
  };
  return (
    map[type] ??
    "Un screening detecta señales que merecen seguimiento. No sustituye una evaluación clínica completa."
  );
}

function prioritizeRoutes(form: ScreeningForm): RouteOption[] {
  const municipality = form.municipality.trim() || "tu municipio";
  const lowCost =
    form.cost.includes("bajo") ||
    form.cost.includes("gratuitas") ||
    form.insurance.includes("Sin seguro");
  const limitedTransport =
    form.transport.includes("limitado") || form.transport.includes("cerca");
  const publicCoverage =
    form.insurance.includes("IMSS") || form.insurance.includes("pública");

  const pool: RouteOption[] = [
    {
      id: "publica",
      name: "Ruta pública / institucional (simulada)",
      note: `En ${municipality}, pregunta en el centro de salud o unidad que corresponda a tu cobertura pública por la evaluación confirmatoria del screening de ${form.type.toLowerCase()}. Verifica requisitos, horarios y documentos directamente con ellos.`,
      why: publicCoverage
        ? "Priorizada porque indicaste cobertura pública."
        : "Útil si puedes gestionar acceso institucional aunque no tengas cobertura clara.",
      priority: publicCoverage ? 1 : lowCost ? 2 : 3,
      simulated: true,
      accessTags: ["cobertura pública", "sin precios inventados"],
    },
    {
      id: "cercana",
      name: "Ruta cercana / menos desplazamiento (simulada)",
      note: `Busca primero un servicio cercano en ${municipality} (unidad local, módulo comunitario o farmacia con orientación) que pueda decirte cómo confirmar el resultado. No asumas cupo ni precios: pregunta antes de ir.`,
      why: limitedTransport
        ? "Priorizada porque tu transporte o distancia es una restricción."
        : "Reduce fricción si el tiempo o el traslado son difíciles.",
      priority: limitedTransport ? 1 : 2,
      simulated: true,
      accessTags: ["cercanía", "transporte"],
    },
    {
      id: "bajo-costo",
      name: "Ruta de bajo costo / comunitaria (simulada)",
      note: `Explora opciones de bajo costo o comunitarias en ${municipality} que orienten sobre el siguiente paso del screening. Esta demo no inventa precios ni disponibilidad: confirma costo y requisitos al contactar.`,
      why: lowCost
        ? "Priorizada porque el costo es una restricción importante para ti."
        : "Alternativa si la vía principal resulta cara o inaccesible.",
      priority: lowCost ? 1 : publicCoverage ? 3 : 2,
      simulated: true,
      accessTags: ["bajo costo", "sin precios inventados"],
    },
    {
      id: "origen",
      name: "Volver al lugar del screening (simulada)",
      note: `Contacta el lugar donde te hicieron el screening (${form.type}) y pregunta: qué significa exactamente “${form.result}”, qué evaluación sigue y qué documentos debes llevar. Es una vía concreta y de baja incertidumbre.`,
      why: "El punto de origen suele aclarar el significado del resultado sin inventar un diagnóstico.",
      priority: 2,
      simulated: true,
      accessTags: ["aclaración", "agencia"],
    },
  ];

  if (form.time.includes("fines") || form.time.includes("tardes")) {
    pool.push({
      id: "horarios",
      name: "Ruta con horarios flexibles (simulada)",
      note: `Dado tu horario (${form.time}), pregunta por servicios con atención fuera de horario laboral o fines de semana en ${municipality}. Confirma disponibilidad real al llamar; esta demo no verifica cupos.`,
      why: "Priorizada por tu disponibilidad de tiempo.",
      priority: 1,
      simulated: true,
      accessTags: ["horarios", "disponibilidad por confirmar"],
    });
  }

  return pool
    .sort((a, b) => a.priority - b.priority || a.name.localeCompare(b.name))
    .slice(0, 3)
    .map((route, index) => ({ ...route, priority: index + 1 }));
}

export function buildDeterministicGuidance(
  form: ScreeningForm
): GuidanceResponse {
  const dateLabel = form.date
    ? `del ${form.date}`
    : "con la fecha que te entregaron";
  const routes = prioritizeRoutes(form);

  return {
    title: "Tu resultado necesita un siguiente paso, no una conclusión.",
    framework: "Detección → Interpretación → Acción",
    interpretation: `Recibiste un screening de ${form.type} con resultado o categoría “${form.result}” ${dateLabel}. ${typeContext(form.type)} En SIGUE MX partimos de esta idea: detectar no es automáticamente valor en salud; el valor aparece cuando entiendes el resultado y das un siguiente paso realista.`,
    screeningVsDiagnosis:
      "Screening no es diagnóstico. El screening es una detección inicial. Un diagnóstico lo establece un profesional de salud con evaluación clínica (y, si aplica, pruebas confirmatorias). Esta demo no diagnostica ni prescribe tratamiento.",
    uncertainty:
      "Hay incertidumbre normal: un solo resultado no cuenta tu historia completa; las condiciones cambian; y esta herramienta no conoce tu estado médico. No afirmamos certeza clínica. Usa esta orientación para preparar preguntas y decisiones, no como veredicto médico.",
    nextStep: `Paso inmediato: confirma con el lugar del screening o con un servicio de ${form.municipality.trim() || "tu zona"} qué significa “${form.result}” y cuál es la vía de evaluación confirmatoria adecuada para tu cobertura (${form.insurance || "por definir"}). Lleva la fecha, el tipo de prueba y el resultado tal como te lo entregaron. Tú decides cuándo y por cuál ruta empezar.`,
    checklist: [
      "Guarda o fotografía el resultado y la fecha del screening.",
      "Anota el tipo de prueba y el lugar donde te la hicieron.",
      "Prepara tu cobertura o forma de pago (sin asumir precios).",
      "Elige una ruta según tus límites de tiempo, transporte y costo.",
      "Llama o pregunta antes de ir: requisitos, horario y documentos.",
      "Si no puedes acceder, registra la barrera y prueba otra ruta.",
    ],
    questions: [
      "¿Este resultado es un screening o un diagnóstico?",
      "¿Qué prueba o evaluación confirma o descarta lo que sugiere el screening?",
      "¿En cuánto tiempo conviene hacer el siguiente paso?",
      "¿Qué documentos o resultados debo llevar?",
      "¿Hay una opción compatible con mi cobertura, horario y transporte?",
    ],
    routes,
    disclaimer:
      "Demo académica de SIGUE MX. No diagnostica, no prescribe, no verifica disponibilidad real ni inventa precios. Los recursos son simulados y deben confirmarse fuera de esta demo.",
  };
}

/** Optional LLM path: if OPENAI_API_KEY exists, callers may try it; always fall back here. */
export async function maybeEnrichWithLlm(
  form: ScreeningForm,
  base: GuidanceResponse
): Promise<GuidanceResponse> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return base;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "Eres un asistente de navegación de salud en México para una demo académica. Nunca diagnostiques, nunca prescribas, nunca inventes disponibilidad ni precios, nunca digas que conoces el estado médico del usuario. Responde SOLO JSON con campos interpretation, nextStep (español claro, tono empático y prudente).",
          },
          {
            role: "user",
            content: JSON.stringify(form),
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) return base;
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) return base;
    const parsed = JSON.parse(text) as {
      interpretation?: string;
      nextStep?: string;
    };

    return {
      ...base,
      interpretation: parsed.interpretation?.trim() || base.interpretation,
      nextStep: parsed.nextStep?.trim() || base.nextStep,
    };
  } catch {
    return base;
  }
}
