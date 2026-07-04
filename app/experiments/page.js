import Link from "next/link";

const experiments = [
  {
    slug: "sketch-pad",
    title: "Sketch Pad",
    description: "A tiny canvas drawing toy — click and drag to draw.",
  },
];

export const metadata = { title: "Experiments · the lab" };

export default function ExperimentsPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-2">Experiments</h1>
      <p className="mb-8 text-neutral-500">
        Small things I build while learning. Each one lives in its own page
        under{" "}
        <code className="rounded bg-neutral-100 px-1.5 py-0.5 dark:bg-neutral-800">
          app/experiments
        </code>
        .
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {experiments.map((exp) => (
          <Link
            key={exp.slug}
            href={`/experiments/${exp.slug}`}
            className="rounded-lg border border-neutral-200 p-5 transition hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
          >
            <h2 className="font-medium">{exp.title}</h2>
            <p className="mt-1 text-sm text-neutral-500">{exp.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
