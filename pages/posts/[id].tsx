import { useBreakpointValue, SlideFade, Icon, Box, Grid, GridItem, Wrap, WrapItem, Spinner } from '@chakra-ui/react'
import {MdCreate, MdUpdate, MdArrowRightAlt } from 'react-icons/md'
import AuthorBox from '../../components/common/AuthorBox'
import Layout from '../../components/layout'
import Block from '../../components/posts/Block'
import Date from '../../components/date'
import Head from 'next/head'
import {v4 as uuidv4} from 'uuid'

import * as NotionBlock from '../../entities/notion/blocks'
import Tag from '../../components/posts/Tag'
import * as NotionPageType from '../../interfaces/NotionPageApiResponses';

import FrontendNotion from '../../lib/frontend/notions'
import BackendNotion from '../../lib/backend/notions'
// import { getTagIcon } from '../../lib/backend/icons'

import useLocation from '../../components/hooks/useLocation'

import { InferGetStaticPropsType, GetStaticPaths } from 'next'

import {
  TwitterIcon,
  TwitterShareButton,
  LineShareButton,
  LineIcon,
  HatenaShareButton,
  HatenaIcon,
  FacebookIcon,
  FacebookShareButton
} from "react-share"

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const PostTitle = ({tags, post, titleBlock}: {tags: any[], post: NotionPageType.IPageHead, titleBlock: NotionBlock.Heading1}) => {
  const url = useLocation()
  // console.log(url.href)

  return (
    <>
      <Block entity={titleBlock}/>
      <Wrap>
        {tags.map((tag) => (
          <WrapItem key={uuidv4()}>
            <Tag entity={tag} />
          </WrapItem>
        ))}
      </Wrap>
      <Box fontSize='sm' textAlign={['right']}>
        <Wrap justify='right'>
          <WrapItem>
            <Icon as={MdCreate} />
            <Date dateString={post.createdAt}/>
          </WrapItem>
          <WrapItem>
            <Icon as={MdArrowRightAlt} />
          </WrapItem>
          <WrapItem>
            <Icon as={MdUpdate} />
            <Date dateString={post.updatedAt}/>
          </WrapItem>
        </Wrap>
        <Wrap justify='right'>
          <WrapItem>
            <TwitterShareButton url={url.href} title={post.title}>
              <TwitterIcon size={32} round={true}/>
            </TwitterShareButton>
          </WrapItem>
          <WrapItem>
            <LineShareButton url={url.href} title={post.title}>
              <LineIcon size={32} round={true}/>
            </LineShareButton>
          </WrapItem>
          <WrapItem>
            <HatenaShareButton url={url.href} title={post.title}>
              <HatenaIcon size={32} round={true}/>
            </HatenaShareButton>
          </WrapItem>
          <WrapItem>
            <FacebookShareButton url={url.href} title={post.title}>
              <FacebookIcon size={32} round={true}/>
            </FacebookShareButton>
          </WrapItem>
        </Wrap>
      </Box>
    </>
  )
}

const LeftSideArea = ({tags, post, titleBlock, isSideColumn}: {tags: any[], post: NotionPageType.IPageHead, titleBlock: NotionBlock.Heading1, isSideColumn: boolean}) => {

  return (
    <>
      <PostTitle tags={tags} post={post} titleBlock={titleBlock} />
    </>
  )
}

const RightSideArea = () => {
  return (
    <></>
  )
}

const MainArea = ({post, postBlockList, titleBlock}: {post: NotionPageType.IPageHead, postBlockList: NotionBlock.BlockList, titleBlock: NotionBlock.Heading1}) => {
  return (
    <Box as='article'>
      {postBlockList.data.map((block: NotionBlock.Block) =>
        <Block
          key = {uuidv4()}
          entity={block} />
      )}
    </Box>
  )
}

export default function Post({tags, post, pageJson, postBlockJson}: Props) {
  const postBlockList = NotionBlock.BlockList.deserialize(postBlockJson.results)
  const titleBlock: NotionBlock.Heading1 = FrontendNotion.convertPageResponseToNotionHeading1Block(pageJson)
  const postHead: NotionPageType.IPageHead = post

  return (
    <Layout
      leftside={
        <SlideFade in={true} offsetY='20px'>
          <LeftSideArea tags={tags} post={postHead} titleBlock={titleBlock} isSideColumn={true}/>
        </SlideFade>
      }
    >
      <Head>
        <title>{post.title}</title>
      </Head>
      <SlideFade in={true} offsetY='20px'>
        <article>
          <MainArea post={postHead} postBlockList={postBlockList} titleBlock={titleBlock}/>
        </article>
      </SlideFade>
      <AuthorBox />
    </Layout>
  )
}

// server側で呼ばれる
export const getStaticPaths: GetStaticPaths = async () => {
  const token: string = process.env.NOTION_TOKEN;
  const databaseId: string = process.env.NOTION_BLOG_DATABASE;
  const notion = new BackendNotion(token, databaseId);
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
  const token: string = process.env.NOTION_TOKEN;
  const databaseId: string = process.env.NOTION_BLOG_DATABASE;
  const notion: BackendNotion = new BackendNotion(token, databaseId);
  const postId: string = await notion.getPostIdBySlug(slug);

  const [post, pageJson]: [NotionPageType.IPageHead, any] = await notion.getPostById(postId);

  // const tagsWithIcon = post.tags.map((tag) => getTagIcon(tag))
  const tagsWithIcon = post.tags
  // console.log("withIcon: " + JSON.stringify(tagsWithIcon))

  const postBlockList = await notion.getPostBlockListById(postId);
  const postBlockListWithOGP = await BackendNotion.setOGPToBookmarkBlocks(postBlockList)

  // console.log(JSON.stringify(postBlockListWithOGP, null, " "))

  return {
    props: {
      tags: tagsWithIcon,
      post: post,
      pageJson: pageJson,
      postBlockJson: postBlockListWithOGP,
    },
    revalidate: 1 * 60
  }
}
