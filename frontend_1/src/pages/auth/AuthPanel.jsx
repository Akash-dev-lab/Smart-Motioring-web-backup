import { Link } from 'react-router-dom';

const GoogleMark = () => (
  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const AuthPanel = ({ children, footerHref, footerLabel, footerText, icon: Icon, onSubmit, title }) => {
  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border-[3px] shadow-[5px_5px_0_#000] sm:max-w-[30rem] sm:border-[4px] sm:shadow-[9px_9px_0_#000] font-['Geist',sans-serif]"
    >
      {/* Window dots */}
      <div className="hidden items-center justify-between border-b-[4px] border-black bg-black p-3 text-white sm:flex">
        <div className="flex gap-2">
          <span className="h-3.5 w-3.5 rounded-full bg-[#FF5F56] animate-dot" style={{ animationDelay: '0s' }} />
          <span className="h-3.5 w-3.5 rounded-full bg-[#FFBD2E] animate-dot" style={{ animationDelay: '0.25s' }} />
          <span className="h-3.5 w-3.5 rounded-full bg-[#00E676] animate-dot" style={{ animationDelay: '0.5s' }} />
        </div>
        <span className="text-[10px] font-black uppercase italic tracking-[0.18em]">Secure_Window</span>
      </div>

      <div className="bg-[#FDFBF7] p-4 sm:p-6">
        <div className="mb-5 hidden items-center gap-3 sm:flex">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border-[3px] border-black bg-[#00E676] shadow-[4px_4px_0_#000]">
            <Icon size={22} strokeWidth={3} />
          </span>
          <h2 className="text-2xl font-black uppercase italic leading-none sm:text-3xl">{title}</h2>
        </div>

        <button
          type="button"
          className="mb-4 inline-flex h-12 w-full items-center justify-center gap-3 rounded-md border-[3px] border-black bg-white px-3 text-sm font-black uppercase shadow-[3px_3px_0_#000] transition-transform hover:-translate-y-0.5 sm:h-13"
        >
          <GoogleMark />
          <span className="truncate">Continue with Google</span>
        </button>

        <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-[10px] font-black uppercase tracking-[0.16em] text-black/45">
          <span className="h-[3px] bg-black/15" />
          <span>Email</span>
          <span className="h-[3px] bg-black/15" />
        </div>

        <div className="rounded-lg border-[3px] border-black bg-white p-3 sm:p-4">{children}</div>
      </div>

      <div className="border-t-[3px] border-black bg-white p-3 text-center text-sm font-black sm:border-t-[4px] sm:p-4">
        <span className="text-black/60">{footerText}</span>{' '}
        <Link to={footerHref} className="uppercase italic text-[#1E6BFF] underline decoration-[3px] underline-offset-4">
          {footerLabel}
        </Link>
      </div>
    </form>
  );
};

export default AuthPanel;
