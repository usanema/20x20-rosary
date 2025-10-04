export type DeviceType = "ios" | "android" | "other";

export function detectDevice(): DeviceType {
  if (typeof window === "undefined") {
    return "other";
  }

  const userAgent = window.navigator.userAgent.toLowerCase();

  // Detect iOS devices
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return "ios";
  }

  // Detect Android devices
  if (/android/.test(userAgent)) {
    return "android";
  }

  // Detect macOS
  if (/macintosh|mac os x/.test(userAgent)) {
    return "ios";
  }

  return "other";
}
