# Deterministic recommendation engine

1. Only TOYOTA candidates are ranked. Budget and seats are hard constraints.
   Unknown/unverified price or seats cannot satisfy eligibility.
2. Normalize to [0,100]: price = clamp((1-price/budget)*100); fuel =
   clamp((km_per_litre-8)/22*100); seats = min(100,capacity/required*100).
   Missing fuel gets 0 and no TCO estimate. The fuel range is a transparent
   engineering heuristic, not a validated customer utility model.
3. Default weights: price .4, fuel .4, seats .2. A supported primary preference
   receives .6, the other two .2. The wizard therefore configures the weights.
4. Safety/comfort/performance/maintenance preferences remain disclosed but use
   default weights, because available data cannot support numerical quality
   comparisons. Usage context is collected but not given invented multipliers.
   Mileage affects the explanation and estimated fuel/TCO, not the base rank.
5. Eligible vehicles are ranked by descending score, with vehicle ID tie-break.
   If none are eligible, alternatives sort by violation count, score and ID, and
   each is marked ineligible. Take one trim per model, then at most three models.
6. Scores express this rule's fit, not probabilities. Explanations include
   component scores, costs and limitations. Existing-vehicle retention remains
   an option. No LLM participates in scoring.

Tests cover constraints, unknown values, order stability, score bounds,
preference changes, unsupported priorities and impossible requests.
