import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
// import * as myExtension from '../../extension';
//

// import * as extension from "../../extension";
import * as downloader from "../../downloader";
import * as fs from "fs";

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

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  const context = new MockExtensionContext();

  test("Server binary is not installed", async () => {
    fs.unlinkSync(downloader.getServerBinaryExecutable(context));
    downloader.updateServerBinaryVersion(context, undefined);

    assert.strictEqual(downloader.isServerBinaryInstalled(context), false);
    assert.strictEqual(downloader.getServerBinaryVersion(context), undefined);
  });

  test("Server binary can be updated", async () => {
    downloader.updateServerBinaryVersion(context, "0.0.1a");
    assert.strictEqual(downloader.getServerBinaryVersion(context), "0.0.1a");

    downloader.updateServerBinaryVersion(context, "0.0.2b");
    assert.strictEqual(downloader.getServerBinaryVersion(context), "0.0.2b");

    downloader.updateServerBinaryVersion(context, undefined);
    assert.strictEqual(downloader.getServerBinaryVersion(context), undefined);
  });

  test("Server binary wanted version", async () => {
    assert.strictEqual(
      downloader.getWantedServerBinaryVersion(context),
      "latest"
    );
  });

  test("Fetch or update server binaries", async () => {
    assert.strictEqual(
      await downloader.fetchOrUpdateServerBinaries(context),
      "latest",
      "fetchOrUpdateServerBinaries does not return correct version"
    );

    assert.strictEqual(downloader.getServerBinaryVersion(context), "latest");

    assert.strictEqual(
      downloader.isServerBinaryInstalled(context),
      true,
      "binary is not installed"
    );
    assert.strictEqual(
      downloader.isServerBinaryCorrectVersion(context),
      true,
      "binary is incorrect version"
    );
  }).timeout(10000);
});
