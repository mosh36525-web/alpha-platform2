import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./_core/oauth";
import { publicPlatformScript } from "./_core/publicConfig";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import { registerStorageProxy } from "./_core/storageProxy";

/**
 * Creates the API application without binding a TCP port.
 * This is shared by the normal Node server and Vercel's serverless function.
 */
export function createApp() {
  const app = express();

  // The admin upload flow sends image/video data as base64 in JSON.
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.get("/api/platform/config.js", (_req, res) => {
    res.set("Cache-Control", "no-store").type("application/javascript").send(publicPlatformScript());
  });

  // Uploaded files are returned as /manus-storage/... paths. Proxy them to
  // the signed object-store URL in both Node and Vercel deployments.
  registerStorageProxy(app);
  registerOAuthRoutes(app);

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  return app;
}
