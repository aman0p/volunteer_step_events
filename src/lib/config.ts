const config = {
  env: {
    apiEndpoint: (() => {
      // In production (Vercel), use the production endpoint
      if (process.env.NODE_ENV === 'production') {
        return process.env.NEXT_PUBLIC_PROD_API_ENDPOINT || 'https://volunteer-step-events-eta.vercel.app';
      }
      // In development, use local endpoint
      return process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:3000';
    })(),
    prodApiEndpoint: process.env.NEXT_PUBLIC_PROD_API_ENDPOINT!,
    imagekit: {
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    },
    databaseUrl: process.env.DATABASE_URL!,
    upstash: {
      redisUrl: process.env.UPSTASH_REDIS_URL!,
      redisToken: process.env.UPSTASH_REDIS_TOKEN!,
      qstashUrl: process.env.QSTASH_URL!,
      qstashToken: process.env.QSTASH_TOKEN!,
    },
    resendToken: process.env.RESEND_TOKEN!,
    professionalEmail: process.env.PROFESSIONAL_EMAIL!,
  },
};

export default config;
