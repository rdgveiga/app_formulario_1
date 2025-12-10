// Manual type declarations to replace missing vite/client

declare var process: {
  env: {
    API_KEY?: string;
    VITE_GOOGLE_CLIENT_ID?: string;
    [key: string]: string | undefined;
  }
};

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly API_KEY: string;
  readonly [key: string]: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}
