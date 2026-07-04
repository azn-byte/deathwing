import PrintCard from "@/components/PrintCard";
import { prints } from "@/lib/prints";

export const metadata = { title: "Prints · the lab" };

export default function PrintsPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-2">Prints</h1>
      <p className="mb-8 text-neutral-500">
        My own photography, available as a personal-use digital download or
        a commercial-use license. Checkout isn’t live yet.
      </p>

      {prints.length === 0 ? (
        <p className="text-neutral-500">
          No prints listed yet. Add a photo to{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 dark:bg-neutral-800">
            public/images/prints
          </code>{" "}
          and an entry to{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 dark:bg-neutral-800">
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
