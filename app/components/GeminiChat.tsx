'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FileUploaderRegular } from '@uploadcare/react-uploader/next';
import '@uploadcare/react-uploader/core.css';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import { sendPromptToGemini } from '../services/geminiApi';
import AlertDialog from './alertbox';
import LinearProgress from '@mui/material/LinearProgress';
import { useMediaQuery } from 'react-responsive';

const PdfExtractor = () => {
  const [pdfText, setPdfText] = useState('');
  //const [fileUrl, setFileUrl] = useState('https://ucarecdn.com/ff44e58d-dd42-42bb-82d0-5ea1f3f88529/christyupdatedresume512241.pdf');
  const [fileUrl, setFileUrl] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<{ question: string; answer: string | null }[]>([]);
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);
  const [hasExtracted, setHasExtracted] = useState(false);
  const [dialogOpen, setDialogOpen]: any = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const pageNavigationPluginInstance = pageNavigationPlugin();

  // const PDFCO_API_KEY :any = process.env.NEXT_PUBLIC_PDF_CO;
  const PDFCO_API_KEY :any = 'christymathew9742@gmail.com_m1mSKhLD9kLCNBMxJfTJNchAyPmlLVgJXGzTuCd7QoznRpTl2xjQQ1pkz9TRaTDD';
  // const PUBLIC_KEY: string = process.env.NEXT_PUBLIC_PUBLIC_KEY || '';
  const PUBLIC_KEY = 'fb51f9b92d777d31a55e' ;
  
  const isMobile = useMediaQuery({ maxWidth: 767 });
 

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const extractPdfText = useCallback(async () => {
    if (!fileUrl || hasExtracted) return;

    try {
      const response = await axios.post(
        'https://api.pdf.co/v1/pdf/convert/to/text',
        {
          url: fileUrl,
          inline: true,
          async: false,
        },
        {
          headers: {
            'x-api-key': PDFCO_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      setPdfText(response.data.body || '');
      setHasExtracted(true);
    } catch (error) {
      alert('Error extracting PDF. If this is a scanned PDF, please upload a clear, high-resolution version. For best results, use PDFs that contain selectable text.');
      setPdfText('Failed to extract text.');
    }
  }, [fileUrl, PDFCO_API_KEY, hasExtracted]);

  useEffect(() => {
    if (fileUrl && !hasExtracted) {
      extractPdfText();
    }
  }, [fileUrl, extractPdfText, hasExtracted]);

  const handleAsk = useCallback(async () => {
    if (!currentQuestion.trim() || isLoadingAnswer) return;

    const question = currentQuestion.trim();
    setCurrentQuestion('');
    setIsLoadingAnswer(true);

    setChatHistory((prev) => [...prev, { question, answer: null }]);
    const currentIndex = chatHistory.length;

    try {
      const answer = await sendPromptToGemini({
        pdfText,
        history: chatHistory,
        currentQuestion: question,
      } as any);

      setChatHistory((prev:any) =>
        prev.map((item:any, index:number) =>
          index === currentIndex ? { ...item, answer } : item
        )
      );
    } catch (err) {
      console.error('Error fetching answer:', err);
    } finally {
      setIsLoadingAnswer(false);
    }
  }, [currentQuestion, pdfText, chatHistory, isLoadingAnswer]);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleAgree = () => {
    setFileUrl('');
  };

  return (
    <div>
      {fileUrl ? (
        <div className="flex-row md:flex h-screen">
          <div className="w-full md:w-1/2 h-screen border-t md:border-t-0 md:border-r-4 border-gray-300 flex flex-col">
            <div className="flex-grow overflow-y-auto bg-gray-200 rounded relative">
              <p className="bg-white p-3 shadow items-end float-end w-full sticky top-0 z-10">
                <span onClick={handleDialogOpen} className={`${pdfText !== '' && 'float-end shadow rounded-full text-gray-500 cursor-pointer'} p-2`}>
                  {pdfText === '' ? <LinearProgress color="success" /> : <CloseIcon />}
                </span>
              </p>
              <div className="px-4 mt-24 overflow-auto">
                {chatHistory.map((item, index) => (
                  <div key={index} className='mb-8 text-sm'>
                    <p className="bg-white p-3 rounded shadow mb-2 relative  w-[98%]">{item.question}<ArrowRightIcon className='text-white absolute -top-[6px] -right-[23px] !text-[40px]'/></p>
                    {item.answer === null ? (
                      <p className="p-3 italic text-emerald-700">Typing...</p> 
                    ) : (
                      <p className="bg-blue-200 p-3 rounded shadow whitespace-pre-line relative w-[98%]">{item.answer}<ArrowLeftIcon className='text-blue-200 absolute -top-[2px] -left-[23px] !text-[40px]'/></p>
                    )}
                  </div>
                ))}
                <div ref={bottomRef}></div>
              </div>
            </div>
            <div className="mt-4 flex p-4">
              <input
                type="text"
                placeholder="Type your question..."
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                className="flex-grow p-2 border !rounded-[4px] mr-4"
                onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              />
              <Button
                variant="contained"
                endIcon={
                  isLoadingAnswer || pdfText === '' ? (
                    <CircularProgress size={20} sx={{ color: 'white' }} />
                  ) : (
                    <SendIcon />
                  )
                }
                onClick={handleAsk}
                disabled={isLoadingAnswer || pdfText === ''}
                className="!rounded-[4px] !bg-purple-600"
              />
            </div>
          </div>
          <div className=" w-full md:w-1/2 h-[500px]  md:h-screen overflow-auto">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer fileUrl={fileUrl} plugins={[pageNavigationPluginInstance]} initialPage={0} />
            </Worker>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
          <div className="w-full relative flex flex-col items-center">
            <FileUploaderRegular
              accept="application/pdf"
              maxLocalFileSizeBytes={10485760}
              multiple={false}
              onChange={(state) => {
                const uploadedFile = state?.successEntries?.[0];
                if (uploadedFile?.cdnUrl) {
                  setFileUrl(uploadedFile.cdnUrl);
                  setHasExtracted(false);
                  setPdfText('');
                  setChatHistory([]);
                }
              }}
              pubkey={PUBLIC_KEY}
              classNameUploader="uc-light"
              className="p-uploader"
            />
          </div>
        </div>
      )}
      <AlertDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onAgree={handleAgree}
      />
    </div>
  );
};

export default PdfExtractor;



















