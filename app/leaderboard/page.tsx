"use client";

import { title } from "@/components/primitives";
import TableComponent from "@/components/table";
import { useEffect, useState } from "react";
import { PostLeaderboardDto } from "../models/dtos";

interface Post {
  message: string;
  timestamp: string;
  timeDifference: string;
  nickname: string;
}

const LeaderboardPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFetchingPosts, setIsFetchingPosts] = useState(false);

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
            timestamp: dto.timestamp,
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

  const columns = ["nickname", "message", "timestamp", "timeDifference"];

  return (
    <>
      <div className="flex justify-center pb-[30px]">
        <h1 className={title()}>1337erboard</h1>
      </div>
      <TableComponent data={posts} columns={columns} loading={isFetchingPosts} />
    </>
  );
};

export default LeaderboardPage;
