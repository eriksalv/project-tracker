import { Box, Button, Text } from "@mantine/core";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        marginTop: "-16px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1920px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "4rem",
          background:
            "linear-gradient(90deg, rgba(31,25,140,1) 0%, rgba(78,13,85,1) 34%, rgba(173,26,64,1) 58%, rgba(140,25,124,1) 83%)",
          backgroundSize: "cover",
          backgroundPosition: "top",
          clipPath: "polygon(50% 0%,100% 0%,100% 90%,50% 100%,0% 90%,0% 0%);",
        }}
      >
        {/* <Box
          sx={{
            position: "absolute",
            inset: 0,
            clipPath: "polygon(0 0,100% 0,100% 75vh,0 100%)",
          }}
        >
          <Image
            src="/minimalist.jpg"
            alt="minimalist image"
            quality={100}
            objectFit="cover"
            layout="fill"
            priority
          />
        </Box> */}
        <Box
          sx={{
            padding: "2rem",
            border: "7px solid white",
            maxWidth: "30rem",
            zIndex: 10,
            background: "rgba(15,15,15,0.5)",
          }}
        >
          <Text weight="bold" color="white" sx={{ fontSize: "3rem" }}>
            Project Tracker
          </Text>
          <Text size="lg" color="white" sx={{ fontSize: "1.5rem" }}>
            The definitive tool for project management
          </Text>
          <Link href="/register" passHref>
            <Button component="a" sx={{ maxWidth: "10rem", marginTop: "1rem" }}>
              Get started
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
