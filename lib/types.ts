export type ScreeningForm = {
  type: string;
  result: string;
  date: string;
  municipality: string;
  insurance: string;
  time: string;
  transport: string;
  cost: string;
};

export type RouteOption = {
  id: string;
  name: string;
  note: string;
  why: string;
  priority: number;
  simulated: true;
  accessTags: string[];
};

export type GuidanceResponse = {
  title: string;
  interpretation: string;
  screeningVsDiagnosis: string;
  uncertainty: string;
  nextStep: string;
  checklist: string[];
  questions: string[];
  routes: RouteOption[];
  framework: string;
  disclaimer: string;
};

export type FollowUpState =
  | "Lo hice"
  | "Tengo cita"
  | "No pude acceder"
  | "Necesito otra ruta"
  | "";

export type Barrier =
  | "Costo"
  | "Tiempo / horarios"
  | "Transporte / distancia"
  | "Requisitos o documentos"
  | "No había cupo / demora"
  | "Otro";

export const SCREENING_TYPES = [
  "Glucosa / diabetes",
  "Presión arterial",
  "Salud visual",
  "Cáncer cervicouterino (Papanicolaou / HPV)",
  "Otro",
] as const;

export const INSURANCE_OPTIONS = [
  "IMSS / ISSSTE / pública",
  "Seguro privado",
  "Sin seguro / particular",
] as const;

export const TIME_OPTIONS = [
  "Flexible",
  "Solo mañanas",
  "Solo tardes / noches",
  "Solo fines de semana",
] as const;

export const TRANSPORT_OPTIONS = [
  "Puedo desplazarme con facilidad",
  "Transporte limitado / lejos",
  "Prefiero cerca de casa o transporte público",
] as const;

export const COST_OPTIONS = [
  "Puedo cubrir un costo moderado",
  "Necesito opción de bajo costo",
  "Solo opciones gratuitas o casi gratuitas",
] as const;

export const FOLLOW_UP_STATES: Exclude<FollowUpState, "">[] = [
  "Lo hice",
  "Tengo cita",
  "No pude acceder",
  "Necesito otra ruta",
];

export const BARRIERS: Barrier[] = [
  "Costo",
  "Tiempo / horarios",
  "Transporte / distancia",
  "Requisitos o documentos",
  "No había cupo / demora",
  "Otro",
];

export const emptyForm: ScreeningForm = {
  type: "",
  result: "",
  date: "",
  municipality: "",
  insurance: "",
  time: "",
  transport: "",
  cost: "",
};
