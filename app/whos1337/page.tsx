"use client";

import { title } from "@/components/primitives";
import { Posts } from "@/components/posts";

function Whos1337Page() {
  return (
    <>
      <h1 className={title()}>Who&apos;s 1337</h1>
      <Posts />
    </>
  );
}
export default Whos1337Page;
