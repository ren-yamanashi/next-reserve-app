import React from "react";
import { useRouter } from "next/router";
import { Box, Button, Heading, Text } from "@chakra-ui/react";

export type PostProps = {
  id: string;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  published: boolean;
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const router = useRouter();
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <>
      <Box sx={{ p: 5, rounded: "base", bgColor: "blue.100" }}>
        <Heading sx={{ fontSize: "20px" }}>{post.title}</Heading>
        <Text sx={{ fontSize: "15px" }}>Create By {authorName}</Text>
        <Text sx={{ fontSize: "15px" }}>{post.content}</Text>
      </Box>
    </>
  );
};

export default Post;
