import fs from "fs";
import path from "path";
import os from "os";
import { execSync } from 'child_process';
import { paths } from '../config';

export function getProjectPath(size: string): string {
    return path.join(paths.projectsRoot, size);
}

export function getDiskUsageMB(dir: string): number {
    try {
        const output = execSync(`du -sm ${dir}`).toString().split("\t")[0];
        return parseInt(output, 10);
    } catch {
        return 0;
    }
}

export function writeResult(manager: string, size: string, result: object) {
    const resultDir = path.join(paths.resultsDir, manager);
    fs.mkdirSync(resultDir, { recursive: true });

    const filePath = path.join(resultDir, `${size}.json`);
    fs.writeFileSync(filePath, JSON.stringify(result, null, 2));

    console.log(`✅ Saved: ${filePath}`);
}

export function cleanGeneratedFiles(projectPath: string) {
    const targets = [
        "dist",
        "bundle.js",
        "node_modules",
        "package-lock.json",
        "pnpm-lock.yaml",
        "bun.lock",
        "deno.lock",
        "yarn.lock",
        "bun.lockb"
    ];

    for (const target of targets) {
        const targetPath = path.join(projectPath, target);
        if (fs.existsSync(targetPath)) {
            fs.rmSync(targetPath, { recursive: true, force: true });
            console.log(`🧹 Removed: ${targetPath}`);
        }
    }
}

export function getTransitiveDependencyCount(projectPath: string): number {
    try {
        const shell = os.platform() === "win32" ? "cmd.exe" : "bash";
        const command =
          os.platform() === "win32"
            ? 'dir /s /b node_modules | findstr /R /C:"node_modules$" | find /C /V ""'
            : 'find node_modules -type d -name node_modules | wc -l';

        const output = execSync(command, {
            cwd: projectPath,
            shell
        }).toString();

        return parseInt(output.trim(), 10);
    } catch (err) {
        console.warn("Could not compute dependency count:", err);
        return 0;
    }
}