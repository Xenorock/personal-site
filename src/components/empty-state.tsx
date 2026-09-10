export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-border p-12 text-center">
      <p className="text-lg font-bold">{title}</p>
      <p className="mx-auto mt-2 max-w-md leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
