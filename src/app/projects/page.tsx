import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "作品",
  description: "我做過的專案與side project。",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader title="作品" description="我做過的專案，以及還在進行中的實驗。" />
      <Container className="py-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Container>
    </>
  );
}
