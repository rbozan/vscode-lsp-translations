**<center>**

```
translate('h
            ^------------------------------------------------------
            | - hello                                       Hi! 👋 |
            | - header.title     Do more with your translations 📔 |
            | - header.sub                in Visual Studio Code 👩‍💻 |
             ------------------------------------------------------
```

**</center>**

# vscode-lsp-translations

An extension for VSCode which provides autocompletion for the translations within your project. Uses https://github.com/rbozan/lsp-translations under the hood. Download the extension on https://marketplace.visualstudio.com/items?itemName=rbozan.vscode-lsp-translations. 

## Features

### Autocompletion for your translations

https://user-images.githubusercontent.com/7997154/139867598-1ab67565-07e1-40c4-b05f-587a509dda5c.mp4

### Hovering over your translation keys gives you information

https://user-images.githubusercontent.com/7997154/139867604-6939e486-e3ba-4664-9318-546146328adf.mp4

## Requirements

This extension requires https://github.com/rbozan/lsp-translations which will automatically be downloaded or updated on startup.

- Translation files must be in `.json` or `.yaml`/`.yml` format for now. Supporting other formats is being worked on in the [Treesitter issue](https://github.com/rbozan/lsp-translations/issues/10).
- While `lsp-translations` theoretically works with any programming language, this extension is currently only enabled on a limited amount of programming languages and extensions, namely:

  - JavaScript (including JSX)

  - TypeScript (including TSX)

  - Ruby

  - PHP

## Quick start

1. Install the extension on https://marketplace.visualstudio.com/items?itemName=rbozan.vscode-lsp-translations
2. Add the configuration under [Common configurations](#common-configurations) to your workspace-settings
3. `translate(` away! (or `t(`, `translate`, `I18n.t(`),

## Extension Settings

This extension contributes the following settings which are recommended to set as workspace settings:

---

### `lsp-translations.translationFiles.include` (required)

Glob patterns for the translation files which contain all the translations of your project.

#### Default

```json
[
  "./translations.json",
  "./translations/*.json",
  "./translations.yml",
  "./translations/*.yml",
  "./translations.yaml",
  "./translations/*.yaml"
]
```

---

### `lsp-translations.translationFiles.exclude`

Glob patterns for the files which match the patterns in `lsp-translations.translationFiles.include` but should not be included as translation file.

#### Default

```json
[]
```

---

### `lsp-translations.fileName.details`

An optional regex pattern for the file name which can provide extra details to the extension. Can be useful when your translation file name contains language like 'en'.

#### Default

None.

#### Example(s)

```json
"(?P<language>.+?)\\.json"
```

---

### `lsp-translations.key.details`

An optional regex pattern for the key of a translation which can provide extra details to the extension. Can be useful when your translation keys contains a language like 'en'.

#### Default

None.

#### Example(s)

```json
"^.+?\\.(?<language>.+?)\\."
```

---

### `lsp-translations.key.filter`

An optional regex pattern to filter out unneeded parts of a translation key.

#### Default

None.

#### Example(s)

If you have a translation key like `123.abc.key` and you only provide `key` to the `translation`function in your code, you can use this setting to filter out the unneeded parts. The first regex group would then be the correct key to be used. In the case of `123.abc.key` you can use the following regex:

```regex
^.+?\..+?\.(.+$)
```

To read more information about this particular regex, see https://regex101.com/r/YLnGRw/1.

## Common configurations

Most projects have a similar way of defining their translations. If you use any of the following ways to organise your translations you can use the configuration for your workspace to easily use the extension.

### Multiple translation files with the language in the file name

| Key        | Value             | Example   |
| ---------- | ----------------- | --------- |
| File name  | `(language).json` | `en.json` |
| Key format | `(key)`           | `header`  |

#### Configuration

```json
"lsp-translations.translationFiles.include": ["./translations/*.json"],
"lsp-translations.fileName.details": "(?P<language>.+?)\\."
```

### Supplying the language in the translation key

| Key        | Value              | Example         |
| ---------- | ------------------ | --------------- |
| File name  | `(anything).json`  | `language.json` |
| Key format | `(language).(key)` | `en.header`     |

#### Configuration

```json
"lsp-translations.translationFiles.include": ["./translations/*.json"],
"lsp-translations.key.details": "^(?P<language>.+?)\\.",
"lsp-translations.key.filter": "^.+?\\.(.+$)"
```

### Supplying a project id and the language in the translation key

| Key        | Value                           | Example           |
| ---------- | ------------------------------- | ----------------- |
| File name  | `(anything).json`               | `language.json`   |
| Key format | `(project_id).(language).(key)` | `12345.en.header` |

#### Configuration

```json
"lsp-translations.translationFiles.include": ["./translations/*.json"],
"lsp-translations.key.details": "^.+?\\.(?P<language>.+?)\\.",
"lsp-translations.key.filter": "^.+?\\..+?\\.(.+$)"
```

## FAQ

### I'm not seeing any autocompletion for my translations

Check if you have setted up the configuration correctly.

### The translations are loaded but are not distinguished by language or country

Use the regex match group `language` to distinguish by language.
