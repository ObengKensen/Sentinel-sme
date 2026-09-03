import { describe, expect, it } from "vitest";
import { assessCyberThreats, legacyFlagsFromAssessment } from "./cyber-threats";

describe("assessCyberThreats", () => {
  it("scores phishing credential submission as high risk", () => {
    const result = assessCyberThreats({
      selectedThreats: ["phishing"],
      answersByThreat: {
        phishing: {
          received_suspicious: true,
          clicked_link: true,
          submitted_credentials: true,
          reported: false,
          resolved: false,
        },
      },
    });

    expect(result.overallLevel).toBe("high");
    expect(result.overallScore).toBeGreaterThanOrEqual(75);
    expect(result.threats[0]?.threatName).toBe("Phishing");
  });

  it("scores no-impact phishing answers as low risk", () => {
    const result = assessCyberThreats({
      selectedThreats: ["phishing"],
      answersByThreat: {
        phishing: {
          received_suspicious: false,
          clicked_link: false,
          submitted_credentials: false,
          reported: false,
          resolved: true,
        },
      },
    });

    expect(result.overallLevel).toBe("low");
  });

  it("aggregates multiple threats by highest score", () => {
    const result = assessCyberThreats({
      selectedThreats: ["phishing", "password_attacks"],
      answersByThreat: {
        phishing: {
          received_suspicious: true,
          clicked_link: false,
          submitted_credentials: false,
          reported: true,
          resolved: false,
        },
        password_attacks: {
          unauthorized_access: true,
          suspicious_logins: true,
          password_compromised: true,
          password_changed: false,
          mfa_enabled: false,
        },
      },
    });

    expect(result.threats).toHaveLength(2);
    expect(result.overallScore).toBe(Math.max(...result.threats.map((t) => t.score)));
    expect(result.overallLevel).toBe("high");
  });

  it("requires other description when Other is selected", () => {
    expect(() =>
      assessCyberThreats({
        selectedThreats: ["other"],
        answersByThreat: {
          other: {
            active_incident: true,
            data_or_access_impact: false,
            customers_affected: false,
            reported: false,
            resolved: false,
          },
        },
      }),
    ).toThrow(/specify/i);
  });

  it("maps assessment flags for legacy compatibility", () => {
    const assessment = assessCyberThreats({
      selectedThreats: ["ransomware"],
      answersByThreat: {
        ransomware: {
          device_affected: true,
          files_encrypted: true,
          ops_disrupted: true,
          reported: true,
          isolated: true,
        },
      },
    });
    const flags = legacyFlagsFromAssessment(assessment);
    expect(flags.suspicious).toBe(true);
    expect(flags.antivirusActive).toBe(false);
  });
});
