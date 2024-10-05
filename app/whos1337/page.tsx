"use client";

import { title } from "@/components/primitives";
import { Posts } from "@/components/posts";

function Whos1337Page() {
  return (
    <>
      <div className="flex justify-center pb-[30px]">
        <h1 className={title()}>Who&apos;s 1337</h1>
      </div>
      <Posts />
    </>
  );
}
export default Whos1337Page;
