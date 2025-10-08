import { useState, useRef, useEffect } from 'react';
import { Mic, Square, RotateCcw, Send, Clock, CheckCircle, Mail, User } from 'lucide-react';
import { trackCustomEvent } from '../utils/fbPixel';

const lawyerQuotes = [
  {
    quote: "A justiça é a verdade em ação.",
    author: "Benjamin Disraeli"
  },
  {
    quote: "Um advogado sem história é um mau advogado.",
    author: "Provérbio jurídico"
  },
  {
    quote: "O direito é o conjunto das condições que permitem que a liberdade de cada um se harmonize com a liberdade de todos.",
    author: "Emmanuel Kant"
  },
  {
    quote: "A justiça sem força é impotente, a força sem justiça é tirânica.",
    author: "Blaise Pascal"
  },
  {
    quote: "Um bom advogado conhece a lei, um grande advogado conhece o juiz.",
    author: "Provérbio americano"
  },
  {
    quote: "A verdade vale mais que uma mentira bem defendida.",
    author: "Sófocles"
  },
  {
    quote: "A ignorância da lei não escusa ninguém.",
    author: "Princípio jurídico"
  },
  {
    quote: "Mais vale prevenir que remediar, mais vale negociar que pleitear.",
    author: "Sabedoria jurídica"
  }
];

interface GravadorVozProps {
  onRecordingComplete?: (audioBlob: Blob) => void;
}

