import { ChevronDownIcon } from '@chakra-ui/icons'
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Heading,
  Image as CImage,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import axios from 'axios'
import type { NextPage } from 'next'
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { createRef, useEffect, useState } from 'react'
import type { Article } from '../../types/Article'

type CategoriesProps = {
  categories: CategoryProps[]
}

type ArticleProps = {
  article: Article
}

type ArticlesProps = {
  articles: Article[]
}

const Articles: React.FC<ArticlesProps> = ({ articles }): JSX.Element => {
  return (
    <Wrap>
      {articles.map((article, key) => {
        return (
          <WrapItem key={key}>
            <Article article={article} />
          </WrapItem>
        )
      })}
    </Wrap>
  )
}

const Categorize = async (category_id: string, item_id: string) => {
  const { status } = await axios.post('/api/category', { category_id, item_id })
}

const Article: React.FC<ArticleProps> = ({ article }) => {
  console.log(article)
  return (
    <Box border="1px" borderColor="gray.200" borderRadius="10px" maxW="200px">
      <Box bg="gray.400" w="200px" h="100px" display="flex" zIndex={2}>
        <ArticleMenu article={article} />
      </Box>
      <Text zIndex={1}>{article.tweet.substr(0, 30)}</Text>
      <Text zIndex={1}>{article.ai_summary}</Text>
    </Box>
  )
}

type CategoryMenuProps = {
  category_id: string
}

