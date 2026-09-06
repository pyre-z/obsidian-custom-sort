# 自定义文件管理器排序（Custom File Explorer sorting）

> 🌍 **语言 / Language**：[简体中文](README.md) | [English](README.en.md)
>
> 这是简明版 README，重点介绍**最常用的基本场景**。
> 更详细的高级文档参见：[advanced-README.md（英文）](https://github.com/SebastianMC/obsidian-custom-sort/blob/master/docs/advanced-README.md)

---

## 自由排列文件管理器中的笔记和文件夹（Obsidian 插件）

完全掌控笔记和文件夹的显示顺序，支持两种方式：

- 🥇 **配置驱动（config-driven）排序**：丰富的选项，实现最精细的排序控制
- 🥈 **拖放排序（drag and drop）**：通过书签（bookmarks）集成实现

最简单的用法是通过拖放来排序：

![拖放排序最简单的例子](https://github.com/SebastianMC/obsidian-custom-sort/assets/23032356/25c997e3-c595-448c-a804-5fa9a66bae20)

另一个典型场景是为每个文件夹应用不同的排序顺序：

![不同文件夹应用不同排序顺序](https://raw.githubusercontent.com/SebastianMC/obsidian-custom-sort/master/docs/img/different-sorting-order-per-folder.png)

详细说明和视频教程参见 [wiki 文档](https://github.com/SebastianMC/obsidian-custom-sort/wiki/How-to-order-items-in-File-Explorer-with-drag-and-drop%3F)

### 配置驱动的更多高级能力

- 文件夹和文件可同等对待，也可区别对待，由你决定
- 支持文件夹级甚至笔记组级的精细规格
- 支持完全手动排序
  - 按期望顺序显式列出笔记和文件夹名称
  - 仅使用前缀或后缀标记以获得更大灵活性
  - 支持通配符（wildcard）名称匹配
  - 从标题中提取数字和日期进行排序
- 按笔记的自定义元数据分组和排序
- 支持标准和非标准规则自动排序
- 手动与自动排序可混合使用
- 支持复合数字排序（前缀、后缀，如后缀中的日期，或中间位置）
- 支持罗马数字，包括复合罗马数字
- 按前缀、后缀或前后缀分组
  - 即使在同一文件夹内，每个组也可以有不同的排序规则
- 配置简单但功能多样
- 配置直接存储在你的笔记 front matter 中
  - 使用笔记属性（又名 _metadata_ / _frontmatter_ / _YAML_）中的 `sorting-spec:` 键
- 未配置自定义排序的文件夹保持 Obsidian 标准排序
- 支持排序规格的继承，并带有灵活的排除和覆盖逻辑

---

## 基础场景 1：为特定文件夹设置自定义排序

在你想要配置排序的文件夹中创建一个名为 `sortspec` 的新笔记

在新笔记的顶部放入以下 YAML front matter 文本：

```yaml
---
sorting-spec: |
  order-desc: a-z
---
```

点击侧边栏图标（![未激活](https://raw.githubusercontent.com/SebastianMC/obsidian-custom-sort/master/docs/icons/icon-inactive.png)，手机上是 ![静态图标](https://raw.githubusercontent.com/SebastianMC/obsidian-custom-sort/master/docs/icons/icon-mobile-initial.png)）让插件读取排序规格并应用它。
排序应应用到该文件夹。在桌面和平板上，侧边栏图标会变成 ![已激活](https://raw.githubusercontent.com/SebastianMC/obsidian-custom-sort/master/docs/icons/icon-active.png)

!!! **完成！** !!!

你应该看到文件夹中的文件和子文件夹按逆字母顺序排序，文件夹和文件交错排列

下面的示意图展示了某个 vault 根文件夹应用逆字母顺序后的效果：

![基础示例](https://github.com/SebastianMC/obsidian-custom-sort/blob/master/docs/svg/simplest-example-3.svg)

---

### 备注

> 备注：
> - 你的新 `sortspec` 笔记应该[长这样](https://github.com/SebastianMC/obsidian-custom-sort/blob/master/docs/examples/basic/sortspec.md?plain=1)，只是语法高亮可能不同
> - 你会注意到文件夹和文件被同等对待并交错排列
>   - 具体行为取决于你的文件夹中有哪些文件和子文件夹
> - 通过 Obsidian 标准 UI 按钮更改排序顺序不会影响你的文件夹，除非...
>   - ...除非你点击侧边栏图标停用自定义排序，使其变为 ![未激活](https://raw.githubusercontent.com/SebastianMC/obsidian-custom-sort/master/docs/icons/icon-inactive.png)
> - 需要明确：笔记 `sortspec` 对应的底层文件名显然是 `sortspec.md`
> - 遇到问题可参考 [advanced-README.md 的 TL;DR 部分](https://github.com/SebastianMC/obsidian-custom-sort/blob/master/docs/advanced-README.md#tldr-usage)
> - 放心尝试！插件以非破坏性方式工作，不会修改你 vault 中的任何内容。
>   它只改变文件管理器中文件和文件夹的显示顺序

---

## 基础场景 2：为文件夹及其子文件夹应用相同排序

假设你的 vault 中有以下文件夹结构：

```
/
├── Notes/
│   ├── 2020/
│   ├── 2021/
│   └── 2022/
├── Projects/
│   ├── Alpha/
│   └── Beta/
└── Archive/
```

你可以**只创建一个** `sortspec` 笔记放在**根目录**，为所有文件夹应用相同的排序规则：

```yaml
---
sorting-spec: |
  target-folder: /*
  order-asc: a-z
---
```

`target-folder: /*` 表示"匹配根文件夹及其所有层级的子文件夹"（整个子树）。子文件夹内的文件也会按此规则排序，除非子文件夹有自己的 `sortspec` 笔记。

只想匹配**直接子文件夹**时用 `/...`：

```yaml
---
sorting-spec: |
  target-folder: /...
  order-asc: a-z
---
```

> 通配符说明：`/*` = 匹配文件夹及其所有子孙（整个子树）；`/...` = 匹配文件夹及其直接子文件夹。

---

## 基础场景 3：手动指定精确顺序

有时你想要的是完全手动控制的顺序，直接在 `sorting-spec: |` 下逐行列出项目名称即可：

```yaml
---
sorting-spec: |
    target-folder: /
    Inbox
    Projects
    Archive
    Templates
---
```

文件夹将按你列出的顺序显示：Inbox → Projects → Archive → Templates。未列出的项目将排在最后。

> 注意：只列出部分项目也是可以的，未列出的项目会自动排在后面（除非规格另有说明）。

---

## 更多功能

### 📌 元数据排序

按笔记 front matter 中的自定义字段排序：

```yaml
---
sorting-spec: |
    target-folder: 读书笔记
    < a-z by-metadata: Pages
---
```

含有 `Pages` 元数据的笔记会排在最前面，按该元数据的值字母排序；没有该元数据的笔记排在后面，默认按字母顺序排列。

`by-metadata: <字段名>` 告诉插件按哪个元数据字段排序。

### 🏷️ 隐藏项目

在排序中隐藏特定文件或文件夹（需要完整文件名，含扩展名）：

```yaml
---
sorting-spec: |
  /--hide: .DS_Store
  /--hide: .obsidian
---
```

也可以用简写 `--hide:`。被隐藏的项目不会出现在文件管理器中。

> 不想手写规则？本 Fork 也支持直接在文件管理器中右键操作，见下方「从文件树隐藏 / 显示」。

### ⚡️ 实时刷新排序（本 Fork 新增）

编辑并保存 `sortspec.md` 后，本 Fork 会**自动**重新读取排序规格并刷新文件管理器，无需再手动点击侧边栏图标。

- 监听 `sortspec.md`（以及文件夹笔记、额外排序文件、索引笔记等）的元数据变更
- 内置约 300ms 防抖，连续保存也不会频繁触发刷新
- 保存后文件管理器顺序立即更新

### 👁️ 从文件树隐藏 / 显示（本 Fork 新增）

除了手写 `/--hide:` 规则，你还可以直接在文件管理器中操作：

- 右键单个文件或文件夹 → 选择「从文件树中隐藏」或「从文件树中显示」
- 多选后右键 → 批量隐藏 / 显示
- 隐藏规则会自动写入对应文件夹的 `sortspec.md`（不存在则新建）
- 对单个项目，菜单文案会根据当前是否已隐藏自动切换（`eye-off` / `eye` 图标）

### 🔀 组合排序组

使用 `/+` 前缀将多个排序组合并为一个逻辑组：

```yaml
---
sorting-spec: |
  /+ Notes \d\d\d\d
  /+ Notes \d\d\d\d-\d\d
   > advanced modified
---
```

`/+` 前缀告诉排序引擎将相邻的 `/+` 组组合起来。上例中，`Notes 2022` 和 `Notes 2022-12` 这类标题会先出现，按修改日期倒序排列，其余文件排在后面。

---

## 🌐 多语言支持（i18n）

本 Fork 新增了 **i18n 多语言支持**：

- 支持 **简体中文** 和 **English**
- 默认 **自动跟随 Obsidian 界面语言**（在设置 → 界面语言中可手动切换）
- 覆盖全部 UI：设置面板、右键菜单、命令、通知、状态栏、解析错误消息
- 控制台错误日志保持英文，便于与上游文档对照排查

切换语言：**设置 → 插件选项 → 界面语言（Language）** → 选择「自动 / 简体中文 / English」，立即生效，无需重启。

---

## 安装

### 方法一：Obsidian 社区插件（官方版）

1. 打开 Obsidian → 设置 → 第三方插件 → 关闭安全模式
2. 浏览社区插件 → 搜索 **"Custom File Explorer sorting"**
3. 安装并启用

### 方法二：手动安装（本中文/i18n Fork）

1. 从 [Releases](../../releases) 或构建产物下载 `main.js`、`manifest.json`、`styles.css`
2. 放入你的 vault：`.obsidian/plugins/obsidian-custom-sort/`
3. 在 Obsidian 设置 → 第三方插件中启用

### 从源码构建

```bash
npm install
npm run build   # 产物在 dist/main.js
npm test        # 运行测试（849 个测试全部通过）
```

---

## 致谢

- 原作者：[SebastianMC](https://github.com/SebastianMC)
- 上游仓库：[SebastianMC/obsidian-custom-sort](https://github.com/SebastianMC/obsidian-custom-sort)
- 本 Fork：由 [pyre-z](https://github.com/pyre-z) 汉化并添加 i18n 支持，GPL-3.0 许可

更多高级用法、语法参考和故障排查，参见 [advanced-README.md](https://github.com/SebastianMC/obsidian-custom-sort/blob/master/docs/advanced-README.md)。
