import { title } from "@/components/primitives";
import { Posts } from "@/components/posts";

export default function Whos1337Page() {
  return (
    <div>
      <h1 className={title()}>Who&apos;s 1337</h1>
      <Posts />
    </div>
  );
}