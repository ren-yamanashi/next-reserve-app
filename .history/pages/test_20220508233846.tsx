import React, { useState } from "react";
import prisma from "../lib/prisma";
import { GetStaticProps } from "next";
import Post, { PostProps } from "../components/Post";
import { Box, Heading, Wrap, WrapItem } from "@chakra-ui/react";

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

const submitData = async (e: React.SyntheticEvent) => {
  e.preventDefault();
  try {
    await fetch("/api/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    await Router.push("/test");
  } catch (error) {
    console.error(error);
  }
};

const Blog: React.FC<Props> = (props) => {
  const [post, setPost] = useState<Post>({
    title: "",
    content: "",
  });
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
    </>
  );
};

export default Blog;
