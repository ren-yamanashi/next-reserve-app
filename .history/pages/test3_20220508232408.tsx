// pages/create.tsx

import React, { useState } from "react";
import Router from "next/router";
import {
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

import { main } from "../prisma/seed";
type Post = {
  title: string;
  content: string;
};

const Draft: React.FC = () => {
  const [post, setPost] = useState<Post>({
    title: "",
    content: "",
  });

  return (
    <>
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

export default Draft;
