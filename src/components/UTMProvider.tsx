"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { UTMParams } from "@/types/lead";

const UTMContext = createContext<UTMParams>({});

export function useUTM() {
  return useContext(UTMContext);
}

export function UTMProvider({ children }: { children: React.ReactNode }) {
  const [utmParams, setUtmParams] = useState<UTMParams>({});

  useEffect(() => {
    // Parse UTM params from URL
    const params = new URLSearchParams(window.location.search);
    const utm: UTMParams = {
      utm_source: params.get("utm_source") || undefined,
      utm_medium: params.get("utm_medium") || undefined,
      utm_campaign: params.get("utm_campaign") || undefined,
      utm_term: params.get("utm_term") || undefined,
      utm_content: params.get("utm_content") || undefined,
    };

    // Store in sessionStorage
    if (Object.values(utm).some((v) => v !== undefined)) {
      sessionStorage.setItem("utm_params", JSON.stringify(utm));
      setUtmParams(utm);
    } else {
      // Try to retrieve from sessionStorage
      const stored = sessionStorage.getItem("utm_params");
      if (stored) {
        setUtmParams(JSON.parse(stored));
      }
    }
  }, []);

  return <UTMContext.Provider value={utmParams}>{children}</UTMContext.Provider>;
}

