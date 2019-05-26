import express, { Request, Response, Router } from "express";
import { posix } from "path";

import { cors } from "../common/middleware/cors";
import { AppConfig } from "../config";
import { AuthRouter } from "./auth";
import { serviceUnavailable } from "./common/serviceUnavailable";
import { OpenApiRouter } from "./docs";
import { GlacierRouter } from "./glacier";
import { CommRouter } from "./comm";

/**
 * Generates the application routes
 * @param {Pool} pool The database connection pool
 */
export function ApplicationRouter(): Router {

  // Require config
  if (!AppConfig) {
    return serviceUnavailable();
  }

  // Build the router
  return express
    .Router()
    .all("/", cors(), index)
    .use("/auth", AuthRouter())
    .use("/comm", CommRouter())
    .use("/openapi.json", OpenApiRouter())
    .use("/glacier", GlacierRouter());
}

function index(req: Request, res: Response, _next: (err?: Error) => void): void {

  const base = AppConfig.base;
  res.status(200).json({
    _message: AppConfig.title,
    auth_url: base + posix.normalize(`${req.originalUrl}/auth`),
    comm_url: base + posix.normalize(`${req.originalUrl}/comm`),
    docs_url: "https://mastermovies.uk/docs",
    glacier_url: base + posix.normalize(`${req.originalUrl}/glacier`),
    openapi_url: base + posix.normalize(`${req.originalUrl}/openapi.json`)
  });

}
