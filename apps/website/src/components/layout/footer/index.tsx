import { AnimatedLink } from "@/components/terminal/animated-link";

export const Footer = () => {
  return (
    <footer className="text-center text-sm text-white flex flex-col-reverse sm:flex-row uppercase py-8 px-4 font-mono gap-4 justify-between w-full">
      <div className="flex-1 flex justify-center sm:justify-start">
        <span className="flex items-center gap-2 z-100">
          <span>© 2025</span>
          <AnimatedLink
            href="https://basement.studio"
            target="_blank"
            rel="noopener noreferrer"
          >
            BASEMENT.STUDIO
          </AnimatedLink>
        </span>
      </div>
      <div className="flex-1 flex gap-4 justify-center sm:justify-end">
        <AnimatedLink
          href="https://npmjs.com/package/xmcp"
          target="_blank"
          rel="noopener noreferrer"
        >
          NPM
        </AnimatedLink>
        <AnimatedLink
          href="https://github.com/basementstudio/xmcp"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </AnimatedLink>
        <AnimatedLink
          href="https://x.com/xmcp_dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          X
        </AnimatedLink>
        <AnimatedLink
          href="https://discord.gg/FPRuDAhPX9"
          target="_blank"
          rel="noopener noreferrer"
        >
          Discord
        </AnimatedLink>
      </div>
    </footer>
  );
};