const ArticleMenu: React.FC<ArticleMenuProps> = ({ article }): JSX.Element => {
  const [categories, setCategories] = useState<CategoryProps[]>([])
  const user_id = localStorage.getItem('user_id')
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const categoryRef = createRef<HTMLInputElement>()
  const Airticle = article
  const [inputCategoryName, setInputCategoryName] = useState('')

  useEffect(() => {
    axios.get(`/api/category?user_id=${user_id}`).then((d) => {
      setCategories(d.data.body.category)
    })
  }, [user_id])

  return (
    <Menu>
      <MenuButton as={Button}>
        <ChevronDownIcon />
      </MenuButton>
      <MenuList>
        <MenuItem
          onClick={() => {
            //console.log(`要約作成画面に遷移 user_id='${user_id}'`)
            localStorage.setItem('article', JSON.stringify(article))
            router.push('/edit/summary')
          }}
        >
          要約作成
        </MenuItem>
        <Divider />
        <MenuGroup title="カテゴリ">
          {categories.map((d, i) => {
            return (
              <MenuItem
                key={i}
                onClick={async () => {
                  console.log(`categorize ${user_id} ${d.category_id}`)
                  const { data } = await axios.post('/api/item/categorize', {
                    user_id,
                    category_id: d.category_id,
                    item_id: article.item_id,
                  })
                  console.log(
                    `/api/item/categorize response '${data.body.status}'`
                  )
                }}
              >
                {d.category_name}
              </MenuItem>
            )
          })}
          <MenuItem onClick={onOpen}>カテゴリを追加する</MenuItem>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>新しいカテゴリ名</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Input
                  placeholder="新しいカテゴリ名"
                  ref={categoryRef}
                  onChange={(event: any) => {
                    setInputCategoryName(event.target.value)
                  }}
                />
              </ModalBody>

              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={() => {
                    if (categoryRef.current !== null) {
                      console.log(`${categoryRef.current.value}`)
                      axios.post(`/api/category`, {
                        user_id,
                        category_name: inputCategoryName,
                      })
                    } else {
                      console.log(`categoryRef.current is null`)
                    }
                    onClose()
                  }}
                >
                  追加
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </MenuGroup>
        <MenuItem
          color="red.400"
          border="2px"
          onClick={() => console.log(`delete user_id='${user_id}'`)}
        >
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({
  category_id,
}): JSX.Element => {
  const user_id = localStorage.getItem('user_id')

  return (
    <Menu>
      <MenuButton as={Button}>
        <ChevronDownIcon />
      </MenuButton>
      <MenuList>
        <MenuItem
          onClick={() =>
            console.log(`名前変更モーダルを表示 user_id='${user_id}'`)
          }
          as={Button}
        >
          名前を変える
        </MenuItem>
        <Divider />
        <MenuItem
          color="red.400"
          border="2px"
          as={Button}
          onClick={() =>
            console.log(
              `記事を削除 category_id='${category_id}' user_id='${user_id}'`
            )
          }
        >
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

type ArticleMenuProps = {
  article: Article
}

const ArticleHeader: React.FC<{ name: string }> = (props) => {
  const username = props.name

  const [profile_image_url, set_profile_image_url] = useState('')
  useEffect(() => {
    const url = localStorage.getItem('profile_image_url')
    if (url) {
      set_profile_image_url(url)
    }
  }, [])

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
              {profile_image_url !== '' ? (
                <Avatar name={username} src={profile_image_url} border="2px" />
              ) : (
                ''
              )}
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

const Categories: React.FC<CategoriesProps> = ({ categories }): JSX.Element => {
  return (
    <Wrap>
      {categories.map((category, key) => {
        return (
          <WrapItem key={key}>
            <Category
              category_id={category.category_id}
              category_name={category.category_name}
              length={length}
            />
          </WrapItem>
        )
      })}
    </Wrap>
  )
}

type CategoryProps = {
  category_id: string
  category_name: string
  length: Number
}

const Category: React.FC<CategoryProps> = ({
  category_id,
  category_name,
  length,
}): JSX.Element => {
  return (
    <Box border="1px" borderColor="gray.200" borderRadius="10px">
      <Box
        bg="gray.200"
        w="200px"
        h="200px"
        display="flex"
        justifyContent="end"
        color="black"
      >
        <CategoryMenu category_id={category_id} />
      </Box>
      <Text>{category_name}</Text>
      {/* <Text>スモアの数: {`${length}`}</Text> */}
      <Text>スモアの数: {`${Math.floor(Math.random() * 10)}`}</Text>
    </Box>
  )
}

const uid_key = 'user_id'
const username_key = 'name'
const at_twitter_id_key = 'username'

const Profile: NextPage = () => {
  const [articles, setArticles] = useState([])
  const [categories, setCategories] = useState([])
  const [username, setUsername] = useState('')
  const [id, setID] = useState('')
  const [user_id, setUserID] = useState('')
  const [profile_image_url, set_profile_image_url] = useState('')

  useEffect(() => {
    const uid = localStorage.getItem(uid_key)
    const name = localStorage.getItem(username_key)
    const id = localStorage.getItem(at_twitter_id_key)
    const url = localStorage.getItem('profile_image_url')
    if (url) {
      set_profile_image_url(url)
    }

    if (uid !== null) {
      setUserID(uid)
    } else {
      setUserID('')
    }
    if (name !== null) {
      setUsername(name)
    } else {
      setUsername('Account')
    }

    if (id !== null) {
      setID(id)
    } else {
      setID('@twitter_id')
    }
    axios.get(`/api/items?user_id=${uid}`).then((d) => {
      setArticles(d.data.body.items)
    })
    axios.get(`/api/category?user_id=${uid}`).then((d) => {
      setCategories(d.data.body.category)
    })
  }, [])

  return (
    <Container maxW="800px" centerContent>
      <ArticleHeader name={username} />
      <Box h={'10vh'}></Box>
      <Avatar size="2xl" name={username} src={profile_image_url} border="2px" />
      <Box h={'3vh'}></Box>
      <Heading textAlign={'center'}>{username}</Heading>
      <Box h={'1vh'}></Box>
      <Text>{id}</Text>
      <Box h={'2vh'}></Box>
      <Tabs align="center">
        <TabList>
          <Tab fontWeight={'bold'}>未分類ブックマーク</Tab>
          <Tab fontWeight={'bold'}>カテゴリ一覧</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Articles articles={articles} />
          </TabPanel>
          <TabPanel>
            <Categories categories={categories} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  )
}

export default Profile
