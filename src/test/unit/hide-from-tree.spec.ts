import {
    addHideLineToBlock,
    blockHidesEntry,
    buildNewSortspecContent,
    buildNewSpecSection,
    createNewSortspec,
    findBlockForTarget,
    parseSortspecFile,
    removeHideLineFromBlock,
    replaceBlockBody,
} from '../../custom-sort/hide-from-tree';

describe('hide-from-tree pure helpers', () => {
    describe('parseSortspecFile', () => {
        it('parses a root spec with `sorting-spec: |` and 2-space indentation', () => {
            const content = [
                '---',
                'sorting-spec: |',
                '  target-folder: /',
                '  Inbox',
                '  Projects',
                '  /--hide: 更新日志.md',
                '  /--hide: sortspec.md',
                '---',
                '',
            ].join('\n');
            const parsed = parseSortspecFile(content);
            expect(parsed).not.toBeNull();
            expect(parsed!.style).toBe('|');
            expect(parsed!.indent).toBe(2);
            expect(parsed!.bodyText).toContain('target-folder: /');
            expect(parsed!.bodyText).toContain('/--hide: sortspec.md');
        });

        it('parses a subfolder spec with `sorting-spec: |-`', () => {
            const content = [
                '---',
                'sorting-spec: |-',
                '  target-folder: Areas/考研2027/数学/线性代数',
                '  解题框架',
                '  行列式.md',
                '  /--hide: sortspec.md',
                '---',
                '',
            ].join('\n');
            const parsed = parseSortspecFile(content);
            expect(parsed).not.toBeNull();
            expect(parsed!.style).toBe('|-');
            expect(parsed!.indent).toBe(2);
        });

        it('returns null when no sorting-spec key', () => {
            const content = ['---', 'title: hello', '---', ''].join('\n');
            expect(parseSortspecFile(content)).toBeNull();
        });

        it('returns null for a file without frontmatter', () => {
            expect(parseSortspecFile('# Just a heading')).toBeNull();
        });
    });

    describe('findBlockForTarget', () => {
        const content = [
            '---',
            'sorting-spec: |',
            '  target-folder: /',
            '  Inbox',
            '  /--hide: sortspec.md',
            '  target-folder: Areas',
            '  AI',
            '  考研2027',
            '---',
            '',
        ].join('\n');
        const parsed = parseSortspecFile(content)!;

        it('finds the root block for folderPath /', () => {
            const block = findBlockForTarget(parsed.bodyText, parsed.indent, '/');
            expect(block).not.toBeNull();
            expect(block!.target).toBe('/');
        });

        it('finds exact subfolder block for Areas', () => {
            const block = findBlockForTarget(parsed.bodyText, parsed.indent, 'Areas');
            expect(block).not.toBeNull();
            expect(block!.target).toBe('Areas');
        });

        it('does not find a missing subfolder block', () => {
            expect(findBlockForTarget(parsed.bodyText, parsed.indent, 'Areas/考研2027')).toBeNull();
        });
    });

    describe('blockHidesEntry', () => {
        it('detects an already hidden entry', () => {
            const content = [
                '---',
                'sorting-spec: |',
                '  target-folder: /',
                '  /--hide: 更新日志.md',
                '---',
                '',
            ].join('\n');
            const parsed = parseSortspecFile(content)!;
            expect(blockHidesEntry(parsed.bodyText, parsed.indent, '更新日志.md')).toBe(true);
            expect(blockHidesEntry(parsed.bodyText, parsed.indent, '别的.md')).toBe(false);
        });
    });

    describe('addHideLineToBlock', () => {
        it('adds a hide line inside the matched block region', () => {
            const content = [
                '---',
                'sorting-spec: |',
                '  target-folder: /',
                '  Inbox',
                '  Projects',
                '---',
                '',
            ].join('\n');
            const parsed = parseSortspecFile(content)!;
            const block = findBlockForTarget(parsed.bodyText, parsed.indent, '/')!;
            const { newBodyText, inserted } = addHideLineToBlock(parsed.bodyText, parsed.indent, block, 'Templates');
            expect(inserted).toBe(true);
            expect(newBodyText).toContain('/--hide: Templates');
            // still contains original rules
            expect(newBodyText).toContain('Inbox');
        });

        it('does not duplicate when entry already hidden', () => {
            const content = [
                '---',
                'sorting-spec: |',
                '  target-folder: /',
                '  /--hide: sortspec.md',
                '---',
                '',
            ].join('\n');
            const parsed = parseSortspecFile(content)!;
            const block = findBlockForTarget(parsed.bodyText, parsed.indent, '/')!;
            const { newBodyText, inserted } = addHideLineToBlock(parsed.bodyText, parsed.indent, block, 'sortspec.md');
            expect(inserted).toBe(false);
            expect(newBodyText).toBe(parsed.bodyText);
        });
    });

    describe('removeHideLineFromBlock', () => {
        it('removes an existing hide line', () => {
            const content = [
                '---',
                'sorting-spec: |',
                '  target-folder: /',
                '  Inbox',
                '  /--hide: Templates',
                '---',
                '',
            ].join('\n');
            const parsed = parseSortspecFile(content)!;
            const { newBodyText, removed } = removeHideLineFromBlock(parsed.bodyText, parsed.indent, 'Templates');
            expect(removed).toBe(true);
            expect(newBodyText).not.toContain('/--hide: Templates');
            expect(newBodyText).toContain('Inbox');
        });

        it('returns unchanged when entry not hidden', () => {
            const content = [
                '---',
                'sorting-spec: |',
                '  target-folder: /',
                '  Inbox',
                '---',
                '',
            ].join('\n');
            const parsed = parseSortspecFile(content)!;
            const { newBodyText, removed } = removeHideLineFromBlock(parsed.bodyText, parsed.indent, 'nope.md');
            expect(removed).toBe(false);
            expect(newBodyText).toBe(parsed.bodyText);
        });
    });
});

