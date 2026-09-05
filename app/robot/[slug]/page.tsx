import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import RobotView from "@/components/robot/RobotView";
import { getEvolution, getRobotBySlug, getRobotList, getSubsystems } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

/** Prerender a route per robot so past seasons are static like everything else. */
export async function generateStaticParams() {
  const robots = await getRobotList();
  return robots.filter((r) => !r.isCurrent).map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const robot = await getRobotBySlug(slug);
  if (!robot) return { title: "The Robot" };
  return {
    title: `${robot.name} — ${robot.gameName} ${robot.season}`,
    description: robot.philosophy?.slice(0, 160),
  };
}

export default async function RobotSeasonPage({ params }: Params) {
  const { slug } = await params;
  const robot = await getRobotBySlug(slug);
  if (!robot) notFound();

  // The current robot has one canonical address, /robot, so a slug pointing at
  // it redirects rather than serving the same page twice.
  if (robot.isCurrent) redirect("/robot");

  const [robots, subsystems, evolution] = await Promise.all([
    getRobotList(),
    getSubsystems(robot._id),
    getEvolution(robot._id),
  ]);

  return (
    <RobotView
      robot={robot}
      robots={robots}
      subsystems={subsystems}
      evolution={evolution}
      headlineSpecs={(robot.specs ?? []).slice(0, 3).map((s) => s.value.replace(/\s*\(.*\)$/, ""))}
    />
  );
}
