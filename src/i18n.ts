/**
 * i18n module for Custom Sort plugin
 * Lightweight translation system with language auto-detection.
 *
 * Usage:
 *   import { t, setLanguage, getLanguage } from './i18n';
 *   t('settings.delayName') // => "初始自动应用自定义排序的延迟"
 *   t('err.dupSortSpec', { path: 'Notes' }) // => "文件夹 Notes 的排序规格重复"
 */

/** Language codes supported by the plugin */
export type LanguageCode = 'auto' | 'zh' | 'en';

/** A translation dictionary: key -> template or function */
export type TranslationDict = {
	[key: string]: string | TranslationDict;
};

/** Current active language (resolved from 'auto') */
export type ResolvedLanguage = 'zh' | 'en';

/** Translation function signature (injectable for testing) */
export type Translator = (key: string, params?: Record<string, string | number | undefined>) => string;

const zh: TranslationDict = {
	// ===== Settings tab =====
	'settings.title': '自定义文件管理器排序设置',
	'settings.delayName': '初始自动应用自定义排序的延迟',
	'settings.delayDesc': '插件/应用启动后，等待多少秒再应用自定义排序。'
		+ '<br>'
		+ '对于大型 vault（仓库）、多插件 vault 或移动端，如果在启动时自动应用自定义排序遇到问题，可能需要调大该值。'
		+ '延迟给 Obsidian 额外的时间从云存储同步笔记、填充笔记元数据缓存等。'
		+ '<br>'
		+ '同时，如果您的 vault 相对较小、仅在桌面端使用、或未与其他副本同步，'
		+ '将延迟调小到 0 也是安全的选择。'
		+ '<br>'
		+ '最小值：{min} 秒，最大值：{max} 秒',
	'settings.additionalFileName': '包含排序规格的额外笔记路径或名称',
	'settings.additionalFileDesc': '除 `sortspec` 笔记和 Folder Notes（文件夹笔记）外，额外扫描的笔记名称或路径（读取 YAML front matter 中的排序规格）。'
		+ '<br>'
		+ ' `.md` 文件后缀可省略。'
		+ '<br>'
		+ '<p>注意：更新此设置后，请通过点击侧边栏图标或运行 <b>启用自定义排序</b> 命令来刷新自定义排序，'
		+ '或重启 Obsidian / 重新加载 vault</p>',
	'settings.additionalFilePlaceholder': '例如：sorting-configuration',
	'settings.indexNoteName': '索引笔记名称（Folder Notes 支持）',
	'settings.indexNoteDesc': '如果您使用基于 <i>索引文件</i> 的文件夹笔记方式（参见 '
		+ '<a href="https://github.com/aidenlx/alx-folder-note/wiki/folder-note-pref">Aidenlx Folder Note 配置</a>'
		+ '），请在此输入索引笔记名称，例如 <b>_about_</b> 或 <b>index</b>'
		+ '<br>'
		+ ' `.md` 文件后缀可省略。'
		+ '<br>'
		+ '插件将读取这些文件中的排序规格和文件夹元数据。'
		+ '<br>'
		+ 'Folder Notes 的 <i>Inside Folder, with Same Name Recommended（文件夹内同名）</i> 模式会自动处理，无需额外配置。'
		+ '</p>'
		+ '<p>注意：更新此设置后，请通过点击侧边栏图标或运行 <b>启用自定义排序</b> 命令来刷新自定义排序，'
		+ '或重启 Obsidian / 重新加载 vault</p>',
	'settings.indexNotePlaceholder': '例如：_about_ 或 index',
	'settings.statusBarEntryName': '启用状态栏条目',
	'settings.statusBarEntryDesc': '状态栏条目显示 `自定义排序：开` 或 `自定义排序：关`，表示插件当前状态。',
	'settings.notificationsName': '启用插件状态变更通知',
	'settings.notificationsDesc': '插件可以显示其状态变更的通知：例如成功解析并应用自定义排序规格时，或解析失败时。'
		+ '如果禁用通知，插件状态的唯一指示就是侧边栏图标按钮。'
		+ '无论通知是否启用，开发者控制台都会显示解析错误信息。',
	'settings.mobileNotificationsName': '仅移动设备启用插件状态变更通知',
	'settings.mobileNotificationsDesc': '见上文。',
	'settings.contextSubmenuName': '启用文件管理器右键子菜单 `自定义排序：`',
	'settings.contextSubmenuDesc': '提供与自定义排序相关的操作入口，例如应用自定义排序。',
	'settings.bookmarksHeader': '书签集成（Bookmarks integration）',
	'settings.bookmarksIntegrationName': '自动集成核心书签插件（用于间接拖放排序）',
	'settings.bookmarksIntegrationDesc': '启用后，文件管理器中的文件和文件夹顺序将反映 '
		+ '书签（核心插件）视图中书签项目的顺序。自动生效，无需任何排序配置。'
		+ '同时，它与 <pre style="display: inline;">sorting-spec:</pre> 配置无缝集成，可以很好地协同工作。'
		+ '<br>'
		+ '<p>为了将普通书签与用于排序的书签区分开，您可以把后者放在一个单独的专用书签组中。'
		+ '组的默认名称为 '
		+ "'<i>{defaultGroup}</i>' "
		+ '，您可以在下面的配置字段中更改组名。'
		+ '<br>'
		+ '如果留空，将使用所有已书签的项目来约束文件管理器中的顺序。</p>'
		+ '<p>有关此功能的更多信息，请参阅本 custom-sort 插件的 '
		+ '<a href="https://github.com/SebastianMC/obsidian-custom-sort/blob/master/docs/manual.md#bookmarks-plugin-integration">手册（manual）</a>'
		+ '</p>',
	'settings.bookmarksGroupName': '用于读取项目顺序的书签组名称',
	'settings.bookmarksGroupDesc': '见上文。',
	'settings.bookmarksGroupPlaceholder': '例如：用于排序的组（Group for sorting）',
	'settings.bookmarksContextMenusName': '书签集成的右键菜单',
	'settings.bookmarksContextMenusDesc': '在文件管理器右键菜单中启用 <i>自定义排序：为排序添加书签</i> 和 <i>自定义排序：为排序添加书签+同级项</i>（及相关）条目',
	'settings.languageName': '界面语言（Language）',
	'settings.languageDesc': '选择插件的界面语言。选择"自动"将跟随 Obsidian 的界面语言设置。',

	// ===== Language options =====
	'lang.auto': '自动（跟随 Obsidian 界面语言）',
	'lang.zh': '简体中文',
	'lang.en': 'English',

	// ===== Commands =====
	'cmd.enable': '启用并应用自定义排序（先重新解析排序配置）。Sort-on。',
	'cmd.suspend': '暂停自定义排序。Sort-off。',

	// ===== Context menus =====
	'menu.customSort': '自定义排序：',
	'menu.apply': '应用自定义排序',
	'menu.suspend': '暂停自定义排序',
	'menu.bookmarkThis': '为排序添加书签',
	'menu.unbookmarkThis': '从排序中移除书签',
	'menu.bookmarkSiblings': '为排序添加书签+同级项',
	'menu.unbookmarkSiblings': '从排序中移除书签+同级项',
	'menu.bookmarkSelected': '自定义排序：为选中项添加书签',
	'menu.unbookmarkSelected': '自定义排序：从排序中移除选中项书签',
	'menu.bookmarkThisMobile': '为自定义排序添加书签',
	'menu.unbookmarkThisMobile': '从自定义排序中移除书签',
	'menu.bookmarkSiblingsMobile': '为自定义排序添加书签+同级项',
	'menu.unbookmarkSiblingsMobile': '从自定义排序中移除书签+同级项',
	'menu.bookmarkSelectedMobile': '为自定义排序添加书签（选中项）',
	'menu.unbookmarkSelectedMobile': '从自定义排序中移除书签（选中项）',

	// ===== Notices =====
	'notice.parseSuccess': '解析自定义排序规格成功！',
	'notice.parseImplicit': '未找到自定义排序规格，将采用隐式排序（基于书签）。',
	'notice.parseFail': '解析自定义排序规格失败，插件已挂起。\n{error}',
	'notice.errNoValidKey': "未找到有效的 '{key}:' 键（在 YAML front matter 中），或多行 YAML 缩进错误，或一般 YAML 语法错误",
	'notice.errNoSpec': '未找到自定义排序规格，或仅有空规格',
	'notice.applied': '自定义排序已应用。',
	'notice.off': '自定义排序已关闭',
	'notice.feViewProblem': '自定义排序：文件管理器视图出现问题。请查看控制台获取详细信息。',
	'notice.feViewProblemMobile': '自定义排序：文件管理器视图出现问题 - 它可见吗？'
		+ ' 当文件管理器至少显示过一次后才能应用自定义排序。',

	// ===== Status bar =====
	'status.on': '自定义排序：开',
	'status.off': '自定义排序：关',

	// ===== Ribbon tooltip =====
	'ribbon.toggle': '切换自定义排序',

	// ===== Sorting spec errors (shown in Notice / console) =====
	'err.invalidSortingOrder': '无效的排序顺序',
	'err.invalidTargetFolder': '无效的目标文件夹规格',
	'err.dupSortSpec': '文件夹 {path} 的排序规格重复',
	'err.dupOrderAttr': '文件夹 {paths} 的排序顺序规格重复',
	'err.dupOrderRule': '文件夹 {paths} 的排序规则顺序规格重复',
	'err.nestedTargetFolder': '不允许嵌套（缩进）指定目标文件夹',
	'err.danglingOrderAttr': '嵌套（缩进）属性需要先定义排序组',
	'err.missingValue': '属性 "{lexeme}" 后需要跟一个值',
	'err.noSpaceAfterAttr': '属性名称 "{lexeme}" 后需要空格',
	'err.tooManySortingSymbols': '每行最多允许一个排序符号',
	'err.inlineRegexBoth': '当前版本中，前缀和后缀不能同时使用内联正则表达式符号。',
	'err.tooManyPriority': '排序组上只允许一个优先级前缀',
	'err.priorityOnOutsiders': '空匹配模式的排序组不允许设置优先级',
	'err.tooManyCombine': '排序组上只允许一个合并前缀',
	'err.combineOnOutsiders': '空匹配模式的排序组不允许合并',
	'err.tooManyGroupType': '排序组上只允许一个排序组类型前缀',
	'err.priorityAfterGroupType': '优先级前缀必须用在排序组类型指示符之前',
	'err.combineAfterGroupType': '合并前缀必须用在排序组类型指示符之前',
	'err.hideExactName': '需要提供要隐藏的文件或文件夹的完整名称（含扩展名）',
	'err.hideNoSymbols': '要隐藏文件或文件夹，需要提供完整名称（含扩展名），且不允许使用排序符号',
	'err.combinedOrder': '合并组的前驱组不能包含顺序规格。请将其放在合并组中组的最后',
	'err.syntaxNotSupported': '排序规格行不符合任何受支持的语法',
	'err.syntaxThreeDots': '省略号（...）出现多次且未指定更多文本',
	'err.syntaxUnrecognized': '省略号（...）出现多次，或排序规则规格无法识别',
	'err.unrecognizedRule': '无法识别的排序规则规格',
	'err.emptyFolderName': "'{lexeme} {matchLexeme}' 值为空",
	'err.dupByName': "同一名称 <{name}> 的 '{lexeme} {matchLexeme}' 定义重复",
	'err.invalidRegexp': '文件夹正则表达式无效或为空 <{expr}>',
	'err.dupWildcard': "通配符 '{wc}' 的规格重复：{spec}",
	'err.primary': '主',
	'err.secondary': '次',
	'err.orderUnrecognizedExtractor': '{order}排序顺序包含无法识别的值提取器：>>> {text} <<<',
	'err.orderUnrecognizedText': '{order}排序顺序包含无法识别的文本：>>> {text} <<<',
	'err.orderDirectionConflict': '{order}排序方向 {a} 与 {b} 相互矛盾',
	'err.metadataNeedsAlphabetical': '按元数据排序需要使用字母顺序之一',
	'err.adjacency': '排序符号不能直接紧挨着通配符，因为可能导致性能问题。在这种情况下，额外的显式分隔符会有所帮助。',
	'err.dupOutsidersFiles': "忽略文件夹 '{folder}' 的排序规格中重复的 Outsiders-files 排序组定义",
	'err.dupOutsidersFolders': "忽略文件夹 '{folder}' 的排序规格中重复的 Outsiders-folders 排序组定义",
	'err.dupOutsiders': "忽略文件夹 '{folder}' 的排序规格中重复的 Outsiders 排序组定义",
	'err.inconsistentOutsiders': "文件夹 '{folder}' 的排序规格中 Outsiders 排序组定义不一致",

	// ===== Error report format =====
	'err.file': '文件：{path}',
	'err.line': '规格行 #{line}："{content}"',
	'err.problem': '问题：{code}:{label}',
	'err.details': '详情：{details}',
	'err.specProblem': '排序规格问题：{code}:{label} {details} ---在{context}的排序规格文件中遇到：{file}',
	'err.specProblemLine': '排序规格问题：{code}:{label} {details} ---在第 {line} 行的排序规格文件中遇到：{file}',
	'err.problemLineContent': '问题行内容："{content}"',
};

