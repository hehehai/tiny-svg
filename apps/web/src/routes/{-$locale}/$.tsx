import { createFileRoute } from "@tanstack/react-router";
import { NotFoundComponent } from "./404";

// The $ (splat/catch-all) route matches any path that doesn't match other routes
// e.g., /en/some/deeply/nested/invalid/path
// This ensures ALL unmatched paths within a locale show the 404 page
// Without this, unmatched deep paths might show a blank page or error
export const Route = createFileRoute("/{-$locale}/$")({
  component: NotFoundComponent,
});
