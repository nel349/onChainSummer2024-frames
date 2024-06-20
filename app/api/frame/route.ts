import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import { GamePhase } from '../..';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_API_DOCS' });

  // const text = message.input || '';
  let state = {
    question: 0,
  };
  try {
    state = JSON.parse(decodeURIComponent(message.state?.serialized));
  } catch (e) {
    console.error(e);
  }

  const {searchParams} = new URL(req.url);
  const frameId = searchParams.get("frameId") as string;
  const gamePhase = searchParams.get("gamePhase") as string;

  // console.log('message', message);
  console.log('frameId:', frameId);
  console.log('gamePhase:', gamePhase);
  // console.log('isValid', isValid);

  const startImageUrl = `${NEXT_PUBLIC_URL}/api/images/start`
  const nextQuestionImageUrl = `${NEXT_PUBLIC_URL}/api/images/next-question?frameId=${frameId}&page=${state.question}`

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }



  /**
   * Use this code to redirect to a different page
   */
  if (message?.button === 3) {
    return NextResponse.redirect(
      'https://www.google.com/search?q=cute+dog+pictures&tbm=isch&source=lnms',
      { status: 302 },
    );
  }

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `State question: ${state?.question || 0}`,
        },
        {
          label: 'Start Game',
        },
        {
          action: 'post_redirect',
          label: 'Dog pictures',
        },
      ],
      image: {
        src: gamePhase === GamePhase.Initial ? startImageUrl : nextQuestionImageUrl,
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
      state: {
        page: state?.question + 1,
        time: new Date().toISOString(),
      },
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
