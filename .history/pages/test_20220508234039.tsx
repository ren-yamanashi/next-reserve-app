import React, { useState } from "react";
import prisma from "../lib/prisma";
import { GetStaticProps } from "next";
import Post, { PostProps } from "../components/Post";
import {
  Box,
  Heading,
  Wrap,
  WrapItem,
  VStack,
  Box,
  Button,
  Textarea,
  FormControl,
  FormLabel,
  Input,
  HStack,
  FormErrorMessage,
} from "@chakra-ui/react";
import Router from "next/router";

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany();
  return { props: { feed } };
};

type Props = {
  feed: PostProps[];
};
type Post = {
  title: string;
  content: string;
};

const Blog: React.FC<Props> = (props) => {
  const [post, setPost] = useState<Post>({
    title: "",
    content: "",
  });
  /** create Post */
  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });
      await Router.reload();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Box className="page">
        <Heading
          sx={{
            fontSize: "18px",
            m: 5,
            p: 3,
            bgColor: "green.300",
            textAlign: "center",
          }}
        >
          Prisma test
        </Heading>
        <Wrap spacing={"20px"} justify={"center"}>
          {props.feed.map((post) => (
            <WrapItem key={post.id}>
              <Post post={post} />
            </WrapItem>
          ))}
        </Wrap>
      </Box>
      <Box mt={5}>
        <FormControl isInvalid={!post.title}>
          <VStack spacing={5}>
            <FormLabel fontSize={30}>New Post</FormLabel>
            {post.title === "" && (
              <FormErrorMessage>Title is required</FormErrorMessage>
            )}
            <Input
              sx={{ maxWidth: 1000 }}
              id="title"
              type="text"
              autoFocus
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              placeholder="Title"
              value={post.title}
            />
            <Textarea
              sx={{ maxWidth: 1000 }}
              cols={50}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
              placeholder="Content"
              rows={8}
              value={post.content}
            />
            <HStack spacing={10}>
              <Button
                disabled={!post.content || !post.title}
                onClick={(e) => submitData(e)}
                sx={{
                  color: "white",
                  bgColor: "teal.400",
                  "&:hover": { bgColor: "teal.500" },
                }}
              >
                Create
              </Button>
              <Button
                className="back"
                onClick={() => Router.push("/")}
                sx={{
                  color: "white",
                  bgColor: "gray.500",
                  "&:hover": { bgColor: "gray.600" },
                }}
              >
                Cancel
              </Button>
            </HStack>
          </VStack>
        </FormControl>
      </Box>
    </>
  );
};

export default Blog;
