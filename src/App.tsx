import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { Toaster } from "@/components/ui/sonner";
import { Loading } from "@/components/Loading";

const FallbackElement = (
  <div 
    title="Loading…"
    className="min-h-dvh grid place-content-center"
  >
    <Loading />
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    hydrateFallbackElement: FallbackElement,
    lazy: async () => {
      const { default: Component } = await import("@/pages/home/Page");
      return { Component };
    },
  },
  {
    path: "/repo/:username/:repo",
    hydrateFallbackElement: FallbackElement,
    lazy: async () => {
      const { default: Component } = await import("@/pages/repo/Page");
      return { Component };
    }
  },
]);

export const App = () => (
  <>
    <RouterProvider router={router} />
    <Toaster 
      richColors
      position="bottom-left" 
    />
  </>
);
