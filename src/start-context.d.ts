import "@tanstack/react-start";

declare module "@tanstack/react-start" {
  interface Register {
    server: {
      requestContext: {
        nonce: string;
        csrfToken: string;
      };
    };
  }
}
