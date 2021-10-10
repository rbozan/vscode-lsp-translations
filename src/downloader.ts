import * as vscode from "vscode";

import fetch from "node-fetch";
import * as fs from "fs";
import * as https from "https";
import * as os from "os";

export async function fetchOrUpdateServerBinaries(
  context: vscode.ExtensionContext
) {
  if (
    isServerBinaryInstalled(context) &&
    isServerBinaryCorrectVersion(context)
  ) {
    return;
  }

  const wantedVersion = getWantedServerBinaryVersion(context);
  const uri =
    wantedVersion === "latest" ? wantedVersion : `tags/${wantedVersion}`;

  try {
    const result = await fetch(
      `https://api.github.com/repos/rbozan/lsp-translations/releases/${uri}`,
      {
        // headers: {
        //   authorization: "token **YOUR_TOKEN**",
        // },
      }
    );

    const json = await result.json();
    const asset = json.assets[0];
    return downloadServerBinary(
      context,
      asset.browser_download_url
      // json.tag_name
    );
  } catch (e) {
    if (isServerBinaryInstalled(context)) {
      vscode.window.showWarningMessage(
        `Could not fetch the latest binary of lsp-translations (${uri}). Falling back to the currently installed version of ${getServerBinaryVersion(
          context
        )}. This might lead to unexpected results.`
      );

      console.error(e);
    } else {
      vscode.window.showErrorMessage(
        `Could not fetch the latest binary of lsp-translations (${uri}). This extension will not work until the server binary is downloaded.`
      );

      throw e;
    }
  }
}

async function downloadServerBinary(
  context: vscode.ExtensionContext,
  downloadUrl: string,
  version = getWantedServerBinaryVersion(context)
) {
  return new Promise(async (resolve, reject) => {
    // Prepare the folder
    const folder = getServerBinaryFolder(context);
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }

    // Download the binaery
    const dest = getServerBinaryExecutable(context);
    const file = fs.createWriteStream(dest);

    console.log("123");

    https
      .get(downloadUrl, function (response) {
        response.pipe(file);
        file.on("finish", function () {
          file.close();
          updateServerBinaryVersion(context, version);
          console.info("Downloaded server binary", version);
          resolve(version);
        });
      })
      .on("error", function (err) {
        fs.unlink(dest, () => {
          throw err;
        });
      });
  });
}

function isServerBinaryInstalled(context: vscode.ExtensionContext) {
  return fs.existsSync(getServerBinaryExecutable(context));
}

function getServerBinaryFolder(context: vscode.ExtensionContext) {
  return context.asAbsolutePath("bin");
}

function getServerBinaryExecutable(context: vscode.ExtensionContext) {
  return vscode.Uri.joinPath(
    vscode.Uri.file(getServerBinaryFolder(context)),
    os.platform() !== "win32" ? "lsp-translations" : "lsp-translations.exe"
  ).fsPath;
}

// Versioning
function updateServerBinaryVersion(
  context: vscode.ExtensionContext,
  version: string | Buffer
) {
  const versionPath = vscode.Uri.joinPath(
    vscode.Uri.file(getServerBinaryFolder(context)),
    "installed_version"
  ).fsPath;

  return fs.writeFileSync(versionPath, version);
}
function getServerBinaryVersion(context: vscode.ExtensionContext) {
  const versionPath = vscode.Uri.joinPath(
    vscode.Uri.file(getServerBinaryFolder(context)),
    "installed_version"
  ).fsPath;

  return !fs.existsSync(versionPath) ? undefined : fs.readFileSync(versionPath);
}

function getWantedServerBinaryVersion(context: vscode.ExtensionContext) {
  const versionPath = vscode.Uri.joinPath(
    vscode.Uri.file(getServerBinaryFolder(context)),
    "wanted_version"
  ).fsPath;

  return !fs.existsSync(versionPath) ? "latest" : fs.readFileSync(versionPath);
}

function isServerBinaryCorrectVersion(context: vscode.ExtensionContext) {
  return (
    getServerBinaryVersion(context) === getWantedServerBinaryVersion(context)
  );
}
