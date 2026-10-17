import fs from "node:fs";
import path from "node:path";

const source = path.join("dist", "pagefind");
const target = path.join("public", "pagefind");

if (!fs.existsSync(source)) {
  console.warn("dist/pagefind 不存在，跳过复制（请先运行 pnpm build 的索引步骤）");
} else {
  fs.rmSync(target, { recursive: true, force: true });
  fs.cpSync(source, target, { recursive: true });
  console.log("Pagefind: 索引已复制到 public/pagefind（供 pnpm dev 搜索使用）");
}
