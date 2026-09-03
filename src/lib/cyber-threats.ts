import type { Severity } from "./risk-store";

export type CyberThreatType =
  | "phishing"
  | "bec"
  | "malware"
  | "ransomware"
  | "password_attacks"
  | "social_engineering"
  | "data_breach"
  | "payment_fraud"
  | "website_attacks"
  | "ddos"
  | "insider_threat"
  | "other";

export type CyberQuestion = {
  id: string;
  label: string;
  /** If true, a "Yes" answer raises risk more aggressively. */
  impact: "info" | "medium" | "high";
};

export type CyberThreatOption = {
  id: CyberThreatType;
  name: string;
  description: string;
  questions: CyberQuestion[];
};

export type CyberThreatResult = {
  threatType: CyberThreatType;
  threatName: string;
  otherDescription?: string;
  answers: Record<string, boolean>;
  score: number;
  level: Severity;
  label: string;
  reason: string;
  recommendedActions: string[];
  status: "active" | "resolved";
};

export type CyberAssessmentPayload = {
  selectedThreats: CyberThreatType[];
  otherDescription?: string;
  threats: CyberThreatResult[];
  overallScore: number;
  overallLevel: Severity;
  overallLabel: string;
  overallReason: string;
};

const labelOf = (level: Severity) =>
  ({ low: "Low Risk", medium: "Medium Risk", high: "High Risk" })[level];

function levelFromScore(score: number): Severity {
  if (score >= 75) return "high";
  if (score >= 40) return "medium";
  return "low";
}

