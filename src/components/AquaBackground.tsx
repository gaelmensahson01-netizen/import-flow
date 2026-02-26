import { motion } from 'framer-motion';

const lightBlobs = [
  { color: '20 35% 65%', x: '5%', y: '10%', size: 380, duration: 20, delay: 0 },    // rosé
  { color: '30 40% 55%', x: '75%', y: '55%', size: 320, duration: 24, delay: 2 },    // brun chaud
  { color: '15 45% 70%', x: '85%', y: '10%', size: 240, duration: 17, delay: 4 },    // pêche
  { color: '170 60% 40%', x: '20%', y: '70%', size: 220, duration: 22, delay: 1 },   // teal
  { color: '35 50% 60%', x: '50%', y: '35%', size: 300, duration: 26, delay: 3 },    // caramel
  { color: '10 30% 75%', x: '60%', y: '80%', size: 180, duration: 18, delay: 5 },    // rosé doux
  { color: '42 65% 58%', x: '40%', y: '15%', size: 200, duration: 19, delay: 2.5 },  // gold
];

const darkBlobs = [
  { color: 'var(--teal)', x: '10%', y: '20%', size: 320, duration: 18, delay: 0 },
  { color: 'var(--sea-blue)', x: '70%', y: '60%', size: 280, duration: 22, delay: 2 },
  { color: 'var(--teal-light)', x: '80%', y: '15%', size: 200, duration: 16, delay: 4 },
  { color: 'var(--gold)', x: '25%', y: '75%', size: 180, duration: 20, delay: 1 },
  { color: 'var(--sea-blue)', x: '50%', y: '40%', size: 260, duration: 24, delay: 3 },
  { color: 'var(--teal)', x: '15%', y: '50%', size: 150, duration: 15, delay: 5 },
];

function Blobs({ blobs, opacity }: { blobs: typeof lightBlobs; opacity: string }) {
  return (
    <>
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: blob.size,
            height: blob.size,
            left: blob.x,
            top: blob.y,
            background: `radial-gradient(circle, hsl(${blob.color} / ${opacity}) 0%, hsl(${blob.color} / 0.08) 50%, transparent 70%)`,
            filter: 'blur(70px)',
          }}
          animate={{
            x: [0, 35, -25, 20, -35, 0],
            y: [0, -30, 25, -20, 30, 0],
            scale: [1, 1.18, 0.88, 1.12, 0.92, 1],
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: blob.delay,
          }}
        />
      ))}
    </>
  );
}

export default function AquaBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base */}
      <div className="absolute inset-0 bg-background" />

      {/* Light mode blobs */}
      <div className="dark:hidden absolute inset-0">
        <Blobs blobs={lightBlobs} opacity="0.35" />
      </div>

      {/* Dark mode blobs */}
      <div className="hidden dark:block absolute inset-0">
        <Blobs blobs={darkBlobs} opacity="0.25" />
      </div>

      {/* Water caustics */}
      <div className="absolute inset-0 aqua-caustics opacity-[0.05] dark:opacity-[0.04]" />

      {/* Ripple rings */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          left: '60%', top: '30%', translateX: '-50%', translateY: '-50%',
          border: '1px solid hsl(170 60% 40% / 0.12)',
        }}
        animate={{ scale: [0.8, 1.5], opacity: [0.4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          left: '25%', top: '65%', translateX: '-50%', translateY: '-50%',
          border: '1px solid hsl(20 35% 65% / 0.15)',
        }}
        animate={{ scale: [0.7, 1.4], opacity: [0.35, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeOut', delay: 3 }}
      />
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full"
        style={{
          left: '80%', top: '75%', translateX: '-50%', translateY: '-50%',
          border: '1px solid hsl(30 40% 55% / 0.12)',
        }}
        animate={{ scale: [0.9, 1.6], opacity: [0.3, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeOut', delay: 1.5 }}
      />

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundSize: '128px 128px' }} />
    </div>
  );
}
