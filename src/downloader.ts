import * as vscode from "vscode";

import fetch from "node-fetch";
import * as fs from "fs";
import * as https from "https";
import * as os from "os";
import * as path from "path";
import { platformArchTriples } from "@napi-rs/triples";
import * as tar from "tar-fs";

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
        // TODO: Remove this secret when the repository has been made public
        headers: process.env.GITHUB_TOKEN
          ? {
              authorization: `token ${process.env.GITHUB_TOKEN}`,
            }
          : undefined,
      }
    );

    const json = await result.json();
    const supportedTargets =
      platformArchTriples[process.platform][process.arch];
    const asset = json.assets.find((asset: { name: string }) => {
      const targetName = path.parse(asset.name).name;

      return supportedTargets.some((triplet) => triplet.raw === targetName);
    });

    if (!asset) {
      throw new Error("No compatible asset found");
    }
    return downloadServerBinary(
      context,
      asset.browser_download_url,
      json.tag_name
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
    const dest = path.join(os.tmpdir(), "lsp-translations-download.tar");
    const file = fs.createWriteStream(dest);

    console.log("Downloading", downloadUrl, "...");

    https
      .get(
        downloadUrl,
        {
          headers: process.env.GITHUB_TOKEN
            ? {
                authorization: `token ${process.env.GITHUB_TOKEN}`,
              }
            : undefined,
        },
        function (response) {
          if (response.statusCode !== 302) {
            return reject(`Status code of ${response.statusCode} received`);
          }

          response.pipe(file);
          file.on("finish", async function () {
            file.close();
            console.info(
              "Downloaded server binary version",
              version,
              "from",
              downloadUrl,
              "to",
              dest
            );
            await extractServerBinary(context, dest);
            updateServerBinaryVersion(context, version);
            resolve(version);
          });
        }
      )
      .on("error", function (err) {
        fs.unlink(dest, () => {
          reject(err);
        });
      });
  });
}

function extractServerBinary(
  context: vscode.ExtensionContext,
  archivePath: string
) {
  return new Promise((resolve, reject) => {
    const test = fs
      .createReadStream(archivePath)
      .pipe(tar.extract(getServerBinaryFolder(context)));

    test.on("finish", (e) => {
      console.log("FINSIHED", e);
      resolve(undefined);
    });

    test.on("error", (e) => {
      reject(e);
    });
  });
}

export function isServerBinaryInstalled(context: vscode.ExtensionContext) {
  return fs.existsSync(getServerBinaryExecutable(context));
}

export function getServerBinaryFolder(context: vscode.ExtensionContext) {
  return context.asAbsolutePath("bin");
}

export function getServerBinaryExecutable(context: vscode.ExtensionContext) {
  return vscode.Uri.joinPath(
    vscode.Uri.file(getServerBinaryFolder(context)),
    os.platform() !== "win32" ? "lsp-translations" : "lsp-translations.exe"
  ).fsPath;
}

// Versioning
export function updateServerBinaryVersion(
  context: vscode.ExtensionContext,
  version: string | Buffer | undefined
) {
  const versionPath = vscode.Uri.joinPath(
    vscode.Uri.file(getServerBinaryFolder(context)),
    "installed_version"
  ).fsPath;

  return version !== undefined
    ? fs.writeFileSync(versionPath, version)
    : fs.unlinkSync(versionPath);
}

export function getServerBinaryVersion(context: vscode.ExtensionContext) {
  const versionPath = vscode.Uri.joinPath(
    vscode.Uri.file(getServerBinaryFolder(context)),
    "installed_version"
  ).fsPath;

  return !fs.existsSync(versionPath)
    ? undefined
    : fs.readFileSync(versionPath).toString();
}

export function getWantedServerBinaryVersion(context: vscode.ExtensionContext) {
  const versionPath = vscode.Uri.joinPath(
    vscode.Uri.file(getServerBinaryFolder(context)),
    "wanted_version"
  ).fsPath;

  return !fs.existsSync(versionPath)
    ? "latest"
    : fs.readFileSync(versionPath).toString().trim();
}

export function isServerBinaryCorrectVersion(context: vscode.ExtensionContext) {
  return (
    getServerBinaryVersion(context) === getWantedServerBinaryVersion(context)
  );
}
