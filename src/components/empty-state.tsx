export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border p-12 text-center">
      <p className="font-medium">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
