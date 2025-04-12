import { execSync } from "child_process";
import path from "path";
import { performance } from "perf_hooks";
import { managers, projectSizes } from "../config";
import {
  getProjectPath,
  getDiskUsageMB,
  writeResult,
  cleanGeneratedFiles
} from "./utils";

// Stability settings
const NUM_RUNS = 3;

type SingleMetric = number;
type StabilityMetric = {
  average: number;
  min: number;
  max: number;
  stddev: number;
};

type RawMetrics = {
  coldInstall: SingleMetric[];
  warmInstall: SingleMetric[];
  devBuild: SingleMetric[];
  prodBuild: SingleMetric[];
  diskUsageMB: SingleMetric[];
  timeToUsable: SingleMetric[];
};

function computeStats(values: number[]): StabilityMetric {
  const average = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length;
  return {
    average: +average.toFixed(2),
    min: +Math.min(...values).toFixed(2),
    max: +Math.max(...values).toFixed(2),
    stddev: +Math.sqrt(variance).toFixed(2)
  };
}

for (const size of projectSizes) {
  const projectPath = getProjectPath(size);

  for (const key in managers) {
    const manager = managers[key];

    const raw: RawMetrics = {
      coldInstall: [],
      warmInstall: [],
      devBuild: [],
      prodBuild: [],
      diskUsageMB: [],
      timeToUsable: []
    };

    console.log(`\n=== ${manager.name.toUpperCase()} | ${size} project ===`);

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
      for (let run = 0; run < NUM_RUNS; run++) {
        console.log(`--> Run ${run + 1} of ${NUM_RUNS}`);

        // Clean
        if (manager.clean) exec(manager.clean);

        const usableStart = performance.now();

        // Cold install
        if (manager.install) {
          raw.coldInstall.push(time(() => exec(manager.install)));
        }

        // Prod build
        if (manager.prodBuild) {
          raw.prodBuild.push(time(() => exec(manager.prodBuild)));
        }

        // Time to usable
        raw.timeToUsable.push(+(performance.now() - usableStart).toFixed(2));

        // Warm install (no clean)
        raw.warmInstall.push(time(() => exec(manager.install)));

        // Dev build
        if (manager.devBuild) {
          raw.devBuild.push(time(() => exec(manager.devBuild)));
        }

        // Disk usage
        raw.diskUsageMB.push(getDiskUsageMB(path.join(projectPath, "node_modules")));

        // Clean up again
        cleanGeneratedFiles(projectPath);
      }

      const result: Record<keyof RawMetrics, StabilityMetric> = {
        coldInstall: computeStats(raw.coldInstall),
        warmInstall: computeStats(raw.warmInstall),
        devBuild: computeStats(raw.devBuild),
        prodBuild: computeStats(raw.prodBuild),
        diskUsageMB: computeStats(raw.diskUsageMB),
        timeToUsable: computeStats(raw.timeToUsable)
      };

      writeResult(manager.name, size, result);
    } catch (err) {
      console.error(`Error running ${manager.name} on ${size} project:`, err);
    }
  }
}
