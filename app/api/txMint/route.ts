import { NextRequest, NextResponse } from 'next/server';
import { encodeFunctionData } from 'viem';
import { baseSepolia } from 'viem/chains';
import abiJson from './GameSessionNft.sol/GameSessionNft.json'

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {

  const { getFrameMessage } = await import('@coinbase/onchainkit/frame');

  const body = await req.json();
  // Remember to replace 'NEYNAR_ONCHAIN_KIT' with your own Neynar API key
  const { isValid } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_API_DOCS' });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  const data = encodeFunctionData({
    abi: abiJson.abi,
    functionName: 'mint',
    args: ["0xA75b12AEE788814e3AdA413EB58b7a844f0D75A3", 'Coffee all day!'],
  });

  const txData = {
    chainId: `eip155:${baseSepolia.id}`,
    method: 'eth_sendTransaction',
    params: {
      data,
      to: "0x7D083167EFA0910B3dD327140cfd218397291356",
      // value: parseEther('0.00004').toString(), // 0.00004 ETH
    },
  };

  return NextResponse.json(txData);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
