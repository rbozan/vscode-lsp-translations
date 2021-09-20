```
translate('h
            ^---------------------------------------------------
            | - hello                                       Hi! |
            | - header.title     Autocomplete your translations |
            | - header.sub       and more in Visual Studio Code |
             ---------------------------------------------------
```

# vscode-lsp-translations

An extension for VSCode which provides autocompletion for the translations within your project. Uses https://github.com/rbozan/lsp-translations under the hood.

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements
* https://github.com/rbozan/lsp-translations, which will automatically be downloaded on first startup.

## Extension Settings

This extension contributes the following settings:

<table>
  <thead>
    <tr>
      <td><strong>Setting</strong></td>
      <td><strong>Default</strong></td>
      <td><strong>Description</strong></td>
      <td><strong>Examples</strong></td>
    </tr>
  </thead>
  <tbody>

<tr>
<td>
        
`lsp-translations.translationFiles`

</td>
<td>
        
```json
[
"./translations.json",
"./translations/*.json"
]
```

</td>
<td>Glob patterns for the translation files which contain all the translations of your project.</td>
<td></td>
</tr>
    
  
<tr>
<td>
        
`lsp-translations.fileName.details`

</td>
<td>🚫</td>
<td>An optional regex pattern for the file name which can provide extra details to the extension. Can be useful when your translation file name contains language like 'en'.</td>
<td></td>
</tr>
    
    
<tr>
<td>
        
`lsp-translations.key.details`

</td>
<td>🚫</td>
<td>An optional regex pattern for the key of a translation which can provide extra details to the extension. Can be useful when your translation keys contains a language like 'en'.</td>
<td>

```json
"^.+?\\.(?<language>.+?)\\."
```

</td>
</tr>

<tr>
<td>

`lsp-translations.key.filter`

</td>
<td>🚫</td>
<td>An optional regex pattern to filter out unneeded parts of a translation key. For example: if you have a translation key like `123.abc.key` and you only provide `key` to your translation function, you can use this setting to filter out the unneeded parts. The first regex group would be the correct key name.</td>
<td></td>
</tr>
    
  </tbody>
</table>

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

-----------------------------------------------------------------------------------------------------------
## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

**Note:** You can author your README using Visual Studio Code.  Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
* Toggle preview (`Shift+CMD+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
* Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (macOS) to see a list of Markdown snippets

### For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
