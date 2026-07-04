import PrintCard from "@/components/PrintCard";
import { prints } from "@/lib/prints";

export const metadata = { title: "Prints · the lab" };

export default function PrintsPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-12 sm:px-10 lg:px-14">
      <h1 className="mb-2 text-4xl font-medium tracking-tight">Prints</h1>
      <p className="mb-8 text-white/50">
        My own photography, available as a personal-use digital download or
        a commercial-use license. Checkout isn’t live yet.
      </p>

      {prints.length === 0 ? (
        <p className="text-white/50">
          No prints listed yet. Add a photo to{" "}
          <code className="rounded bg-neutral-800 px-1.5 py-0.5">
            public/images/prints
          </code>{" "}
          and an entry to{" "}
          <code className="rounded bg-neutral-800 px-1.5 py-0.5">
            lib/prints.js
          </code>{" "}
          to list it here.
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2">
          {prints.map((print) => (
            <PrintCard key={print.slug} print={print} />
          ))}
        </div>
      )}
    </section>
  );
}
