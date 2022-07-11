import { Button } from "@mantine/core";
import Link from "next/link";
import React from "react";
import classes from "../styles/404.module.css";

const NotFoundPage = () => {
  return (
    <div className={classes.container}>
      <div className={classes.title}>404</div>
      <div className={classes.title2}>Oops!</div>
      <div className={classes.title3}>
        PAGE DOES NOT EXIST OR IS UNAVAILABLE
      </div>
      <Link href="/" passHref>
        <Button component="a">Go back home</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
