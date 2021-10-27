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
import { ExtensionMode } from "vscode";

let client: LanguageClient;

export async function activate(context: vscode.ExtensionContext) {
  if (context.extensionMode === ExtensionMode.Production) {
    await fetchOrUpdateServerBinaries(context);
  }

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
        cwd: context.asAbsolutePath("../lsp-translations"),
        shell: true,
      },
    },
  };

  // Options to control the language client
  let clientOptions: LanguageClientOptions = {
    revealOutputChannelOn: RevealOutputChannelOn.Info,
    documentSelector: [
      { scheme: "file", language: "javascript" },
      { scheme: "file", language: "javascriptreact" },
      { scheme: "file", language: "typescript" },
      { scheme: "file", language: "typescriptreact" },
      { scheme: "file", language: "ruby" },
    ],
  };

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