describe('hide-from-tree serialization helpers', () => {
    describe('replaceBlockBody', () => {
        it('replaces the block body while preserving frontmatter fences', () => {
            const content = [
                '---',
                'sorting-spec: |',
                '  target-folder: /',
                '  Inbox',
                '  Projects',
                '---',
                '',
            ].join('\n');
            const parsed = parseSortspecFile(content)!;
            const newBody = [
                '  target-folder: /',
                '  Inbox',
                '  Projects',
                '  /--hide: Templates',
            ].join('\n');
            const updated = replaceBlockBody(content, parsed, newBody);
            expect(updated).toContain('sorting-spec: |');
            expect(updated).toContain('  /--hide: Templates');
            expect(updated.endsWith('---\n')).toBe(true);
        });
    });

    describe('buildNewSortspecContent', () => {
        it('builds a root spec hiding an entry plus itself', () => {
            const c = buildNewSortspecContent('/', 'secret.md');
            expect(c).toContain('target-folder: /');
            expect(c).toContain('/--hide: secret.md');
            expect(c).toContain('/--hide: sortspec.md');
        });

        it('builds a subfolder spec using vault-relative path', () => {
            const c = buildNewSortspecContent('Areas/考研2027', 'private.md');
            expect(c).toContain('target-folder: Areas/考研2027');
            expect(c).toContain('/--hide: private.md');
            expect(c).toContain('/--hide: sortspec.md');
        });
    });

    describe('buildNewSpecSection', () => {
        it('builds a section block with target + hides', () => {
            const s = buildNewSpecSection('Notes', 'x.md');
            expect(s).toContain('target-folder: Notes');
            expect(s).toContain('/--hide: x.md');
            expect(s).toContain('/--hide: sortspec.md');
        });
    });

    describe('createNewSortspec duplicate-block regression', () => {
        function mockVault() {
            const files: Record<string, string> = {
                'Resources/sortspec.md': [
                    '---',
                    'sorting-spec: |',
                    '  target-folder: Resources',
                    '  README.md',
                    '  index.md',
                    '  心理',
                    '  计算机',
                    '  /--hide: sortspec.md',
                    '---',
                    '',
                ].join('\n'),
            };
            const vault: any = {
                getAbstractFileByPath(path: string) {
                    if (files[path] !== undefined) {
                        return { path, name: path.split('/').pop(), vault } as any;
                    }
                    return null;
                },
                async read(file: any) { return files[file.path] ?? ''; },
                async modify(file: any, data: string) { files[file.path] = data; },
                async create(path: string, data: string) {
                    files[path] = data;
                    return { path, name: path.split('/').pop(), vault } as any;
                },
            };
            return { vault, files };
        }

        it('adds only a hide line when the spec file already has a matching block (no duplicate target-folder)', async () => {
            const { vault, files } = mockVault();
            const folder: any = { path: 'Resources', name: 'Resources', vault, isRoot: () => false };

            const result: any = await createNewSortspec(vault, folder, 'Resources', 'README.md');

            expect(result.path).toBe('Resources/sortspec.md');
            const updated = files['Resources/sortspec.md'];
            const parsed = parseSortspecFile(updated)!;
            expect(updated.match(/target-folder: Resources/g)?.length).toBe(1);
            expect(blockHidesEntry(parsed.bodyText, parsed.indent, 'README.md')).toBe(true);
        });

        it('does not duplicate when the hide already exists', async () => {
            const { vault, files } = mockVault();
            const folder: any = { path: 'Resources', name: 'Resources', vault, isRoot: () => false };

            await createNewSortspec(vault, folder, 'Resources', 'sortspec.md');

            const updated = files['Resources/sortspec.md'];
            expect(updated.match(/target-folder: Resources/g)?.length).toBe(1);
        });
    });
});
