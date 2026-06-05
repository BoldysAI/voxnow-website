import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function Redirect() {
  const { slug } = useParams<{ slug: string }>();
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      return;
    }

    let cancelled = false;

    async function fetchRedirect() {
      const { data, error } = await supabase
        .from('redirections')
        .select('destination_url')
        .eq('slug', slug)
        .limit(1)
        .single();

      if (cancelled) return;

      if (error || !data) {
        setNotFound(true);
        return;
      }

      window.location.replace(data.destination_url);
    }

    fetchRedirect();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lien introuvable</h1>
          <a
            href="https://voxnow.be"
            className="text-vox-blue hover:underline font-medium"
          >
            Retour à voxnow.be
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-vox-blue mx-auto mb-4" />
        <p className="text-lg text-gray-700 font-medium">Redirection en cours...</p>
      </div>
    </div>
  );
}
