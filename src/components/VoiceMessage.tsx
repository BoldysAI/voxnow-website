import React, { useState, useRef, useEffect } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Mic, Square, ArrowLeft, MessageSquare, RotateCcw, Upload, AlertTriangle, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackViewContent, trackCustomEvent } from '../utils/fbPixel';

export function VoiceMessage() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    // Track voice message page view
    trackViewContent({
      content_name: 'Voice Message Page',
      content_category: 'Voice Recording'
    });
  }, []);

  const startRecording = async () => {
    try {
      // Track recording start
      trackCustomEvent('RecordingStarted', {
        content_name: 'Voice Message Recording',
        content_category: 'User Interaction'
      });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      setAudioUrl(null);
      setAudioBlob(null);
      setUploadSuccess(false);
      setUploadError(null);
      setDownloadUrl(null);

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setAudioBlob(blob);
        
        // Track recording completion
        trackCustomEvent('RecordingCompleted', {
          content_name: 'Voice Message Recording',
          content_category: 'User Interaction'
        });
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setUploadError("Erreur d'accès au microphone. Veuillez vérifier vos permissions.");
      
      // Track recording error
      trackCustomEvent('RecordingError', {
        content_name: 'Microphone Access Error',
        content_category: 'Error'
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleUpload = async () => {
    if (!audioBlob) {
      setUploadError("Aucun enregistrement disponible");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Track upload start
      trackCustomEvent('VoiceMessageUploadStarted', {
        content_name: 'Voice Message Upload',
        content_category: 'Lead Generation'
      });

      console.log("Starting upload process...");
      const timestamp = new Date().getTime();
      const filename = `voice-message-${timestamp}.webm`;
      const storageRef = ref(storage, `voice-messages/${filename}`);
      
      console.log("Uploading to Firebase Storage...");
      const snapshot = await uploadBytes(storageRef, audioBlob);
      console.log("Upload completed:", snapshot);
      
      console.log("Getting download URL...");
      const url = await getDownloadURL(snapshot.ref);
      console.log("Download URL obtained:", url);

      setDownloadUrl(url);
      setUploadSuccess(true);
      setUploadError(null);

      // Track successful upload
      trackCustomEvent('VoiceMessageUploaded', {
        content_name: 'Voice Message Upload Success',
        content_category: 'Lead Generation',
        value: 1,
        currency: 'EUR'
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadError(error.message || "Erreur lors de l'envoi. Veuillez réessayer.");
      
      // Track upload error
      trackCustomEvent('VoiceMessageUploadError', {
        content_name: 'Voice Message Upload Error',
        content_category: 'Error'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setUploadSuccess(false);
    setUploadError(null);
    setIsUploading(false);
    setDownloadUrl(null);

    // Track recording reset
    trackCustomEvent('RecordingReset', {
      content_name: 'Voice Message Reset',
      content_category: 'User Interaction'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/"
          className="text-vox-blue hover:text-now-green transition-colors duration-300 flex items-center mb-8"
          onClick={() => trackCustomEvent('BackToHomeClick', { 
            content_name: 'Navigation',
            source: 'Voice Message Page'
          })}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour à l'accueil
        </Link>

        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-12">
            <img 
              src="https://res.cloudinary.com/drdqov4zs/image/upload/v1741862267/My%20Brand/LOGO_VoxNow_d6fbzq.png"
              alt="VoxNow Logo"
              className="h-16"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h1 className="text-2xl font-bold mb-6 text-vox-blue text-center">Laissez votre message vocal</h1>
            
            <div className="flex flex-col items-center mb-12">
              {!isRecording && !audioUrl ? (
                <button
                  onClick={startRecording}
                  className="bg-gradient-to-r from-vox-blue to-now-green text-white rounded-full p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
                >
                  <Mic className="h-8 w-8" />
                </button>
              ) : isRecording ? (
                <button
                  onClick={stopRecording}
                  className="bg-red-500 hover:bg-opacity-90 text-white rounded-full p-6 transition-all duration-300 hover:shadow-lg animate-pulse"
                >
                  <Square className="h-8 w-8" />
                </button>
              ) : null}

              <div className="text-center mt-4">
                <p className="text-gray-600 font-medium">
                  {isRecording ? "Cliquez pour arrêter l'enregistrement" : "Cliquez pour commencer l'enregistrement"}
                </p>
              </div>
            </div>

            {audioUrl && (
              <div className="mt-8 space-y-6">
                <div className="flex justify-center">
                  <audio controls src={audioUrl} className="w-full max-w-md" />
                </div>
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={resetRecording}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={isUploading}
                  >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Recommencer
                  </button>
                  
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className={`flex items-center px-6 py-2 bg-gradient-to-r from-vox-blue to-now-green text-white rounded-lg transition-all ${
                      isUploading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'
                    }`}
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    {isUploading ? 'Envoi en cours...' : 'Envoyer'}
                  </button>
                </div>
              </div>
            )}

            {downloadUrl && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">URL du fichier audio :</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(downloadUrl);
                      trackCustomEvent('AudioURLCopied', {
                        content_name: 'Audio URL Copy',
                        content_category: 'User Interaction'
                      });
                    }}
                    className="text-vox-blue hover:text-now-green transition-colors flex items-center"
                  >
                    <LinkIcon className="h-4 w-4 mr-1" />
                    Copier
                  </button>
                </div>
                <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                  <p className="text-xs text-gray-800 break-all">{downloadUrl}</p>
                </div>
              </div>
            )}

            {uploadError && (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center bg-red-50 text-red-600 px-6 py-3 rounded-full">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  {uploadError}
                </div>
              </div>
            )}

            {uploadSuccess && (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center bg-green-50 text-green-600 px-6 py-3 rounded-full">
                  Message envoyé avec succès !
                </div>
              </div>
            )}

            <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-vox-blue rounded-full p-2 flex-shrink-0">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Suggestion de message :</p>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <p className="text-gray-700 leading-relaxed">
                      Bonjour, merci de préciser votre nom, prénom ainsi que la raison de votre appel.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-gray-500 text-sm">
            <p>En laissant un message, vous acceptez nos conditions d'utilisation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}