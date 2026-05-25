import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    console.log("Launching browser to generate completely flat, pixel-perfect PDF...");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set higher scale factor for retina/high-res crystal clear text
    await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
    
    const filePath = `file://${path.join(__dirname, 'linkedin_presentation.html')}`;
    await page.goto(filePath, { waitUntil: 'networkidle0' });
    
    // Wait for fonts and CSS to fully render
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Take individual screenshots of each slide
    const slides = await page.$$('.slide');
    const imagePaths = [];
    
    console.log(`Found ${slides.length} slides. Processing to high-res images...`);
    for (let i = 0; i < slides.length; i++) {
        const imgPath = path.join(__dirname, `slide_${i}.png`);
        // Remove page-break from CSS temporarily to avoid scrolling issues in bounding box
        await page.evaluate((el) => { el.style.pageBreakAfter = 'auto'; }, slides[i]);
        await slides[i].screenshot({ path: imgPath });
        imagePaths.push(imgPath);
    }
    
    // Generate a simple HTML that just contains the perfect images
    let htmlContent = `
    <html>
    <head>
        <style>
            @page { size: 1080px 1080px; margin: 0; }
            body { margin: 0; padding: 0; background-color: #0a0a0c; }
            img { width: 1080px; height: 1080px; display: block; break-after: always; }
        </style>
    </head>
    <body>
    `;
    
    imagePaths.forEach(img => {
        htmlContent += `<img src="file://${img}">\n`;
    });
    htmlContent += `</body></html>`;
    
    const flatHtmlPath = path.join(__dirname, 'flat_temp.html');
    fs.writeFileSync(flatHtmlPath, htmlContent);
    
    // Load the image-based HTML and print IT to PDF
    await page.goto(`file://${flatHtmlPath}`, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Ensure images loaded
    
    console.log("Compiling images into unbreakable PDF...");
    const pdfPath = 'BPB_Convergence_Report_Carousel_Fixed.pdf';
    await page.pdf({
        path: pdfPath,
        width: '1080px',
        height: '1080px',
        printBackground: true
    });
    
    // Cleanup temporary files
    imagePaths.forEach(img => fs.unlinkSync(img));
    fs.unlinkSync(flatHtmlPath);
    
    await browser.close();
    console.log("Done! The unbreakable PDF is ready.");
})();