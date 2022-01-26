import React, { useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";

import { User } from "../../models/User";
import styles from "./Header.module.scss";

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [user, setUser] = useState<User>();
  const menuFunction = () => {
    setOpenMenu(!openMenu);
  };
  return (
    <React.Fragment>
      <header id="header" className={styles.header}>
        <div className={styles.logo}>
          <Link href="/user/login">
            <a className={styles.logo}>Home</a>
          </Link>
        </div>
        <nav>
          <ul>
            <li>
              <Link href={`/reserve/${user?.uid}`}>
                <a>固定予約一覧表</a>
              </Link>
            </li>
            <li>
              <Link href={`/user/login`}>
                <a>Home</a>
              </Link>
            </li>
          </ul>
        </nav>
        <div className={styles.container}>
          <div className={styles.humburger} onClick={() => menuFunction()}>
            <span className={openMenu ? styles.open : undefined}></span>
            <span className={openMenu ? styles.open : undefined}></span>
            <p className={openMenu ? styles.open : undefined}>Menu</p>
          </div>
        </div>
      </header>
      <div
        className={`${styles.drawerMenu} ${openMenu ? styles.open : undefined}`}
      >
        <ul>
          <div className={styles.close} onClick={() => menuFunction()}>
            <span></span>
            <span></span>
            <p>Close</p>
          </div>
          <li>
            <Link href="/user/login">
              <a>
                <p className={styles.mainTitle}>ログイン</p>
              </a>
            </Link>
          </li>
          <li>
            <Link href={`/reserve/${user?.uid}`}>
              <a>
                <p className={styles.mainTitle}>固定予約一覧表</p>
              </a>
            </Link>
          </li>
          <li>
            <Link href={`/user/login`}>
              <a>
                <p className={styles.mainTitle}>Home</p>
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
}