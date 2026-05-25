import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    console.log("Launching headless browser to generate perfect PDF...");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const filePath = `file://${path.join(__dirname, 'linkedin_presentation.html')}`;
    console.log(`Loading ${filePath}...`);
    
    await page.goto(filePath, { waitUntil: 'networkidle0' });
    
    // Add a tiny delay to ensure Tailwind CDN finishes rendering
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Exporting 1080x1080 PDF...");
    await page.pdf({
        path: 'BPB_Convergence_Report_Carousel.pdf',
        width: '1080px',
        height: '1080px',
        printBackground: true,
        pageRanges: '1-5'
    });
    
    await browser.close();
    console.log("Done! The perfect PDF is saved as 'BPB_Convergence_Report_Carousel.pdf'");
})();