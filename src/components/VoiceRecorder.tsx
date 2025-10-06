import { useState, useRef, useEffect } from 'react';
import { Mic, Square, RotateCcw, Send, Clock, CheckCircle, Mail, User } from 'lucide-react';
import { trackCustomEvent } from '../utils/fbPixel';

const lawyerQuotes = [
  {
    quote: "La justice est la vérité en action.",
    author: "Benjamin Disraeli"
  },
  {
    quote: "Un avocat sans histoire est un mauvais avocat.",
    author: "Proverbe juridique"
  },
  {
    quote: "Le droit est l'ensemble des conditions qui permettent à la liberté de chacun de s'accorder avec la liberté de tous.",
    author: "Emmanuel Kant"
  },
  {
    quote: "La justice sans force est impuissante, la force sans justice est tyrannique.",
    author: "Blaise Pascal"
  },
  {
    quote: "Un bon avocat connaît la loi, un grand avocat connaît le juge.",
    author: "Proverbe américain"
  },
  {
    quote: "La vérité vaut mieux qu'un mensonge bien défendu.",
    author: "Sophocle"
  },
  {
    quote: "L'ignorance de la loi n'excuse personne.",
    author: "Principe juridique"
  },
  {
    quote: "Mieux vaut prévenir que guérir, mieux vaut négocier que plaider.",
    author: "Sagesse juridique"
  }
];

interface VoiceRecorderProps {
  onRecordingComplete?: (audioBlob: Blob) => void;
}

export function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
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
      setSendError("Veuillez saisir votre adresse e-mail avant d'enregistrer");
      return;
    }

    if (!fullName.trim()) {
      setSendError("Veuillez saisir votre nom et prénom avant d'enregistrer");
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
      setSendError("Erreur d'accès au microphone. Veuillez vérifier vos permissions.");
      
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
      setSendError("Aucun enregistrement disponible");
      return;
    }

    // Check minimum duration (2 seconds)
    if (recordingDuration < 2) {
      setSendError("L'enregistrement doit durer au moins 2 secondes");
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
      const audioFile = new File([audioBlob], 'voix.webm', {
        type: 'audio/webm',
        lastModified: Date.now()
      });
      
      formData.append('audio', audioFile);
      formData.append('email', email);
      formData.append('fullName', fullName);
      formData.append('filename', `message-vocal-${Date.now()}.webm`);
      formData.append('contentType', 'audio/webm');
      formData.append('duration', recordingDuration.toString());
      formData.append('timestamp', new Date().toISOString());
      formData.append('source', 'VoxNow Recording Page');

      const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL;
      if (!webhookUrl) {
        throw new Error('Configuration manquante. Veuillez contacter le support.');
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
        throw new Error(`Erreur serveur: ${response.status}`);
      }
    } catch (error: any) {
      setSendError(`Erreur lors de l'envoi: ${error.message}. Veuillez réessayer.`);
      
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
            ✅ Message bien reçu !
          </h3>
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <p className="text-green-800 leading-relaxed">
              <strong>Merci !</strong> Votre message a été transmis à notre équipe. 
              Nous configurons votre messagerie vocale téléphonique personnalisée et vous recevrez 
              <strong> sous 48h</strong> un code personnalisé pour activer le service sur votre ligne.
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
              Enregistrer un autre message vocal pour un autre compte client
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
          Configuration de votre service VoxNow personnalisé
        </h3>
        <p className="text-gray-600">
          Laissez-nous un message vocal pour que nous puissions configurer votre service VoxNow personnalisé
        </p>
      </div>

      {/* Contact Information */}
      <div className="space-y-6 mb-8">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Nom et prénom de l'avocat *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="ex. Maître Jean Dupont"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Votre adresse e-mail (celle avec laquelle nous sommes en contact) *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex. avocat@cabinetdelcourt.be"
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
            <p className="text-sm text-gray-500 mb-2">Exemple de message vocal pour vos clients :</p>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <p className="text-gray-700 leading-relaxed italic">
                "Bonjour, vous êtes bien au cabinet [Nom].<br/><br/>
                Le seul moyen de nous joindre après un appel manqué est de <strong>nous laisser un message vocal.</strong><br/><br/>
                Sans message, nous ne pourrons pas vous recontacter.<br/><br/>
                Merci d'indiquer clairement l'objet de votre appel ainsi que de nous fournir une explication détaillée.<br/><br/>
                Parlez après le BIP."
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* Important Note */}
      <div className="bg-amber-50 rounded-xl p-4 mb-8 border border-amber-200">
        <div className="flex items-start space-x-3">
          <span className="text-amber-600 text-lg">⚠️</span>
          <p className="text-sm text-amber-800">
            <strong>Important :</strong> Demandez directement de laisser un message vocal dès le début de votre accueil téléphonique. 
            Évitez les longs préambules car les correspondants risquent de raccrocher sans laisser de message, 
            ce qui diminuerait la valeur de votre service VoxNow.
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
              <span className="font-medium">🎤 Enregistrement en cours...</span>
              <div className="flex items-center space-x-1 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(recordingDuration)}</span>
              </div>
            </div>
          ) : audioUrl ? (
            <p className="text-green-600 font-medium">
              ⏹️ Enregistrement terminé ({formatDuration(recordingDuration)})
            </p>
          ) : (
            <p className="text-gray-600">
              {email && fullName.trim() 
                ? "🎤 Cliquez pour enregistrer votre message" 
                : "Veuillez remplir vos informations avant d'enregistrer"
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
              Recommencer
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
              Envoyer le message
            </button>
          </div>
        )}

        {/* Loading Animation */}
        {isSending && (
          <div className="w-full max-w-md mx-auto loading-animation">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 border border-gray-200">
              <div className="text-center">
                {/* Spinner */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-vox-blue border-r-now-green rounded-full animate-spin"></div>
                  </div>
                </div>
                
                {/* Loading text */}
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Configuration en cours...
                </h4>
                
                {/* Quote */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">⚖️</span>
                    <div>
                      <p className="text-gray-700 italic leading-relaxed mb-2">
                        "{lawyerQuotes[currentQuoteIndex].quote}"
                      </p>
                      <p className="text-sm text-gray-500 font-medium">
                        — {lawyerQuotes[currentQuoteIndex].author}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Duration Warning */}
        {audioUrl && recordingDuration < 2 && !isSending && (
          <div className="text-center text-amber-600 text-sm">
            ⚠️ L'enregistrement doit durer au moins 2 secondes
          </div>
        )}

        {/* Status Messages */}
        {sendError && !isSending && (
          <div className="text-center">
            <div className="inline-flex items-center bg-red-50 text-red-600 px-6 py-3 rounded-full">
              {sendError}
            </div>
          </div>
        )}

        {/* UX Tip - Moved below recording controls */}
        <div className="bg-blue-50 rounded-xl p-4 mt-6 border border-blue-200">
          <div className="flex items-start space-x-3">
            <span className="text-blue-600 text-lg">💡</span>
            <div className="text-sm text-blue-800">
              <p className="mb-2">
                <strong>Conseil :</strong> Incitez vos clients à donner un maximum d'informations 
                dans leur message vocal pour faciliter votre suivi et améliorer votre service.
              </p>
              <p>
                Il n'est pas utile de demander les coordonnées du correspondant car cette info est d'office retransmise par VoxNow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}