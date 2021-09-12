import path = require("path");
import * as vscode from "vscode";

import {
  LanguageClient,
  LanguageClientOptions,
  RevealOutputChannelOn,
  ServerOptions,
  TransportKind,
} from "vscode-languageclient/node";

let client: LanguageClient;

export function activate(context: vscode.ExtensionContext) {
  const translationFiles = vscode.workspace.getConfiguration("lsp-translations").get<string[]>("translationFiles");
  let serverOptions: ServerOptions = {
    run: {
      command: `--todo run --manifest-path ${context.asAbsolutePath(path.join('lsp-translations', 'Cargo.toml'))}`,
    },
    debug: {
      command: `cargo`,
      args: ['run'],
      transport: TransportKind.stdio,
      options: {
        cwd: context.asAbsolutePath('lsp-translations'),
        shell: true,
      }
    },
  };

  // Options to control the language client
  let clientOptions: LanguageClientOptions = {
   revealOutputChannelOn: RevealOutputChannelOn.Info,
    documentSelector: [{ scheme: "file", language: "javascript" }],
    synchronize: {
      fileEvents: translationFiles?.map((globPattern) => vscode.workspace.createFileSystemWatcher(globPattern)),
    },
  };
  vscode.window.showInformationMessage("loaded!");
  vscode.workspace.onDidChangeConfiguration((e) => {
    vscode.window.showInformationMessage('Updated');
  });

  // Create the language client and start the client.
  client = new LanguageClient(
    "lsp-translations",
    "lsp-translations",
    serverOptions,
    clientOptions
  );

  // Start the client. This will also launch the server
  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
