"use client";

import { title } from "@/components/primitives";
import { Posts } from "@/components/posts";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";

function Whos1337Page() {
  const searchParams = useSearchParams();
  const [defaultDate, setDefaultDate] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    const paramDate = searchParams.get("defaultDate");

    if (paramDate) {
      setDefaultDate(paramDate);
    } else {
      setDefaultDate(format(new Date(), "yyyy-MM-dd"));
    }
    router.push("/whos1337");
  }, []);

  return (
    <>
      <div className="flex justify-center pb-[30px]">
        <h1 className={title()}>Who&apos;s 1337</h1>
      </div>
      {defaultDate ? <Posts defaultDate={defaultDate as string} /> : <></>}
    </>
  );
}
export default Whos1337Page;
