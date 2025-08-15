

const DiscoveryCall = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Découvrons comment transformer votre cabinet
          </h1>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                📞 Vos demandes juridiques téléphoniques résumées et traitées instantanément
              </h2>
              <p className="text-muted-foreground">
                Vos messages vocaux transcrits et résumés en quelques secondes par email
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                📱 Vos clients reçoivent un SMS instantané qui répond à leur demande et les accompagne dans l'ouverture de dossier
              </h2>
            </div>
          </div>
        </div>

        {/* Calendly Embed */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-8">
            <h3 className="text-2xl font-bold text-center text-foreground mb-8">
              Réservez votre appel découverte gratuit
            </h3>
            
            {/* Calendly Inline Widget */}
            <div 
              className="calendly-inline-widget" 
              data-url="https://calendly.com/votre-calendly-url" 
              style={{ minWidth: '320px', height: '700px' }}
            ></div>
            
            {/* Calendly Script */}
            <script 
              type="text/javascript" 
              src="https://assets.calendly.com/assets/external/widget.js" 
              async
            ></script>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryCall;