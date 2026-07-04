import Link from "next/link";

export default function Home() {
  return (
    <section className="mx-auto flex max-w-5xl flex-1 flex-col justify-center px-6 py-20">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        A small lab for images and ideas.
      </h1>
      <p className="mt-4 max-w-xl text-neutral-500">
        This is where I keep photos and try out little web experiments as I
        learn to build things.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/gallery"
          className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          View gallery
        </Link>
        <Link
          href="/experiments"
          className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium dark:border-neutral-700"
        >
          See experiments
        </Link>
      </div>
    </section>
  );
}
