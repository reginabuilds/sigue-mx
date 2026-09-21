'use client';

import { useMemo, useState } from 'react';

type Choice = { text: string; recognition: number; reassessment: number; adaptation: number; justification: string };
type Scenario = { id: number; title: string; context: string; constraint: string; marker: string; options: Choice[] };

const scenarios: Scenario[] = [
  { id: 1, title: 'El punto de encuentro quedó inaccesible', context: 'Acaba de ocurrir un sismo en CDMX. Tu hijo está en la escuela. No puedes comunicarte con la persona que normalmente lo recoge.', constraint: 'El acceso principal a la escuela está cerrado. No sabes todavía si la escuela ya inició su protocolo de entrega.', marker: 'ACCESO CERRADO', options: [
    { text: 'Confirmar primero con la escuela y seguir su protocolo.', recognition: 2, reassessment: 2, adaptation: 2, justification: 'Reconoce el supuesto roto y busca información antes de actuar.' },
    { text: 'Ir inmediatamente a la escuela aunque el acceso esté cerrado.', recognition: 2, reassessment: 0, adaptation: 0, justification: 'Reconoce el cambio, pero actúa sin resolver la incertidumbre.' },
    { text: 'Enviar a otro familiar al punto alterno sin confirmar nada.', recognition: 0, reassessment: 0, adaptation: 0, justification: 'Mantiene el plan sin comprobar si sus condiciones siguen vigentes.' }
  ] },
  { id: 2, title: 'La persona responsable no está disponible', context: 'La persona que debía ayudar a tu abuela no responde. Tu familia está separada y la red celular funciona de manera intermitente.', constraint: 'No sabes si tu abuela necesita ayuda en este momento.', marker: 'SEÑAL INTERMITENTE', options: [
    { text: 'Verificar primero su estado mediante el canal alterno antes de enviar a alguien.', recognition: 2, reassessment: 2, adaptation: 2, justification: 'Distingue urgencia de certeza y busca el dato que falta.' },
    { text: 'Mandar a la primera persona disponible sin verificar.', recognition: 2, reassessment: 0, adaptation: 1, justification: 'Intenta adaptar el plan, pero no comprueba la condición que lo activa.' },
    { text: 'Asumir que está bien y continuar con el plan original.', recognition: 0, reassessment: 0, adaptation: 0, justification: 'No reconoce que el supuesto central cambió.' }
  ] },
  { id: 3, title: 'El plan B también falla', context: 'El punto alterno está cerrado y la persona que debía llevar a tu hijo tampoco puede hacerlo.', constraint: 'Dos supuestos del plan original ya no son válidos. La información disponible sigue siendo incompleta.', marker: 'PLAN B INVALIDADO', options: [
    { text: 'Reconocer que el plan ya no aplica, identificar qué información falta y construir una alternativa segura.', recognition: 2, reassessment: 2, adaptation: 2, justification: 'No memoriza otra ruta: reconoce que el plan dejó de aplicar y construye una respuesta nueva.' },
    { text: 'Seguir intentando ejecutar el plan B aunque sus condiciones ya no existan.', recognition: 2, reassessment: 0, adaptation: 0, justification: 'Detecta el cambio pero no actualiza realmente la decisión.' },
    { text: 'Elegir cualquier opción rápidamente para terminar.', recognition: 0, reassessment: 0, adaptation: 0, justification: 'Prioriza velocidad sobre comprensión de las restricciones.' }
  ] }
];

