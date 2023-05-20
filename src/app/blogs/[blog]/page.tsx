import React from 'react';
import { notion } from '@/lib/notion';
import { NotionToMarkdown } from 'notion-to-md';
import ReactMarkdown from 'react-markdown';
import { NotionImage } from '@/components/sharedComponents/notionImage';

export const revalidate = 60;

export async function generateStaticParams() {
  const blogs = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });

  return blogs.results.map((blog: any) => ({
    blog: blog.properties.Slug.rich_text[0].plain_text,
  }));
}

async function getData(slug: any) {
  const post = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: 'Slug',
      formula: {
        string: {
          equals: slug,
        },
      },
    },
  });
  const n2m = new NotionToMarkdown({ notionClient: notion });
  const mdblocks = await n2m.pageToMarkdown(post.results[0].id);
  const blockManipulate = mdblocks.map((block) => {
    if (block.type === 'image') {
      return {
        ...block,
        parent: block.parent.replace(
          'GetObject',
          `GetObject&blockId=${block.blockId}`
        ),
      };
    } else {
      return block;
    }
  });

  const mdString = n2m.toMarkdownString(blockManipulate);
  return mdString;
}

const Blog = async ({ params }: { params: { blog: string } }) => {
  console.log(params);
  const data = await getData(params.blog);

  const MarkdownComponents: object = {
    p: (paragraph: { children?: boolean; node?: any }) => {
      const { node } = paragraph;
      if (node.children[0].tagName === 'img') {
        const image = node.children[0];
        const metastring = image.properties.alt;
        const alt = metastring?.replace(/ *\{[^)]*\} */g, '');
        const metaWidth = metastring.match(/{([^}]+)x/);
        const metaHeight = metastring.match(/x([^}]+)}/);
        const width = metaWidth ? metaWidth[1] : '768';
        const height = metaHeight ? metaHeight[1] : '432';

        return (
          <div
            style={{ height: height + 'px' }}
            className="my-[2rem] relative w-100 object-contain"
          >
            <NotionImage
              src={image.properties.src.replace(/(\?|&)blockId=[^&]+/g, '')}
              alt={alt}
              blockId={image.properties.src.match(/blockId=([^&]+)/)[1] ?? null}
            />
            {alt ? (
              <span className="caption" aria-label={alt}>
                {alt}
              </span>
            ) : null}
          </div>
        );
      }
      return <p>{paragraph.children}</p>;
    },
  };

  return (
    <div className="prose prose-invert prose-img:m-0 max-w-6xl mx-auto">
      <ReactMarkdown components={MarkdownComponents}>
        {data.parent}
      </ReactMarkdown>
    </div>
  );
};

export default Blog;
