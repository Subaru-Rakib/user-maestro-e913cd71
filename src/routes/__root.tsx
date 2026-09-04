import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Pro Inventory & Stock Management" },
      { name: "description", content: "Carton-wise stock in, stock out and reports." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Pro Inventory & Stock Management" },
      { property: "og:description", content: "Carton-wise stock in, stock out and reports." },
      { property: "og:image", content: "/icon-512.png" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      /* Rakib er "R" logo. Prothom line ta chhobi ta NIJER bhitore niye rakhe
         (data-URI), tai public/ er chhobi gulo upload na korleo tab er icon ta
         thik-i ashe. Baki gulo - .ico purono browser, PNG gulo bookmark ar
         phone er home screen (Add to Home screen) er jonno. */
      { rel: "icon", type: "image/png", sizes: "32x32", href: "data:image/png;base64,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" },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
