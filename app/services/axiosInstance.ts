// pages/api/extract-text.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const PDFCO_API_KEY = process.env.NEXT_PUBLIC_PDF_CO; // Store the API key in environment variables

// Extract text from PDF using PDF.co API
const extractTextFromPdf = async (pdfUrl: string) => {
  try {
    const response = await axios.post(
      'https://api.pdf.co/v1/pdf/convert/to/text',
      {
        url: pdfUrl, // The URL of the PDF to extract text from
      },
      {
        headers: {
          'x-api-key': PDFCO_API_KEY,
        },
      }
    );

    return response.data; // Return the extracted text or URL with text content
  } catch (error:any) {
    throw new Error(`Error extracting PDF text: ${error.message}`);
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { pdfUrl } = req.body; // Extract PDF URL from the request body

    if (!pdfUrl) {
      return res.status(400).json({ error: 'PDF URL is required' });
    }

    try {
      const textData = await extractTextFromPdf(pdfUrl);
      res.status(200).json({ text: textData.text });
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

