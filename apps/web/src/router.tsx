import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import Loader from "@/components/loader";
import { routeTree } from "@/routeTree.gen";

export const getRouter = () => {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    trailingSlash: "never",
    context: {},
    defaultPendingComponent: () => <Loader />,
    defaultNotFoundComponent: () => <div>Not Found</div>,
    Wrap: ({ children }) => <>{children}</>,
    defaultViewTransition: true,
  });
  return router;
};
