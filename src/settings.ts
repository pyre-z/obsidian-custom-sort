import {App, normalizePath, PluginSettingTab, sanitizeHTMLToDom, Setting} from "obsidian";
import {groupNameForPath} from "./utils/BookmarksCorePluginSignature";
import CustomSortPlugin from "./main";
import { t, LanguageCode, setLanguage } from "./i18n";

export interface CustomSortPluginSettings {
    additionalSortspecFile: string
    indexNoteNameForFolderNotes: string
    suspended: boolean
    statusBarEntryEnabled: boolean
    notificationsEnabled: boolean
    mobileNotificationsEnabled: boolean
    automaticBookmarksIntegration: boolean
    customSortContextSubmenu: boolean
    bookmarksContextMenus: boolean
    bookmarksGroupToConsumeAsOrderingReference: string
    delayForInitialApplication: number // miliseconds
    language: LanguageCode
}

const MILIS = 1000
const DEFAULT_DELAY_SECONDS = 1
const DELAY_MIN_SECONDS = 0
const DELAY_MAX_SECONDS = 30
const DEFAULT_DELAY = DEFAULT_DELAY_SECONDS * MILIS

export const DEFAULT_SETTINGS: CustomSortPluginSettings = {
    additionalSortspecFile: '',
    indexNoteNameForFolderNotes: '',
    suspended: true,  // if false by default, it would be hard to handle the auto-parse after plugin install
    statusBarEntryEnabled: true,
    notificationsEnabled: true,
    mobileNotificationsEnabled: false,
    customSortContextSubmenu: true,
    automaticBookmarksIntegration: false,
    bookmarksContextMenus: false,
    bookmarksGroupToConsumeAsOrderingReference: 'sortspec',
    delayForInitialApplication: DEFAULT_DELAY,
    language: 'auto'
}

// On API 1.2.x+ enable the bookmarks integration by default
export const DEFAULT_SETTING_FOR_1_2_0_UP: Partial<CustomSortPluginSettings> = {
    automaticBookmarksIntegration: true,
    bookmarksContextMenus: true
}

