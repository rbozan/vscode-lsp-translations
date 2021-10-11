import path = require("path");
import * as vscode from "vscode";
import {
  fetchOrUpdateServerBinaries,
  getServerBinaryExecutable,
} from "./downloader";

import {
  LanguageClient,
  LanguageClientOptions,
  RevealOutputChannelOn,
  ServerOptions,
  TransportKind,
} from "vscode-languageclient/node";

let client: LanguageClient;

export async function activate(context: vscode.ExtensionContext) {
  await fetchOrUpdateServerBinaries(context);

  const translationFiles = vscode.workspace
    .getConfiguration("lsp-translations")
    .get<string[]>("translationFiles");
  let serverOptions: ServerOptions = {
    run: {
      command: getServerBinaryExecutable(context),
      transport: TransportKind.stdio,
    },
    debug: {
      command: `cargo`,
      args: ["run"],
      transport: TransportKind.stdio,
      options: {
        cwd: context.asAbsolutePath("lsp-translations"),
        shell: true,
      },
    },
  };

  // Options to control the language client
  let clientOptions: LanguageClientOptions = {
    revealOutputChannelOn: RevealOutputChannelOn.Info,
    documentSelector: [{ scheme: "file", language: "javascript" }],
    synchronize: {
      fileEvents: translationFiles?.map((globPattern) =>
        vscode.workspace.createFileSystemWatcher(globPattern)
      ),
    },
  };
  vscode.window.showInformationMessage("loaded!");
  vscode.workspace.onDidChangeConfiguration((e) => {
    vscode.window.showInformationMessage("Updated");
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
