# Week 7 Persona Test — Operación CDMX

## Synthetic user

**Mariana, 43 — SEMOVI mobility analyst**

- Reviews route spreadsheets and maps frequently.
- Reads quickly and scans for the decision first.
- Distrusts black-box AI claims.
- Wants to know exactly what evidence supports a recommendation.
- Will reject a system that silently turns a signal into an official route change.

## Task

> You are Mariana. Open the Week 7 dashboard and decide whether Route 12 should receive human review. Then test the stable and insufficient-coverage scenarios. Narrate where you hesitate and what you believe each result means.

## Screen-by-screen test log

### Screen 1 — Route analysis

**Expected understanding:** “I choose a route and scenario, then the system compares observed operations with the official representation.”

**Potential confusion:** The word “ML” can imply the model is authoritative.

**Fix:** Keep `Simulated ML output` visible next to the confidence metric and repeat that the result is advisory.

### Screen 2 — Map

**Expected understanding:** Dashed line = official representation; solid blue = observed telemetry; orange = observed variant.

**Potential confusion:** A route difference could be interpreted as a safety violation.

**Fix:** Evidence copy explicitly says that mismatch is not automatically unsafe and requires human validation.

### Screen 3 — Coverage

**Expected understanding:** Coverage tells the analyst whether the observation sample is sufficient to make a comparison.

**Potential confusion:** A high mismatch score with low coverage may look alarming.

**Fix:** The insufficient-coverage scenario blocks the actionable review interpretation and says `Not enough data to know.`

### Screen 4 — Recommendation

**Expected understanding:** “Review recommended” means a human should investigate; it does not mean the route is officially changed.

**Potential confusion:** User may assume the system has authority over the dataset.

**Fix:** Evidence package and scope language make human validation explicit.

## Worst confusion to fix

**Confusion:** A mismatch signal could be read as proof that the route is wrong or unsafe.

**Fix implemented:** The product uses the phrase **“Potential representation mismatch — review recommended”** and explicitly says that the signal is advisory, simulated, and not an automatic route update.

## Persona-test conclusion

The product is understandable when the analyst sees the three distinctions clearly:

1. observed change ≠ unsafe change;
2. mismatch ≠ official route update;
3. insufficient data ≠ stable route.

Those distinctions are now part of the UI copy and the test plan.