const en: TranslationDict = {
	// ===== Settings tab =====
	'settings.title': 'Custom Sort Settings',
	'settings.delayName': 'Delay for initial automatic application of custom ordering',
	'settings.delayDesc': 'Number of seconds to wait before applying custom ordering on plugin / app start.'
		+ '<br>'
		+ 'For large vaults, multi-plugin vaults or on mobile the value might need to be increased if you encounter issues with auto-applying'
		+ ' of custom ordering on start. The delay gives Obsidian additional time to sync notes from cloud storages, to populate notes metadata caches,'
		+ ' etc.'
		+ '<br>'
		+ 'At the same time if your vault is relatively small or only used on desktop, or not synced with other copies,'
		+ ' decreasing the delay to 0 could be a safe option.'
		+ '<br>'
		+ `Min: {min} sec., max. {max} sec.`,
	'settings.additionalFileName': 'Path or name of additional note(s) containing sorting specification',
	'settings.additionalFileDesc': 'A note name or note path to scan (YAML frontmatter) for sorting specification in addition to the `sortspec` notes and Folder Notes.'
		+ '<br>'
		+ ' The `.md` filename suffix is optional.'
		+ '<br>'
		+ '<p>NOTE: After updating this setting remember to refresh the custom sorting via clicking on the ribbon icon or via the <b>sort-on</b> command'
		+ ' or by restarting Obsidian or reloading the vault</p>',
	'settings.additionalFilePlaceholder': 'e.g. sorting-configuration',
	'settings.indexNoteName': 'Name of index note (Folder Notes support)',
	'settings.indexNoteDesc': 'If you employ the <i>Index-File based</i> approach to folder notes (as documented in '
		+ '<a href="https://github.com/aidenlx/alx-folder-note/wiki/folder-note-pref">Aidenlx Folder Note preferences</a>'
		+ ') enter here the index note name, e.g. <b>_about_</b> or <b>index</b>'
		+ '<br>'
		+ ' The `.md` filename suffix is optional.'
		+ '<br>'
		+ 'This will tell the plugin to read sorting specs and also folders metadata from these files.'
		+ '<br>'
		+ 'The <i>Inside Folder, with Same Name Recommended</i> mode of Folder Notes is handled automatically, no additional configuration needed.'
		+ '</p>'
		+ '<p>NOTE: After updating this setting remember to refresh the custom sorting via clicking on the ribbon icon or via the <b>sort-on</b> command'
		+ ' or by restarting Obsidian or reloading the vault</p>',
	'settings.indexNotePlaceholder': 'e.g. _about_ or index',
	'settings.statusBarEntryName': 'Enable the status bar entry',
	'settings.statusBarEntryDesc': 'The status bar entry shows the label `Custom sort:ON` or `Custom sort:OFF`, representing the current state of the plugin.',
	'settings.notificationsName': 'Enable notifications of plugin state changes',
	'settings.notificationsDesc': 'The plugin can show notifications about its state changes: e.g. when successfully parsed and applied'
		+ ' the custom sorting specification, or, when the parsing failed. If the notifications are disabled,'
		+ ' the only indicator of plugin state is the ribbon button icon. The developer console presents the parsing'
		+ ' error messages regardless if the notifications are enabled or not.',
	'settings.mobileNotificationsName': 'Enable notifications of plugin state changes for mobile devices only',
	'settings.mobileNotificationsDesc': 'See above.',
	'settings.contextSubmenuName': 'Enable File Explorer context submenu `Custom sort:`',
	'settings.contextSubmenuDesc': 'Gives access to operations relevant for custom sorting, e.g. applying custom sorting.',
	'settings.bookmarksHeader': 'Bookmarks integration',
	'settings.bookmarksIntegrationName': 'Automatic integration with core Bookmarks plugin (for indirect drag & drop ordering)',
	'settings.bookmarksIntegrationDesc': 'If enabled, order of files and folders in File Explorer will reflect the order '
		+ 'of bookmarked items in the bookmarks (core plugin) view. Automatically, without any '
		+ 'need for sorting configuration. At the same time, it integrates seamlessly with'
		+ ' <pre style="display: inline;">sorting-spec:</pre> configurations and they can nicely cooperate.'
		+ '<br>'
		+ '<p>To separate regular bookmarks from the bookmarks created for sorting, you can put '
		+ 'the latter in a separate dedicated bookmarks group. The default name of the group is '
		+ "'<i>{defaultGroup}</i>' "
		+ 'and you can change the group name in the configuration field below.'
		+ '<br>'
		+ 'If left empty, all the bookmarked items will be used to impose the order in File Explorer.</p>'
		+ '<p>More information on this functionality in the '
		+ '<a href="https://github.com/SebastianMC/obsidian-custom-sort/blob/master/docs/manual.md#bookmarks-plugin-integration">manual</a> of this custom-sort plugin.'
		+ '</p>',
	'settings.bookmarksGroupName': 'Name of the group in Bookmarks from which to read the order of items',
	'settings.bookmarksGroupDesc': 'See above.',
	'settings.bookmarksGroupPlaceholder': 'e.g. Group for sorting',
	'settings.bookmarksContextMenusName': 'Context menus for Bookmarks integration',
	'settings.bookmarksContextMenusDesc': 'Enable <i>Custom-sort: bookmark for sorting</i> and <i>Custom-sort: bookmark+siblings for sorting</i> (and related) entries '
		+ 'in context menu in File Explorer',
	'settings.languageName': 'Interface language',
	'settings.languageDesc': 'Select the interface language of the plugin. "Auto" follows the Obsidian interface language.',

	// ===== Language options =====
	'lang.auto': 'Auto (follow Obsidian interface language)',
	'lang.zh': '简体中文',
	'lang.en': 'English',

	// ===== Commands =====
	'cmd.enable': 'Enable and apply the custom sorting, (re)parsing the sorting configuration first. Sort-on.',
	'cmd.suspend': 'Suspend the custom sorting. Sort-off.',

	// ===== Context menus =====
	'menu.customSort': 'Custom sort:',
	'menu.apply': 'Apply custom sorting',
	'menu.suspend': 'Suspend custom sorting',
	'menu.bookmarkThis': 'Bookmark it for sorting',
	'menu.unbookmarkThis': 'UNbookmark it from sorting',
	'menu.bookmarkSiblings': 'Bookmark it+siblings for sorting',
	'menu.unbookmarkSiblings': 'UNbookmark it+siblings from sorting',
	'menu.bookmarkSelected': 'Custom sort: bookmark selected for sorting',
	'menu.unbookmarkSelected': 'Custom sort: UNbookmark selected from sorting',
	'menu.bookmarkThisMobile': 'Bookmark it for custom sorting',
	'menu.unbookmarkThisMobile': 'UNbookmark it from custom sorting',
	'menu.bookmarkSiblingsMobile': 'Bookmark it+siblings for custom sorting',
	'menu.unbookmarkSiblingsMobile': 'UNbookmark it+siblings from custom sorting',
	'menu.bookmarkSelectedMobile': 'Bookmark selected for custom sorting',
	'menu.unbookmarkSelectedMobile': 'UNbookmark selected from custom sorting',

	// ===== Notices =====
	'notice.parseSuccess': 'Parsing custom sorting specification SUCCEEDED!',
	'notice.parseImplicit': 'No custom sorting spec, will go with implicit sorting (bookmarks-based).',
	'notice.parseFail': 'Parsing custom sorting specification FAILED. Suspending the plugin.\n{error}',
	'notice.errNoValidKey': "No valid '{key}:' key(s) in YAML front matter or multiline YAML indentation error or general YAML syntax error",
	'notice.errNoSpec': 'No custom sorting specification found or only empty specification(s)',
	'notice.applied': 'Custom sort APPLIED.',
	'notice.off': 'Custom sort OFF',
	'notice.feViewProblem': 'Custom sort File Explorer view problem. See console for detailed message.',
	'notice.feViewProblemMobile': 'Custom sort File Explorer view problem - is it visible?'
		+ ' Can\'t apply custom sorting when the File Explorer was not displayed at least once.',

	// ===== Status bar =====
	'status.on': 'Custom sort:ON',
	'status.off': 'Custom sort:OFF',

	// ===== Ribbon tooltip =====
	'ribbon.toggle': 'Toggle custom sorting',

	// ===== Sorting spec errors =====
	'err.invalidSortingOrder': 'Invalid sorting order',
	'err.invalidTargetFolder': 'Invalid target folder specification',
	'err.dupSortSpec': 'Duplicate sorting spec for folder {path}',
	'err.dupOrderAttr': 'Duplicate order specification for folder(s) {paths}',
	'err.dupOrderRule': 'Duplicate order specification for a sorting rule of folder {paths}',
	'err.nestedTargetFolder': 'Nested (indented) specification of target folder is not allowed',
	'err.danglingOrderAttr': 'Nested (indented) attribute requires prior sorting group definition',
	'err.missingValue': 'Attribute "{lexeme}" requires a value to follow',
	'err.noSpaceAfterAttr': 'Space required after attribute name "{lexeme}"',
	'err.tooManySortingSymbols': 'Maximum one sorting symbol allowed per line',
	'err.inlineRegexBoth': 'In current version, inline regex symbols are not allowed both in prefix and suffix.',
	'err.tooManyPriority': 'Only one priority prefix allowed on sorting group',
	'err.priorityOnOutsiders': 'Priority is not allowed for sorting group with empty match-pattern',
	'err.tooManyCombine': 'Only one combining prefix allowed on sorting group',
	'err.combineOnOutsiders': 'Combining is not allowed for sorting group with empty match-pattern',
	'err.tooManyGroupType': 'Only one sorting group type prefix allowed on sorting group',
	'err.priorityAfterGroupType': 'Priority prefix must be used before sorting group type indicator',
	'err.combineAfterGroupType': 'Combining prefix must be used before sorting group type indicator',
	'err.hideExactName': 'Exact name with ext of file or folders to hide is required',
	'err.hideNoSymbols': 'For hiding of file or folder, the exact name with ext is required and no sorting symbols allowed',
	'err.combinedOrder': 'Predecessor group of combined group cannot contain order specification. Put it at the last of group in combined groups',
	'err.syntaxNotSupported': "Sorting specification line doesn't match any supported syntax",
	'err.syntaxThreeDots': 'three dots occurring more than once and no more text specified',
	'err.syntaxUnrecognized': 'three dots occurring more than once or unrecognized specification of sorting rule',
	'err.unrecognizedRule': 'Unrecognized specification of sorting rule',
	'err.emptyFolderName': "Empty '{lexeme} {matchLexeme}' value",
	'err.dupByName': "Duplicate '{lexeme} {matchLexeme}' definition for the same name <{name}>",
	'err.invalidRegexp': 'Invalid or empty folder regexp expression <{expr}>',
	'err.dupWildcard': "Duplicate wildcard '{wc}' specification for {spec}",
	'err.primary': 'Primary',
	'err.secondary': 'Secondary',
	'err.orderUnrecognizedExtractor': '{order} sorting order contains unrecognized value extractor: >>> {text} <<<',
	'err.orderUnrecognizedText': '{order} sorting order contains unrecognized text: >>> {text} <<<',
	'err.orderDirectionConflict': '{order} sorting direction {a} and {b} are contradicting',
	'err.metadataNeedsAlphabetical': 'Sorting by metadata requires one of alphabetical orders',
	'err.adjacency': 'Sorting symbol must not be directly adjacent to a wildcard because of potential performance problem. An additional explicit separator helps in such case.',
	'err.dupOutsidersFiles': "Ignoring duplicate Outsiders-files sorting group definition in sort spec for folder '{folder}'",
	'err.dupOutsidersFolders': "Ignoring duplicate Outsiders-folders sorting group definition in sort spec for folder '{folder}'",
	'err.dupOutsiders': "Ignoring duplicate Outsiders sorting group definition in sort spec for folder '{folder}'",
	'err.inconsistentOutsiders': "Inconsistent Outsiders sorting group definition in sort spec for folder '{folder}'",

	// ===== Error report format =====
	'err.file': 'File: {path}',
	'err.line': 'Specification line #{line}: "{content}"',
	'err.problem': 'Problem: {code}:{label}',
	'err.details': 'Details: {details}',
	'err.specProblem': 'Sorting specification problem: {code}:{label} {details} ---encountered in{context} sorting spec in file {file}',
	'err.specProblemLine': 'Sorting specification problem: {code}:{label} {details} ---encountered in line {line} of sorting spec in file {file}',
	'err.problemLineContent': 'Content of problematic line: "{content}"',
};

