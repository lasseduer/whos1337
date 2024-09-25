"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";

import { PostDto } from "@/app/models/dtos";

export const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("api/post")
      .then((response) => response.json())
      .then((postDtos) => {
        setPosts(postDtos);
      })
      .catch((error) => {
        console.error("Error fetching posts", error);
      });
  }, []);

  return (
    <Table aria-label="Table of posts">
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>MESSAGE</TableColumn>
        <TableColumn>TIMESTAMP</TableColumn>
      </TableHeader>
      <TableBody>
        {posts.map((post: PostDto) => {
          return (
            <TableRow key={post.id}>
              <TableCell>{post.name}</TableCell>
              <TableCell>{post.message}</TableCell>
              <TableCell>{post.timestamp}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
