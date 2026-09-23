# Decisions Log — Week 7

## Session close

- **Decision:** Build an evidence-layer experiment instead of claiming a new mobility algorithm.
  **Why:** Week 6 adversarial testing killed the broad driver-knowledge, machine-readable, and governance-vacuum claims.

- **Decision:** Make observation coverage a first-class output.
  **Why:** Without sufficient coverage, absence of observed change cannot be treated as evidence of stability.

- **Decision:** Use simulated phone/GPS telemetry.
  **Why:** Week 7 requires a third Dragon Stack capability beyond maps/geodata and ML; simulated telemetry is explicitly allowed and avoids real personal data.

- **Decision:** Keep human validation in the loop.
  **Why:** The system is evidence for review, not authority to change an official route.

- **Decision:** Use deterministic simulated ML instead of a live model.
  **Why:** The assignment requires a working slice, and the hypothesis is about the workflow and evidence signal, not about pretending a model is more capable than it is.

- **Decision:** Include an insufficient-data state.
  **Why:** A route with sparse observations must not be classified as stable.

- **Decision:** No safety claim from mismatch alone.
  **Why:** A deviation can be a normal or useful adaptation; the product must not convert representation mismatch into enforcement or a safety verdict.

## Tomorrow's first move

Run the Week 7 page at `/week7.html`, test all three scenarios, then verify the final GitHub/Vercel deployment and record the mechanical bug fix in the demo notes.
