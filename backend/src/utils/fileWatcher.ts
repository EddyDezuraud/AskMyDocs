// import chokidar from 'chokidar';
// import path from 'path';
// import config from '../config/config';
// import { indexPdf } from '../services/vectorstore.service';
// import { isFileProcessed } from '../services/pdf.service';
//
// export function watchPdfDirectory() {
//   const watcher = chokidar.watch(config.paths.docsDir, {
//     persistent: true,
//     ignoreInitial: true,
//     awaitWriteFinish: {
//       stabilityThreshold: 2000,
//       pollInterval: 100
//     }
//   });
//
//   console.log(`Watching PDF directory: ${config.paths.docsDir}`);
//
//   watcher
//       .on('add', async (filePath) => {
//         if (filePath.toLowerCase().endsWith('.pdf')) {
//           console.log(`New file detected: ${path.basename(filePath)}`);
//
//           // Check if the file has already been processed
//           const processed = await isFileProcessed(filePath);
//
//           if (!processed) {
//             console.log(`Automatically indexing: ${path.basename(filePath)}`);
//             await indexPdf(filePath);
//           } else {
//             console.log(`File ${path.basename(filePath)} has already been indexed, skipping.`);
//           }
//         }
//       })
//       .on('error', (error) => {
//         console.error('Error while monitoring files:', error);
//       });
//
//   return watcher;
// }
