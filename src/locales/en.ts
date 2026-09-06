/**
 * English locale for Custom Sort plugin.
 * Add a new language by creating a new file in src/locales/ and
 * registering it in src/locales/index.ts
 */
import type { TranslationDict } from '../i18n';

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
	'menu.hideFromTree': 'Hide from file tree',
	'menu.showInTree': 'Show in file tree',
	'menu.hideFromTreeSelected': 'Hide selected from file tree',
	'menu.showInTreeSelected': 'Show selected in file tree',
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

export default en;
