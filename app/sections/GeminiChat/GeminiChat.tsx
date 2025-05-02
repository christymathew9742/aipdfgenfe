'use client';

import React, {
    useEffect,
    useRef,
    useState,
    useCallback,
} from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Button,
    Card,
    CardContent,
    LinearProgress,
    Fade,
    Grid,
} from '@mui/material';
import { baseURL } from '@/app/utils/url';
import ProgressComponent from '@/app/components/progressBar';
import { AppDispatch } from '@/app/redux/store';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { useDropzone } from 'react-dropzone';
import axios, { CancelTokenSource } from 'axios';
import { useMediaQuery } from 'react-responsive';
import { useDispatch, useSelector } from 'react-redux';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import socket from '@/app/utils/socket';


import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css"
import {
    getBotSelector,
    getPendingSelector,
} from '@/app/redux/reducers/chatBot/selectors';

import {
    postBotRequest,
} from '@/app/redux/reducers/chatBot/actions';
import AlertDialog from '@/app/components/alertbox';
import {constantsText} from '@/app/constant/constant';
import Image from 'next/image';

const {
  BOT:{
    UPLOAD_TITLE,
    DRAG_TEXT,
    SET_ERROR,
  },
} = constantsText;

const PdfExtractor = () => {
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [fileUrl, setFileUrl] = useState('');
    const [fileId, setfileId] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [chatHistory, setChatHistory] = useState<
        { question: string; answer: string | null }[]
    >([]);
    const [dialogOpen, setDialogOpen]: any = useState(false);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress]:any = useState<number>(0);
    const [error, setError] = useState('');
    const [serverError, setServerError] = useState('');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(true);
    const [pdfStatus, setPdfStatus] = useState<string>('')
    const cancelTokenRef = useRef<CancelTokenSource | null>(null);
    const [progress, setProgress] = useState(0);
    const isPending = useSelector(getPendingSelector);
    const botData = useSelector(getBotSelector);
    const dispatch = useDispatch<AppDispatch>();
    const answer = botData?.data;

    const handleAsk = useCallback(async () => {
        if (!currentQuestion.trim()) return;

        const question = currentQuestion.trim();
        setCurrentQuestion('');
        setChatHistory((prev) => [...prev, { question, answer: null }]);

        try {
            const ChatData = {
                prompt: question,
                uploadedFileId: fileId,
            };
            await dispatch(postBotRequest(ChatData));
        } catch (error) {
            console.error("Error while requesting bot:", error);
        } 
    }, [currentQuestion, fileId, dispatch, chatHistory.length]);

    useEffect(() => {
        if (answer !== undefined && chatHistory.length > 0 && chatHistory[chatHistory.length - 1].answer === null) {
            setChatHistory((prev) =>
                prev.map((item, index) =>
                index === prev.length - 1 ? { ...item, answer } : item
                )
            );
        }
    }, [answer]);

    useEffect(() => {
        if (!fileId) return;
      
        socket.emit('join', fileId);

        socket.on('internal_server_error', (data) => {
            if (data.uploadedFileId === fileId) {
                setServerError(data.Error);
            }
        });

        socket.on('extraction_progress', (data) => {
            if (data.uploadedFileId === fileId) {
                setProgress(data.progress);
                setPdfStatus(data.status)
            }
        });
      
        socket.on('extraction_complete', (data) => {
            if (data.uploadedFileId === fileId) {
                setPending(false);
            }
        });
      
        return () => {
            socket.off('internal_server_error');
            socket.off('extraction_progress');
            socket.off('extraction_complete');
        };
    }, [fileId]);
      
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const handleDialogOpen = () => setDialogOpen(true);
    const handleDialogClose = () => setDialogOpen(false);
    const handleAgree = () => {
        setFileUrl('');
        setChatHistory([]);
        setFile(null);
        setfileId('');
        setPending(true);
        setProgress(0);
        setPdfStatus('');
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles: File[], fileRejections) => {
            if (fileRejections.length > 0) {
                setError(SET_ERROR);
                setFile(null);
                setFileUrl('');
                setUploadProgress(0);
                return;
            }
    
            const selectedFile = acceptedFiles[0];
            if (selectedFile) {
                setFile(selectedFile);
                setFileUrl('');
                setUploadProgress(0);
                setError(''); 
            }
        },
        accept: {
            'application/pdf': ['.pdf'],
        },
        multiple: false,
    });
    
    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        cancelTokenRef.current = axios.CancelToken.source();
        
        try {
            setIsUploading(true);
            const response = await axios.post(`${baseURL}api/uploads`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                setUploadProgress(percent);
                },
                cancelToken: cancelTokenRef.current.token,
            });

            if (response.data) {
                setFileUrl(response.data.fileUrl);
                setfileId(response.data.uploadedFileId);
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                console.warn('Upload cancelled');
            } else {
                console.error('Upload failed:', error);
            }
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
        if (file) uploadFile(file);
    }, [file]);

    return (
        <div>
        {fileUrl ? (
            <div className="flex-row md:flex h-screen">
                <div className="w-full md:w-1/2 h-screen border-t md:border-t-0 md:border-r-4 border-gray-300 flex flex-col">
                    <div className="flex-grow overflow-y-auto bg-gray-200 rounded relative">
                        <div  className="bg-white p-3 shadow items-end float-end w-full sticky top-0 z-10">
                            <Grid container>
                                <Grid size={11}>
                                    <Fade 
                                        in={pending} 
                                        timeout={1000}
                                    >
                                        <Box 
                                            sx={{ 
                                                position: 'relative', 
                                                width: '100%', 
                                                marginTop: '14px',
                                            }}
                                        >
                                            <LinearProgress
                                                color="secondary"
                                                variant="determinate"
                                                value={Number(progress)}
                                                sx={{
                                                    height: 18,
                                                    borderRadius: 2, 
                                                    width: '100%!important', 
                                                }}
                                            />
                                            <Typography
                                                variant="caption"
                                                component="span"
                                                color="white"
                                                sx={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    fontSize:'8px'
                                                }}
                                            >
                                                {`${pdfStatus} ${Math.round(Number(progress))}%`}
                                            </Typography>
                                        </Box>
                                    </Fade>
                                </Grid>
                                <Grid size={1}>
                                    <span onClick={handleDialogOpen} className="float-end shadow rounded-full text-gray-500 cursor-pointer p-2">
                                        <CloseIcon />
                                    </span>
                                </Grid>
                            </Grid>
                        </div >
                        <div className="px-4 mt-24 overflow-auto">
                            {chatHistory.map((item, index) => (
                                <div key={index} className='mb-8 text-sm'>
                                    <p className="bg-white p-3 rounded shadow mb-2 relative w-[98%]">{item.question}<ArrowRightIcon className='text-white absolute -top-[6px] -right-[23px] !text-[40px]' /></p>
                                    {item.answer === null ? (
                                        serverError ? (
                                            <p className="bg-red-100 text-red-700 border border-red-400 rounded px-4 py-3 text-sm w-[98%]">
                                                {serverError}
                                            </p>
                                        ) : (
                                            <Image
                                                src="/image/gif/typing.gif"
                                                alt="Typing"
                                                width={60}
                                                height={10}
                                                className="-ml-2"
                                            />
                                        )
                                    ) : (
                                        <p className="bg-blue-200 p-3 rounded shadow whitespace-pre-line relative w-[98%]">
                                            {item.answer}
                                            <ArrowLeftIcon className="text-blue-200 absolute -top-[2px] -left-[23px] !text-[40px]" />
                                        </p>
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
                            disabled={isPending || pending}
                        />
                        <Button
                            variant="contained"
                            endIcon={
                                isPending || pending ? (
                                    <CircularProgress size={20} sx={{ color: 'white' }} />
                                ) : (
                                    <SendIcon />
                                )
                            }
                            onClick={handleAsk}
                            disabled={isPending || pending}
                            className="!rounded-[4px] !bg-[#b400aa]"
                        />
                    </div>
                </div>
                <div className="w-full md:w-1/2 h-[500px] md:h-screen overflow-auto">
                    <iframe 
                        src={`/pdfjs-dist/web/viewer.html?file=/api/proxy-pdf?url=${encodeURIComponent(fileUrl)}`}
                        width="100%" 
                        height="100%"
                    />
                </div>
            </div>
        ) : (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    backgroundColor: '#f9f9f9',
                    padding: 2,
                }}
            >
                <Card 
                    sx={{
                        width: 400,
                        p: 0,
                        ...(isUploading ? {boxShadow:'none!important',background:'none!important'} : { borderRadius: 2, boxShadow: 3 }),
                    }}
                >
                    <CardContent>
                        
                        {isUploading ? (
                            <ProgressComponent  value={uploadProgress}/>
                        ): (
                            <>
                                <Box
                                    {...getRootProps()}
                                    sx={{
                                        border: '2px dashed #ccc',
                                        borderRadius: 2,
                                        padding: '32px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        backgroundColor: '#fafafa',
                                        marginBottom: -1,
                                        height: '200px',
                                    }}
                                >
                                    <input {...getInputProps()} />
                                    <UploadFileIcon color="secondary" fontSize="large" sx={{ marginBottom:'12px'}} />
                                    <Typography variant="h6" gutterBottom>
                                        {UPLOAD_TITLE} 
                                    </Typography>
                                    <Typography variant="body2">
                                        {DRAG_TEXT}
                                    </Typography>
                                    {file && (
                                        <Typography variant="subtitle2" sx={{ mb: 2 }}>
                                            {file.name}
                                        </Typography>
                                    )}
                                    { error && (
                                        <Typography variant="body2" color="error">
                                            {error}
                                        </Typography>
                                    )}
                                </Box>
                            </>
                        )}
                    </CardContent>
                </Card>
            </Box>
        )}
        <AlertDialog open={dialogOpen} onClose={handleDialogClose} onAgree={handleAgree} />
        </div>
    );
};

export default PdfExtractor;


























