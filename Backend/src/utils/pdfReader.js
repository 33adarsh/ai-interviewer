import { PDFParse } from 'pdf-parse';
import fs from 'fs';

export async function extractPdfText(input) {
  try {
    const dataBuffer = Buffer.isBuffer(input)
      ? input
      : fs.readFileSync(input);

    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    return result.text;
  } catch (err) {
    
    throw new Error('Failed to extract text from PDF');
  }
}