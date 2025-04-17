'use client';

import { useState, useRef } from 'react';
import { Button, CircularProgress, Typography, Box, TextareaAutosize } from '@mui/material';

export default function PdfTextExtractor() {
  const [pdfText, setPdfText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Change this to your actual PDF.co API key
  const PDFCO_API_KEY = 'your_pdfco_api_key_here';

  const extractTextFromPdfUrl = async (pdfUrl: string) => {
    setLoading(true);
    setError('');
    setPdfText('');

    try {
      const res = await fetch('https://api.pdf.co/v1/pdf/convert/to/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': PDFCO_API_KEY,
        },
        body: JSON.stringify({ url: pdfUrl }),
      });

      const data = await res.json();

      if (res.ok && data.body) {
        // Option 1: Text content directly returned
        setPdfText(data.body);
      } else {
        setError(data.message || 'Failed to extract text from PDF');
      }
    } catch (err) {
      setError('Error calling PDF.co API');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file');
      return;
    }

    // Upload file temporarily to get a URL (use your own server or a file uploader like file.io)
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      // Upload to file.io as example, you can replace this with your own server upload logic
      const uploadRes = await fetch('https://file.io/?expires=1d', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (uploadData.success && uploadData.link) {
        await extractTextFromPdfUrl(uploadData.link);
      } else {
        setError('File upload failed');
        setLoading(false);
      }
    } catch (err) {
      setError('Upload error');
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          PDF Text Extractor
        </Typography>

        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />

        <Button
          variant="contained"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          sx={{ mb: 2 }}
        >
          Upload PDF
        </Button>

        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={24} />
            <Typography>Processing PDF...</Typography>
          </Box>
        )}

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {pdfText && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Extracted Text:
            </Typography>
            <TextareaAutosize
              minRows={10}
              maxRows={20}
              value={pdfText}
              style={{
                width: '100%',
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontFamily: 'monospace',
              }}
              readOnly
            />
          </Box>
        )}
      </Box>
    </div>
  );
}



















// // "use client";

// // import { useState } from "react";
// // import { Button, TextField, Typography, Box } from '@mui/material';
// // import * as pdfjsLib from 'pdfjs-dist/build/pdf';
// // import { sendPromptToGemini } from "../services/geminiApi";



// // export default function GeminiChat() {
// //   const [prompt, setPrompt] = useState("tell about kerala");
// //   const [response, setResponse] = useState("");

// //   const handleSend = async () => {
// //     const result:string = await sendPromptToGemini(prompt) || "";
// //     setResponse(result);
// //   };

// //   return (
// //     <div className="p-4">
// //       <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />
// //       <button onClick={handleSend}>click</button>
// //       <p>{response}</p>
// //     </div>
// //   );
// // }



// 'use client';

// import React, { useState, useRef } from 'react';
// import { Button, Box, Typography, CircularProgress } from '@mui/material';
// import axios from 'axios';

// const GeminiChat = () => {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [fileUrl, setFileUrl] = useState<string>('');
//   const [pdfText, setPdfText] = useState<string>('');
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const PDFCO_API_KEY = process.env.NEXT_PUBLIC_PDF_CO;
// console.log(PDFCO_API_KEY,"PDFCO_API_KEY")
//   const extractTextFromPdfUrl = async (pdfUrl: string) => {
//     setLoading(true);
//     setError(null);
//     setPdfText('');

//     try {
//       const response = await axios.post(
//         'https://api.pdf.co/v1/pdf/convert/to/text',
//         { url: pdfUrl },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'x-api-key': PDFCO_API_KEY || '',
//           },
//         }
//       );

//       const data = response.data;

//       if (data?.body) {
//         setPdfText(data.body);
//         console.log('Extracted PDF Text:', data.body);
//       } else {
//         setError(data.message || 'Failed to extract text from PDF');
//       }
//     } catch (err) {
//       console.error(err);
//       setError('Error calling PDF.co API');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file && file.type === 'application/pdf') {
//       setSelectedFile(file);
//       setError(null);
//       setLoading(true);

//       const reader = new FileReader();
//       reader.onloadend = async () => {
//         const result = reader.result as string;
//         setFileUrl(result);
//         const formData = new FormData();
//         formData.append('file', file); 

//         try {
//           const uploadResponse = await axios.post(
//             'https://api.pdf.co/v1/file/upload',
//             {
//               formData,
//             },
//             {
//               headers: {
//                 'Content-Type': 'application/json',
//                 'x-api-key': PDFCO_API_KEY || '',
//               },
//             }
//           );

//           const uploadedUrl = uploadResponse.data.url;
//           console.log('Uploaded PDF URL:', uploadedUrl);
//          // await extractTextFromPdfUrl(uploadedUrl);
//         } catch (uploadErr) {
//           console.error(uploadErr);
//           setError('Failed to upload PDF to PDF.co');
//         } finally {
//           setLoading(false);
//         }
//       };

//       reader.onerror = () => {
//         setError('Error reading file');
//         setLoading(false);
//       };

//       reader.readAsDataURL(file);
//     } else {
//       setError('Please upload a valid PDF file.');
//     }
//   };

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
//       <Typography variant="h6">Upload a PDF file</Typography>

//       <input
//         type="file"
//         accept="application/pdf"
//         onChange={handleFileChange}
//         ref={fileInputRef}
//         style={{ margin: '20px 0' }}
//       />

//       {error && <Typography color="error">{error}</Typography>}

//       {loading ? (
//         <CircularProgress size={24} />
//       ) : (
//         selectedFile && (
//           <Box sx={{ mt: 2, width: '100%' }}>
//             <Typography variant="body1">PDF File: {selectedFile.name}</Typography>
//             <iframe src={fileUrl} width="100%" height="500px" title="PDF Preview" />
//             {pdfText && (
//               <Box mt={2}>
//                 <Typography variant="subtitle1">Extracted Text:</Typography>
//                 <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
//                   {pdfText}
//                 </Typography>
//               </Box>
//             )}
//           </Box>
//         )
//       )}
//     </Box>
//   );
// };

// export default GeminiChat;