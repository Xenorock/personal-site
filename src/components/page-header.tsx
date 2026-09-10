import { Container } from "@/components/container";

export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-border">
      <Container className="py-14">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {description && (
          <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </Container>
    </div>
  );
}
