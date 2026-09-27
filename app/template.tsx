import RouteTransition from "@/components/RouteTransition";

/**
 * A template rather than a layout: Next remounts this on every navigation,
 * which is what lets the transition replay. It deliberately adds no wrapper
 * element around `children` — see RouteTransition for why a wrapper would be
 * actively harmful here.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RouteTransition />
      {children}
    </>
  );
}
