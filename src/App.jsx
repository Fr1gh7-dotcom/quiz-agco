import { useState, useEffect } from 'react'
import questions from './data/questions.json'
import Header from './components/Header.jsx'
import Welcome from './components/Welcome.jsx'
import NameInput from './components/NameInput.jsx'
import Instructions from './components/Instructions.jsx'
import Question from './components/Question.jsx'
import Result from './components/Result.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import { totalScore, correctCount, totalSeconds } from './lib/scoring.js'
import { submitScore, getLeaderboard, hasPlayed, markPlayed, alreadyPlayedByName } from './lib/storage.js'

const SCREENS = { WELCOME: 0, NAME: 1, INSTR: 2, QUIZ: 3, RESULT: 4, BOARD: 5 }

export default function App() {
  const [lang, setLang] = useState('it')
  const [screen, setScreen] = useState(SCREENS.WELCOME)
  const [player, setPlayer] = useState(null)
  const [qIndex, setQIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [me, setMe] = useState(null)
  const [rows, setRows] = useState([])
  const [rank, setRank] = useState(null)
  const [saving, setSaving] = useState(false)
  const [locked, setLocked] = useState(false)
  const [checking, setChecking] = useState(false)

  // Carica classifica + calcola rank, evidenziando l'entry. Non naviga.
  async function loadBoard(entry) {
    setLocked(true)
    setMe(entry)
    const board = await getLeaderboard(50)
    setRows(board)
    const pos = board.findIndex(
      (r) =>
        r.nome === entry.nome &&
        r.cognome === entry.cognome &&
        r.punteggio === entry.punteggio &&
        r.tempoTotaleSecondi === entry.tempoTotaleSecondi
    )
    setRank(pos >= 0 ? pos + 1 : null)
  }

  // Carica e va diretto alla classifica (già giocato).
  async function showLockedBoard(entry) {
    await loadBoard(entry)
    setScreen(SCREENS.BOARD)
  }

  // Una volta sola per device: se ha già giocato, mostra direttamente la classifica.
  useEffect(() => {
    const prev = hasPlayed()
    if (prev) showLockedBoard(prev)
  }, [])

  async function confirmName(p) {
    setPlayer(p)
    setChecking(true)
    // Backstop server: questo nome ha già giocato? (copre webview/privata senza localStorage)
    const prev = await alreadyPlayedByName(p.nome, p.cognome)
    setChecking(false)
    if (prev) {
      markPlayed(prev)
      showLockedBoard(prev)
    } else {
      setScreen(SCREENS.INSTR)
    }
  }

  function reset() {
    setScreen(SCREENS.WELCOME)
    setPlayer(null)
    setQIndex(0)
    setAnswers([])
    setMe(null)
    setRows([])
    setRank(null)
  }

  function handleAnswer(a) {
    setAnswers((prev) => [...prev, a])
  }

  async function finishQuiz(finalAnswers) {
    setScreen(SCREENS.RESULT)
    setSaving(true)
    const entry = {
      nome: player.nome,
      cognome: player.cognome,
      punteggio: totalScore(finalAnswers),
      tempoTotaleSecondi: Math.round(totalSeconds(finalAnswers)),
      risposteCorrette: correctCount(finalAnswers),
    }
    const saved = await submitScore(entry)
    markPlayed(saved)
    await loadBoard(saved)
    setSaving(false)
  }

  function nextQuestion() {
    if (qIndex === questions.length - 1) {
      finishQuiz(answers)
    } else {
      setQIndex((i) => i + 1)
    }
  }

  const score = totalScore(answers)
  const secs = totalSeconds(answers)
  const correct = correctCount(answers)

  return (
    <div className="app">
      <Header lang={lang} setLang={setLang} />
      <main className="app-main">
        {screen === SCREENS.WELCOME && (
          <Welcome lang={lang} onStart={() => setScreen(SCREENS.NAME)} />
        )}
        {screen === SCREENS.NAME && (
          <NameInput lang={lang} onConfirm={confirmName} checking={checking} />
        )}
        {screen === SCREENS.INSTR && (
          <Instructions lang={lang} onGo={() => setScreen(SCREENS.QUIZ)} />
        )}
        {screen === SCREENS.QUIZ && (
          <Question
            lang={lang}
            q={questions[qIndex]}
            index={qIndex}
            total={questions.length}
            onAnswer={handleAnswer}
            onNext={nextQuestion}
          />
        )}
        {screen === SCREENS.RESULT && (
          <Result
            lang={lang}
            player={player}
            score={score}
            seconds={secs}
            rank={rank}
            correct={correct}
            total={questions.length}
            saving={saving}
            onLeaderboard={() => setScreen(SCREENS.BOARD)}
          />
        )}
        {screen === SCREENS.BOARD && (
          <Leaderboard lang={lang} rows={rows.slice(0, 20)} me={me} onPlayAgain={reset} locked={locked} />
        )}
      </main>
    </div>
  )
}
