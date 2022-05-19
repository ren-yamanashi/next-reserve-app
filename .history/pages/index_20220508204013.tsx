import React from "react";
import Top from "../components/templates/TopPage/topPage";

import prisma from "../lib/prisma";

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
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
