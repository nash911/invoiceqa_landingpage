/**
 * Dynamically load Microsoft Clarity on the client.
 * Safe to call multiple times; it won't inject duplicate scripts.
 */
export function loadClarity(projectId: string): void {
  if (typeof window === "undefined") return; // SSR guard
  if (!projectId) return;

  const existing = document.getElementById("clarity-script");
  if (existing) return;

  const script = document.createElement("script");
  script.id = "clarity-script";
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${projectId}`;
  document.head.appendChild(script);
}

export function trackEvent(
  event: string,
  payload?: Record<string, unknown>
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent("analytics", {
      detail: {
        event,
        ...(payload ? { payload } : {}),
      },
    })
  );
}

export function trackDemoOpen(): void {
  trackEvent("demo_open");
}
