import React from "react";
import { useRouter } from "next/router";
import { Box, Button, Heading, Text } from "@chakra-ui/react";

export type PostProps = {
  id: string;
  title: string;
  text: string;
  useName: string;
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const router = useRouter();
  return (
    <>
      <Box
        sx={{ p: 5, rounded: "base", bgColor: "blue.100" }}
        onClick={() => router.push("/post/[id]", `/post/${post.id}`)}
      >
        <Heading sx={{ fontSize: "20px" }}>{post.title}</Heading>
        <Text sx={{ fontSize: "15px" }}>Create By {post.useName}</Text>
        <Text sx={{ fontSize: "15px" }}>{post.text}</Text>
      </Box>
    </>
  );
};

export default Post;