export function GravadorVoz({ onRecordingComplete }: GravadorVozProps) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);

  // Rotate quotes every 2 seconds during loading
  useEffect(() => {
    let quoteInterval: NodeJS.Timeout;
    
    if (isSending) {
      quoteInterval = setInterval(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % lawyerQuotes.length);
      }, 2000);
    }
    
    return () => {
      if (quoteInterval) {
        clearInterval(quoteInterval);
      }
    };
  }, [isSending]);

  const startRecording = async () => {
    // Validate email before starting
    if (!email || !email.includes('@')) {
      setSendError("Por favor insira o seu endereço de e-mail antes de gravar");
      return;
    }

    if (!fullName.trim()) {
      setSendError("Por favor insira o seu nome completo antes de gravar");
      return;
    }

    try {
      trackCustomEvent('VoiceRecordingStarted', {
        content_name: 'VoxNow Service Configuration',
        content_category: 'User Interaction'
      });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunks.current = [];
      
      // Reset states
      setAudioUrl(null);
      setAudioBlob(null);
      setSendSuccess(false);
      setSendError(null);
      setRecordingDuration(0);

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
        
        if (onRecordingComplete) {
          onRecordingComplete(blob);
        }

        trackCustomEvent('VoiceRecordingCompleted', {
          content_name: 'VoxNow Service Configuration',
          content_category: 'User Interaction',
          duration: recordingDuration
        });
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      
      // Start timer
      recordingTimer.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error("Error accessing microphone:", error);
      setSendError("Erro de acesso ao microfone. Por favor verifique as suas permissões.");
      
      trackCustomEvent('VoiceRecordingError', {
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
      
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
        recordingTimer.current = null;
      }
    }
  };

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setSendSuccess(false);
    setSendError(null);
    setRecordingDuration(0);

    trackCustomEvent('VoiceRecordingReset', {
      content_name: 'VoxNow Service Configuration Reset',
      content_category: 'User Interaction'
    });
  };

  const sendToWebhook = async () => {
    if (!audioBlob) {
      setSendError("Nenhuma gravação disponível");
      return;
    }

    // Check minimum duration (2 seconds)
    if (recordingDuration < 2) {
      setSendError("A gravação deve durar pelo menos 2 segundos");
      return;
    }

    setIsSending(true);
    setSendError(null);

    // Scroll to loading section after a short delay
    setTimeout(() => {
      const loadingElement = document.querySelector('.loading-animation');
      if (loadingElement) {
        loadingElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);
    
    try {
      trackCustomEvent('VoxNowConfigurationUploadStarted', {
        content_name: 'VoxNow Service Configuration Upload',
        content_category: 'Lead Generation',
        duration: recordingDuration
      });

      // Add a small delay to show the loading animation
      await new Promise(resolve => setTimeout(resolve, 500));

      const formData = new FormData();
      
      // Create a proper File object from the blob
      const audioFile = new File([audioBlob], 'voz.webm', {
        type: 'audio/webm',
        lastModified: Date.now()
      });
      
      formData.append('audio', audioFile);
      formData.append('email', email);
      formData.append('fullName', fullName);
      formData.append('filename', `mensagem-vocal-${Date.now()}.webm`);
      formData.append('contentType', 'audio/webm');
      formData.append('duration', recordingDuration.toString());
      formData.append('timestamp', new Date().toISOString());
      formData.append('source', 'VoxNow Gravacao Page');

      const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_PT_URL;
      if (!webhookUrl) {
        throw new Error('Configuração em falta. Por favor contacte o suporte.');
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
        headers: {
          // Let browser set Content-Type with boundary for multipart/form-data
        }
      });

      await response.text();
      
      if (response.ok) {
        setSendSuccess(true);
        setSendError(null);
        
        // Scroll to success message
        setTimeout(() => {
          const element = document.querySelector('.success-message');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
        
        trackCustomEvent('VoxNowConfigurationUploaded', {
          content_name: 'VoxNow Service Configuration Success',
          content_category: 'Lead Generation',
          value: 1,
          currency: 'EUR',
          duration: recordingDuration
        });
      } else {
        throw new Error(`Erro do servidor: ${response.status}`);
      }
    } catch (error: any) {
      setSendError(`Erro ao enviar: ${error.message}. Por favor tente novamente.`);
      
      trackCustomEvent('VoxNowConfigurationUploadError', {
        content_name: 'VoxNow Service Configuration Error',
        content_category: 'Error'
      });
    } finally {
      setIsSending(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (sendSuccess) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 success-message">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-green-600 mb-4">
            ✅ Mensagem bem recebida!
          </h3>
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <p className="text-green-800 leading-relaxed">
              <strong>Obrigado!</strong> A sua mensagem foi transmitida à nossa equipa. 
              Configuramos o seu atendimento telefónico personalizado e receberá 
              <strong> em 48h</strong> um código personalizado para ativar o serviço na sua linha.
            </p>
          </div>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                // Reset all states for new recording
                setEmail('');
                setFullName('');
                setAudioUrl(null);
                setAudioBlob(null);
                setSendSuccess(false);
                setSendError(null);
                setRecordingDuration(0);
                setIsSending(false);
                
                trackCustomEvent('NewClientRecordingStarted', {
                  content_name: 'Another Client Recording',
                  content_category: 'User Interaction'
                });
              }}
              className="bg-gradient-to-r from-vox-blue to-now-green text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center mx-auto"
            >
              <Mic className="h-5 w-5 mr-2" />
              Gravar outra mensagem vocal para outro cliente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold gradient-text mb-4">
          Configuração do seu serviço VoxNow personalizado
        </h3>
        <p className="text-gray-600">
          Deixe-nos uma mensagem vocal para que possamos configurar o seu serviço VoxNow personalizado
        </p>
      </div>

      {/* Contact Information */}
      <div className="space-y-6 mb-8">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Nome completo do advogado *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="ex. Dr. João Silva"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            O seu endereço de e-mail (aquele com o qual estamos em contacto) *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex. advogado@escritorio.pt"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
              required
            />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 mb-6 border border-gray-200">
        <div className="flex items-start space-x-4">
          <div className="bg-vox-blue rounded-full p-2 flex-shrink-0">
            <Mic className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Exemplo de mensagem vocal para os seus clientes:</p>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <p className="text-gray-700 leading-relaxed italic">
                "Olá, aqui é o Dr. Silva. Por favor explique-me o motivo da sua chamada, 
                bem como o seu nome. A sua mensagem será-me transcrita, resumida e enviada automaticamente 
                por e-mail, graças ao VoxNow.be."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* UX Tip */}
      <div className="bg-blue-50 rounded-xl p-4 mb-8 border border-blue-200">
        <div className="flex items-start space-x-3">
          <span className="text-blue-600 text-lg">💡</span>
          <p className="text-sm text-blue-800">
            <strong>Conselho:</strong> Incentive os seus clientes a dar o máximo de informações 
            na sua mensagem vocal para facilitar o seu acompanhamento e melhorar o seu serviço.
          </p>
        </div>
      </div>

      {/* Recording Controls */}
      <div className="flex flex-col items-center space-y-6">
        {/* Main Recording Button */}
        <div className="relative">
          {!isRecording && !audioUrl ? (
            <button
              onClick={startRecording}
              disabled={!email || !fullName.trim()}
              className={`rounded-full p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 transform ${
                email && fullName.trim()
                  ? 'bg-gradient-to-r from-vox-blue to-now-green text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
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
        </div>

        {/* Recording Status */}
        <div className="text-center">
          {isRecording ? (
            <div className="flex items-center space-x-2 text-red-600">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-medium">🎤 Gravação em curso...</span>
              <div className="flex items-center space-x-1 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(recordingDuration)}</span>
              </div>
            </div>
          ) : audioUrl ? (
            <p className="text-green-600 font-medium">
              ⏹️ Gravação terminada ({formatDuration(recordingDuration)})
            </p>
          ) : (
            <p className="text-gray-600">
              {email && fullName.trim() 
                ? "🎤 Clique para gravar a sua mensagem" 
                : "Por favor preencha as suas informações antes de gravar"
              }
            </p>
          )}
        </div>

        {/* Audio Playback */}
        {audioUrl && (
          <div className="w-full max-w-md">
            <audio controls src={audioUrl} className="w-full" />
          </div>
        )}

        {/* Action Buttons */}
        {audioUrl && !isSending && (
          <div className="flex space-x-4">
            <button
              onClick={resetRecording}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Recomeçar
            </button>
            
            <button
              onClick={sendToWebhook}
              disabled={recordingDuration < 2}
              className={`flex items-center px-6 py-2 bg-gradient-to-r from-vox-blue to-now-green text-white rounded-lg transition-all ${
                recordingDuration < 2 
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'hover:shadow-lg'
              }`}
            >
              <Send className="h-5 w-5 mr-2" />
              Enviar a mensagem
            </button>
          </div>
        )}

        {/* Loading Animation */}
        {isSending && (
          <div className="w-full max-w-md mx-auto loading-animation">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-vox-blue border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <h4 className="text-xl font-bold text-vox-blue mb-4">
                  🚀 A processar a sua mensagem...
                </h4>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <p className="text-gray-700 italic text-sm">
                      "{lawyerQuotes[currentQuoteIndex].quote}"
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      — {lawyerQuotes[currentQuoteIndex].author}
                    </p>
                  </div>
                  <p className="text-gray-600 text-sm">
                    A nossa IA está a analisar a sua mensagem para configurar o serviço VoxNow perfeito para si...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {sendError && (
          <div className="w-full max-w-md mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{sendError}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}