import { useState, useRef, useEffect } from "react";

import "./App.css";
import { getRandomWord } from "./utils.js";

import catImage from "../src/assets/cat.png"
import githubIcon from "../src/assets/github-icon.png"

import clsx from "clsx"
import Confetti from "react-confetti"

function App() {
  //state values
  const [currentWord, setCurrentWord] = useState(() => getRandomWord())
  const [guess, setGuess] = useState([])
  const [confettiOn, setConfettiOn] = useState(true)

  //just in case
  console.log(currentWord)

  //derive values
  const wrongAnswerCount = guess.filter(letter => !currentWord.includes(letter)).length
  const isWon = wrongAnswerCount <= 7 && currentWord.split("").every(letter => guess.includes(letter))
  const isLost = wrongAnswerCount > 7
  const isGameOver = isWon || isLost

  //static values
  const alphabet = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ"

  //ref values
  const newGameButton = useRef(null)

  useEffect(() => {
    if (isGameOver) {
      newGameButton.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [isGameOver])

  const gameStatusClass = clsx("game-status", {
    won: isWon,
    lost: isLost,
  })

  //status section logic
  function renderGameStatus() {
    if (isWon) {
      return (
        <>
          <h2>Tebrikler!</h2>
          <p>Kedimiz {9 - wrongAnswerCount} canıyla mutluluktan mırlıyor! 😻 </p>
        </>
      )
    } if (isLost) {
      return (
        <>
          <h2>Kaybettin!</h2>
          <p>Kedimiz artık biraz dinlenmeli... Tek bir canı kaldı. 😿</p>
        </>
      )
    }
  }

  //creates cat span elements
  const catElements = Array.from({ length: 9 }, (_, index) => {
    const checkLost = index < wrongAnswerCount ? true : false
    const className = clsx("chip", { "lost": checkLost })
    return (
      <span
        className={className}
        key={index}>
        <img src={catImage} alt="cat-image" style={{ width: "35px" }} />
      </span>
    )
  })

  //creates displayed letter elements
  const letterElements = currentWord.split("").map((letter, index) => {
    const shouldRevealLetter = guess.includes(letter) || isLost
    const className = clsx(isLost && !guess.includes(letter) && "missed-letter")
    return (
      <span
        className={className}
        key={index}>
        {shouldRevealLetter && letter}
      </span>
    )
  })

  //creates keyboard elements and checks if input is correct
  const keyboardElements = alphabet.split("").map((letter, index) => {
    const isGuessed = guess.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong
    })
    return (
      <button
        disabled={isGameOver}
        key={index}
        className={className}
        onClick={() => handleKeyboard(letter)}>
        {letter}
      </button>
    )
  })

  //adds pressed buttons to guess'es
  function handleKeyboard(letter) {
    setGuess(prevLetter =>
      prevLetter.includes(letter) ? prevLetter : [...prevLetter, letter])
  }

  //new game function
  function newGame() {
    setGuess([])
    setCurrentWord(getRandomWord())
  }

  //changes confetti setting
  function changeConfetti() {
    setConfettiOn(prev => prev = !prev)
  }

  return (
    <>
      {isWon && confettiOn && <Confetti recycle={false} numberOfPieces={1000} />}
      <main>
        <header>
          <h1>Miyavmaca</h1>
          <p>9 canın var! Her yanlış harf bir can götürür, tek bir can kalırsa oyun biter.</p>
        </header>

        <section className={gameStatusClass}>
          {renderGameStatus()}
        </section>

        <section className="cat-chips" ref={newGameButton}>
          {catElements}
        </section>

        <section className="letters">
          {letterElements}
        </section>

        <section className="keyboard">
          {keyboardElements}
        </section>

        {isGameOver && <button className="new-game" onClick={newGame}>Yeni kelime</button>}
        {isGameOver && <button className="confetti-setting" onClick={changeConfetti}>Konfeti {confettiOn ? "kapat" : "aç"}</button>}
        
        <a href="https://github.com/Cruithnes"><img src={githubIcon} style={{ width: "35px" }} /></a>
      </main>
    </>
  );
}

export default App;
