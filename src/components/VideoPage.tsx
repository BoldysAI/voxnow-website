interface VideoPageProps {
  title: string;
  driveFileId: string;
}

export function VideoPage({ title, driveFileId }: VideoPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">{title}</h1>
      <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-xl border border-gray-200">
        <iframe
          src={`https://drive.google.com/file/d/${driveFileId}/preview`}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={title}
        />
      </div>
    </div>
  );
}
