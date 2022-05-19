import React from "react";
import ReactMarkdown from "react-markdown";
import Router from "next/router";
import { GetServerSideProps } from "next";
import { VStack, Heading, Text, Box, Button } from "@chakra-ui/react";
// import my File
import { PostProps } from "../../components/Post";
import prisma from "../../lib/prisma";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
  });
  return {
    props: post,
  };
};
// 削除
async function deletePost(id: string): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: "DELETE",
  });
  Router.push("/");
}

const Post: React.FC<PostProps> = (props) => {
  let title = props.title;
  let userName = props.useName;
  let text = props.text;
  return (
    <>
      <VStack spacing={"20px"} sx={{ mt: 5, mx: "auto" }}>
        <Heading sx={{ fontSize: "30px", justifyContent: "left" }}>
          Title : {title}
        </Heading>
        <Box sx={{ display: "flex", justifyContent: "left" }}>
          <Text sx={{ fontSize: "20px" }}>CreateUser : {userName}</Text>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "left" }}>
          <Text sx={{ fontSize: "20px" }}>{text}</Text>
        </Box>

        <Button
          onClick={() => deletePost(props.id)}
          sx={{
            color: "white",
            bgColor: "green.400",
            "&:hover": { bgColor: "green.500" },
          }}
        >
          Delete
        </Button>
      </VStack>
    </>
  );
};

export default Post;
