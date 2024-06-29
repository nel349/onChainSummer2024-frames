import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import { GamePhase } from '../..';
import { getFrameSession, getQuestions } from '../../mongo/frame-session';
import { Question } from '../../game-domain/question';

async function getResponse(req: NextRequest): Promise<NextResponse> {

  const { getFrameMessage, getFrameHtmlResponse } = await import('@coinbase/onchainkit/frame');
  const body = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_API_DOCS' });

  // const text = message.input || '';
  let state: { question: number; savedResponses: string[] } = {
    question: 0,
    savedResponses: [],
  };
  try {
    state = JSON.parse(decodeURIComponent(message.state?.serialized));

  } catch (e) {
    console.error(e);
  }

  const { searchParams } = new URL(req.url);
  const frameId = searchParams.get("frameId") as string;
  const gamePhase = searchParams.get("gamePhase") as string;
  const previousResponseIndex = searchParams.get("previousResponse")
  const action = searchParams.get("action")
  const { numberOfQuestions } = await getFrameSession(frameId);
  const frameSession = await getFrameSession(frameId);
  const questions = await getQuestions(frameSession.metaphor_id);
  console.log('questions', questions);

  // console.log('message', message);
  // console.log('frameId:', frameId);
  // console.log('gamePhase:', gamePhase);
  // console.log('isValid', isValid);



  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }
  const isPlaying = gamePhase === GamePhase.Playing;
  // Update the state with the pressed button
  if (isPlaying && previousResponseIndex && action === 'next') {

    console.log('previousResponseIndex: ', previousResponseIndex);
    // state.question is the current question number
    // previousResponseIndex is the index of the pressed option
    // we need to get the option from the previous question
    state.savedResponses.push(questions[state.question-1].options[parseInt(previousResponseIndex)]);

    // print the state
    console.log('state', state);
    console.log('message.button: ', message.button);
  }

  const startImageUrl = `${NEXT_PUBLIC_URL}/api/images/start`
  const nextQuestionImageUrl = `${NEXT_PUBLIC_URL}/api/images/next-question?frameId=${frameId}&page=${state.question}`
  const score = calculateScore(state.savedResponses, questions, numberOfQuestions)
  const finishedImageUrl = `${NEXT_PUBLIC_URL}/api/images/finished?frameId=${frameId}&score=${score}`

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        // we are going to add the question button options (A: blabhb, B: blahblahblah ...)
        ...(gamePhase === GamePhase.Playing && state.question < numberOfQuestions
          ? questions[state.question].options.map((option, index) => {
            // console.log('option: ', option);
            // console.log('index: ', index);
            return ({
            label: `${String.fromCharCode(65 + index)}: ${option}`,
            action: 'post',
            target: `${NEXT_PUBLIC_URL}/api/frame?frameId=${frameId}&gamePhase=${GamePhase.Playing}&previousResponse=${index}&action=next`,
          })})
          : []),

        gamePhase === GamePhase.Playing && state.question < numberOfQuestions && {
          label: `Next`,
          action: 'post',
          target: `${NEXT_PUBLIC_URL}/api/frame?frameId=${frameId}&gamePhase=${gamePhase}`,
        },
        gamePhase === GamePhase.Initial && {
          label: 'Start Game',
          action: 'post',
          target: `${NEXT_PUBLIC_URL}/api/frame?frameId=${frameId}&gamePhase=${GamePhase.Playing}`,
        },
        gamePhase === GamePhase.Playing && state.question >= numberOfQuestions && {
          label: 'Submit Score',
          action: 'tx',
          target: `${NEXT_PUBLIC_URL}/api/txJoinGame?frameId=${frameId}&score=${score}`,
          postUrl: `${NEXT_PUBLIC_URL}/api/tx-success`,
        },
        gamePhase === GamePhase.Finished && {
          action: 'tx',
          label: 'Submit Score',
          target: `${NEXT_PUBLIC_URL}/api/txMint`,
          postUrl: `${NEXT_PUBLIC_URL}/api/tx-success`,
        },
      ].filter(Boolean),
      image: {
        src: gamePhase === GamePhase.Initial ? startImageUrl :
        gamePhase === GamePhase.Playing && state.question >= numberOfQuestions ? finishedImageUrl : nextQuestionImageUrl
      },
      state: {
        question: isPlaying ? state?.question + 1 : state?.question,
        savedResponses: state.savedResponses,
      },
    }),
  );
}

const calculateScore = (savedResponses: string[], questions: Question[], numberOfQuestions: number) => {

  // calculate the score

  // create an array with only the answers.
  const answers = questions.map(
    (question) => question.answer
  )

  // compare the answers with the savedResponses
  const correctAnswers = answers.filter(
    (answer, index) => answer === savedResponses[index]
  )

  return correctAnswers.length / numberOfQuestions * 100;  
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
