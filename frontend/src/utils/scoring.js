// frontend/src/utils/scoring.js

// Matrix for Total Score (Max 175)
export const evaluateTotalEI = (totalScore) => {
  if (totalScore >= 123) return { level: "High EI", description: "Strong emotional competence across all dimensions. The individual demonstrates consistent self-awareness, effective regulation, intrinsic motivation, empathy, and well-developed interpersonal skills.", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
  
  if (totalScore >= 79) return { level: "Moderate EI", description: "Reasonable emotional competence with identifiable areas for development. The individual shows strength in some dimensions but may be inconsistent or less effective in others.", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" };
  
  return { level: "Low EI", description: "Limited emotional competence that may hinder professional effectiveness. Targeted training and developmental interventions are strongly recommended.", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" };
};

// Matrix for Individual Dimensions (Max 25)
export const evaluateDimension = (score) => {
  if (score >= 20) return { label: "Strong", desc: "Competency in this dimension is well-developed and consistently applied.", color: "text-green-600" };
  
  if (score >= 13) return { label: "Developing", desc: "Competency is present but variable; targeted coaching or reflection is beneficial.", color: "text-blue-600" };
  
  return { label: "Needs Focus", desc: "This dimension requires deliberate, structured development through training or mentoring.", color: "text-orange-600" };
};