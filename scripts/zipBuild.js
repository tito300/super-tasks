import AdmZip from "adm-zip";
import fs from "fs";

const folderPath = "./dist"; // Path to the folder to be zipped

const manifestFile = fs.readFileSync(folderPath + "/manifest.json", {
  encoding: "utf-8",
});
const manifest = JSON.parse(manifestFile);

const outputPath = `./zip/extension-v${manifest.version}.zip`; // Path to the output .zip file

if (fs.existsSync(outputPath))
  throw new Error(
    `Current version ${manifest.version} already exists. Either update the manifest version or delete the current zip file.`
  );

const zip = new AdmZip();
zip.addLocalFolder(folderPath, "", (filename) => {
  if (filename.includes(".map")) {
    return false;
  }
  return true;
}); // Add the contents of the folder to the zip file
zip.writeZip(outputPath); // Write the zip file to disk

fs.access(outputPath, (err) => {
  if (err) {
    console.error("Error creating zip file:", err);
  } else {
    console.log("Zip file created successfully:", outputPath);
  }
});
