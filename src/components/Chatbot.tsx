import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Calendar } from 'lucide-react';
import { trackCustomEvent } from '../utils/fbPixel';
import OpenAI from 'openai';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true
});

const VOXY_SYSTEM_PROMPT = `Tu es Voxy, le chatbot IA de VoxNow, une solution SaaS belge qui automatise la gestion des messages vocaux manqués pour les cabinets d'avocats.

CONTEXTE VOXNOW :
VoxNow résout le problème des avocats qui ratent des appels importants quand ils sont occupés (audience, réunion, fermé). Ces appels deviennent des messages vocaux qu'ils n'ont pas le temps d'écouter.

SOLUTION VOXNOW :

- Transcription et résumé automatique par IA en quelques secondes
- Envoi direct par e-mail au cabinet
- Réponse automatique par SMS au client en fonction de sa demande

FONCTIONNEMENT :
1. Abonnement mensuel 90€
2. Enregistrement du message d'accueil sur https://voxnow.be/recording
3. Réception des codes de déviation à taper sur le téléphone
4. Redirection automatique et transcription par e-mail

PRIX : 90€/mois TTC, sans engagement, transcriptions illimitées, paiement Stripe, support inclus

CIBLE : Avocats indépendants, cabinets petite/moyenne taille, secrétaires juridiques

TON & STYLE :
- Toujours en français
- Chaleureux, professionnel et rassurant
- Pas trop technique mais clair
- Réponses TRÈS courtes (maximum 2-3 phrases), sois ultra direct
- Mets en valeur les bénéfices (gain de temps, réactivité, image pro)
- IMPÉRATIF : Garde tes réponses courtes, comme un SMS

QUESTIONS FRÉQUENTES :
- Comment ça fonctionne ? → Redirection + transcription automatique par e-mail
- Prix ? → 90€/mois TTC sans engagement, tout inclus
- Compatible ? → Tous téléphones et opérateurs belges
- Sécurisé ? → Cryptage, serveurs Europe, e-mail privé
- Installation ? → Non, juste un code de redirection
- Test ? → Pas d'essai gratuit mais démo personnalisée
- Plusieurs avocats ? → Une ligne par cabinet ou par avocat

REDIRECTION CTA :
Après quelques échanges, propose une démo : "Je peux vous proposer une démo personnalisée de VoxNow. Réservez une démo grâce au bouton ci-dessous"

Réponds toujours comme Voxy, de manière utile et engageante !`;

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [hasShownAutoTrigger, setHasShownAutoTrigger] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [ctaAnimating, setCtaAnimating] = useState(true);
  const [position, setPosition] = useState({ x: 24, y: 24 }); // bottom-right by default
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoTriggerTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shakeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shakeStopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const ctaTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const ctaStopAnimationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !hasShownWelcome) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: "👋 Salut ! Je suis Voxy, votre assistant VoxNow !\n\nDites-moi, vous prenez beaucoup de temps à gérer vos appels aujourd'hui ? 📞",
        isBot: true,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      setHasShownWelcome(true);
      
      // Track chatbot opening
      trackCustomEvent('ChatbotOpened', {
        content_name: 'Voxy Chatbot',
        content_category: 'User Interaction'
      });

      // Show CTA button after 20 seconds
      ctaTimeoutRef.current = setTimeout(() => {
        setShowCTA(true);
        setCtaAnimating(true);
        
        // Stop CTA animation after 5 seconds
        ctaStopAnimationTimeoutRef.current = setTimeout(() => {
          setCtaAnimating(false);
        }, 5000);
      }, 40000);
    }
  }, [isOpen, hasShownWelcome]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Shake animation after 8 seconds, stop after 5 seconds
  useEffect(() => {
    if (!isOpen) {
      shakeTimeoutRef.current = setTimeout(() => {
        setIsShaking(true);
        
        // Stop shaking after 5 seconds
        shakeStopTimeoutRef.current = setTimeout(() => {
          setIsShaking(false);
        }, 5000);
      }, 8000);
    }

    return () => {
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current);
      }
      if (shakeStopTimeoutRef.current) {
        clearTimeout(shakeStopTimeoutRef.current);
      }
    };
  }, [isOpen]);

  // Auto-trigger after 30 seconds of inactivity
  useEffect(() => {
    if (!isOpen && !hasShownAutoTrigger) {
      autoTriggerTimeoutRef.current = setTimeout(() => {
        if (!isOpen && !hasShownAutoTrigger) {
          setHasShownAutoTrigger(true);
          // Show auto-trigger bubble
          const bubble = document.createElement('div');
          bubble.className = 'fixed bottom-24 right-6 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 max-w-xs z-40';
          bubble.innerHTML = `
            <div class="flex items-start space-x-3">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-700 font-medium">Besoin d'aide ?</p>
                <p class="text-xs text-gray-600">Je peux vous expliquer comment VoxNow optimise la gestion d'appels de votre cabinet 📩</p>
              </div>
            </div>
          `;
          
          bubble.addEventListener('click', () => {
            setIsOpen(true);
            bubble.remove();
            trackCustomEvent('AutoTriggerClicked', {
              content_name: 'Voxy Auto Trigger',
              content_category: 'User Interaction'
            });
          });
          
          document.body.appendChild(bubble);
          
          // Remove bubble after 5 seconds
          setTimeout(() => {
            if (bubble.parentNode) {
              bubble.remove();
            }
          }, 5000);
        }
      }, 30000);
    }

    return () => {
      if (autoTriggerTimeoutRef.current) {
        clearTimeout(autoTriggerTimeoutRef.current);
      }
    };
  }, [isOpen, hasShownAutoTrigger]);

  // Drag and drop functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isOpen) return; // Don't allow dragging when chat is open
    
    setIsDragging(true);
    const rect = chatbotRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
    e.preventDefault();
  };

  // Touch drag and drop functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isOpen) return; // Don't allow dragging when chat is open
    
    setIsDragging(true);
    const touch = e.touches[0];
    const rect = chatbotRef.current?.getBoundingClientRect();
    if (rect && touch) {
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      });
    }
    e.preventDefault();
    e.stopPropagation();
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = window.innerWidth - (e.clientX - dragOffset.x) - 64; // 64px = button width
    const newY = window.innerHeight - (e.clientY - dragOffset.y) - 64; // 64px = button height
    
    // Constrain to viewport
    const constrainedX = Math.max(24, Math.min(newX, window.innerWidth - 88));
    const constrainedY = Math.max(24, Math.min(newY, window.innerHeight - 88));
    
    setPosition({ x: constrainedX, y: constrainedY });
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    if (!touch) return;
    
    const newX = window.innerWidth - (touch.clientX - dragOffset.x) - 64; // 64px = button width
    const newY = window.innerHeight - (touch.clientY - dragOffset.y) - 64; // 64px = button height
    
    // Constrain to viewport
    const constrainedX = Math.max(24, Math.min(newX, window.innerWidth - 88));
    const constrainedY = Math.max(24, Math.min(newY, window.innerHeight - 88));
    
    setPosition({ x: constrainedX, y: constrainedY });
    e.preventDefault(); // Prevent scrolling while dragging
    e.stopPropagation();
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, dragOffset]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Track chatbot opening
      trackCustomEvent('ChatbotToggled', {
        content_name: 'Voxy Chatbot Toggle',
        content_category: 'User Interaction'
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowCTA(false);
    setCtaAnimating(false);
    if (ctaTimeoutRef.current) {
      clearTimeout(ctaTimeoutRef.current);
    }
    if (ctaStopAnimationTimeoutRef.current) {
      clearTimeout(ctaStopAnimationTimeoutRef.current);
    }
    trackCustomEvent('ChatbotClosed', {
      content_name: 'Voxy Chatbot Close',
      content_category: 'User Interaction'
    });
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    // Force dezoom on mobile after sending message
    if (window.innerWidth <= 640) {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
      // Force scroll to top of chat to ensure visibility
      setTimeout(() => {
        const chatWindow = document.querySelector('.chatbot-window');
        if (chatWindow) {
          chatWindow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Track user message
    trackCustomEvent('ChatbotMessageSent', {
      content_name: 'User Message to Voxy',
      content_category: 'User Interaction'
    });

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: VOXY_SYSTEM_PROMPT },
          ...messages.map(msg => ({
            role: msg.isBot ? 'assistant' as const : 'user' as const,
            content: msg.text
          })),
          { role: 'user', content: userMessage.text }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.choices[0]?.message?.content || "Désolé, je n'ai pas pu traiter votre demande. Pouvez-vous reformuler ?",
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);

      // Track bot response
      trackCustomEvent('ChatbotResponseReceived', {
        content_name: 'Voxy Response',
        content_category: 'AI Interaction'
      });

    } catch (error) {
      console.error('Erreur OpenAI:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Désolé, je rencontre un problème technique. Vous pouvez me reposer votre question ou contacter directement notre équipe à sacha@voxnow.be",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);

      // Track error
      trackCustomEvent('ChatbotError', {
        content_name: 'Voxy Error',
        content_category: 'Error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (text: string) => {
    // Convert URLs to clickable links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-green-600 underline font-medium"
            onClick={() => trackCustomEvent('ChatbotLinkClick', {
              content_name: 'Link from Voxy',
              url: part
            })}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const scrollToCalendly = () => {
    trackCustomEvent('CalendlyClickFromChatbot', {
      content_name: 'Demo Booking from Voxy',
      content_category: 'Lead Generation'
    });
    
    // Scroll to Calendly embed section
    const calendlySection = document.querySelector('.calendly-inline-widget');
    if (calendlySection) {
      calendlySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle mobile viewport adjustment
  useEffect(() => {
    if (isOpen) {
      // Completely disable zoom on mobile when chatbot is open
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
      }
    } else {
      // Restore normal viewport when closed (but still prevent zoom)
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    }

    return () => {
      // Cleanup on unmount - keep zoom disabled
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    };
  }, [isOpen]);

  return (
    <>
      {/* Chatbot Toggle Button - Draggable */}
      <div 
        ref={chatbotRef}
        className="fixed z-50"
        style={{ 
          right: `${position.x}px`, 
          bottom: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : (isOpen ? 'pointer' : 'grab')
        }}
      >
        <button
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={(e) => {
            if (!isDragging) {
              handleToggle();
            } else {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          className={`w-16 h-16 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
            isOpen 
              ? 'bg-gray-500 hover:bg-gray-600' 
              : 'bg-gradient-to-r from-blue-500 to-green-500 hover:shadow-xl hover:scale-110'
          } ${isShaking ? 'animate-bounce' : ''} ${isDragging ? 'scale-110' : ''}`}
          style={{ touchAction: 'none' }}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <div className="relative">
              {/* Modern Robot Design */}
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center relative">
                {/* Robot Head */}
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-green-500 rounded-md relative">
                  {/* Robot Eyes */}
                  <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full"></div>
                  <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full"></div>
                  {/* Robot Mouth */}
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-white rounded-full"></div>
                  {/* Robot Antenna */}
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-1 bg-gradient-to-t from-blue-500 to-green-500"></div>
                  <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full"></div>
                </div>
              </div>
              {/* Notification dot */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </button>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div 
          className="fixed w-80 sm:w-96 h-[450px] sm:h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden"
          style={{ 
            right: window.innerWidth <= 640 ? '8px' : `${position.x}px`, 
            bottom: window.innerWidth <= 640 ? '80px' : `${position.y + 80}px`,
            left: window.innerWidth <= 640 ? '8px' : 'auto',
            maxWidth: window.innerWidth <= 640 ? 'calc(100vw - 16px)' : 'none'
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-green-500 p-3 sm:p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
                  {/* Robot head in header - white version */}
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/30 rounded-md relative">
                    {/* Robot Eyes */}
                    <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full"></div>
                    <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full"></div>
                    {/* Robot Mouth */}
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-white rounded-full"></div>
                    {/* Robot Antenna */}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-1 bg-white"></div>
                    <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">Voxy</h3>
                  <p className="text-xs sm:text-sm text-white/90">Assistant VoxNow</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20 ml-2"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed">
                    {message.isBot ? formatMessage(message.text) : message.text}
                  </div>
                  <div className={`text-xs mt-1 ${
                    message.isBot ? 'text-gray-500' : 'text-white/70'
                  }`}>
                    {message.timestamp.toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    <span className="text-xs sm:text-sm text-gray-600">Voxy réfléchit...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* CTA Button - Hidden under stylish button */}
          {showCTA && (
            <div className="px-3 sm:px-4 pb-2">
              <button
                onClick={scrollToCalendly}
                className={`w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${
                  ctaAnimating ? 'animate-pulse' : ''
                }`}
              >
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">🎯 Réserver une démo gratuite</span>
              </button>
            </div>
          )}

          {/* Input */}
          <div className="p-3 sm:p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                style={{ fontSize: '16px' }} // Prevent zoom on iOS
              />
              <button
                onClick={sendMessage}
                disabled={!inputText.trim() || isLoading}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  inputText.trim() && !isLoading
                    ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}