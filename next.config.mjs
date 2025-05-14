import nextPwa from 'next-pwa'

let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = nextPwa({
  dest: "public", // Αποθηκεύει το Service Worker στο public
  disable: process.env.NODE_ENV === "development", // Απενεργοποιεί το PWA στη development mode
  register: true, // Καταγράφει αυτόματα το Service Worker
  skipWaiting: true, // Εφαρμόζει άμεσα τις νέες εκδόσεις
})({
  output: "export", // 🔹 Static export (δημιουργεί 'out' folder)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
})

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig
