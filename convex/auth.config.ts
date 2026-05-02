// Convex auth provider configuration for Clerk-issued tokens.
export default {
  providers: [
    {
      domain: process.env.CLERK_ISSUER_URL,
      applicationID: "convex",
    },
  ]
};
