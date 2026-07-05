import { ERoutes } from "./routes";
import type { TAppLocationState } from "./types";
import type { Location } from "react-router-dom";

export const isPostRoute = (pathname: string) =>
  new RegExp(`^${ERoutes.post}/[^/]+$`).test(pathname);

export const getBackgroundLocation = (state: unknown) =>
  (state as TAppLocationState | null)?.background;

export const createModalState = (
  location: Location,
): TAppLocationState => ({
  background: location,
});
