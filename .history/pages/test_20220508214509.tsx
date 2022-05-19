import React from "react";
import prisma from "../lib/prisma";
import { GetStaticProps } from "next";
import Post, { PostProps } from "../components/Post";
import { Box, Heading, VStack, Wrap, WrapItem } from "@chakra-ui/react";

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.todo.findMany({
    where: { published: true },
  });
  return { props: { feed } };
};

type Props = {
  feed: PostProps[];
};

const Blog: React.FC<Props> = (props) => {
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
          Public Posts
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
