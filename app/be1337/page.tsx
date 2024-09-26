import { title } from "@/components/primitives";
import { CreatePost } from "@/components/create-post";

export default function Be1337Page() {
  return (
    <div>
      <h1 className={title()}>Who&apos;s 1337</h1>
      <CreatePost />
    </div>
  );
}