const dictionaries: Record<ResolvedLanguage, TranslationDict> = { zh, en };

let currentLanguage: ResolvedLanguage = 'zh';
let fallbackLanguage: ResolvedLanguage = 'en';

/** Resolve 'auto' to an actual language based on Obsidian's locale */
export function resolveLanguage(lang: LanguageCode): ResolvedLanguage {
	if (lang === 'auto') {
		// Detect from Obsidian's moment locale (e.g. 'zh-cn', 'en', 'de')
		try {
			const locale = (window as any).moment?.locale?.() ?? 'en';
			return locale.toLowerCase().startsWith('zh') ? 'zh' : 'en';
		} catch {
			return 'en';
		}
	}
	return lang;
}

/** Set the current language (auto resolves immediately) */
export function setLanguage(lang: LanguageCode): void {
	currentLanguage = resolveLanguage(lang);
}

/** Get the current resolved language */
export function getLanguage(): ResolvedLanguage {
	return currentLanguage;
}

/**
 * Translate a key with optional parameters.
 * Supports both flat keys ('settings.delayName') and nested templates.
 * Parameters use {name} placeholders.
 */
export function t(key: string, params?: Record<string, string | number | undefined>): string {
	const dict = dictionaries[currentLanguage] ?? dictionaries[fallbackLanguage];
	let template = lookup(dict, key);
	if (template === undefined) {
		// Fallback to other language
		const fallbackDict = dictionaries[currentLanguage === 'zh' ? 'en' : 'zh'];
		template = lookup(fallbackDict, key);
	}
	if (template === undefined) {
		return key; // Not found — return the key itself
	}
	if (params) {
		for (const k in params) {
			template = template.replace(new RegExp(`\\{${k}\\}`, 'g'), String(params[k]));
		}
	}
	return template;
}

function lookup(dict: TranslationDict, key: string): string | undefined {
	// Try the full key first (flat keys like 'err.specProblem')
	const direct = dict[key];
	if (typeof direct === 'string') {
		return direct;
	}
	// Fall back to dot-path traversal (nested keys)
	const parts = key.split('.');
	let node: TranslationDict = dict;
	for (const part of parts) {
		const next = node[part];
		if (typeof next === 'string') {
			return next;
		}
		if (next && typeof next === 'object') {
			node = next as TranslationDict;
		} else {
			return undefined;
		}
	}
	return undefined;
}

/** Convenience: translate a string from the current dict directly (for tests) */
export function translate(dict: TranslationDict, key: string, params?: Record<string, string | number | undefined>): string {
	let template = lookup(dict, key) ?? key;
	if (params) {
		for (const k in params) {
			template = template.replace(new RegExp(`\\{${k}\\}`, 'g'), String(params[k]));
		}
	}
	return template;
}
