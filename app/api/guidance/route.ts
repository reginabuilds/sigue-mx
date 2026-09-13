import { z } from "zod";
import {
  buildDeterministicGuidance,
  maybeEnrichWithLlm,
} from "@/lib/guidance";

const schema = z.object({
  type: z.string().min(1, "Tipo requerido"),
  result: z.string().min(1, "Resultado requerido").max(200),
  date: z.string().optional().default(""),
  municipality: z.string().min(1, "Municipio requerido").max(120),
  insurance: z.string().min(1, "Cobertura requerida"),
  time: z.string().min(1, "Disponibilidad requerida"),
  transport: z.string().min(1, "Transporte requerido"),
  cost: z.string().min(1, "Costo requerido"),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        error: "Datos incompletos",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const base = buildDeterministicGuidance(parsed.data);
  const guidance = await maybeEnrichWithLlm(parsed.data, base);

  return Response.json(guidance);
}
