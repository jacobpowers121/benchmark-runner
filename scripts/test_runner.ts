import { execSync } from "child_process";
import path from "path";
import { performance } from "perf_hooks";
import { managers, projectSizes } from "../config";
import { getProjectPath, getDiskUsageMB, writeResult, cleanGeneratedFiles } from "./utils";

type Metric = "coldInstall" | "warmInstall" | "devBuild" | "prodBuild" | "diskUsageMB";

for (const size of projectSizes) {
  const projectPath = getProjectPath(size);

  for (const key in managers) {
    const manager = managers[key];

    const result: Record<Metric, number> = {
      coldInstall: 0,
      warmInstall: 0,
      devBuild: 0,
      prodBuild: 0,
      diskUsageMB: 0
    };

    console.log(`\n=== ${manager.name.toUpperCase()} | ${size} project ===`);

    // The check here is for deno since there is no install step
    const exec = (cmd: string) => {
      if (!cmd || cmd.trim() === "") return;
      execSync(cmd, { cwd: projectPath, stdio: "ignore", env: process.env });
    };

    const time = (fn: () => void): number => {
      const start = performance.now();
      fn();
      return +(performance.now() - start).toFixed(2);
    };

    try {
      // Clean
      if (manager.clean) exec(manager.clean);

      // Cold install
      if (manager.install) {
        result.coldInstall = time(() => exec(manager.install));
      }

      // Warm install (no clean)
      result.warmInstall = time(() => exec(manager.install));

      // Dev build
      if (manager.devBuild) {
        result.devBuild = time(() => exec(manager.devBuild));
      }

      // Prod build
      if (manager.prodBuild) {
        result.prodBuild = time(() => exec(manager.prodBuild));
      }

      // Disk usage
      result.diskUsageMB = getDiskUsageMB(path.join(projectPath, "node_modules"));

      // Write to file
      writeResult(manager.name, size, result);
      cleanGeneratedFiles(projectPath);
    } catch (err) {
      console.error(`Error running ${manager.name} on ${size} project:`, err);
    }
  }
}
