"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { format, isToday, isYesterday } from "date-fns";
import { Button } from "@nextui-org/button";
import { PostDto } from "@/app/models/dtos";
import { Spinner } from "@nextui-org/spinner";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { AppError } from "@/app/store";
import { handleError } from "@/app/api/utils/errors";
import { Errors } from "./errors";

interface PostComponentProps {
  defaultDate: string;
}
interface Post {
  id: number;
  name: string;
  message: string;
  timestamp: string;
  timeZone: string;
}

export const Posts: React.FC<PostComponentProps> = ({ defaultDate }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFetchingPosts, setIsFetchingPosts] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(
    defaultDate ? new Date(defaultDate) : new Date()
  );
  const [errors, setErrors] = useState<AppError[]>([]);

  const handleGoBackOneDay = () => {
    const date = new Date(selectedDate);

    date.setDate(date.getDate() - 1);
    setSelectedDate(date);
  };

  const getDateLabel = () => {
    if (isToday(selectedDate)) {
      return "Today";
    } else if (isYesterday(selectedDate)) {
      return "Yesterday";
    }
    
    return format(selectedDate, "MMMM do");
  };

  const handleGoForwardOneDay = () => {
    const date = new Date(selectedDate);

    date.setDate(date.getDate() + 1);
    setSelectedDate(date);
  };

  useEffect(() => {
    setIsFetchingPosts(true);
    setPosts([]);
    fetch(`api/post?date=${format(selectedDate, "yyyy-MM-dd")}`)
      .then((response) => response.json())
      .then((postDtos: PostDto[]) => {
        setPosts(
          postDtos.map((dto: PostDto, index: number) => ({
            id: index,
            name: dto.name,
            message: dto.message,
            timestamp: dto.timestamp,
            timeZone: dto.timeZone,
          }))
        );
      })
      .catch((error) => {
        setErrors([handleError(400, error)]);
      })
      .finally(() => setIsFetchingPosts(false));
  }, [selectedDate]);

  return (
    <>
      <div className="flex justify-between w-full pb-[10px]">
        <Button
          className="flex justify-start"
          startContent={<FaArrowLeft />}
          onPress={handleGoBackOneDay}
        >
          Back one day
        </Button>
        <span>{getDateLabel()}</span>
        <Button
          className="flex justify-end"
          disabled={isToday(selectedDate)}
          endContent={<FaArrowRight />}
          onPress={handleGoForwardOneDay}
        >
          Forward one day
        </Button>
      </div>
      <Errors errors={errors} />
      <Table aria-label="Table of posts">
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Message</TableColumn>
          <TableColumn>Timestamp</TableColumn>
          <TableColumn>Origin</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={isFetchingPosts}
          loadingContent={<Spinner label="Loading..." />}
        >
          {posts.map((post: Post) => {
            return (
              <TableRow key={post.id}>
                <TableCell>{post.name}</TableCell>
                <TableCell>{post.message}</TableCell>
                <TableCell>{post.timestamp}</TableCell>
                <TableCell>{post.timeZone}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};
