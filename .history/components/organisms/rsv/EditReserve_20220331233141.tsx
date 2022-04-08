//外部インポート
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  runTransaction,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useState, useEffect, FormEvent } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { createMedia } from "@artsy/fresnel";
import { blue, grey, teal } from "@mui/material/colors";
//内部インポート
import { useAuth } from "../../../hooks/useUserAuth";
import { FreeList } from "../../../models/FreeList";
import { useEditReserves_queryId } from "../../../hooks/student/useReserves";

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    sm: 0,
    md: 600,
    lg: 990,
    xl: 1200,
  },
});

//queryの方を準備
type Query = {
  id: string;
};
//Itemのスタイル
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  backgroundColor: "#FFFFDD",
}));
const Item2 = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
/**===============
 * @returns 予約編集画面の作成　キャンセル・生徒名/コースの変更が可能
 *===============*/
export default function EditReserve() {
  const router = useRouter();
  const db = getFirestore();
  const query_ = router.query as Query;
  const [reserves, setReserves] = useState<FreeList>();
  const { editRsv, loadReserves_queryId } = useEditReserves_queryId();
  //フォームの入力内容をステートに保管
  const { user } = useAuth();
  const [student, setStudent] = useState("");
  const [course, setCourse] = useState("");
  const [err, setErr] = useState<boolean>(false);
  //collection設定
  function getCollections() {
    const db = getFirestore();
    return {
      db,
      reserveCollection: collection(db, "FreeSpace"),
    };
  }
  /**================
   * Firebaseからシフトを取り出す
   *===============*/
  async function loadReserve() {
    if (query_.id === undefined) {
      return;
    }
    const { reserveCollection } = getCollections();
    const reserveDoc = await getDoc(doc(reserveCollection, query_.id)); //idを取り出す
    if (!reserveDoc.exists()) {
      return;
    }
    const gotReserve = reserveDoc.data() as FreeList;
    gotReserve.id = reserveDoc.id;
    setReserves(gotReserve);
  }
  /**=======
   * キャンセル処理
   *======*/
  const deleteRsv = async (id: string, e: any) => {
    e.stopPropagation();
    await updateDoc(doc(db, "FreeSpace", id), {
      reserved: false,
      student: "",
      reserverUid: "",
    }).then(() => router.back());
    toast.success("キャンセルしました", {
      position: "bottom-left",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  /**==========
   * 予約更新
   *==========*/
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { db, reserveCollection } = getCollections();
    try {
      await runTransaction(db, async (t: any) => {
        t.update(doc(reserveCollection, editRsv.id), {
          student,
          course,
          reserved: true,
        });
      });
      setStudent("");
      setCourse("");
      toast.success("更新しました", {
        position: "bottom-left",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log(error);
      setErr(true);
    }
  }
  useEffect(() => {
    loadReserves_queryId(query_.id);
  }, [query_.id]);
  return (
    <>
      <React.Fragment>
        <MediaContextProvider>
          <CardContent
            style={{
              width: "95%",
              borderRadius: "7px",
              borderWidth: "2px",
              borderStyle: "solid",
              borderColor: "#4689FF",
              margin: "auto",
            }}
          >
            <Media greaterThan="sm">
              <Typography sx={{ fontSize: 20 }} color={blue[500]}>
                予約情報
              </Typography>
              <Box
                sx={{ flexGrow: 1 }}
                component="form"
                noValidate
                onSubmit={onSubmit}
              >
                {editRsv && editRsv && (
                  <Grid container spacing={2} margin="0 auto">
                    <Grid item xs={11} md={11} mt={4}>
                      <Item>
                        <Box display="flex">
                          <Grid item xs={10} md={11} my="auto">
                            <Typography
                              variant="h5"
                              component="div"
                              ml={5}
                              color="black"
                              textAlign="left"
                              fontSize={17}
                            >
                              予約者名
                            </Typography>
                          </Grid>
                          <Grid item xs={10} md={20} textAlign="left">
                            <Typography variant="h5" component="div">
                              {editRsv.student}
                            </Typography>
                          </Grid>
                        </Box>
                      </Item>
                    </Grid>
                    <Grid item xs={11} md={11}>
                      <Item2>
                        <Box display="flex">
                          <Grid item xs={10} md={11} my="auto">
                            <Typography
                              variant="h5"
                              component="div"
                              ml={5}
                              color="black"
                              textAlign="left"
                              fontSize={17}
                            >
                              担当者名
                            </Typography>
                          </Grid>
                          <Grid item xs={10} md={20} textAlign="left">
                            <Typography variant="h5" component="div">
                              {editRsv.teacher}
                            </Typography>
                          </Grid>
                        </Box>
                      </Item2>
                    </Grid>
                    <Grid item xs={11} md={11}>
                      <Item>
                        <Box display="flex">
                          <Grid item xs={10} md={11} my="auto">
                            <Typography
                              variant="h5"
                              component="div"
                              ml={5}
                              color="black"
                              textAlign="left"
                              fontSize={17}
                            >
                              予約日
                            </Typography>
                          </Grid>
                          <Grid item xs={10} md={20} textAlign="left">
                            <Typography variant="h5" component="div">
                              {dayjs(editRsv.date.toDate()).format(
                                "YYYY/MM/DD "
                              )}
                            </Typography>
                          </Grid>
                        </Box>
                      </Item>
                    </Grid>
                    <Grid item xs={11} md={11}>
                      <Item2>
                        <Box display="flex">
                          <Grid item xs={10} md={11} my="auto">
                            <Typography
                              variant="h5"
                              component="div"
                              ml={5}
                              color="black"
                              fontSize={17}
                              textAlign="left"
                            >
                              予約時間
                            </Typography>
                          </Grid>
                          <Grid item xs={10} md={20} textAlign="left">
                            <Typography variant="h5" component="div">
                              {`${editRsv.time}:00`}
                            </Typography>
                          </Grid>
                        </Box>
                      </Item2>
                    </Grid>
                    <Grid item xs={11} md={11}>
                      <Item>
                        <Box display="flex">
                          <Grid item xs={10} md={11} my="auto">
                            <Typography
                              variant="h5"
                              component="div"
                              ml={5}
                              color="black"
                              fontSize={17}
                              textAlign="left"
                            >
                              予約受付日時
                            </Typography>
                          </Grid>
                          <Grid item xs={10} md={20} textAlign="left">
                            <Typography variant="h5" component="div">
                              {dayjs(editRsv.createAt.toDate()).format(
                                "YYYY/MM/DD HH:mm"
                              )}
                            </Typography>
                          </Grid>
                        </Box>
                      </Item>
                    </Grid>
                  </Grid>
                )}
              </Box>
              <Box display="flex">
                <Box width="10vw" mt={5} ml={5}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      bgcolor: teal[400],
                      "&:hover": { bgcolor: teal[300] },
                    }}
                  >
                    更新
                  </Button>
                </Box>
                <Grid item xs={20} md={3} lg={3}>
                  <Box mt={5} ml={5}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{
                        maxWidth: 120,
                        mt: 3,
                        mb: 2,
                        bgcolor: grey[500],
                        "&:hover": { bgcolor: grey[400] },
                      }}
                      onClick={(e) => deleteRsv(editRsv.id, e)}
                    >
                      キャンセル
                    </Button>
                  </Box>
                </Grid>
              </Box>
            </Media>
            {/* スマホレスポンシブ */}
            <Media at="sm">
              <Box
                sx={{ flexGrow: 1 }}
                component="form"
                noValidate
                onSubmit={onSubmit}
              >
                <Typography
                  sx={{ fontSize: 20 }}
                  color={blue[500]}
                  gutterBottom
                >
                  予約情報
                </Typography>
                {editRsv && (
                  <Grid container spacing={2} margin="0 auto">
                    <Grid item xs={11} md={11}>
                      <Item>
                        <Box display="flex">
                          <Grid item xs={10} md={11} my="auto">
                            <Typography
                              variant="h5"
                              component="div"
                              ml={5}
                              textAlign="left"
                              fontSize={12}
                            >
                              生徒名
                            </Typography>
                          </Grid>
                          <Grid item xs={10} md={20} textAlign="left">
                            <Typography
                              variant="h6"
                              component="div"
                              fontSize={13}
                              color="black"
                            >
                              {editRsv.student}
                            </Typography>
                          </Grid>
                        </Box>
                      </Item>
                    </Grid>
                    <Grid item xs={11} md={11}>
                      <Item2>
                        <Box display="flex">
                          <Grid item xs={10} md={11} my="auto">
                            <Typography
                              variant="h5"
                              component="div"
                              ml={5}
                              textAlign="left"
                              fontSize={12}
                            >
                              講師名
                            </Typography>
                          </Grid>
                          <Grid item xs={10} md={20} textAlign="left">
                            <Typography
                              variant="h6"
                              component="div"
                              fontSize={13}
                              color="black"
                            >
                              {editRsv.teacher}
                            </Typography>
                          </Grid>
                        </Box>
                      </Item2>
                    </Grid>
                    <Grid item xs={11} md={11}>
                      <Item>
                        <Box display="flex">
                          <Grid item xs={10} md={11} my="auto">
                            <Typography
                              variant="h5"
                              component="div"
                              ml={5}
                              textAlign="left"
                              fontSize={12}
                            >
                              予約日
                            </Typography>
                          </Grid>
                          <Grid item xs={10} md={20} textAlign="left">
                            <Typography
                              variant="h6"
                              component="div"
                              fontSize={13}
                              color="black"
                            >
                              {dayjs(editRsv.date.toDate()).format(
                                "YYYY/MM/DD "
                              )}
                            </Typography>
                          </Grid>
                        </Box>
                      </Item>
                    </Grid>
                    <Grid item xs={11} md={11}>
                      <Item2>
                        <Box display="flex">
                          <Grid item xs={10} md={11} my="auto">
                            <Typography
                              variant="h5"
                              component="div"
                              ml={5}
                              fontSize={12}
                              textAlign="left"
                            >
                              予約時間
                            </Typography>
                          </Grid>
                          <Grid item xs={10} md={20} textAlign="left">
                            <Typography
                              variant="h5"
                              component="div"
                              fontSize={13}
                              color="black"
                            >
                              {`${editRsv.time}:00`}
                            </Typography>
                          </Grid>
                        </Box>
                      </Item2>
                    </Grid>
                    <Grid item xs={11} md={11}>
                      <Item>
                        <Box display="flex">
                          <Grid item xs={10} md={11} my="auto">
                            <Typography
                              variant="h5"
                              component="div"
                              ml={5}
                              fontSize={12}
                              textAlign="left"
                            >
                              受付日時
                            </Typography>
                          </Grid>
                          <Grid item xs={10} md={20} textAlign="left">
                            <Typography
                              variant="h5"
                              component="div"
                              fontSize={13}
                              color="black"
                            >
                              {dayjs(editRsv.createAt.toDate()).format(
                                "YYYY/MM/DD HH:mm"
                              )}
                            </Typography>
                          </Grid>
                        </Box>
                      </Item>
                    </Grid>
                  </Grid>
                )}
              </Box>
              <Box display="flex">
                <Box width="10vw" ml={5}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      fontSize: 12,
                      bgcolor: teal[400],
                      "&:hover": { bgcolor: teal[300] },
                    }}
                  >
                    更新
                  </Button>
                </Box>
                <Grid item xs={20} md={3} lg={3}>
                  <Box ml={5}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{
                        maxWidth: 120,
                        fontSize: 12,
                        mt: 3,
                        mb: 2,
                        bgcolor: grey[500],
                        "&:hover": { bgcolor: grey[400] },
                      }}
                      onClick={(e) => deleteRsv(editRsv.id, e)}
                    >
                      キャンセル
                    </Button>
                  </Box>
                </Grid>
              </Box>
            </Media>
            {/* スマホレスポンシブ */}
          </CardContent>
          {err == true && (
            <Grid xs={12} sm={15}>
              <Alert
                variant="filled"
                severity="error"
                sx={{ m: 3, textAlign: "center" }}
              >
                エラー : もう1度やり直してください
              </Alert>
            </Grid>
          )}
        </MediaContextProvider>
      </React.Fragment>
      <ToastContainer />
    </>
  );
}
