import { TFile, TFolder, Vault } from 'obsidian';

export const SORTSPEC_FILE_NAME = 'sortspec.md';

/**
 * Minimal vault-path normalizer (replaces obsidian.normalizePath, which is not
 * available in jest's obsidian mock): collapse duplicate slashes, strip leading
 * slash and trailing slash, and resolve '.'/'..' segments.
 */
export function normalizeVaultPath(p: string): string {
	const collapsed = String(p).replace(/\\/g, '/').replace(/\/+/g, '/');
	const parts = collapsed.split('/');
	const out: string[] = [];
	for (const part of parts) {
		if (part === '' || part === '.') continue;
		if (part === '..') {
			out.pop();
			continue;
		}
		out.push(part);
	}
	return out.join('/');
}

/**
 * Pure parsing/editing helpers for a sortspec.md YAML block scalar.
 * Kept free of Obsidian API so they are unit-testable.
 */

export interface SortspecBlockInfo {
	/** Whether the file starts with YAML frontmatter and has a sorting-spec key. */
	hasSortingSpec: boolean;
	/** The block scalar style (|, |-, |+, >, >-, >+ or null). */
	style: string | null;
	/** Raw text inside the block scalar, with common indentation preserved. */
	bodyText: string;
	/** Common indentation (spaces) used inside the block, deduced from first content line. */
	indent: number;
	/** Whole file content. */
	fullContent: string;
}

/**
 * Parse a .md file's frontmatter block scalar for `sorting-spec:`.
 * Returns null if the file has no `sorting-spec:` key.
 * NOTE: relies on the common Obsidian frontmatter format:
 *   ---
 *   sorting-spec: |
 *     line
 *   ---
 */
export function parseSortspecFile(content: string): SortspecBlockInfo | null {
	// Match the frontmatter opening fence + sorting-spec key at start of a line
	const match = content.match(/^---\r?\n\s*sorting-spec:\s*([|>][-+]?)?\s*\r?\n([\s\S]*?)\r?\n?^---/m);
	if (!match) return null;
	const style = match[1] || null;
	let bodyText = match[2] || '';
	// Deduce indentation from first non-empty line inside the block
	let indent = 0;
	for (const line of bodyText.split('\n')) {
		if (line.trim() !== '') {
			const m = line.match(/^[ \t]*/);
			indent = m ? m[0].length : 0;
			break;
		}
	}
	return { hasSortingSpec: true, style, bodyText, indent, fullContent: content };
}

export interface SpecTargetBlock {
	/** 1-based index of the target-folder line inside the block body. */
	targetLine: number;
	/** The trimmed target-folder value. */
	target: string;
	/** Lines in the block belonging to this target (inclusive of target line). */
	startLine: number;
	/** End line index (exclusive) of this target's block. */
	endLine: number;
}

/**
 * Given a parsed block bodyText, locate all `target-folder:` blocks and their
 * (possibly empty) rule spans. Returns the block that exactly matches the
 * given folderPath, if any.
 */
export function findBlockForTarget(bodyText: string, indent: number, folderPath: string): SpecTargetBlock | null {
	const lines = bodyText.split('\n');
	// Dedent lines by removing the common indent
	const dedented = lines.map((l) => (l.trim() === '' ? '' : l.slice(indent)));
	const targets: SpecTargetBlock[] = [];
	for (let i = 0; i < dedented.length; i++) {
		const line = dedented[i].trim();
		if (line.startsWith('target-folder:')) {
			const target = line.slice('target-folder:'.length).trim();
			let endLine = dedented.length;
			for (let j = i + 1; j < dedented.length; j++) {
				if (dedented[j].trim().startsWith('target-folder:')) {
					endLine = j;
					break;
				}
			}
			targets.push({ targetLine: i + 1, target, startLine: i, endLine });
		}
	}
	if (folderPath === '/') {
		return targets.find((b) => b.target === '/' || b.target === '') ?? null;
	}
	// Exact match (no leading slash in target for subfolders)
	const wanted = folderPath.replace(/^\/+/, '');
	return targets.find((b) => b.target.replace(/^\/+/, '') === wanted) ?? null;
}

/** Whether a rule line is a hide directive. */
export function isHideDirective(line: string): boolean {
	const t = line.trim();
	return t.startsWith('/--hide:') || t.startsWith('--%');
}

/** Extract hidden entry name from a hide directive. */
export function hideDirectiveName(line: string): string | null {
	const t = line.trim();
	let m = t.match(/^\/?--hide:\s*(.+)$/);
	if (m) return m[1].trim();
	m = t.match(/^--%\s*(.+)$/);
	return m ? m[1].trim() : null;
}

