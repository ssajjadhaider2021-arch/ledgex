/**
 * Risk score from onboarding questionnaire answers.
 * Score starts at 0; rules add points. Aliases match current client option values where names differ.
 */

function computeRiskScore({
  businessType,
  businessLocation,
  annualTurnover,
  highValueTransactions,
  cashPercentage,
  isPep,
  isPepAssociate,
  hasSanctions,
  hasAdverseMedia,
}) {
  let score = 0;

  const bt = String(businessType || "").toLowerCase();
  if (bt === "crypto" || bt === "msb") score += 3;

  const loc = String(businessLocation || "").toLowerCase();
  if (loc === "high_risk") score += 3;

  if (annualTurnover === "over_5m") score += 2;

  const hvt = highValueTransactions || "";
  /* spec: "regular"; questionnaire uses "frequently" for the same bucket */
  if (hvt === "regular" || hvt === "frequently") score += 2;

  const cash = cashPercentage || "";
  /* spec: "majority"; questionnaire uses "50+" for majority cash share */
  if (cash === "majority" || cash === "50+") score += 3;

  if (isPep === true) score += 5;
  if (isPepAssociate === true) score += 3;
  if (hasSanctions === true) score += 10;
  if (hasAdverseMedia === true) score += 4;

  return score;
}

/** 0–4 low, 5–9 medium, 10+ high */
function riskLevelFromScore(score) {
  if (score <= 4) return "low";
  if (score <= 9) return "medium";
  return "high";
}

module.exports = { computeRiskScore, riskLevelFromScore };
