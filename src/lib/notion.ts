const { Client } = require('@notionhq/client');

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const getChangelogImageSrc = async (blockId: string) => {
  const supportedBlockType = 'image';
  const block = await notion.blocks.retrieve({ block_id: blockId });

  if (block.type !== supportedBlockType) {
    throw new Error('Block is not an image');
  }

  const image = block[supportedBlockType] as any;

  if (image.type === 'external') {
    return image.external.url;
  }

  return image.file.url;
};
