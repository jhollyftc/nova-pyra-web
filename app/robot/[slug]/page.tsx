import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import RobotView from "@/components/robot/RobotView";
import { getEvolution, getRobot, getRobotBySlug, getRobotList,
  getSectionCopy, getSubsystems } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

/**
 * Prerender a route per robot so past seasons are static like everything else,
 * except the one `/robot` is already showing — that slug only ever redirects.
 */
export async function generateStaticParams() {
  const [robots, featured] = await Promise.all([getRobotList(), getRobot()]);
  return robots.filter((r) => r.slug !== featured?.slug).map((r) => ({ slug: r.slug }));
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

  // Whichever robot /robot is showing has one canonical address, so its slug
  // redirects rather than serving the same page at two URLs. That is the
  // featured robot, not necessarily the current one — during build season they
  // are different, and redirecting on `isCurrent` would have sent people
  // looking for DRAKOS to a page about a robot that does not exist yet.
  const featured = await getRobot();
  if (featured && robot._id === featured._id) redirect("/robot");

  const [robots, subsystems, evolution, copy] = await Promise.all([
    getRobotList(),
    getSubsystems(robot._id),
    getEvolution(robot._id),
    getSectionCopy(),
  ]);

  return (
    <RobotView
      robot={robot}
      robots={robots}
      subsystems={subsystems}
      evolution={evolution}
      copy={copy}
      headlineSpecs={(robot.specs ?? []).slice(0, 3).map((s) => s.value.replace(/\s*\(.*\)$/, ""))}
    />
  );
}
