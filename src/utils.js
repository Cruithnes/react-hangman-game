import { words } from "../public/words"

export function getRandomWord() {
    const rnd = Math.floor(Math.random() * words.length)
    return words[rnd]
}