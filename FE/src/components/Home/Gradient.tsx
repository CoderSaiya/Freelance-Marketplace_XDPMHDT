const Gradient = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
      <div className="absolute inset-0">
        {/* Base gradient layer */}
        <div 
          className="absolute inset-0 opacity-80 transition-all duration-1000 ease-in-out"
          style={{
            background: 'linear-gradient(125deg, #FF0080, #7928CA, #FF0080)',
            backgroundSize: '200% 200%',
            animation: 'moveBackground 12s infinite cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />

        {/* Flowing layers with distinct colors */}
        {[
          { colors: ['#FF0080', '#7928CA', '#00DFD8'], delay: 0 },
          { colors: ['#7928CA', '#00DFD8', '#FF0080'], delay: -4 },
          { colors: ['#00DFD8', '#FF0080', '#7928CA'], delay: -8 }
        ].map((layer, i) => (
          <div
            key={i}
            className="absolute inset-0 opacity-60 mix-blend-soft-light transition-all duration-1000 ease-in-out"
            style={{
              background: `radial-gradient(circle at center, 
                ${layer.colors[0]}dd,
                ${layer.colors[1]}aa,
                ${layer.colors[2]}88
              )`,
              filter: 'blur(60px)',
              transform: `scale(${1.2 + i * 0.1})`,
              animation: `flow ${15 + i * 3}s infinite cubic-bezier(0.4, 0, 0.2, 1)`,
              animationDelay: `${layer.delay}s`,
            }}
          />
        ))}

        {/* Dynamic color waves */}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background: 'linear-gradient(45deg, #FF0080, #7928CA, #00DFD8)',
            backgroundSize: '400% 400%',
            animation: 'shimmer 8s infinite ease-in-out',
            filter: 'blur(30px)',
          }}
        />

        {/* Texture overlay for depth */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            mixBlendMode: 'overlay',
          }}
        />

        {/* Subtle white gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10" />
      </div>

      {/* Content */}
      {/* <div className="relative z-10 p-8">
        <h1 className="text-6xl font-bold text-white">
          Financial infrastructure<br />
          to grow your revenue
        </h1>
      </div> */}

      <style jsx>{`
        @keyframes moveBackground {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes flow {
          0%, 100% {
            transform: translate(0, 0) scale(1.2) rotate(0deg);
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          25% {
            transform: translate(5%, 5%) scale(1.3) rotate(5deg);
            border-radius: 40% 60% 70% 30% / 30% 60% 40% 70%;
          }
          50% {
            transform: translate(-5%, 5%) scale(1.25) rotate(-5deg);
            border-radius: 30% 60% 40% 70% / 50% 60% 30% 60%;
          }
          75% {
            transform: translate(-5%, -5%) scale(1.2) rotate(-8deg);
            border-radius: 60% 40% 70% 30% / 40% 50% 60% 50%;
          }
        }

        @keyframes shimmer {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default Gradient;