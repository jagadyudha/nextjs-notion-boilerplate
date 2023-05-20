import { NextApiHandler } from 'next';
import { getChangelogImageSrc } from '../../../lib/notion';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const blockId = searchParams.get('blockId');

  try {
    if (blockId == null) {
      return NextResponse.json({ message: 'Block ID is not defined' });
    }

    const imageSrc = await getChangelogImageSrc(blockId);
    return NextResponse.json({ imageSrc });
  } catch (e) {
    return NextResponse.json(
      { error: 'something went wrong' },
      { status: 500 }
    );
  }
}
