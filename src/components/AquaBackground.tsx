import { motion } from 'framer-motion';

const blobs = [
  { color: 'var(--teal)', x: '10%', y: '20%', size: 320, duration: 18, delay: 0 },
  { color: 'var(--sea-blue)', x: '70%', y: '60%', size: 280, duration: 22, delay: 2 },
  { color: 'var(--teal-light)', x: '80%', y: '15%', size: 200, duration: 16, delay: 4 },
  { color: 'var(--gold)', x: '25%', y: '75%', size: 180, duration: 20, delay: 1 },
  { color: 'var(--sea-blue)', x: '50%', y: '40%', size: 260, duration: 24, delay: 3 },
  { color: 'var(--teal)', x: '15%', y: '50%', size: 150, duration: 15, delay: 5 },
];

export default function AquaBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-background" />

      {/* Animated blobs */}
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: blob.size,
            height: blob.size,
            left: blob.x,
            top: blob.y,
            background: `radial-gradient(circle, hsl(${blob.color} / 0.25) 0%, hsl(${blob.color} / 0.08) 50%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, 30, -20, 15, -30, 0],
            y: [0, -25, 20, -15, 25, 0],
            scale: [1, 1.15, 0.9, 1.1, 0.95, 1],
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: blob.delay,
          }}
        />
      ))}

      {/* Water caustics overlay */}
      <div className="absolute inset-0 aqua-caustics opacity-[0.04]" />

      {/* Ripple rings */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full border border-teal/10"
        style={{ left: '60%', top: '30%', translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: [0.8, 1.4], opacity: [0.3, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full border border-sea-blue/10"
        style={{ left: '25%', top: '65%', translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: [0.8, 1.5], opacity: [0.25, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeOut', delay: 3 }}
      />

      {/* Noise texture for depth */}
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundSize: '128px 128px' }} />
    </div>
  );
}
