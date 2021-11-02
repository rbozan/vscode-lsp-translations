
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

An extension for VSCode which provides autocompletion for the translations within your project. Uses https://github.com/rbozan/lsp-translations under the hood.

## Features

### Autocompletion for your translations

https://user-images.githubusercontent.com/7997154/139867598-1ab67565-07e1-40c4-b05f-587a509dda5c.mp4

### Hovering over your translation keys gives you information

https://user-images.githubusercontent.com/7997154/139867604-6939e486-e3ba-4664-9318-546146328adf.mp4

## Requirements
This extension requires https://github.com/rbozan/lsp-translations which will automatically be downloaded or updated on startup.
* Translation files must be in `.json` or `.yaml`/`.yml` format for now. Supporting other formats is being worked on in the [Treesitter issue](https://github.com/rbozan/lsp-translations/issues/10).
* While  `lsp-translations`  theoretically  works  with  any  programming  language,  this  extension  is  currently  only  enabled  on  a  limited  amount  of  programming  languages  and  extensions,  namely:

	-  JavaScript  (including  JSX)

	-  TypeScript  (including  TSX)

	-  Ruby

## Extension Settings

This extension contributes the following settings which are recommended to set as workspace settings:

___
###  `lsp-translations.translationFiles`
Glob patterns for the translation files which contain all the translations of your project.

#### Default ( HAS TO BE UPDATED FOR INCLUDE + EXCLUDE )
```json
[
	"./translations.json",
	"./translations/*.json"
]
```
___
### `lsp-translations.fileName.details`
An optional regex pattern for the file name which can provide extra details to the extension. Can be useful when your translation file name contains language like 'en'.

#### Default
🚫

#### Example(s)
```json
"(?P<language>.+?)\\.json"
```
___
### `lsp-translations.key.details`
An optional regex pattern for the key of a translation which can provide extra details to the extension. Can be useful when your translation keys contains a language like 'en'.

#### Default
🚫

#### Example(s)

```json
"^.+?\\.(?<language>.+?)\\."
```
___
### `lsp-translations.key.filter`
An optional regex pattern to filter out unneeded parts of a translation key.

#### Default
🚫

#### Example(s)
If you have a translation key like `123.abc.key` and you only provide `key` to the `translation`function in your code, you can use this setting to filter out the unneeded parts. The first regex group would then be the correct key to be used. In the case of `123.abc.key` you can use the following regex:
```regex
^.+?\..+?\.(.+$)
```
To read more information about this particular regex, see https://regex101.com/r/YLnGRw/1.

## Common configurations
Most projects have a similar way of defining their translations. If you use any of the following ways to organise your translations you can use the configuration for your workspace to easily use the extension.

### Multiple translation files with the language in the file name

Key | Value | Example
-----------|-----------|--------
File name | `(language).json` | `en.json`
Key format | `(key)` | `header`
Configuration| <pre lang="json">test</pre>

### Supplying the language in the translation key

Key | Value | Example
-----------|-----------|--------
File name | `(anything).json` | `language.json`
Key format | `(language).(key)` | `en.header`
Configuration| <pre lang="json">test</pre>

### Supplying a project id and the language in the translation key

Key | Value | Example
-----------|-----------|--------
File name | `(anything).json` | `language.json`
Key format | `(project_id).(language).(key)` | `12345.en.header`
Configuration| <pre lang="json">test</pre>

## FAQ
### I'm not seeing any autocompletion for my translations
Check if you have setted up the configuration correctly.

### The translations are loaded but are not distinguished by language or country
Use the regex match group `language` to distinguish by language.