/**
 * Check whether the block already hides an entry by name.
 * Assumes the spec was parsed and we pass its bodyText.
 */
export function blockHidesEntry(bodyText: string, indent: number, entryName: string): boolean {
	const lines = bodyText.split('\n').map((l) => (l.trim() === '' ? '' : l.slice(indent)));
	return lines.some((l) => {
		const n = hideDirectiveName(l);
		return n === entryName;
	});
}

/**
 * Build the sorted order for hide directives within one target block:
 * Return the lines to write (all lines of the block region, dedented) plus
 * the index where a new hide line should be inserted.
 */
export function addHideLineToBlock(
	bodyText: string,
	indent: number,
	block: SpecTargetBlock,
	entryName: string,
): { newBodyText: string; inserted: boolean } {
	const lines = bodyText.split('\n');
	const dedented = lines.map((l) => (l.trim() === '' ? '' : l.slice(indent)));
	if (dedented.some((l) => hideDirectiveName(l) === entryName)) {
		return { newBodyText: bodyText, inserted: false }; // already hidden
	}
	// Insert after the last rule line in this block (skip blank lines at end)
	let insertIdx = block.endLine;
	// trim trailing blank lines
	while (insertIdx > block.startLine && dedented[insertIdx - 1].trim() === '') {
		insertIdx--;
	}
	// Find the last non-comment, non-blank line before insertIdx to append after it.
	const newLine = `/--hide: ${entryName}`;
	dedented.splice(insertIdx, 0, newLine);
	const reindented = dedented.map((l) => (l.trim() === '' ? '' : ' '.repeat(indent) + l));
	return { newBodyText: reindented.join('\n'), inserted: true };
}

/** Remove a hide line from the block by entry name. */
export function removeHideLineFromBlock(
	bodyText: string,
	indent: number,
	entryName: string,
): { newBodyText: string; removed: boolean } {
	const lines = bodyText.split('\n');
	const dedented = lines.map((l) => (l.trim() === '' ? '' : l.slice(indent)));
	let removed = false;
	const out = dedented.filter((l) => {
		if (!removed && hideDirectiveName(l) === entryName) {
			removed = true;
			return false;
		}
		return true;
	});
	if (!removed) return { newBodyText: bodyText, removed: false };
	const reindented = out.map((l) => (l.trim() === '' ? '' : ' '.repeat(indent) + l));
	return { newBodyText: reindented.join('\n'), removed: true };
}

// ============================================================================
// Obsidian API service layer (Vault read/write)
// ============================================================================

export interface FindSpecResult {
	/** The spec file to edit (may be null when none exists nearby). */
	file: TFile | null;
	/** Folder whose spec file we looked in (the nearest ancestor with a spec). */
	containerFolder: TFolder;
	/** The exact folder path the target block must match (e.g. 'Areas/数学'). */
	targetFolderPath: string;
}

/**
 * Nearest-ancestor discovery of a spec file whose target-folder covers the
 * given folder. Mirrors the candidate-name rules of readAndParseSortingSpec()
 * and returns the file only if it actually contains a target-folder block that
 * exactly matches `folder.path` (or '/' for the vault root).
 */
