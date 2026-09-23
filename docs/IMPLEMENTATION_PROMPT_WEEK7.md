# Implementation Prompt — Week 7 Operación CDMX

You are the coding agent. Build the Week 7 working slice from `docs/PACKET_WEEK7_OPERACION_CDMX.md`.

## Non-negotiables

- This is an academic demo, not a production mobility system.
- Use only invented/simulated trip telemetry. Label it clearly on-screen.
- Do not identify drivers or passengers.
- Do not connect to SEMOVI or claim live SEMOVI data.
- Do not automatically modify an official route.
- Do not build ride-hailing, passenger navigation, enforcement, or surveillance.
- Simulated ML must be explicitly labeled as simulated.
- The system must distinguish insufficient coverage from stable operation.
- The system must never infer that a route is unsafe merely because it differs from the official representation.

## MVP

Create a browser-first analyst view at `/week7.html` that lets the user:

1. Choose one of three synthetic CDMX route scenarios.
2. Choose a scenario representing persistent mismatch, normal variation, or insufficient data.
3. See an OpenStreetMap/Leaflet map.
4. See the official route as a dashed line.
5. See simulated observed GPS/phone telemetry as solid lines.
6. See four metrics: coverage, mismatch, confidence, and action state.
7. See one of three outputs:
   - `Possible representation mismatch — review recommended.`
   - `Variation consistent with observed baseline — no review signal.`
   - `Not enough data to know.`
8. See an evidence summary explaining why the system produced the output.

## Features in order

### Feature 1 — Route/scenario selector
Acceptance:
- Three predefined routes exist.
- Three scenario states exist.
- Selecting a route changes the selected scenario consistently.
- No free-form personal data input exists.

### Feature 2 — Map layer
Acceptance:
- Leaflet loads without an API key.
- Official route is visually distinct from observed trajectories.
- The map zooms to the selected route.
- Mobile layout remains usable.

### Feature 3 — Coverage logic
Acceptance:
- High and stable scenarios display `SUFFICIENT`.
- Low scenario displays `INSUFFICIENT`.
- Low coverage prevents the system from presenting a mismatch as actionable.

### Feature 4 — Simulated ML signal
Acceptance:
- A deterministic simulated classifier maps scenario data to review/no-review/insufficient states.
- The UI explicitly says `Simulated ML output`.
- Confidence is displayed.
- No real AI/API key is required.

### Feature 5 — Evidence package
Acceptance:
- The analyst sees the evidence supporting the signal.
- The evidence includes coverage, observed trips, and comparison status.
- The system never says that an official route should be changed automatically.

### Feature 6 — Safety/ethics guardrails
Acceptance:
- No driver identity exists anywhere in the UI or data.
- No enforcement language exists.
- No claim of actual safety risk is made from mismatch alone.
- All data is synthetic.

## Test plan

Mechanical:
- load page;
- high-mismatch scenario;
- stable scenario;
- insufficient-data scenario;
- mobile width;
- map render;
- no console errors.

Persona:
- Synthetic user: Mariana, 43, SEMOVI mobility analyst; fast scanner; comfortable with maps/spreadsheets; skeptical of black-box AI.
- Ask her to determine whether a route merits human review.
- Log where she misunderstands coverage, confidence, simulated ML, or review status.
- Fix the worst confusion before final demo.

## Commit plan

1. `docs: add Week 7 packet before code`
2. `feat: add Week 7 operational mismatch map`
3. `docs: add Week 7 implementation prompt`
4. `test: add Week 7 persona and session close evidence`
5. `fix: clarify insufficient coverage and simulated ML states`

After each meaningful session, update `docs/DECISIONS.md`, note tomorrow's first move, commit, and push.

## Definition of done

The working slice is done when a reviewer can open `/week7.html`, select a route, visually compare official and observed trajectories, understand whether the evidence is sufficient, and see a clearly labeled advisory signal without any automatic route update or safety overclaim.
