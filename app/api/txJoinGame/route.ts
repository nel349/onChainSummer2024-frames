import { NextRequest, NextResponse } from 'next/server';
import { encodeFunctionData } from 'viem';
import { baseSepolia } from 'viem/chains';
import abiJson from '../../abis/TriviaGameHub.sol/TriviaGameHub.json'
import { getFrameSession } from '../../mongo/frame-session';

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {

  const { getFrameMessage } = await import('@coinbase/onchainkit/frame');

  const { searchParams } = new URL(req.url);
  const frameId = searchParams.get("frameId") as string;
  const { game_id} = await getFrameSession(frameId);
  const score = searchParams.get("score") as string;

  const body = await req.json();
  // Remember to replace 'NEYNAR_ONCHAIN_KIT' with your own Neynar API key
  const { isValid } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_API_DOCS' });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  const data = encodeFunctionData({
    abi: abiJson.abi,
    functionName: 'joinGame',
    args: [parseInt(game_id), parseInt(score)],
  });

  const txData = {
    chainId: `eip155:${baseSepolia.id}`,
    method: 'eth_sendTransaction',
    params: {
      data,
      to: "0xB95B8d25E476EF1CA2B9D82ab5950a1E4c8059Af",
      // value: parseEther('0.00004').toString(), // 0.00004 ETH
    },
  };

  return NextResponse.json(txData);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
