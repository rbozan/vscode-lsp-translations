import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
// import * as myExtension from '../../extension';
//

// import * as extension from "../../extension";
import * as downloader from "../../downloader";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Sample test", () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  });

  test("Downloads lsp-translations", async () => {
    assert.strictEqual(
      await downloader.fetchOrUpdateServerBinaries(new MockExtensionContext()),
      "latest"
    );
  });
});

import * as path from "path";
import * as os from "os";

class MockExtensionContext implements vscode.ExtensionContext {
  asAbsolutePath(relativePath: string): string {
    return path.join(os.tmpdir(), relativePath);
  }

  // TODO: Remove the following as it is unneeded
  subscriptions!: { dispose(): any }[];
  workspaceState!: vscode.Memento;
  globalState!: vscode.Memento & {
    setKeysForSync(keys: readonly string[]): void;
  };
  secrets!: vscode.SecretStorage;
  extensionUri!: vscode.Uri;
  extensionPath!: string;
  environmentVariableCollection!: vscode.EnvironmentVariableCollection;

  storageUri: vscode.Uri | undefined;
  storagePath: string | undefined;
  globalStorageUri!: vscode.Uri;
  globalStoragePath!: string;
  logUri!: vscode.Uri;
  logPath!: string;
  extensionMode!: vscode.ExtensionMode;
  extension!: vscode.Extension<any>;
}
