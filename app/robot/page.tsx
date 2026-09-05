import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RobotView from "@/components/robot/RobotView";
import {
  getEvolution,
  getHeadlineSpecs,
  getRobot,
  getRobotList,
  getSubsystems,
} from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const robot = await getRobot();
  return {
    title: robot ? `${robot.name} — The Robot` : "The Robot",
    description: robot?.philosophy?.slice(0, 160),
  };
}

/** The current robot. Past seasons live at /robot/[slug]. */
export default async function RobotPage() {
  const robot = await getRobot();
  if (!robot) notFound();

  const [robots, subsystems, evolution, headlineSpecs] = await Promise.all([
    getRobotList(),
    getSubsystems(robot._id),
    getEvolution(robot._id),
    getHeadlineSpecs(),
  ]);

  return (
    <RobotView
      robot={robot}
      robots={robots}
      subsystems={subsystems}
      evolution={evolution}
      headlineSpecs={headlineSpecs}
    />
  );
}