const pathToFlatString = (path: string): string => {
    return path.replace(/\//g,'_').replace(/\\/g, '_')
}

export class CustomSortSettingTab extends PluginSettingTab {
    plugin: CustomSortPlugin;

    constructor(app: App, plugin: CustomSortPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;

        containerEl.empty();

        // Language selection (appears at the top so users can switch immediately)
        new Setting(containerEl)
            .setName(t('settings.languageName'))
            .setDesc(t('settings.languageDesc'))
            .addDropdown(dropdown => dropdown
                .addOption('auto', t('lang.auto'))
                .addOption('zh', t('lang.zh'))
                .addOption('en', t('lang.en'))
                .setValue(this.plugin.settings.language)
                .onChange(async (value: LanguageCode) => {
                    this.plugin.settings.language = value;
                    setLanguage(value);
                    await this.plugin.saveSettings();
                    // Re-render the settings tab in the new language
                    this.display();
                }));

        const delayDescr: DocumentFragment = sanitizeHTMLToDom(
            t('settings.delayDesc', {min: DELAY_MIN_SECONDS, max: DELAY_MAX_SECONDS})
        )

        new Setting(containerEl)
            .setName(t('settings.delayName'))
            .setDesc(delayDescr)
            .addText(text => text
                .setValue(`${this.plugin.settings.delayForInitialApplication/MILIS}`)
                .onChange(async (value) => {
                    let delayS = parseFloat(value)
                    delayS = (Number.isNaN(delayS) || !Number.isFinite((delayS))) ? DEFAULT_DELAY_SECONDS : (delayS < DELAY_MIN_SECONDS ? DELAY_MIN_SECONDS :(delayS > DELAY_MAX_SECONDS ? DELAY_MAX_SECONDS : delayS))
                    delayS = Math.round(delayS*10) / 10  // allow values like 0.2
                    this.plugin.settings.delayForInitialApplication = delayS * MILIS
                    await this.plugin.saveSettings()
                }))

        const additionalSortspecFileDescr: DocumentFragment = sanitizeHTMLToDom(
            t('settings.additionalFileDesc')
        )

        new Setting(containerEl)
            .setName(t('settings.additionalFileName'))
            .setDesc(additionalSortspecFileDescr)
            .addText(text => text
                .setPlaceholder(t('settings.additionalFilePlaceholder'))
                .setValue(this.plugin.settings.additionalSortspecFile)
                .onChange(async (value) => {
                    this.plugin.settings.additionalSortspecFile = value.trim() ? normalizePath(value) : '';
                    await this.plugin.saveSettings();
                }));

        const indexNoteNameDescr: DocumentFragment = sanitizeHTMLToDom(
            t('settings.indexNoteDesc')
        )

        new Setting(containerEl)
            .setName(t('settings.indexNoteName'))
            .setDesc(indexNoteNameDescr)
            .addText(text => text
                .setPlaceholder(t('settings.indexNotePlaceholder'))
                .setValue(this.plugin.settings.indexNoteNameForFolderNotes)
                .onChange(async (value) => {
                    this.plugin.settings.indexNoteNameForFolderNotes = value.trim() ? normalizePath(value) : '';
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(t('settings.statusBarEntryName'))
            .setDesc(t('settings.statusBarEntryDesc'))
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.statusBarEntryEnabled)
                .onChange(async (value) => {
                    this.plugin.settings.statusBarEntryEnabled = value;
                    if (value) {
                        // Enabling
                        if (this.plugin.statusBarItemEl) {
                            // for sanity
                            this.plugin.statusBarItemEl.detach()
                        }
                        this.plugin.statusBarItemEl =  this.plugin.addStatusBarItem();
                        this.plugin.updateStatusBar()

                    } else { // disabling
                        if (this.plugin.statusBarItemEl) {
                            this.plugin.statusBarItemEl.detach()
                        }
                    }
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(t('settings.notificationsName'))
            .setDesc(t('settings.notificationsDesc'))
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.notificationsEnabled)
                .onChange(async (value) => {
                    this.plugin.settings.notificationsEnabled = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(t('settings.mobileNotificationsName'))
            .setDesc(t('settings.mobileNotificationsDesc'))
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.mobileNotificationsEnabled)
                .onChange(async (value) => {
                    this.plugin.settings.mobileNotificationsEnabled = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(t('settings.contextSubmenuName'))
            .setDesc(t('settings.contextSubmenuDesc'))
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.customSortContextSubmenu)
                .onChange(async (value) => {
                    this.plugin.settings.customSortContextSubmenu = value;
                    await this.plugin.saveSettings();
                }));

        containerEl.createEl('h2', {text: t('settings.bookmarksHeader')});
        const bookmarksIntegrationDescription: DocumentFragment = sanitizeHTMLToDom(
            t('settings.bookmarksIntegrationDesc', {defaultGroup: DEFAULT_SETTINGS.bookmarksGroupToConsumeAsOrderingReference})
        )

        new Setting(containerEl)
            .setName(t('settings.bookmarksIntegrationName'))
            .setDesc(bookmarksIntegrationDescription)
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.automaticBookmarksIntegration)
                .onChange(async (value) => {
                    this.plugin.settings.automaticBookmarksIntegration = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(t('settings.bookmarksGroupName'))
            .setDesc(t('settings.bookmarksGroupDesc'))
            .addText(text => text
                .setPlaceholder(t('settings.bookmarksGroupPlaceholder'))
                .setValue(this.plugin.settings.bookmarksGroupToConsumeAsOrderingReference)
                .onChange(async (value) => {
                    value = groupNameForPath(value.trim()).trim()
                    this.plugin.settings.bookmarksGroupToConsumeAsOrderingReference = value ? pathToFlatString(normalizePath(value)) : '';
                    await this.plugin.saveSettings();
                }));

        const bookmarksIntegrationContextMenusDescription: DocumentFragment = sanitizeHTMLToDom(
            t('settings.bookmarksContextMenusDesc')
        )
        new Setting(containerEl)
            .setName(t('settings.bookmarksContextMenusName'))
            .setDesc(bookmarksIntegrationContextMenusDescription)
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.bookmarksContextMenus)
                .onChange(async (value) => {
                    this.plugin.settings.bookmarksContextMenus = value;
                    if (value) {
                        this.plugin.settings.customSortContextSubmenu = true; // automatically enable custom sort context submenu
                    }
                    await this.plugin.saveSettings();
                }))
    }
}
