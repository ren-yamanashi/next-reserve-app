import React from "react";
import Top from "../components/templates/TopPage/topPage";
import { GetStaticProps } from "next";
import prisma from "../lib/prisma";

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({});
  return { props: { feed } };
};

const TopPage = () => {
  return (
    <>
      <Top />
    </>
  );
};
export default TopPage;
