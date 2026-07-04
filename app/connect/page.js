import Link from "next/link";
import ProfileCard from "@/components/ProfileCard";

const experiments = [
  {
    slug: "sketch-pad",
    title: "Sketch Pad",
    description: "A tiny canvas drawing toy — click and drag to draw.",
  },
];

export const metadata = { title: "Connect · the lab" };

export default function ConnectPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-12 sm:px-10 lg:px-14">
      <h1 className="mb-2 text-4xl font-medium tracking-tight">Connect</h1>
      <p className="mb-8 text-white/50">
        Your visitor profile follows you across the site, plus small things
        I build while learning. Each experiment lives in its own page under{" "}
        <code className="rounded bg-neutral-800 px-1.5 py-0.5">
          app/connect
        </code>
        .
      </p>

      <ProfileCard />

      <div className="grid gap-4 sm:grid-cols-2">
        {experiments.map((exp) => (
          <Link
            key={exp.slug}
            href={`/connect/${exp.slug}`}
            className="rounded-sm border border-white/10 p-5 transition hover:border-white/30"
          >
            <h2 className="font-medium">{exp.title}</h2>
            <p className="mt-1 text-sm text-white/50">{exp.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
