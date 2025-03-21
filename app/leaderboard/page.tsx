"use client";

import { title } from "@/components/primitives";
import TableComponent from "@/components/table";
import { useEffect, useState } from "react";
import { PostLeaderboardDto } from "../models/dtos";
import { format } from "date-fns";
import { AppError } from "../store/store.model";
import { handleError } from "../api/utils/errors";
import { Errors } from "@/components/errors";

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
  const [errors, setErrors] = useState<AppError[]>([]);

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
      .catch((error: any) => {
        setErrors([handleError(400, error)])
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
        setErrors([handleError(400, error)])
      })
      .finally(() => setIsFetchingShamePosts(false));
  }, []);

  const columns = ["nickname", "message", "timestamp", "timeDifference"];

  return (
    <>
      <div className="flex justify-center pb-[30px]">
        <h1 className={title()}>1337erboard</h1>
      </div>
      
      <Errors errors={errors} />
      
      <TableComponent
        columns={columns}
        data={posts}
        loading={isFetchingPosts}
      />

      <br />
      <br />
      <div className="flex justify-center pb-[30px]">
        <h1 className={title()}>Board of shame</h1>
      </div>
      <TableComponent
        columns={columns}
        data={shamePosts}
        loading={isFetchingShamePosts}
      />
    </>
  );
};

export default LeaderboardPage;
