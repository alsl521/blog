import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import https from "node:https";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

function pagefindDir() {
  // pagefind 的 exports 只有 import 条件、且未暴露 package.json，
  // 用 ESM 解析入口文件再反推包根目录（realpath 以兼容 pnpm 符号链接）。
  return fs.realpathSync(
    path.dirname(path.dirname(fileURLToPath(import.meta.resolve("pagefind"))))
  );
}

function binaryContext() {
  const platform = process.platform === "win32" ? "windows" : process.platform;
  const pkgName = `${platform}-${process.arch}`;
  const extern = process.platform === "win32" ? ".exe" : "";
  const pagefind = pagefindDir();
  const dirs = [
    // pnpm: <store>/pagefind@x/node_modules/@pagefind/<platform>-<arch>
    path.join(path.dirname(pagefind), "@pagefind", pkgName),
    // npm / yarn nested: pagefind/node_modules/@pagefind/<platform>-<arch>
    path.join(pagefind, "node_modules", "@pagefind", pkgName),
    // hoisted: <project>/node_modules/@pagefind/<platform>-<arch>
    path.join(process.cwd(), "node_modules", "@pagefind", pkgName),
  ];
  const binaries = [
    path.join("bin", `pagefind_extended${extern}`),
    path.join("bin", `pagefind${extern}`),
  ];
  return { pkgName, pagefind, dirs, binaries };
}

function isInstalled({ dirs, binaries }) {
  return dirs.some(dir =>
    binaries.some(binary => fs.existsSync(path.join(dir, binary)))
  );
}

function download(url, destination, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) {
      reject(new Error(`下载重定向过多: ${url}`));
      return;
    }
    const request = https.get(
      url,
      { headers: { "user-agent": "astro-blog-ensure-pagefind" } },
      response => {
        const status = response.statusCode ?? 0;
        if (status >= 300 && status < 400 && response.headers.location) {
          response.resume();
          const next = new URL(response.headers.location, url).href;
          download(next, destination, redirects + 1).then(resolve, reject);
          return;
        }
        if (status !== 200) {
          response.resume();
          reject(new Error(`下载失败: HTTP ${status} ${url}`));
          return;
        }
        const file = fs.createWriteStream(destination);
        response.pipe(file);
        file.on("finish", () => file.close(() => resolve()));
        file.on("error", reject);
        response.on("error", reject);
      }
    );
    request.setTimeout(600000, () => {
      request.destroy(new Error(`下载超时: ${url}`));
    });
    request.on("error", reject);
  });
}

async function main() {
  const context = binaryContext();
  if (isInstalled(context)) {
    return;
  }

  const version = JSON.parse(
    fs.readFileSync(path.join(context.pagefind, "package.json"), "utf8")
  ).version;
  const url = `https://registry.npmjs.org/@pagefind/${context.pkgName}/-/${context.pkgName}-${version}.tgz`;
  const tarball = path.join(
    os.tmpdir(),
    `pagefind-${context.pkgName}-${version}.tgz`
  );

  console.log(
    `Pagefind: 缺少平台二进制 @pagefind/${context.pkgName}@${version}，尝试自动下载...`
  );
  await download(url, tarball);

  // 装到 pagefind 包自己的 node_modules 下，Node 从 pagefind/lib 解析时一定能找到。
  const target = path.join(
    context.pagefind,
    "node_modules",
    "@pagefind",
    context.pkgName
  );
  fs.rmSync(target, { recursive: true, force: true });
  fs.mkdirSync(target, { recursive: true });
  execFileSync("tar", ["-xzf", tarball, "-C", target, "--strip-components=1"], {
    stdio: "inherit",
  });
  fs.rmSync(tarball, { force: true });

  if (!isInstalled(context)) {
    throw new Error(
      `Pagefind: 自动补装失败，请手动下载并解压 ${url} 到 ${target}`
    );
  }
  console.log(`Pagefind: 已补装 @pagefind/${context.pkgName}@${version}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
