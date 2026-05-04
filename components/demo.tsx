export function Demo() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-neutral-950" id="demo" aria-labelledby="demo-heading">
      <div className="max-w-5xl mx-auto text-center">
        <h2 id="demo-heading" className="text-4xl sm:text-5xl font-bold text-white mb-4 text-balance">
          See it in action
        </h2>
        <p className="text-lg text-neutral-400 mb-12 max-w-2xl mx-auto">
          55 seconds. Zero config. From PR open to one-click fix.
        </p>
        <div className="relative">
          <video
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="auto"
            className="w-full rounded-xl border border-neutral-800 shadow-2xl"
            aria-label="Mieru-bot full demo: opening a pull request, automatic review, inline suggestions, applying a fix, and chatting with the bot"
          >
            <source src="https://v0-mieru-bot.vercel.app/mieru-demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div
            className="absolute inset-x-0 -bottom-12 mx-auto h-48 max-w-3xl bg-red-500/5 blur-3xl pointer-events-none -z-10"
            aria-hidden="true"
          />
        </div>
        <p className="mt-12 text-sm text-neutral-500 max-w-2xl mx-auto">
          Includes: auto-review, walkthrough comment, inline suggestions with one-click apply, screen-reader announcement, and @mieru-bot chat reply.
        </p>
      </div>
    </section>
  )
}
