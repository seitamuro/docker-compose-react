import {
  Avatar,
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import axios from 'axios'
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

const SummaryCreate: React.FC<{
  AirticleName: string
  AirticleUrl: string
  UserName: string
  item_id: number
}> = (props): JSX.Element => {
  // const AirticleName = props.AirticleName
  // const AirticleUrl = props.AirticleUrl
  // const UserName = props.UserName
  const AirticleName = 'Reactで画像を表示する方法'
  const AirticleUrl = 'https://qiita.com/ytnd0928/items/22704b1c47c20e1bd83f'
  const UserNameString = localStorage.getItem('name')
  const item_id = props.item_id
  const [text, setText] = useState('')
  const router = useRouter()
  if (!UserNameString) {
    throw new Error('記事取得に失敗しました')
  }
  const UserName = UserNameString
  const handleChange = (e: any) => {
    setText(() => e.target.value)
  }
  const articleString = localStorage.getItem('article')
  if (!articleString) {
    throw new Error('記事取得に失敗しました')
  }
  const article = JSON.parse(articleString)
  console.log('article', article)

  return (
    <>
      <ArticleHeader name={UserName} />
      <Box h={'10vh'}></Box>
      <Center>
        <Stack display={'flex'}>
          <Box w={'70vw'}>
            <Heading size="md" color={'gray'}>
              要約作成
            </Heading>
            <Box h={'2vh'}></Box>
            <HStack>
              <Heading size="lg">{article.tweet}</Heading>
              <NextLink target="_blank" href={article.url} passHref>
                <Text>{article.url}</Text>
              </NextLink>
            </HStack>
            <Box h={'5vh'}></Box>

            <VStack>
              <Box w={'70vw'}>
                <Textarea
                  placeholder="要約 200字程度でまとめてみよう"
                  h={'30vh'}
                  value={text}
                  onChange={handleChange}
                />
              </Box>
              <Box>
                <Button
                  color={'white'}
                  bg={'#CEA618'}
                  px={'25px'}
                  borderRadius={'full'}
                  width={'150px'}
                  alignItems={'center'}
                  marginLeft={'auto'}
                  marginRight={'auto'}
                  onClick={async () => {
                    console.log(`read ${article.item_id} ${text}`)
                    const { data } = await axios.post('/api/item/read', {
                      item_id: article.item_id,
                      user_text: text,
                    })
                    console.log(
                      `/api/item/read response '${
                        JSON.parse(data.body).status
                      }'`
                    )
                    router.push('/profile')
                  }}
                >
                  作成
                </Button>
              </Box>
            </VStack>

            <Box h={'5vh'}></Box>
          </Box>
        </Stack>
      </Center>
    </>
  )
}
const ArticleHeader: React.FC<{ name: string }> = (props) => {
  const username = props.name
  return (
    <Box
      paddingTop={'5px'}
      h={'10vh'}
      position={'fixed'}
      bg={'white'}
      w={'100%'}
      zIndex={1}
    >
      <HStack justify={'space-between'}>
        <Box paddingLeft={'3vw'}>
          <HStack>
            <Image
              src="/images/IMG_0528.PNG"
              width={64}
              height={64}
              objectFit="contain"
              alt="My avatar"
            />
            <Text fontWeight={'bold'} fontSize={20} color={'gray'}>
              ホーム
            </Text>
          </HStack>
        </Box>
        <Box w={'60vw'}>
          <Input
            placeholder="自分のブックマークを検索"
            variant="filled"
            borderRadius={'full'}
          />
        </Box>
        <Box paddingRight={'15'}>
          <Menu>
            <MenuButton>
              <Avatar name={username} border="2px" />
            </MenuButton>
            <MenuList>
              <NextLink href="/profile" passHref>
                <MenuItem fontWeight={'bold'}>プロフィール</MenuItem>
              </NextLink>
              <NextLink href="/" passHref>
                <MenuItem fontWeight={'bold'} textColor={'red'}>
                  ログアウト
                </MenuItem>
              </NextLink>
            </MenuList>
          </Menu>
        </Box>
      </HStack>
    </Box>
  )
}

export default SummaryCreate
