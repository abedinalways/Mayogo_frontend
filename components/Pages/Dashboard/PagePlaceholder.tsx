interface PagePlaceholderProps {
  title: string;
  subtitle: string;
}

export function PagePlaceholder({ title, subtitle }: PagePlaceholderProps) {
  return (
    <section className="rounded-2xl border border-[#e4ebf1] bg-white p-8">
      <h2 className="text-base font-semibold text-[#123e5e]">{title}</h2>
      <p className="mt-1 text-sm text-[#6c8294]">{subtitle}</p>
    </section>
  );
}
