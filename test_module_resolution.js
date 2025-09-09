import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = __dirname; // The project root is where this test file is located (apaddcito-4)

const importerPath = path.join(projectRoot, 'api', 'index.ts'); // Changed to .ts as it's the source file
const importedPath = path.join(projectRoot, 'server', 'routes.ts');

console.log(`Importer path: ${importerPath}`);
console.log(`Imported path: ${importedPath}`);

if (fs.existsSync(importedPath)) {
    console.log(`File exists at: ${importedPath}`);
} else {
    console.log(`File does NOT exist at: ${importedPath}`);
}

// This test is mainly to confirm file existence and pathing.


