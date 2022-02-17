import { Box, Divider } from '@chakra-ui/react'
import Layout from '../../components/layout';
import Block from '../../components/posts/Block';
import Date from '../../components/date'
import Head from 'next/head';
import {v4 as uuidv4} from 'uuid';

import * as NotionBlock from '../../entities/notion/blocks';
import { NotionPostHead } from '../../entities/notion_entities'

import Notion from '../../lib/notions'
import { InferGetStaticPropsType, GetStaticPaths } from 'next'

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function Post({post, pageJson, postBlockJson}: Props) {
  const postBlockList = NotionBlock.BlockList.deserialize(postBlockJson.results)
  // console.log("---------------------------------------------[object]");
  // console.log(JSON.stringify(postBlockList, null, " "))
  // const titleBlock: NotionBlock.Heading1 = Notion.convertPageResponseToNotionHeading1Block(pageJson)
  // console.log(postBlockList)

  return (
    <Layout>
      <Head>
        <title>{post.title}</title>
      </Head>
      <article>
        <Box>
          <Box textAlign={['right']}>
            <Date dateString={post.updatedAt}/>
          </Box>
        </Box>
        <Divider />
        {postBlockList.data.map((block: NotionBlock.Block) =>
          <Block
            key = {uuidv4()}
            entity={block} />
        )}
      </article>
    </Layout>
  )
}

// server側で呼ばれる
export const getStaticPaths: GetStaticPaths = async () => {
  const token: string = process.env.NOTION_TOKEN;
  const databaseId: string = process.env.NOTION_BLOG_DATABASE;
  const notion = new Notion(token, databaseId);
  const allPostsData = await notion.getPostList();
  const pathList = allPostsData.map(post => {
    return {
      params: {id: post.slug}
    }
  });
  return {
    paths: pathList,
    fallback: false
  }
}

// server側で呼ばれる
export const getStaticProps = async ({params}) => {
  const slug = params.id;
  // console.log("START-------[id]");
  // console.log(params);
  // console.log(slug);
  const token: string = process.env.NOTION_TOKEN;
  const databaseId: string = process.env.NOTION_BLOG_DATABASE;
  const notion: Notion = new Notion(token, databaseId);
  const postId: string = await notion.getPostIdBySlug(slug);
  // console.log(postId);
  const [post, pageJson]: [NotionPostHead, any] = await notion.getPostById(postId);
  const postBlockList = await notion.getPostBlockListById(postId);
  const postBlockListWithOGP = await Notion.setOGPToBookmarkBlocks(postBlockList)
  // console.log("---------------------------------------------[id]");
  // console.log(JSON.stringify(postBlockListWithOGP, null, " "))
  // console.log("END---------[id]");

  return {
    props: {
      post: post,
      pageJson: pageJson,
      postBlockJson: postBlockListWithOGP,
    },
    revalidate: 1 * 60
  }
}
