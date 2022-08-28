import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import * as React from "react";
import Link from "next/link";
import Typography from "@mui/material/Typography";

const SampleSing = () => {
  return (
    <Box textAlign="center" mt={1}>
      <Typography fontWeight={"bold"}>
        アプリを試し見する
      </Typography>
      <Box display="flex" justifyContent={"center"}>
      <Button>
          <Link href={"/sample/store/"}>管理者サイト</Link>
        </Button>
        <Button>
          <Link href={"/sample/staff/"}>スタッフサイト</Link>
        </Button>
        <Button>
          <Link href={"/testCompany/reserver"}>お客さまサイト</Link>
        </Button>
        </Box>
    </Box>
  );
};

export default SampleSing;
