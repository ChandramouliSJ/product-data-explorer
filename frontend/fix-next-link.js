const fs = require("fs");
const path = require("path");

// Folder to scan (frontend)
const folderPath = path.join(__dirname, "pages"); // change to "components" if needed

// Recursively scan files
function scanFiles(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanFiles(fullPath);
    } else if (file.endsWith(".js") || file.endsWith(".jsx") || file.endsWith(".ts") || file.endsWith(".tsx")) {
      fixLink(fullPath);
    }
  });
}

// Fix <Link><a>...</a></Link>
function fixLink(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // Regex to match <Link> with <a> child
  const regex = /<Link([^>]*)>\s*<a([^>]*)>([\s\S]*?)<\/a>\s*<\/Link>/g;

  const newContent = content.replace(regex, `<Link$1>$3</Link>`);

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, "utf8");
    console.log(`✅ Fixed <Link> in: ${filePath}`);
  }
}

scanFiles(folderPath);
console.log("🎉 All <Link> components fixed!");
