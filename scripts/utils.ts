import fs from "fs";
import path from "path";
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
    const targets = ["dist", "bundle.js", "package-lock.json", "pnpm-lock.yaml", "yarn.lock", "bun.lockb"];

    for (const target of targets) {
        const targetPath = path.join(projectPath, target);
        if (fs.existsSync(targetPath)) {
            fs.rmSync(targetPath, { recursive: true, force: true });
            console.log(`🧹 Removed: ${targetPath}`);
        }
    }
}
