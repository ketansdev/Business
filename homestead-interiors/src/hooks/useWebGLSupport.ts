"use client";

import { useEffect, useState } from "react";

export type WebGLStatus = "checking" | "supported" | "unsupported";

/** Detect WebGL once on the client. */
export function useWebGLSupport(): WebGLStatus {
  const [status, setStatus] = useState<WebGLStatus>("checking");

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        (canvas.getContext("webgl2") as WebGLRenderingContext | null) ??
        (canvas.getContext("webgl") as WebGLRenderingContext | null);
      setStatus(gl ? "supported" : "unsupported");
      // Release the probe context straight away.
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      setStatus("unsupported");
    }
  }, []);

  return status;
}