export const CYBER_THREAT_OPTIONS: CyberThreatOption[] = [
  {
    id: "phishing",
    name: "Phishing",
    description:
      "Fraudulent emails, messages, or websites designed to trick users into revealing information or clicking malicious links.",
    questions: [
      {
        id: "received_suspicious",
        label: "Have employees received suspicious emails or messages?",
        impact: "medium",
      },
      { id: "clicked_link", label: "Has anyone clicked a suspicious link?", impact: "high" },
      {
        id: "submitted_credentials",
        label: "Has anyone submitted login credentials through a suspicious link?",
        impact: "high",
      },
      { id: "reported", label: "Has the incident been reported?", impact: "info" },
      { id: "resolved", label: "Is the incident currently resolved?", impact: "info" },
    ],
  },
  {
    id: "bec",
    name: "Business Email Compromise (BEC)",
    description:
      "Attackers impersonate executives or suppliers by email to trick staff into sending money or sensitive information.",
    questions: [
      {
        id: "impersonation_email",
        label: "Has the business received emails impersonating a manager or supplier?",
        impact: "medium",
      },
      {
        id: "payment_requested",
        label: "Was a payment or fund transfer requested through that email?",
        impact: "high",
      },
      { id: "payment_sent", label: "Was money or data sent based on the request?", impact: "high" },
      { id: "reported", label: "Has the incident been reported?", impact: "info" },
      { id: "resolved", label: "Is the incident currently resolved?", impact: "info" },
    ],
  },
  {
    id: "malware",
    name: "Malware",
    description:
      "Malicious software installed on devices that can steal data, spy on activity, or disrupt systems.",
    questions: [
      {
        id: "device_infected",
        label: "Has any business device shown signs of malware infection?",
        impact: "high",
      },
      {
        id: "unexpected_behavior",
        label: "Have systems behaved unexpectedly (slowdowns, pop-ups, unknown programs)?",
        impact: "medium",
      },
      {
        id: "antivirus_alert",
        label: "Has antivirus or security software raised an alert?",
        impact: "medium",
      },
      { id: "reported", label: "Has the incident been reported?", impact: "info" },
      {
        id: "resolved",
        label: "Has the affected device been cleaned or replaced?",
        impact: "info",
      },
    ],
  },
  {
    id: "ransomware",
    name: "Ransomware",
    description: "Malware that locks or encrypts files and demands payment to restore access.",
    questions: [
      { id: "device_affected", label: "Has any business device been affected?", impact: "high" },
      {
        id: "files_encrypted",
        label: "Have files been encrypted or made inaccessible?",
        impact: "high",
      },
      {
        id: "ops_disrupted",
        label: "Has the business experienced operational disruption?",
        impact: "high",
      },
      { id: "reported", label: "Has the incident been reported?", impact: "info" },
      { id: "isolated", label: "Has the affected device been isolated?", impact: "info" },
    ],
  },
  {
    id: "password_attacks",
    name: "Password Attacks / Account Compromise",
    description:
      "Unauthorized access attempts or successful logins using stolen, guessed, or reused passwords.",
    questions: [
      {
        id: "unauthorized_access",
        label: "Has an employee account been accessed without authorization?",
        impact: "high",
      },
      {
        id: "suspicious_logins",
        label: "Have suspicious login attempts been detected?",
        impact: "medium",
      },
      { id: "password_compromised", label: "Has a password been compromised?", impact: "high" },
      { id: "password_changed", label: "Has the affected password been changed?", impact: "info" },
      {
        id: "mfa_enabled",
        label: "Has multi-factor authentication been enabled?",
        impact: "info",
      },
    ],
  },
  {
    id: "social_engineering",
    name: "Social Engineering",
    description:
      "Psychological tricks used to manipulate people into giving access, money, or confidential information.",
    questions: [
      {
        id: "staff_targeted",
        label: "Have staff been contacted by someone pretending to be trusted?",
        impact: "medium",
      },
      {
        id: "info_shared",
        label: "Was confidential information shared during the interaction?",
        impact: "high",
      },
      {
        id: "access_granted",
        label: "Was system or building access granted as a result?",
        impact: "high",
      },
      { id: "reported", label: "Has the incident been reported?", impact: "info" },
      {
        id: "resolved",
        label: "Have staff been briefed and controls updated?",
        impact: "info",
      },
    ],
  },
  {
    id: "data_breach",
    name: "Data Breach / Data Theft",
    description: "Unauthorized access to, exposure of, or theft of business or customer data.",
    questions: [
      {
        id: "unauthorized_access",
        label: "Has unauthorized access to business data been detected?",
        impact: "high",
      },
      {
        id: "customer_data",
        label: "Was customer or personal data affected?",
        impact: "high",
      },
      {
        id: "still_accessible",
        label: "Is the affected data still accessible to the attacker?",
        impact: "high",
      },
      { id: "reported", label: "Has the incident been reported?", impact: "info" },
      { id: "resolved", label: "Has the issue been resolved?", impact: "info" },
    ],
  },
  {
    id: "payment_fraud",
    name: "Online Payment / Financial Fraud",
    description:
      "Fraudulent online payments, stolen card details, or unauthorized financial transactions.",
    questions: [
      {
        id: "fraud_detected",
        label: "Have unauthorized or fraudulent transactions been detected?",
        impact: "high",
      },
      {
        id: "customer_impact",
        label: "Have customers reported payment issues linked to your business?",
        impact: "medium",
      },
      {
        id: "funds_lost",
        label: "Has the business lost money due to the fraud?",
        impact: "high",
      },
      {
        id: "reported",
        label: "Has the incident been reported to the bank/provider?",
        impact: "info",
      },
      { id: "resolved", label: "Have payment channels been secured?", impact: "info" },
    ],
  },
  {
    id: "website_attacks",
    name: "Website Attacks",
    description:
      "Attempts to deface, hack, inject malware into, or take over the business website.",
    questions: [
      {
        id: "site_compromised",
        label: "Has the website been defaced or compromised?",
        impact: "high",
      },
      {
        id: "suspicious_changes",
        label: "Have unexpected website changes or redirects been noticed?",
        impact: "medium",
      },
      {
        id: "customer_impact",
        label: "Are customers unable to use the website normally?",
        impact: "medium",
      },
      {
        id: "reported",
        label: "Has the incident been reported to your hosting provider?",
        impact: "info",
      },
      {
        id: "resolved",
        label: "Has the website been restored and secured?",
        impact: "info",
      },
    ],
  },
  {
    id: "ddos",
    name: "Denial-of-Service (DoS/DDoS)",
    description:
      "Flooding online services so websites, email, or apps become slow or unavailable.",
    questions: [
      {
        id: "service_down",
        label: "Have online services become unavailable or extremely slow?",
        impact: "high",
      },
      { id: "ongoing", label: "Is the disruption still ongoing?", impact: "high" },
      {
        id: "customer_impact",
        label: "Are customers or staff unable to operate because of it?",
        impact: "medium",
      },
      { id: "reported", label: "Has the provider been notified?", impact: "info" },
      { id: "mitigated", label: "Have mitigation steps been applied?", impact: "info" },
    ],
  },
  {
    id: "insider_threat",
    name: "Insider Threat",
    description:
      "Risk from employees, contractors, or partners misusing legitimate access to harm the business.",
    questions: [
      {
        id: "misuse_suspected",
        label: "Is misuse of internal access suspected or confirmed?",
        impact: "high",
      },
      {
        id: "data_exfiltrated",
        label: "Was business data copied, deleted, or shared improperly?",
        impact: "high",
      },
      {
        id: "access_revoked",
        label: "Has the person's access been revoked or restricted?",
        impact: "info",
      },
      { id: "reported", label: "Has the incident been reported internally?", impact: "info" },
      {
        id: "resolved",
        label: "Have access reviews and controls been updated?",
        impact: "info",
      },
    ],
  },
  {
    id: "other",
    name: "Other",
    description: "A cybersecurity threat that is not listed above.",
    questions: [
      {
        id: "active_incident",
        label: "Is this threat currently affecting the business?",
        impact: "high",
      },
      {
        id: "data_or_access_impact",
        label: "Has data, access, or operations been impacted?",
        impact: "high",
      },
      {
        id: "customers_affected",
        label: "Have customers or staff been affected?",
        impact: "medium",
      },
      { id: "reported", label: "Has the incident been reported?", impact: "info" },
      { id: "resolved", label: "Is the issue currently resolved?", impact: "info" },
    ],
  },
];

