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
  // The debug options for the server
  // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
  // let debugOptions = { execArgv: ["--nolazy", "--inspect=6009"] };
  let serverOptions: ServerOptions = {
    // run: { module: serverModule, transport: TransportKind.ipc },
    run: {
      command: `--todo run --manifest-path ${context.asAbsolutePath(path.join('lsp-translations', 'Cargo.toml'))}`,
    },
    debug: {
      // command: './lsp-translations',
      command: `cargo`,
      args: ['run'],
      // args: ['watch', '-x', '"run"'],
      // transport: { kind: TransportKind.socket, port: 9258 },
      transport: TransportKind.stdio,
      options: {
        cwd: context.asAbsolutePath('lsp-translations'),
        // cwd: context.asAbsolutePath(path.join('lsp-translations', 'target', 'debug')),
        shell: true,
        // detached: true
      }
    },
  };


  // Options to control the language client
  let clientOptions: LanguageClientOptions = {
   revealOutputChannelOn: RevealOutputChannelOn.Info,
    outputChannelName: "jaja!",
    progressOnInitialization: true,
    documentSelector: [{ scheme: "file", language: "javascript" }],
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
      // fileEvents: vscode.workspace.createFileSystemWatcher("**/*.js"),
      // fileEvents: vscode.workspace.createF
    },
  };
  vscode.window.showInformationMessage("test")

  // Create the language client and start the client.
  client = new LanguageClient(
    "lsp-translations",
    "Language Server Example",
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
