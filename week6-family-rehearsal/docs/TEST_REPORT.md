# TEST_REPORT — Rehearsal MX Week 6

## Mechanical pass plan

1. Start rehearsal.
2. Complete scenario 1.
3. Choose different answers in separate runs and confirm the adaptive route changes.
4. Complete scenarios 2 and 3.
5. Use voice playback.
6. Confirm the result screen.
7. Confirm no personal-data fields exist.
8. Check mobile layout.
9. Confirm restart works.

## Known bug fixed during implementation

**Bug:** the original route used a fixed next scenario, so the interface claimed adaptive behavior without actually changing the path.

**Fix:** `nextScenarioId()` now uses the selected choice's adaptation score to select the next remaining scenario. The mechanism is deterministic and explicitly labeled as simulated.

## Environment limitation

A full build was not verified in this execution environment because npm dependency installation could not complete without registry access. This is an environment limitation, not evidence that the build is broken.

## Persona test

Synthetic persona: **Doña Mari, 54**, sells food outside the metro, uses WhatsApp but distrusts apps, reads slowly, and gives up silently when confused.

Source-level UX safeguards include a dedicated changed-condition block, visible simulated-AI labeling, a 300-character reasoning limit, repeated simulation warning, and no account or personal-information request.

The live persona test still needs to be run after deployment; no positive result is fabricated here.
