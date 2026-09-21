# DECISIONS.md — Rehearsal MX

## Week 6 session close

- Keep the declared vacuum as **FAMILY REHEARSAL**.
- Do not make VR the product claim. The MVP uses CSS 3D and browser voice, while adaptive logic is explicitly labeled simulated.
- The core behavior under test remains **recognize → reassess → adapt → justify**.
- The rehearsal complements Mexico's existing school/Protección Civil protocols; it never overrides them.
- The prototype collects no personal data and has no login, database, live earthquake feed, or emergency service.
- The adaptive engine changes the order of remaining scenarios based on the user's prior adaptive decision quality.
- The final transfer action is intentionally small: discuss one concrete family responsibility and one alternate coordination channel outside the simulation.
- The score is framed as simulated performance, not a prediction of real safety or preparedness.

### Testing status
The mechanical and persona test plans are documented, but full browser/dependency execution must still be performed after installing npm dependencies and deploying the project. Do not present an unrun live test as completed.

### First move after opening
Run `npm install`, then `npm run build`, then deploy. After deployment, run the mechanical and persona tests and record the first real bug before the second deploy.
