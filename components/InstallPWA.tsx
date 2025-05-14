"use client";

import { useEffect, useState } from "react";

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const installApp = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      setDeferredPrompt(null);
      setShowInstall(false);
    });
  };

  if (!showInstall) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#82f01f",
        padding: "10px 20px",
        borderRadius: "10px",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "bold",
      }}
      onClick={installApp}
    >
      📲 Install Speedtest by AcronWeb
    </div>
  );
};

export default InstallPWA;