export function getThreatOption(id: CyberThreatType): CyberThreatOption | undefined {
  return CYBER_THREAT_OPTIONS.find((t) => t.id === id);
}

const ACTIONS: Record<CyberThreatType, string[]> = {
  phishing: [
    "Change affected account passwords immediately.",
    "Enable multi-factor authentication.",
    "Review recent account activity.",
    "Report and investigate the suspicious message.",
    "Provide phishing awareness training to affected employees.",
  ],
  bec: [
    "Verify payment requests through a second channel.",
    "Freeze or reverse any suspicious transfers if possible.",
    "Review email account forwarding rules and inbox rules.",
    "Warn staff about executive/supplier impersonation.",
    "Enable stronger email authentication where available.",
  ],
  malware: [
    "Disconnect and scan affected devices.",
    "Update antivirus definitions and run a full scan.",
    "Remove unknown software and restore from a clean backup if needed.",
    "Review downloads and email attachments from the past week.",
    "Keep operating systems and apps patched.",
  ],
  ransomware: [
    "Isolate affected devices from the network immediately.",
    "Do not pay a ransom without professional advice.",
    "Restore critical files from clean backups.",
    "Report the incident to relevant authorities/providers.",
    "Review backup and recovery procedures.",
  ],
  password_attacks: [
    "Change compromised passwords immediately.",
    "Enable multi-factor authentication on all critical accounts.",
    "Review recent login history for unauthorized access.",
    "Disable unused or shared accounts.",
    "Use a password manager for unique strong passwords.",
  ],
  social_engineering: [
    "Brief staff on the incident and verification procedures.",
    "Revoke any access granted during the interaction.",
    "Confirm no funds or data were released incorrectly.",
    "Update call-back and identity verification rules.",
    "Log the incident for future awareness training.",
  ],
  data_breach: [
    "Contain unauthorized access immediately.",
    "Identify what data was exposed and who is affected.",
    "Notify affected parties where legally or ethically required.",
    "Rotate credentials and review access permissions.",
    "Preserve logs for investigation.",
  ],
  payment_fraud: [
    "Contact your bank or payment provider immediately.",
    "Disable compromised payment channels temporarily.",
    "Review recent transactions for further fraud.",
    "Notify affected customers if their payments were impacted.",
    "Strengthen checkout and refund verification controls.",
  ],
  website_attacks: [
    "Take the compromised site offline or into maintenance mode if needed.",
    "Restore from a clean backup.",
    "Update CMS, plugins, and hosting credentials.",
    "Scan for injected scripts or backdoors.",
    "Enable monitoring and web application firewalls where available.",
  ],
  ddos: [
    "Contact your hosting/ISP provider for mitigation.",
    "Enable rate-limiting or DDoS protection services.",
    "Communicate service status to customers.",
    "Monitor traffic until services stabilize.",
    "Document attack windows for future capacity planning.",
  ],
  insider_threat: [
    "Revoke or restrict the individual's access immediately.",
    "Preserve audit logs and evidence.",
    "Review what systems and data were accessed.",
    "Update access control and least-privilege policies.",
    "Conduct an internal review with management.",
  ],
  other: [
    "Document the threat and impact clearly.",
    "Contain any active exposure or unauthorized access.",
    "Escalate to your IT support or cybersecurity advisor.",
    "Update passwords and access controls as needed.",
    "Monitor systems closely after containment.",
  ],
};

