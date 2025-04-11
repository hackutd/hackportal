import React from 'react';
import type { NextPage } from 'next';
import HackerpackDisplay from '@/components/hackerpack/HackerpackDisplay';
import hackerpackSettings from '@/components/hackerpack/hackerpack-settings.json';

const HackerpacksIndexPage: NextPage = () => {
  // Use type assertion to tell TypeScript this is the correct type
  const emptyContent = {
    block: {},
    collection: {},
    collection_view: {},
    notion_user: {},
    space: {},
  } as any; // Use 'as any' to bypass type checking

  return (
    <HackerpackDisplay content={emptyContent} notionRootId={hackerpackSettings.notionPageId} />
  );
};

export default HackerpacksIndexPage;
