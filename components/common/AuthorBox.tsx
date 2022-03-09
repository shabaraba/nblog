import React from 'react'
import axios from 'axios'
import useSWRImmutable from 'swr/immutable'
import {Skeleton, Container, Box, Image, VStack, Tooltip, Icon, Text} from '@chakra-ui/react'
import Link from 'next/link'
import {SiGithub, SiTwitter, SiQiita} from 'react-icons/si'

export default () => {
  const fetcher = async (url:string) => {
    console.log('fetching... -> ' + url)
    const result = await axios.get(url)
    console.log('result... -> ' + JSON.stringify(result))
    return result.data
  }

  const { data: fetchedData } = useSWRImmutable('https://api.github.com/users/shabaraba', fetcher)
  if (!fetchedData) return <Skeleton />

  const avatarUrl = fetchedData.avatar_url
  const iconSize = 6
  return (
    <Container
      p={5}
    >
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
      >
        <Image
          borderRadius='full'
          boxSize='150px'
          alt='shabaraba'
          src={avatarUrl}
        />
        <VStack
          align='center'
          justify='center'
          ml={5}
        >
          <Tooltip hasArrow label='Github' placement='right-start'>
            <Link href="https://github.com/shabaraba">
              <Icon as={SiGithub} w={iconSize} h={iconSize}/>
            </Link>
          </Tooltip>
          <Tooltip hasArrow label='Twitter' placement='right-start'>
            <Link href="https://twitter.com/shaba_raba">
              <Icon as={SiTwitter} w={iconSize} h={iconSize}/>
            </Link>
          </Tooltip>
          <Tooltip hasArrow label='Qiita' placement='right-start'>
            <Link href="https://qiita.com/shabaraba">
              <Icon as={SiQiita} w={iconSize} h={iconSize}/>
            </Link>
          </Tooltip>
        </VStack>
      </Box>
      <Box
        p={5}
      >
        <Text fontSize='lg'>
          Author: しゃば
        </Text>
        <Text fontSize='xs'>
          ロボット好きのPHPエンジニア<br />
          自分でイジれるおもちゃを欲しがち<br />
          時間がなく3年ほど中断している工作機械自作の完成が夢<br />
        </Text>
      </Box>

    </Container>
  )
}

