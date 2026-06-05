import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Loader2, Copy, Trash2, X, Check, Plus, Upload } from 'lucide-react';

type Redirection = {
  id: string;
  slug: string;
  destination_url: string;
  label: string | null;
  use_case: string | null;
  lawyer_name: string | null;
  created_at: string;
};

const STOP_SHORT = new Set(['de', 'du', 'la', 'le', 'les', 'un', 'une', 'des', 'et', 'a', 'au', 'aux', 'en', 'l', 'd']);

function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function generateLawyerSlug(name: string): string {
  return stripAccents(name.toLowerCase())
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 15)
    .replace(/-+$/g, '');
}

function generateSlug(label: string, existing: Set<string>, lawyerName?: string): string {
  const cleaned = stripAccents(label.toLowerCase())
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = cleaned.split(' ').filter(Boolean);

  let base = '';
  const firstLong = words.find((w) => w.length > 3 && !STOP_SHORT.has(w));
  if (firstLong) {
    base = firstLong;
  } else {
    const meaningful = words.filter((w) => !STOP_SHORT.has(w));
    base = meaningful.slice(0, 2).join('-') || words.slice(0, 2).join('-') || 'lien';
  }
  base = base.slice(0, 20).replace(/-+$/g, '');

  const lawyerSlug = lawyerName ? generateLawyerSlug(lawyerName) : '';
  const compose = (b: string) => {
    if (lawyerSlug) return `${lawyerSlug}-${b}`.slice(0, 30).replace(/-+$/g, '');
    return b.slice(0, 20).replace(/-+$/g, '');
  };

  let candidate = compose(base);
  if (!existing.has(candidate)) return candidate;
  let i = 2;
  while (existing.has(compose(`${base}-${i}`))) i++;
  return compose(`${base}-${i}`);
}

