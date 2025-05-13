export default function BackgroundVideo() {
  return (
    <div className="fixed inset-0 -z-10 w-screen h-screen overflow-hidden">
      <div className="absolute top-1/2 left-1/2 w-[120vw] h-[120vh] -translate-x-1/2 -translate-y-1/2">
        <iframe
          className="w-full h-full pointer-events-none"
          src="https://www.youtube.com/embed/1TMk9SKISQY?autoplay=1&mute=1&controls=0&loop=1&playlist=1TMk9SKISQY&modestbranding=1&showinfo=0&rel=0"
          title="YouTube video background"
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
} 