function scoreThreat(
  threat: CyberThreatOption,
  answers: Record<string, boolean>,
): { score: number; reason: string; status: "active" | "resolved" } {
  let score = 18;
  const reasons: string[] = [];

  for (const q of threat.questions) {
    const yes = Boolean(answers[q.id]);
    if (q.impact === "high" && yes) {
      score = Math.max(score, 88);
      reasons.push(q.label.replace(/\?$/, ""));
    } else if (q.impact === "medium" && yes) {
      score = Math.max(score, 58);
      if (reasons.length < 2) reasons.push(q.label.replace(/\?$/, ""));
    }
  }

  if (answers.resolved || answers.mitigated || answers.isolated || answers.password_changed) {
    if (score < 75) score = Math.max(15, score - 10);
  }
  if (answers.mfa_enabled) score = Math.max(15, score - 5);

  if (threat.id === "phishing") {
    if (answers.submitted_credentials || answers.clicked_link) score = Math.max(score, 88);
    else if (answers.received_suspicious) score = Math.max(score, 55);
  }
  if (threat.id === "ransomware") {
    if (answers.files_encrypted || answers.ops_disrupted || answers.device_affected) {
      score = Math.max(score, 90);
    }
  }
  if (threat.id === "password_attacks") {
    if (answers.unauthorized_access || answers.password_compromised) score = Math.max(score, 88);
    else if (answers.suspicious_logins) score = Math.max(score, 55);
  }

  const hasActiveIssue = threat.questions.some((q) => q.impact !== "info" && answers[q.id]);
  const resolved = Boolean(answers.resolved || answers.mitigated);

  if (!hasActiveIssue) {
    return {
      score: Math.min(score, 22),
      reason: "No high-impact cybersecurity indicators were reported for this threat.",
      status: "resolved",
    };
  }

  return {
    score,
    reason:
      reasons.length > 0
        ? `${reasons[0]}${reasons[1] ? `; ${reasons[1].charAt(0).toLowerCase()}${reasons[1].slice(1)}` : ""}.`
        : "Relevant cybersecurity indicators were reported for this threat.",
    status: resolved ? "resolved" : "active",
  };
}

export function assessCyberThreats(input: {
  selectedThreats: CyberThreatType[];
  answersByThreat: Record<string, Record<string, boolean>>;
  otherDescription?: string;
}): CyberAssessmentPayload {
  const selected = [...new Set(input.selectedThreats)];
  if (selected.length === 0) {
    throw new Error("Select at least one cybersecurity threat.");
  }
  if (selected.includes("other") && !input.otherDescription?.trim()) {
    throw new Error("Please specify the cybersecurity threat for Other.");
  }

  const threats: CyberThreatResult[] = selected.map((id) => {
    const option = getThreatOption(id);
    if (!option) throw new Error(`Unknown threat: ${id}`);
    const answers = input.answersByThreat[id] ?? {};
    for (const q of option.questions) {
      if (typeof answers[q.id] !== "boolean") {
        throw new Error(`Please answer all questions for ${option.name}.`);
      }
    }
    const scored = scoreThreat(option, answers);
    const level = levelFromScore(scored.score);
    return {
      threatType: id,
      threatName: option.name,
      otherDescription: id === "other" ? input.otherDescription?.trim() : undefined,
      answers,
      score: scored.score,
      level,
      label: labelOf(level),
      reason: scored.reason,
      recommendedActions: ACTIONS[id],
      status: scored.status,
    };
  });

  const overallScore = Math.max(...threats.map((t) => t.score));
  const overallLevel = levelFromScore(overallScore);
  const top = [...threats].sort((a, b) => b.score - a.score)[0]!;

  return {
    selectedThreats: selected,
    otherDescription: input.otherDescription?.trim() || undefined,
    threats,
    overallScore,
    overallLevel,
    overallLabel: labelOf(overallLevel),
    overallReason: top.reason,
  };
}

/** Map assessment outcomes onto legacy cyber flags used elsewhere in the app. */
export function legacyFlagsFromAssessment(assessment: CyberAssessmentPayload): {
  passwordUpdated: boolean;
  antivirusActive: boolean;
  suspicious: boolean;
} {
  const flat = assessment.threats.flatMap((t) => Object.entries(t.answers));
  const yes = (id: string) => flat.some(([key, value]) => key === id && value);

  const passwordIssue =
    yes("password_compromised") ||
    yes("unauthorized_access") ||
    yes("submitted_credentials") ||
    assessment.threats.some(
      (t) =>
        (t.threatType === "password_attacks" || t.threatType === "phishing") &&
        t.level !== "low",
    );

  const malwareLike =
    assessment.selectedThreats.includes("malware") ||
    assessment.selectedThreats.includes("ransomware");
  const deviceHit = yes("device_infected") || yes("device_affected") || yes("files_encrypted");

  const suspicious =
    assessment.overallLevel !== "low" ||
    yes("clicked_link") ||
    yes("submitted_credentials") ||
    yes("unauthorized_access") ||
    yes("fraud_detected");

  return {
    passwordUpdated: !passwordIssue || yes("password_changed"),
    antivirusActive: !(malwareLike && deviceHit),
    suspicious,
  };
}
