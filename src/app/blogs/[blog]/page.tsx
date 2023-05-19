import React from 'react';
import notion from '@/lib/notion';
import { NotionToMarkdown } from 'notion-to-md';
import ReactMarkdown from 'react-markdown';

async function getData(context: any) {
  const slug = context.params.blog;
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
  const mdString = n2m.toMarkdownString(mdblocks);
  return mdString;
}

const Blog = async (context: any) => {
  const data = await getData(context);
  return (
    <div className="prose prose-invert max-w-6xl mx-auto">
      <ReactMarkdown>{data.parent}</ReactMarkdown>
    </div>
  );
};

export default Blog;
