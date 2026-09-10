import { GithubIcon } from "@/components/icons";
import type { Project } from "@/data/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-semibold">{project.title}</h3>
        <span className="font-mono text-xs text-muted-foreground">
          {project.year}
        </span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      {project.repo && (
        <a
          href={project.repo}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <GithubIcon className="size-4" />
          原始碼
        </a>
      )}
    </article>
  );
}
