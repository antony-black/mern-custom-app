import FullProductInfoPage from "pages/full-product-info";
import React, { Suspense } from "react";
import {
  CreatePageSkeleton,
  FullProductInfoPageSkeleton,
  HomePageSkeleton,
  NotFoundPageSkeleton,
} from "./skeletons";
import type { RouteObject } from "react-router-dom";

const HomePage = React.lazy(() => import("../pages/home"));

const CreatePage = React.lazy(() => import("../pages/create"));

const NotFoundPage = React.lazy(() => import("../pages/not-found"));

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
    path: "/info/:id",
    element: (
      <Suspense fallback={<div>{<FullProductInfoPageSkeleton />}</div>}>
        <FullProductInfoPage />
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
