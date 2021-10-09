**<center>**
```
translate('h
            ^------------------------------------------------------
            | - hello                                       Hi! 👋 |
            | - header.title     Autocomplete your translations 📔 |
            | - header.sub       and more in Visual Studio Code 👩‍💻 |
             ------------------------------------------------------
```
**</center>**
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