function nextScenarioId(currentId: number, choice: Choice, visited: number[]) {
  const remaining = scenarios.filter((scenario) => !visited.includes(scenario.id) && scenario.id !== currentId);
  if (!remaining.length) return null;
  if (choice.adaptation >= 2) return remaining.sort((a, b) => b.id - a.id)[0].id;
  return remaining.sort((a, b) => a.id - b.id)[0].id;
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [currentId, setCurrentId] = useState(1);
  const [visited, setVisited] = useState<number[]>([]);
  const [choice, setChoice] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ scenarioId: number; choice: number; reasoning: string }[]>([]);
  const [reflection, setReflection] = useState('');
  const [done, setDone] = useState(false);
  const scenario = scenarios.find((item) => item.id === currentId) ?? scenarios[0];
  const score = useMemo(() => answers.reduce((total, answer) => {
    const item = scenarios.find((s) => s.id === answer.scenarioId)!;
    const selected = item.options[answer.choice];
    return total + (selected ? Math.round((selected.recognition + selected.reassessment + selected.adaptation) / 6) : 0);
  }, 0), [answers]);

  function speak() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${scenario.title}. ${scenario.context}. La condición que cambió: ${scenario.constraint}`);
    utterance.lang = 'es-MX';
    window.speechSynthesis.speak(utterance);
  }

  function continueScenario() {
    if (choice === null) return;
    const selected = scenario.options[choice];
    const nextAnswers = [...answers, { scenarioId: scenario.id, choice, reasoning: reflection.trim() }];
    const nextVisited = [...visited, scenario.id];
    const nextId = nextScenarioId(scenario.id, selected, nextVisited);
    setAnswers(nextAnswers); setVisited(nextVisited); setChoice(null); setReflection('');
    if (nextId === null) setDone(true); else setCurrentId(nextId);
  }

  function restart() { setStarted(false); setCurrentId(1); setVisited([]); setChoice(null); setAnswers([]); setReflection(''); setDone(false); }

  if (!started) return <main className="shell"><header><div className="brand"><span className="pulse">〽</span><div><b>Rehearsal <em>MX</em></b><small>Familias más preparadas, decisiones más seguras</small></div></div><span className="menu" aria-hidden="true">☰</span></header><section className="hero"><div className="badge">SIMULACIÓN 3D · ACADÉMICA</div><h1>No practicamos el terremoto.<br /><span>Practicamos cuando el plan falla.</span></h1><p>Una experiencia corta para probar si una familia puede reconocer una condición nueva, detenerse, reevaluar y adaptar su decisión.</p><div className="scene3d" aria-label="Escena 3D simulada de una calle y una escuela"><div className="building b1" /><div className="building b2" /><div className="road" /><div className="marker">ESCUELA</div></div><div className="notice"><b>⚠ Esto es una simulación.</b> No es una recomendación de emergencia real ni sustituye a Protección Civil o a los protocolos de tu escuela.</div><button className="primary" onClick={() => setStarted(true)}>Empezar ensayo · 8 min →</button><div className="stack"><span>3D / simulación</span><span>Adaptive logic (simulada)</span><span>Voice</span></div></section></main>;

  if (done) return <main className="shell"><header><div className="brand"><span className="pulse">〽</span><div><b>Rehearsal <em>MX</em></b><small>Reflexión de cierre</small></div></div></header><section className="result"><div className="badge">ENSAYO COMPLETADO</div><div className="score">{score}/3</div><h1>La pregunta no era “¿te sabes el plan?”</h1><p>Era si puedes reconocer cuándo el plan deja de ser válido y construir una respuesta razonable sin ignorar las restricciones institucionales.</p><div className="card"><h3>Qué se observó</h3><p>Este prototipo observa una secuencia simulada: <b>reconocimiento → reevaluación → adaptación → justificación</b>. La ruta de escenarios cambia según tus decisiones. El resultado es simulado y <b>no predice seguridad real</b>.</p></div><div className="card"><h3>Prueba de transferencia</h3><p>Haz una acción real y segura: confirma con tu familia quién tiene una responsabilidad concreta y cuál sería el canal alterno para coordinarse. No necesitas compartir esos datos con Rehearsal MX.</p></div><button className="primary" onClick={restart}>Repetir otro intento</button></section></main>;

  return <main className="shell"><header><div className="brand"><span className="pulse">〽</span><div><b>Rehearsal <em>MX</em></b><small>Ensayo {visited.length + 1} de {scenarios.length}</small></div></div><span className="menu" aria-hidden="true">☰</span></header><div className="progress" aria-label={`Progreso ${visited.length + 1} de ${scenarios.length}`}><i style={{ width: `${((visited.length + 1) / scenarios.length) * 100}%` }} /></div><section className="scenario"><div className="topline"><span className="badge red">SIMULACIÓN</span><button className="voice" onClick={speak}>🔊 Escuchar</button></div><div className="adaptive-label">IA / lógica adaptativa: <b>SIMULADA</b> · Esta ruta cambia según tu decisión anterior.</div><h2>{scenario.title}</h2><p className="context">{scenario.context}</p><div className="constraint"><b>La condición que cambió:</b> {scenario.constraint}</div><div className="scene3d mini" aria-hidden="true"><div className="building b1" /><div className="building b2" /><div className="road" /><div className="marker">{scenario.marker}</div></div><div className="prompt"><b>Pausa y reevalúa.</b><span>¿Qué información falta? ¿Qué parte de tu plan ya no aplica?</span></div><h3>¿Qué harías primero?</h3>{scenario.options.map((option, index) => <button key={option.text} className={`option ${choice === index ? 'selected' : ''}`} onClick={() => setChoice(index)}><span className="radio">{choice === index ? '●' : '○'}</span>{option.text}</button>)}<textarea maxLength={300} value={reflection} onChange={(event) => setReflection(event.target.value)} placeholder="Explica brevemente por qué… (opcional)" aria-label="Explica brevemente por qué" /><div className="char-count">{reflection.length}/300</div><button className="primary" disabled={choice === null} onClick={continueScenario}>Continuar →</button><div className="sim-note">La simulación no sustituye protocolos reales. No guarda respuestas ni datos personales.</div></section></main>;
}
