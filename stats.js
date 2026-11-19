const PASSING_PERCENTAGE = 67

function isArray(value) {
  return Array.isArray(value)
}

export function validateQuizData(data) {
  if (data === null || typeof data !== 'object' || isArray(data)) return false
  const { quizTitle, correctAnswers, attempts } = data
  if (typeof quizTitle !== 'string' || quizTitle.trim() === '') return false
  if (!isArray(correctAnswers) || correctAnswers.length === 0) return false
  if (!isArray(attempts) || attempts.length === 0) return false

  return attempts.every(attempt =>
    attempt !== null && typeof attempt === 'object' && !isArray(attempt) &&
    typeof attempt.name === 'string' && attempt.name.trim() !== '' &&
    isArray(attempt.answers) && attempt.answers.length === correctAnswers.length
  )
}

export function calculateAttempt(attempt, correctAnswers) {
  let score = 0
  correctAnswers.forEach((answer, index) => {
    if (attempt.answers[index] === answer) score += 1
  })
  const percentage = Math.round(100 * score / correctAnswers.length)
  return { name: attempt.name.trim(), score, percentage, passed: percentage >= PASSING_PERCENTAGE }
}

export function calculateReport(data) {
  const attempts = data.attempts.map(attempt => calculateAttempt(attempt, data.correctAnswers))
  let best = attempts[0]
  let totalPercentage = 0
  let passedCount = 0
  attempts.forEach(attempt => {
    if (attempt.score > best.score) best = attempt
    if (attempt.passed) passedCount += 1
    totalPercentage += attempt.percentage
  })
  return {
    quizTitle: data.quizTitle.trim(),
    questionCount: data.correctAnswers.length,
    participantCount: attempts.length,
    averagePercentage: Math.round(totalPercentage / attempts.length),
    passedCount,
    threshold: PASSING_PERCENTAGE,
    best,
    attempts,
  }
}
