/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';

const BlogsPage = ({ data }: any) => {
  return (
    <div className="max-w-6xl mx-auto my-10">
      <h1 className="text-4xl font-bold mb-8">List Menu</h1>
      <div className="w-full grid grid-cols-3 gap-x-8">
        {data.map((item: any) => (
          <div key={item.id} className="w-full">
            <a
              href={'/blogs/' + item.properties.Slug.rich_text[0].plain_text}
              className="block h-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <img
                alt=""
                className="w-full h-[200px] object-cover mb-3 rounded"
                src={item.properties.Header.files[0].external.url}
              />
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {item.properties.Name.title[0].plain_text}
              </h5>
              <div>
                {item.properties.Tags.multi_select.map((item: any) => (
                  <span
                    className={`${
                      item.name === 'Haram' ? 'bg-red-500' : 'bg-green-500'
                    } px-3 py-1 text-xs rounded`}
                    key={item.id}
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogsPage;