export default function SimplicyRedirections() {
  const [items, setItems] = useState<Redirection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [lawyerName, setLawyerName] = useState('');
  const [label, setLabel] = useState('');
  const [useCase, setUseCase] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [bulkLawyerName, setBulkLawyerName] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Redirection | null>(null);
  const [deleting, setDeleting] = useState(false);

  const existingSlugs = useMemo(() => new Set(items.map((i) => i.slug)), [items]);

  useEffect(() => {
    if (slugManuallyEdited) return;
    if (!label.trim()) {
      setCustomSlug('');
      return;
    }
    setCustomSlug(generateSlug(label, existingSlugs, lawyerName.trim() || undefined));
  }, [label, lawyerName, existingSlugs, slugManuallyEdited]);

  const slugValid = customSlug === '' || /^[a-z0-9-]+$/.test(customSlug);

  async function loadList() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('redirections')
      .select('id, slug, destination_url, label, use_case, lawyer_name, created_at')
      .order('created_at', { ascending: false });
    if (error) {
      setError(error.message);
      setItems([]);
    } else {
      setItems((data ?? []) as Redirection[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadList();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim() || !destinationUrl.trim() || !customSlug || !slugValid) return;
    setSubmitting(true);
    setError(null);
    const { error } = await supabase.from('redirections').insert({
      slug: customSlug,
      destination_url: destinationUrl.trim(),
      label: label.trim(),
      use_case: useCase.trim() || null,
      lawyer_name: lawyerName.trim() || null,
    });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setLawyerName('');
    setLabel('');
    setUseCase('');
    setDestinationUrl('');
    setCustomSlug('');
    setSlugManuallyEdited(false);
    await loadList();
  }

  function parseBulk(
    text: string,
    lawyerName?: string
  ): { slug: string; destination_url: string; label: string; use_case: string | null; lawyer_name: string | null }[] {
    // Split into blocks at each "=>" marker OR blank-line separator (legacy ◊ format).
    const normalized = text.replace(/\r\n/g, '\n').trim();
    let blocks: string[];
    if (/^\s*=>/m.test(normalized)) {
      blocks = normalized
        .split(/\n(?=\s*=>)/)
        .map((b) => b.trim())
        .filter(Boolean);
    } else {
      blocks = normalized.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
    }
    const used = new Set(existingSlugs);
    const rows: { slug: string; destination_url: string; label: string; use_case: string | null; lawyer_name: string | null }[] = [];
    for (const block of blocks) {
      let lbl = '';
      let uc: string | null = null;
      let url = '';

      if (/^\s*=>/.test(block)) {
        // New format:  => Label : https://url   (followed by free-form description lines)
        const cleaned = block.replace(/^\s*=>\s*/, '');
        const urlMatch = cleaned.match(/https?:\/\/\S+/);
        if (urlMatch) {
          url = urlMatch[0].replace(/[.,;)]+$/, '');
          const before = cleaned.slice(0, urlMatch.index).replace(/[\s:–—-]+$/, '').trim();
          const firstLine = before.split('\n')[0].trim();
          lbl = firstLine;
          const after = cleaned.slice((urlMatch.index ?? 0) + urlMatch[0].length).trim();
          uc = after ? after.replace(/\s+/g, ' ').trim() : null;
        }
      } else {
        // Legacy format: ◊ Label / USECASE : ... / LIEN : ...
        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
        for (const line of lines) {
          if (line.startsWith('◊')) {
            lbl = line.replace(/^◊\s*/, '').trim();
          } else if (/^USECASE\s*:/i.test(line)) {
            uc = line.replace(/^USECASE\s*:/i, '').trim() || null;
          } else if (/^LIEN\s*:/i.test(line)) {
            url = line.replace(/^LIEN\s*:/i, '').trim();
          } else if (!lbl) {
            lbl = line;
          }
        }
      }

      if (!lbl || !url) continue;
      const slug = generateSlug(lbl, used, lawyerName);
      used.add(slug);
      rows.push({ slug, destination_url: url, label: lbl, use_case: uc, lawyer_name: lawyerName || null });
    }
    return rows;

  }

  async function handleBulkImport() {
    setImportMessage(null);
    const rows = parseBulk(bulkText, bulkLawyerName.trim() || undefined);
    if (rows.length === 0) {
      setImportMessage({ type: 'error', text: 'Aucune entrée valide détectée.' });
      return;
    }
    setImporting(true);
    const { error } = await supabase.from('redirections').insert(rows);
    setImporting(false);
    if (error) {
      setImportMessage({ type: 'error', text: error.message });
      return;
    }
    setImportMessage({ type: 'success', text: `${rows.length} lien(s) importé(s) avec succès.` });
    setBulkText('');
    setBulkLawyerName('');
    await loadList();
  }

  async function handleCopy(item: Redirection) {
    const url = `https://voxnow.be/a/${item.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId((c) => (c === item.id ? null : c)), 2000);
    } catch {
      setError('Impossible de copier dans le presse-papiers.');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from('redirections').delete().eq('id', deleteTarget.id);
    setDeleting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDeleteTarget(null);
    await loadList();
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Single creation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Plus className="h-5 w-5 mr-2 text-red-600" /> Nouveau lien
          </h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'avocat</label>
              <input
                type="text"
                value={lawyerName}
                onChange={(e) => setLawyerName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Rousseau"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Label *</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Demande de rendez-vous"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug (modifiable)</label>
              <input
                type="text"
                value={customSlug}
                onChange={(e) => {
                  setSlugManuallyEdited(true);
                  setCustomSlug(e.target.value);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono"
                placeholder="rousseau-rendezvous"
              />
              {!slugValid && (
                <p className="text-xs text-red-600 mt-2">
                  Le slug ne peut contenir que des minuscules, des chiffres et des tirets.
                </p>
              )}
              {customSlug && slugValid && (
                <p className="text-xs text-gray-500 mt-2">
                  <span className="font-mono text-gray-700">voxnow.be/a/{customSlug}</span>
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Use case</label>
              <input
                type="text"
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Description (optionnel)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL destination *</label>
              <input
                type="url"
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="https://simplicy.eu/..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !label.trim() || !destinationUrl.trim() || !customSlug || !slugValid}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
            >
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Créer le lien'}
            </button>
          </form>
        </div>

        {/* Bulk import */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Upload className="h-5 w-5 mr-2 text-red-600" /> Import en lot
          </h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'avocat</label>
            <input
              type="text"
              value={bulkLawyerName}
              onChange={(e) => setBulkLawyerName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Rousseau"
            />
          </div>
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            rows={10}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm"
            placeholder={'◊ Demande de rendez-vous\nUSECASE : prise de RDV\nLIEN : https://simplicy.eu/...\n\n◊ Envoi de documents\nUSECASE : ...\nLIEN : https://...'}
          />
          {importMessage && (
            <div
              className={`mt-3 px-4 py-2 rounded-lg text-sm ${
                importMessage.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              {importMessage.text}
            </div>
          )}
          <button
            type="button"
            onClick={handleBulkImport}
            disabled={importing || !bulkText.trim()}
            className="mt-4 w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
          >
            {importing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Importer tout'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Redirections ({items.length})</h3>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Aucune redirection pour le moment.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Avocat</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Label</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Use case</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Lien court</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">URL destination</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{item.lawyer_name || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.label || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.use_case || '—'}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-700">voxnow.be/a/{item.slug}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span title={item.destination_url}>
                        {item.destination_url.length > 40
                          ? `${item.destination_url.slice(0, 40)}…`
                          : item.destination_url}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleCopy(item)}
                          className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            copiedId === item.id
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="h-4 w-4 mr-1" /> Copié !
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-1" /> Copier
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Supprimer la redirection</h3>
              <button
                onClick={() => setDeleteTarget(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Voulez-vous vraiment supprimer{' '}
              <span className="font-mono text-gray-900">voxnow.be/a/{deleteTarget.slug}</span> ? Cette action est irréversible.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-medium flex items-center justify-center"
              >
                {deleting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
