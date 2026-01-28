// ============================================
// FILESYSTEM SCANNER - Flat Structure
// scripts/scanFilesystem.js
// ============================================

import fs from "fs";
import path from "path";
import mongoose from "mongoose";


// Import model
import File from "../models/files.model.js";

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  // Add your root folders to scan
  rootFoldersToScan: [
    "C:\\Users\\Da3mss\\Desktop\\forDatabase",
    // Add more paths here
  ],
  
  includeExtensions: [], // Empty = all files. Example: [".pdf", ".xlsx", ".dwg"]
  excludeExtensions: [".tmp", ".cache", ".log"],
  skipFolders: ["node_modules", ".git", ".vscode", "dist", "build"],
  maxDepth: 10,
};

// ============================================
// DATABASE CONNECTION
// ============================================
async function connectDB() {
  try {
    await mongoose.connect("mongodb+srv://gh7007u_db_user:FileManger54@learnmongodb.xxuuapt.mongodb.net/FileManger");
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function shouldSkipFolder(folderName) {
  return CONFIG.skipFolders.includes(folderName);
}

function shouldIncludeFile(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  
  if (CONFIG.excludeExtensions.includes(ext)) {
    return false;
  }
  
  if (CONFIG.includeExtensions.length > 0) {
    return CONFIG.includeExtensions.includes(ext);
  }
  
  return true;
}

// ============================================
// MAIN SCANNING FUNCTION
// ============================================
async function scanDirectory(dirPath, parentId = null, level = 0) {
  try {
    if (CONFIG.maxDepth > 0 && level > CONFIG.maxDepth) {
      return;
    }
    
    if (!fs.existsSync(dirPath)) {
      console.warn(`⚠️  Path does not exist: ${dirPath}`);
      return;
    }
    
    const items = fs.readdirSync(dirPath);
    
    // Create/update folder in database
    let currentFolder = null;
    
    const folderData = {
      name: path.basename(dirPath),
      type: "folder",
      parent_id: parentId,
      path: dirPath,
      level: level,
    };
    
    currentFolder = await File.findOneAndUpdate(
      { path: dirPath },
      folderData,
      { upsert: true, new: true }
    );
    
    console.log(`${"  ".repeat(level)}📁 ${folderData.name}`);
    
    // Process items in the folder
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      
      try {
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          if (shouldSkipFolder(item)) {
            console.log(`${"  ".repeat(level + 1)}⏭️  Skipping: ${item}`);
            continue;
          }
          
          // Recursively scan subfolder
          await scanDirectory(
            itemPath,
            currentFolder._id,
            level + 1
          );
          
        } else if (stats.isFile()) {
          if (!shouldIncludeFile(item)) {
            continue;
          }
          
          const ext = path.extname(item).toLowerCase().substring(1);
          
          const fileData = {
            name: item,
            type: "file",
            parent_id: currentFolder._id.toString(),
            path: itemPath,
            size: stats.size,
            extension: ext || "unknown",
            lastModified: stats.mtime,
          };
          
          await File.findOneAndUpdate(
            { path: itemPath },
            fileData,
            { upsert: true, new: true }
          );
          
          console.log(`${"  ".repeat(level + 1)}📄 ${item} (${ext || "no ext"})`);
        }
      } catch (error) {
        console.error(`Error processing ${itemPath}:`, error.message);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error.message);
  }
}

// ============================================
// MAIN EXECUTION
// ============================================
async function main() {
  console.log("🚀 Starting filesystem scan...\n");
  
  await connectDB();
  
  // Optional: Clear existing data
  const clearExisting = process.argv.includes("--clear");
  if (clearExisting) {
    console.log("🗑️  Clearing existing data...");
    await File.deleteMany({});
    console.log("✅ Existing data cleared\n");
  }
  
  // Scan each root folder
  for (const rootPath of CONFIG.rootFoldersToScan) {
    console.log(`\n📂 Scanning: ${rootPath}`);
    console.log("=".repeat(60));
    
    await scanDirectory(rootPath, null, 0);
  }
  
  // Display statistics
  console.log("\n" + "=".repeat(60));
  console.log("📊 SCAN COMPLETE - Statistics");
  console.log("=".repeat(60));
  
  const totalFolders = await File.countDocuments({ type: "folder" });
  const totalFiles = await File.countDocuments({ type: "file" });
  
  const filesByExtension = await File.aggregate([
    { $match: { type: "file" } },
    { $group: { _id: "$extension", count: { $sum: 1 }, totalSize: { $sum: "$size" } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);
  
  const totalSize = await File.aggregate([
    { $match: { type: "file" } },
    { $group: { _id: null, total: { $sum: "$size" } } },
  ]);
  
  console.log(`📁 Total Folders: ${totalFolders}`);
  console.log(`📄 Total Files: ${totalFiles}`);
  console.log(`💾 Total Size: ${formatBytes(totalSize[0]?.total || 0)}`);
  console.log("\n📊 Top File Extensions:");
  
  filesByExtension.forEach((item, index) => {
    console.log(`   ${index + 1}. .${item._id}: ${item.count} files (${formatBytes(item.totalSize)})`);
  });
  
  console.log("\n✅ Scan completed successfully!");
  process.exit(0);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

// ============================================
// RUN THE SCANNER
// ============================================
main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});

