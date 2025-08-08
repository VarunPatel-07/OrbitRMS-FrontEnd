/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_BACKEND_API_BASEURL: string;
  readonly VITE_GOOGLE_SAFE_BROWSING_CHECKER_API_KEY: string;
  readonly VITE_ENCRYPTION_KEY: string;
  readonly VITE_ENVIRONMENT: string;
  // add other env vars here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}
// vite-env.d.ts
declare module '*?worker' {
  const WorkerConstructor: {
    new (): Worker;
  };
  export default WorkerConstructor;
}
