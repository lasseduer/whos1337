import { title } from "@/components/primitives";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block text-center justify-center">
        <span className={title({ color: "violet" })}>13:37</span>
        <br />
        <br />
        <br />
        <span className={title()}>Master the game, own the name!</span>
      </div>
    </section>
  );
}
