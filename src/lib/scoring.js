// Scoring rules (da PIANO_PROGETTO sez. 3)
// Risposta corretta: 100 punti, sbagliata 0
// Bonus tempo: max(0, 30 - secondi) * 2  (max 60 per domanda)
// Parità: vince il tempo totale più basso

export const POINTS_CORRECT = 100
export const TIME_LIMIT = 30 // secondi entro cui scatta il bonus

export function timeBonus(seconds) {
  return Math.max(0, TIME_LIMIT - Math.floor(seconds)) * 2
}

export function questionScore(isCorrect, seconds) {
  if (!isCorrect) return 0
  return POINTS_CORRECT + timeBonus(seconds)
}

// answers: [{ correct: bool, seconds: number }]
export function totalScore(answers) {
  return answers.reduce((sum, a) => sum + questionScore(a.correct, a.seconds), 0)
}

export function correctCount(answers) {
  return answers.filter((a) => a.correct).length
}

export function totalSeconds(answers) {
  return answers.reduce((sum, a) => sum + a.seconds, 0)
}
