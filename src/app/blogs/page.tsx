import React from 'react';
import notion from '@/lib/notion';
import BlogsPage from '@/components/pageComponents/blogs/blogsPage';

async function getData() {
  const posts = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });

  return posts.results;
}

const Blogs = async () => {
  const data = await getData();
  return <BlogsPage data={data} />;
};

export default Blogs;
