
'use client' 

import { FileUploaderRegular } from '@uploadcare/react-uploader/next';
import '@uploadcare/react-uploader/core.css';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Button } from '@mui/material';

function PdfExtractor() {
  const [pdfText, setpdfText] = useState('');
  //const [fileUrl, setFileUrl] = useState('https://ucarecdn.com/ff44e58d-dd42-42bb-82d0-5ea1f3f88529/christyupdatedresume512241.pdf');
  const [fileUrl, setFileUrl] = useState('');

  const PDFCO_API_KEY = process.env.NEXT_PUBLIC_PDF_CO;
  const PUBLIC_KEY:any = process.env.NEXT_PUBLIC_PUBLIC_KEY;



  const handleExtract = async () => {
    const url = 'https://api.pdf.co/v1/pdf/convert/to/text';

    const options = {
      method: 'POST',
      url: url,
      headers: {
        'x-api-key': PDFCO_API_KEY,
        'Content-Type': 'application/json'
      },
      data: {
        url: fileUrl,
        inline: true,
        async: false
      }
    };

    try {
      const response = await axios(options);
 
      setpdfText(response.data.body);
    } catch (error) {
      console.error('Error extracting PDF:', error);
      setpdfText('Failed to extract text.');
    }
  };
  return (
    <div>
      {fileUrl ? (
        <div className="flex h-screen md:flex-row">
          <div className="w-full md:w-1/2 h-1/2 md:h-screen border-t md:border-t-0 md:border-r-4 border-gray-300 flex flex-col">
            <div className="flex-grow overflow-y-auto bg-gray-100 rounded">
              <p className="bg-white p-3 shadow items-end float-end w-full">
                <span className='float-end shadow rounded-full p-2 text-gray-500 cursor-pointer'>
                  <CloseIcon/>
                </span>
              </p>
              <div className='px-4 mt-24 overflow-auto'>
                <p className="bg-white p-3 rounded shadow mb-2">What is this about?</p>
                <p className="bg-blue-100 p-3 rounded shadow mb-2">
                  This PDF is an introductory document that provides an overview of the main topic covered within the text.
                </p>
              </div>
            </div>
            <div className="mt-4 flex p-4">
              <input
                type="text"
                placeholder="Type your question..."
                className="flex-grow p-2 border !rounded-[4px] mr-4"
              />
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                className="!rounded-[4px] !bg-purple-600"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 h-1/2 md:h-screen overflow-auto border-t md:border-t-0">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer fileUrl={fileUrl}/>
            </Worker>
          </div>
        </div>
      ):(
        <div className="min-h-screen flex items-center justify-center  bg-gray-200">
          <div className="w-full relative flex flex-col items-center">
            <FileUploaderRegular
              className='p-uploader'
              accept="application/pdf"
              multiple={false}
              onChange={(state) => {
                if (state.successEntries.length > 0) {
                  const uploadedFile = state.successEntries[0];
                  setFileUrl(uploadedFile.cdnUrl);
                }
              }}
              pubkey={PUBLIC_KEY}
              classNameUploader="uc-light"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PdfExtractor;

















