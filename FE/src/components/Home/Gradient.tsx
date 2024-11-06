const Gradient = () => {
  return (
    <div className="absolute inset-0">
      {/* Primary Gradient Background */}
      <div
        className="absolute inset-0 animate-gradient-slow"
        style={{
          background: "linear-gradient(-45deg, #ff0080, #7928ca, #4b0082)",
          backgroundSize: "400% 400%",
        }}
      />

      {/* Smooth Moving Blobs */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          {/* Large Centered Blob */}
          <div
            className="absolute w-[800px] h-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "radial-gradient(circle, rgba(255,0,128,0.3) 0%, rgba(121,40,202,0.1) 50%, transparent 70%)",
              filter: "blur(40px)",
              animation: "float 20s ease-in-out infinite",
            }}
          />

          {/* Smaller Floating Blobs */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                width: `${400 - i * 50}px`,
                height: `${400 - i * 50}px`,
                top: `${30 + i * 20}%`,
                left: `${20 + i * 25}%`,
                background: `radial-gradient(circle, ${
                  i === 0
                    ? "rgba(255,0,128,0.2)"
                    : i === 1
                    ? "rgba(121,40,202,0.2)"
                    : "rgba(75,0,130,0.2)"
                } 0%, transparent 70%)`,
                filter: "blur(40px)",
                animation: `float-${i + 1} ${15 + i * 2}s ease-in-out infinite`,
                animationDelay: `${i * -3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Subtle Overlay for Depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom right, transparent, rgba(0,0,0,0.1))",
          mixBlendMode: "multiply",
        }}
      />

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        @keyframes float-1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(5%, 5%) scale(1.1);
          }
        }

        @keyframes float-2 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-5%, 10%) scale(1.1);
          }
        }

        @keyframes float-3 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(10%, -5%) scale(1.1);
          }
        }

        .animate-gradient-slow {
          animation: gradient 15s ease infinite;
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default Gradient;
