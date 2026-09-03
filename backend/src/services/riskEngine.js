/** Rule-based risk detection engine (no AI/ML) */

const levelFromScore = (score) => (score >= 75 ? 'high' : score >= 40 ? 'medium' : 'low');
const labelOf = (level) =>
  ({ low: 'Low Risk', medium: 'Medium Risk', high: 'High Risk' })[level];

function daysUntil(dateStr) {
  return Math.floor((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

export function computeFinancialRisk(record) {
  if (!record) return { level: 'low', score: 10, label: labelOf('low') };
  let score = 15;
  const income = Number(record.income);
  const expenses = Number(record.expenses);
  const outstanding = Number(record.outstanding_payments);

  if (expenses > income) score = 90;
  else if (income > 0 && (income - expenses) / income < 0.2) score = Math.max(score, 60);

  if (outstanding > income * 0.4) score = Math.max(score, 80);
  else if (outstanding > income * 0.2) score = Math.max(score, 55);

  const level = levelFromScore(score);
  return { level, score, label: labelOf(level) };
}

export function computeCyberRisk(record) {
  if (!record) return { level: 'low', score: 10, label: labelOf('low') };
  let score = 15;
  if (!record.antivirus_active) score = Math.max(score, 90);
  if (record.suspicious_activity) score = Math.max(score, 88);
  if (!record.password_updated) score = Math.max(score, 55);
  const level = levelFromScore(score);
  return { level, score, label: labelOf(level) };
}

export function computeComplianceRisk(record) {
  if (!record) return { level: 'low', score: 10, label: labelOf('low') };
  let score = 15;
  const td = daysUntil(record.tax_deadline);
  if (td < 0) score = Math.max(score, 90);
  else if (td <= 7) score = Math.max(score, 60);
  const ld = daysUntil(record.license_expiry);
  if (ld < 0) score = Math.max(score, 90);
  else if (ld <= 7) score = Math.max(score, 60);
  const level = levelFromScore(score);
  return { level, score, label: labelOf(level) };
}

export function computeOperationalRisk(record) {
  if (!record) return { level: 'low', score: 10, label: labelOf('low') };
  let score = 15;
  if (record.staff_present < record.staff_required) score = Math.max(score, 55);
  if (record.equipment_status === 'faulty') score = Math.max(score, 60);
  if (record.delivery_status === 'delayed') score = Math.max(score, 55);
  const level = levelFromScore(score);
  return { level, score, label: labelOf(level) };
}

export function computeOverallRisk(financial, cyber, compliance, operational) {
  const all = [
    computeFinancialRisk(financial),
    computeCyberRisk(cyber),
    computeComplianceRisk(compliance),
    computeOperationalRisk(operational),
  ];
  const score = Math.round(all.reduce((a, r) => a + r.score, 0) / all.length);
  const level = levelFromScore(score);
  return { level, score, label: labelOf(level) };
}

/** Generate alert payloads from latest records */
export function evaluateFinancialRules(record) {
  const alerts = [];
  const income = Number(record.income);
  const expenses = Number(record.expenses);
  const outstanding = Number(record.outstanding_payments);

  if (expenses > income) {
    alerts.push({
      category: 'financial',
      severity: 'high',
      title: 'Expenses exceed income',
      action_text:
        'Review variable costs and renegotiate non-essential spending immediately.',
    });
  } else if (income > 0 && (income - expenses) / income < 0.2) {
    alerts.push({
      category: 'financial',
      severity: 'medium',
      title: 'Low profit margin (<20%)',
      action_text: 'Identify top-margin products and prioritize higher-margin sales.',
    });
  }

  if (outstanding > income * 0.2) {
    alerts.push({
      category: 'financial',
      severity: outstanding > income * 0.4 ? 'high' : 'medium',
      title: 'Outstanding payments above threshold',
      action_text: 'Send collection reminders and offer short-term payment plans.',
    });
  }
  return alerts;
}

export function evaluateCyberRules(record) {
  const alerts = [];
  if (!record.antivirus_active) {
    alerts.push({
      category: 'cybersecurity',
      severity: 'high',
      title: 'Antivirus inactive',
      action_text: 'Re-enable endpoint protection on all devices today.',
    });
  }
  if (record.suspicious_activity) {
    alerts.push({
      category: 'cybersecurity',
      severity: 'high',
      title: 'Suspicious activity reported',
      action_text: 'Isolate affected accounts and force a password reset.',
    });
  }
  if (!record.password_updated) {
    alerts.push({
      category: 'cybersecurity',
      severity: 'medium',
      title: 'Passwords not updated',
      action_text: 'Rotate all admin and shared-account passwords within 7 days.',
    });
  }
  return alerts;
}

export function evaluateComplianceRules(record) {
  const alerts = [];
  const td = daysUntil(record.tax_deadline);
  if (td < 0) {
    alerts.push({
      category: 'compliance',
      severity: 'high',
      title: 'Tax deadline passed',
      action_text: 'File outstanding tax submissions and contact a tax advisor.',
    });
  } else if (td <= 7) {
    alerts.push({
      category: 'compliance',
      severity: 'medium',
      title: `Tax deadline in ${td} days`,
      action_text: 'Prepare filing documents and confirm payment schedule.',
    });
  }
  const ld = daysUntil(record.license_expiry);
  if (ld < 0) {
    alerts.push({
      category: 'compliance',
      severity: 'high',
      title: 'Business license expired',
      action_text: 'Renew license immediately to avoid operating illegally.',
    });
  } else if (ld <= 7) {
    alerts.push({
      category: 'compliance',
      severity: 'medium',
      title: `License expires in ${ld} days`,
      action_text: 'Submit renewal paperwork this week.',
    });
  }
  return alerts;
}

export function evaluateOperationalRules(record) {
  const alerts = [];
  if (record.staff_present < record.staff_required) {
    alerts.push({
      category: 'operational',
      severity: 'medium',
      title: 'Low staff availability',
      action_text: 'Schedule cover or activate part-time staff for the shortfall.',
    });
  }
  if (record.equipment_status === 'faulty') {
    alerts.push({
      category: 'operational',
      severity: 'medium',
      title: 'Faulty equipment reported',
      action_text: 'Log a service request and prepare a backup workflow.',
    });
  }
  if (record.delivery_status === 'delayed') {
    alerts.push({
      category: 'operational',
      severity: 'medium',
      title: 'Delivery delayed',
      action_text: 'Notify affected customers and confirm new ETA with supplier.',
    });
  }
  return alerts;
}

export function evaluateAllRules(records) {
  const { financial, cyber, compliance, operational } = records;
  return [
    ...(financial ? evaluateFinancialRules(financial) : []),
    ...(cyber ? evaluateCyberRules(cyber) : []),
    ...(compliance ? evaluateComplianceRules(compliance) : []),
    ...(operational ? evaluateOperationalRules(operational) : []),
  ];
}