export async function findSpecToEdit(
	vault: Vault,
	folder: TFolder,
	additionalSortspecFile: string,
	indexNoteNameForFolderNotes: string,
): Promise<FindSpecResult> {
	const wanted = folder.isRoot() ? '/' : folder.path.replace(/^\/+/, '');

	let current: TFolder | null = folder;
	while (current) {
		// Candidate spec file inside this folder
		const candidates: TFile[] = [];
		const specNames = [SORTSPEC_FILE_NAME, `${SORTSPEC_FILE_NAME}.md`];
		for (const name of specNames) {
			const abs = normalizeVaultPath(`${current.path}/${name}`);
			const f = vault.getAbstractFileByPath(abs);
			if (f instanceof TFile) candidates.push(f);
		}
		// Folder-note mode: file with same basename as folder
		if (current.name && !current.isRoot()) {
			const notePath = normalizeVaultPath(`${current.path}/${current.name}.md`);
			const nf = vault.getAbstractFileByPath(notePath);
			if (nf instanceof TFile) candidates.push(nf);
		}
		// Additional configured spec file
		if (additionalSortspecFile) {
			const base = additionalSortspecFile.endsWith('.md')
				? additionalSortspecFile
				: `${additionalSortspecFile}.md`;
			const p1 = normalizeVaultPath(`${current.path}/${base}`);
			const f1 = vault.getAbstractFileByPath(p1);
			if (f1 instanceof TFile) candidates.push(f1);
			if (base.startsWith('/')) {
				const p2 = normalizeVaultPath(base.slice(1));
				const f2 = vault.getAbstractFileByPath(p2);
				if (f2 instanceof TFile) candidates.push(f2);
			}
		}
		// Index note
		if (indexNoteNameForFolderNotes) {
			const idxName = indexNoteNameForFolderNotes.endsWith('.md')
				? indexNoteNameForFolderNotes
				: `${indexNoteNameForFolderNotes}.md`;
			const idxPath = normalizeVaultPath(`${current.path}/${idxName}`);
			const idxF = vault.getAbstractFileByPath(idxPath);
			if (idxF instanceof TFile) candidates.push(idxF);
		}

		// De-dupe by path
		const seen = new Set<string>();
		const unique = candidates.filter((c) => (seen.has(c.path) ? false : (seen.add(c.path), true)));

		// A candidate is valid if its content has a block for `wanted`.
		for (const cand of unique) {
			// Use vault.read (not cachedRead) so a spec that was just modified on
			// disk is judged by its current content. cachedRead can serve stale
			// metadata-cache text and make us miss an existing target block,
			// which used to trigger an accidental duplicate-block append.
			const content = await vault.read(cand);
			const parsed = parseSortspecFile(content);
			if (parsed) {
				const block = findBlockForTarget(parsed.bodyText, parsed.indent, wanted);
				if (block) {
					return { file: cand, containerFolder: current, targetFolderPath: wanted };
				}
			}
		}

		if (current.isRoot()) break;
		current = current.parent;
	}

	// No existing spec covers this folder. Fall back to creating one in the
	// folder itself (caller decides whether to create).
	return { file: null, containerFolder: folder, targetFolderPath: wanted };
}

/** Check whether a spec file's matching block already hides an entry. */
export async function specHidesEntry(vault: Vault, specFile: TFile, folderPath: string, entryName: string): Promise<boolean> {
	const content = await vault.cachedRead(specFile);
	const parsed = parseSortspecFile(content);
	if (!parsed) return false;
	const block = findBlockForTarget(parsed.bodyText, parsed.indent, folderPath === '/' ? '/' : folderPath.replace(/^\/+/, ''));
	if (!block) return false;
	return blockHidesEntry(parsed.bodyText, parsed.indent, entryName);
}

/** Add a hide directive into the spec file's matching block; creates the file if needed. */
export async function addHideToSpecFile(
	vault: Vault,
	result: FindSpecResult,
	entryName: string,
): Promise<void> {
	if (result.file) {
		let content = await vault.read(result.file);
		const parsed = parseSortspecFile(content);
		if (parsed) {
			const block = findBlockForTarget(parsed.bodyText, parsed.indent, result.targetFolderPath);
			if (block) {
				const { newBodyText } = addHideLineToBlock(parsed.bodyText, parsed.indent, block, entryName);
				if (newBodyText !== parsed.bodyText) {
					const updated = replaceBlockBody(content, parsed, newBodyText);
					await vault.modify(result.file, updated);
				}
				return;
			}
			// The spec file exists but has no block matching this folder.
			// Append ONLY the missing target-folder block, never duplicate an
			// existing block (duplicate target-folder makes the plugin suspend).
			if (blockHidesEntry(parsed.bodyText, parsed.indent, entryName)) {
				return; // already hidden somewhere in this file
			}
			const appended = content.endsWith('\n') ? content : content + '\n';
			const newSpecSection = buildNewSpecSection(result.targetFolderPath, entryName);
			const idx = appended.lastIndexOf('\n---');
			let updated: string;
			if (idx !== -1) {
				updated = appended.slice(0, idx + 1) + '\n' + newSpecSection + appended.slice(idx + 1);
			} else {
				updated = appended + newSpecSection + '\n';
			}
			await vault.modify(result.file, updated);
			return;
		}
		// File exists but is not a valid sortspec (no sorting-spec key). Do not
		// silently reshape it; creating a dedicated spec would be surprising too.
		// Leave it untouched and surface nothing (caller shows the toggle state).
		return;
	}

	// No spec file exists: create one in the container folder.
	await createNewSortspec(vault, result.containerFolder, result.targetFolderPath, entryName);
}

