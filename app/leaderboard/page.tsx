"use client";

import { title } from "@/components/primitives";
import TableComponent from "@/components/table";
import { useEffect, useState } from "react";
import { PostLeaderboardDto } from "../models/dtos";
import { format } from "date-fns";

interface Post {
  message: string;
  timestamp: string;
  timeDifference: string;
  nickname: string;
}

const LeaderboardPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFetchingPosts, setIsFetchingPosts] = useState(false);
  const [shamePosts, setShamePosts] = useState<Post[]>([]);
  const [isFetchingShamePosts, setIsFetchingShamePosts] = useState(false);

  useEffect(() => {
    setIsFetchingPosts(true);
    setPosts([]);
    fetch("api/leaderboard")
      .then((response) => response.json())
      .then((postDtos: PostLeaderboardDto[]) => {
        setPosts(
          postDtos.map((dto: PostLeaderboardDto, index: number) => ({
            id: index,
            message: dto.message,
            timestamp: format(dto.timestamp, "MMMM do"),
            timeDifference: dto.timeDifference,
            nickname: dto.nickname,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching leaderboard posts", error);
      })
      .finally(() => setIsFetchingPosts(false));
  }, []);

  useEffect(() => {
    setIsFetchingShamePosts(true);
    setShamePosts([]);
    fetch("api/shameboard")
      .then((response) => response.json())
      .then((postDtos: PostLeaderboardDto[]) => {
        setShamePosts(
          postDtos.map((dto: PostLeaderboardDto, index: number) => ({
            id: index,
            message: dto.message,
            timestamp: format(dto.timestamp, "MMMM do HH:mm:ss.SSS"),
            timeDifference: dto.timeDifference,
            nickname: dto.nickname,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching shameboard posts", error);
      })
      .finally(() => setIsFetchingShamePosts(false));
  }, []);

  const columns = ["nickname", "message", "timestamp", "timeDifference"];

  return (
    <>
      <div className="flex justify-center pb-[30px]">
        <h1 className={title()}>1337erboard</h1>
      </div>
      <TableComponent
        data={posts}
        columns={columns}
        loading={isFetchingPosts}
      />
      <br />
      <br />
      <div className="flex justify-center pb-[30px]">
        <h1 className={title()}>Board of shame</h1>
      </div>
      <TableComponent
        data={shamePosts}
        columns={columns}
        loading={isFetchingShamePosts}
      />
    </>
  );
};

export default LeaderboardPage;
