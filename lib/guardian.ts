export const fieldLabels: Record<string, string> = {
  fullName: "Full name",
  studentId: "Student identifier",
  enrolmentStatus: "Enrolment confirmation",
  course: "Course of study",
  passportNumber: "Full passport number",
  homeAddress: "Home address",
  insurancePolicyNumber: "Insurance policy number",
  insuranceStatus: "Insurance coverage status",
};
export const fieldNames = Object.keys(fieldLabels);
export function assess(
  purpose: string,
  fields: string[],
  durationHours: number,
) {
  const studentPurpose = /student|enrol|enroll|accommodation/i.test(purpose);
  const minimum = studentPurpose
    ? [
        "enrolmentStatus",
        ...(fields.includes("fullName")
          ? ["fullName"]
          : fields.includes("studentId")
            ? ["studentId"]
            : []),
      ]
    : fields.filter(
        (f) =>
          !["passportNumber", "homeAddress", "insurancePolicyNumber"].includes(
            f,
          ),
      );
  const excessiveFields = fields.filter((f) => !minimum.includes(f));
  return {
    mode: "Rules-based demo analysis",
    risk: excessiveFields.some((f) =>
      ["passportNumber", "homeAddress", "insurancePolicyNumber"].includes(f),
    )
      ? "high"
      : excessiveFields.length || durationHours > 24
        ? "medium"
        : "low",
    excessiveFields,
    explanation: studentPurpose
      ? "Confirming student status generally needs an enrolment confirmation. A full passport number, home address, and insurance policy number do not establish enrolment and may be unnecessary. A name or student identifier can help match the applicant."
      : "This demo flags direct identity and policy identifiers for additional review. Check each field against the stated purpose.",
    suggestedMinimum: minimum,
    suggestedDurationHours: Math.min(durationHours, 24),
    advisory:
      "Advisory only. This is not a legal finding or a guarantee of safety.",
  };
}
