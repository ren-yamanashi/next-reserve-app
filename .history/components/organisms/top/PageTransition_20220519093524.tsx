import * as React from "react";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import Title_15 from "../../atoms/Text/Title_15";
import { blue } from "@mui/material/colors";
import CardMedia from "@mui/material/CardMedia";
import manager from "../../../public/manager.jpg";
import customer from "../../../public/customer.jpg";
import staffs from "../../../public/staffs.jpg";
import Router from "next/router";

const PageTransition = () => {
  const pageIntroArr = [
    {
      title: "店舗管理者サイト",
      text: "全ての予約操作、シフト管理、スタッフ情報の閲覧が可能。",
      src: manager.src,
      alt: "manager",
      link: "/testCompany/home",
    },
    {
      title: "スタッフサイト",
      text: "自身のシフト登録、出勤管理、予約登録が可能。",
      src: staffs.src,
      alt: "staffs",
      link: "/",
    },
    {
      title: "お客さまサイト",
      text: "予約の手軽さを重視し、ログインをせずに予約登録が可能。",
      src: customer.src,
      alt: "customer",
      link: "/testCompany/reserver",
    },
  ];
  return (
    <>
      <a id="transition">
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <Title_15
            fontSize={30}
            color={blue[500]}
            fontWeight={600}
            textTitle={"3つのユーザータイプ"}
            style={{
              mb: 2,
              my: "auto",
            }}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
          <Title_15
            fontSize={15}
            color={blue[500]}
            fontWeight={600}
            textTitle={
              <>
                店舗管理者サイト・スタッフサイト・お客さまサイト、それぞれで操作方法や特徴が異なります
                <br />
                ※クリックして試見できます
              </>
            }
            style={{
              mb: 2,
              my: "auto",
              textAlign: "center",
            }}
          />
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", p: 3 }}>
          {pageIntroArr.map((index) => (
            <>
              <Box
                sx={{
                  my: 3,
                  display: "flex",
                  justifyContent: "center",
                  mx: "auto",
                  cursor: "pointer",
                }}
                onClick={() => Router.push(index.link)}
              >
                <Grid item xs={6} sm={4} lg={4} md={5}>
                  <Box mb={3} display="flex" justifyContent="center" mx="auto">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        flexDirection: "column",
                        my: "auto",
                      }}
                    >
                      <CardMedia
                        component="img"
                        sx={{
                          width: 220,
                          height: 140,
                          borderRadius: "10%",
                          justifyContent: "center",
                          textAlign: "center",
                          alignItems: "center",
                        }}
                        src={index.src}
                        alt={index.alt}
                      />
                      <Title_15
                        fontSize={20}
                        color={blue[500]}
                        fontWeight={600}
                        textTitle={index.title}
                        style={{
                          mb: 1,
                          mt: 1,
                        }}
                      />
                      <Title_15
                        fontSize={15}
                        color={blue[500]}
                        fontWeight={600}
                        textTitle={index.text}
                        style={{
                          mb: 1,
                        }}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Box>
            </>
          ))}
        </Box>
      </a>
    </>
  );
};
export default PageTransition;