/** Remove a hide directive from the spec file's matching block. */
export async function removeHideFromSpecFile(
	vault: Vault,
	result: FindSpecResult,
	entryName: string,
): Promise<void> {
	if (!result.file) return;
	let content = await vault.read(result.file);
	const parsed = parseSortspecFile(content);
	if (!parsed) return;
	const block = findBlockForTarget(parsed.bodyText, parsed.indent, result.targetFolderPath);
	if (!block) return;
	const { newBodyText, removed } = removeHideLineFromBlock(parsed.bodyText, parsed.indent, entryName);
	if (!removed) return;
	const updated = replaceBlockBody(content, parsed, newBodyText);
	await vault.modify(result.file, updated);
}

/** Replace the block scalar body inside the frontmatter with new text. */
export function replaceBlockBody(content: string, parsed: SortspecBlockInfo, newBodyText: string): string {
	// The parsed structure holds fullContent; simplest robust approach:
	// find the sorting-spec header line, then the closing frontmatter fence.
	const headerMatch = content.match(/^---\r?\n(\s*sorting-spec:\s*[^\r\n]*\r?\n)/);
	if (!headerMatch) return content;
	const afterHeader = content.slice(headerMatch[0].length);
	// Find the next line that is exactly `---` (the closing fence)
	const closeMatch = afterHeader.match(/^---[ 	]*\r?$/m);
	if (!closeMatch) return content;
	// endIdx points at the start of the closing fence line. The text between the
	// header and the closing fence is the OLD body — we must drop it entirely and
	// replace it with newBodyText, otherwise the old body stays and duplicates.
	const endIdx = headerMatch[0].length + (closeMatch.index ?? 0);
	return content.slice(0, headerMatch[0].length) + newBodyText + '\n' + content.slice(endIdx);
}

/** Build a new sortspec file content for a folder with a single hide entry. */
export function buildNewSortspecContent(folderPath: string, entryName: string): string {
	const target = folderPath === '/' ? '/' : folderPath.replace(/^\/+/, '');
	const lines = [
		'---',
		'sorting-spec: |',
		`  target-folder: ${target}`,
		`  /--hide: ${entryName}`,
		`  /--hide: sortspec.md`,
		'---',
		'',
	];
	return lines.join('\n');
}

export function buildNewSpecSection(folderPath: string, entryName: string): string {
	const target = folderPath === '/' ? '/' : folderPath.replace(/^\/+/, '');
	const lines = [
		`  target-folder: ${target}`,
		`  /--hide: ${entryName}`,
		`  /--hide: sortspec.md`,
	];
	return lines.join('\n');
}

/** Create a new sortspec.md inside the folder (or root). */
export async function createNewSortspec(
	vault: Vault,
	folder: TFolder,
	targetFolderPath: string,
	entryName: string,
): Promise<TFile> {
	const path = normalizeVaultPath(`${folder.path}/${SORTSPEC_FILE_NAME}`);
	const content = buildNewSortspecContent(targetFolderPath, entryName);
	const existing = vault.getAbstractFileByPath(path) as TFile | null;
	if (existing) {
		// The file already exists but findSpecToEdit did not consider it a
		// controlling spec (e.g. it lacks a block for this folder). Never
		// duplicate its blocks — append a minimal missing target-folder block
		// only when the hide is not already present.
		let cur = await vault.read(existing);
		const parsed = parseSortspecFile(cur);
		if (parsed && blockHidesEntry(parsed.bodyText, parsed.indent, entryName)) {
			return existing;
		}
		if (parsed && findBlockForTarget(parsed.bodyText, parsed.indent, targetFolderPath)) {
			// Block exists but the hide line is missing — add it there instead
			// of appending a duplicate block.
			const block = findBlockForTarget(parsed.bodyText, parsed.indent, targetFolderPath)!;
			const { newBodyText } = addHideLineToBlock(parsed.bodyText, parsed.indent, block, entryName);
			if (newBodyText !== parsed.bodyText) {
				const updated = replaceBlockBody(cur, parsed, newBodyText);
				await vault.modify(existing, updated);
			}
			return existing;
		}
		cur = cur.endsWith('\n') ? cur : cur + '\n';
		const idx = cur.lastIndexOf('\n---');
		const section = buildNewSpecSection(targetFolderPath, entryName);
		if (idx !== -1) {
			cur = cur.slice(0, idx + 1) + '\n' + section + cur.slice(idx + 1);
		} else {
			cur = cur + section + '\n';
		}
		await vault.modify(existing, cur);
		return existing;
	}
	const created = await vault.create(path, content);
	return created;
}
