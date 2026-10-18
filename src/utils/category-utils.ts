import { getCategoryUrl } from "@utils/url-utils";
import type { Category } from "./content-utils";

export const CATEGORY_SEPARATOR = "/";

/** 把分类路径（如 "后端/Java"）拆成层级。空分类返回空数组。 */
export function splitCategoryPath(category?: string | null): string[] {
	if (!category) return [];
	return category
		.split(CATEGORY_SEPARATOR)
		.map((part) => part.trim())
		.filter(Boolean);
}

/** 分类路径的顶级分类，例如 "后端/Java" -> "后端"。 */
export function getCategoryParent(category?: string | null): string {
	return splitCategoryPath(category)[0] ?? "";
}

/** 分类路径的最后一级，例如 "后端/Java" -> "Java"。 */
export function getCategoryLeaf(category?: string | null): string {
	const parts = splitCategoryPath(category);
	return parts[parts.length - 1] ?? "";
}

/**
 * category 是否属于 group（含 group 本身或 group 的子分类）。
 * 例如 group="后端" 可以匹配 "后端/Java"。
 */
export function isCategoryInGroup(
	category?: string | null,
	group?: string | null,
): boolean {
	const current = (category ?? "").trim();
	const parent = (group ?? "").trim();
	if (!current || !parent) return false;
	return current === parent || current.startsWith(`${parent}${CATEGORY_SEPARATOR}`);
}

/** 面包屑显示用：把 "后端/Java" 格式化为 "后端 / Java"。 */
export function formatCategoryLabel(
	category?: string | null,
	separator = " / ",
): string {
	const parts = splitCategoryPath(category);
	return parts.length > 0 ? parts.join(separator) : (category ?? "");
}

/** 面包屑每一级的名称与累积路径。 */
export function getCategoryBreadcrumb(
	category?: string | null,
): Array<{ name: string; path: string }> {
	const parts = splitCategoryPath(category);
	const result: Array<{ name: string; path: string }> = [];
	let current = "";
	for (const part of parts) {
		current = current ? `${current}${CATEGORY_SEPARATOR}${part}` : part;
		result.push({ name: part, path: current });
	}
	return result;
}

export interface CategoryTreeNode {
	/** 显示名（父级或子级中的一级名称） */
	name: string;
	/** 完整分类路径 */
	fullPath: string;
	/** 该分类下的直接文章数 */
	count: number;
	/** 该分类及其所有子分类的文章总数 */
	total: number;
	url: string;
	children: CategoryTreeNode[];
}

/**
 * 把扁平的分类列表构建成最多两级的树。
 * - "后端/Java" -> 顶级 "后端" 节点，children 中有 "Java"
 * - 只有一级的分类（如 "开发笔记"）-> 没有 children 的顶级节点
 * 顶级分类与子分类都按文章数降序排列，数量相同时按名称排序。
 */
export function buildCategoryTree(categories: Category[]): CategoryTreeNode[] {
	const groups = new Map<
		string,
		{
			direct?: Category;
			children: Map<string, Category>;
		}
	>();

	for (const category of categories) {
		const parts = splitCategoryPath(category.name);
		if (parts.length === 0) continue;
		const parent = parts[0] as string;
		const entry = groups.get(parent) ?? { children: new Map<string, Category>() };
		if (parts.length === 1) {
			entry.direct = category;
		} else {
			const childPath = parts.slice(1).join(CATEGORY_SEPARATOR);
			entry.children.set(childPath, category);
		}
		groups.set(parent, entry);
	}

	const compareNodes = (a: CategoryTreeNode, b: CategoryTreeNode): number =>
		b.total - a.total || a.name.localeCompare(b.name);

	const tree: CategoryTreeNode[] = [];
	for (const [parent, entry] of groups) {
		const children: CategoryTreeNode[] = [];
		let childTotal = 0;
		for (const [childPath, childCategory] of entry.children) {
			children.push({
				name: childPath,
				fullPath: `${parent}${CATEGORY_SEPARATOR}${childPath}`,
				count: childCategory.count,
				total: childCategory.count,
				url: childCategory.url,
				children: [],
			});
			childTotal += childCategory.count;
		}
		children.sort(compareNodes);
		const directCount = entry.direct?.count ?? 0;
		tree.push({
			name: parent,
			fullPath: parent,
			count: directCount,
			total: directCount + childTotal,
			url: getCategoryUrl(parent),
			children,
		});
	}

	tree.sort(compareNodes);
	return tree;
}
