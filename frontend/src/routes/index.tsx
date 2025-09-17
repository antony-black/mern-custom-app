import React, { Suspense } from "react";
import { CreatePageSkeleton, HomePageSkeleton, NotFoundPageSkeleton } from "./skeletons";
import type { RouteObject } from "react-router-dom";

const HomePage = React.lazy(() => import("../pages/home-page"));

const CreatePage = React.lazy(() => import("../pages/create-page"));

const NotFoundPage = React.lazy(() => import("../pages/not-found-page"));

export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <Suspense fallback={<div>{<HomePageSkeleton />}</div>}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: "/create",
    element: (
      <Suspense fallback={<CreatePageSkeleton />}>
        <CreatePage />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<NotFoundPageSkeleton />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
];
