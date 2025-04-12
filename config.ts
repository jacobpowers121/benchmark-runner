import path from "path";

export type ManagerConfig = {
    name: string;
    install: string;
    devBuild: string;
    prodBuild: string;
    clean: string;
};

export const projectSizes: string[] = ["small"];

export const managers: Record<string, ManagerConfig> = {
    npm: {
        name: "npm",
        install: "npm install",
        devBuild: "npm run build:dev",
        prodBuild: "npm run build:prod",
        clean: "rm -rf node_modules package-lock.json"
    },
    yarn: {
        name: "yarn",
        install: "yarn install",
        devBuild: "yarn build:dev",
        prodBuild: "yarn build:prod",
        clean: "rm -rf node_modules yarn.lock"
    },
    pnpm: {
        name: "pnpm",
        install: "pnpm install",
        devBuild: "pnpm run build:dev",
        prodBuild: "pnpm run build:prod",
        clean: "rm -rf node_modules pnpm-lock.yaml"
    },
    bun: {
        name: "bun",
        install: "bun install",
        devBuild: "bun run build:dev",
        prodBuild: "bun run build:prod",
        clean: "rm -rf node_modules bun.lockb"
    },
    deno: {
        name: "deno",
        install: "", // No install needed
        devBuild: "deno task build:dev",
        prodBuild: "deno task build:prod",
        clean: "" // No cleanup needed
    }
};

export const paths = {
    projectsRoot: path.join(__dirname, "projects"),
    resultsDir: path.join(__dirname, "results")
};
