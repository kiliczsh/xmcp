import { AnimatedLink } from "@/components/terminal/animated-link";
import styles from "./progressive-blur.module.css";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="sticky top-0 right-0 left-0 w-full mx-auto bg-transparent z-50 flex justify-center items-center">
      <div
        className={`
          pointer-events-none
          absolute inset-0
          w-full h-full
          ${styles.progressiveBlur}
        `}
        aria-hidden="true"
      >
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="z-[6] relative max-w-[800px] w-full flex justify-center items-center px-4 py-8 text-center text-md text-white font-mono gap-8">
        <AnimatedLink href="/">Home</AnimatedLink>
        <span
          className="bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] text-[1.3em] relative -top-[0.12em]"
          style={{
            background:
              "linear-gradient(207deg, #CFCFCF 29.21%, #868686 69.52%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          xmcp
        </span>
        <AnimatedLink href="/docs">Docs</AnimatedLink>
      </div>
      <GithubButton />
    </header>
  );
};

const GithubButton = () => {
  return (
    <Link
      href="https://github.com/basementstudio/xmcp"
      className="text-white hover:text-white/80 transition-colors absolute right-4 top-1/2 -translate-y-1/2 z-100"
      target="_blank"
      aria-label="GitHub"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-5"
      >
        <path
          d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        ></path>
      </svg>
    </Link>
  );
};
