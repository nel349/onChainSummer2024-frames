import { FrameSession } from "./game-domain/frame-session"
import { Question } from "./game-domain/question"

// enum with initial and next
// export enum FramePhase {
//     initial = "initial",
//     next = "next"
// }

// Define the GameState enum
export enum GamePhase {
    Initial = "initial",
    Playing = "playing",
    Finished = "finished"
}

export type State = {
    questionIndex?: number
    gameState?: 'initial' | 'playing' | 'finished'
    questions?: Question[]
    score?: number
    numberOfQuestions?: number
    frameSession?: FrameSession
}