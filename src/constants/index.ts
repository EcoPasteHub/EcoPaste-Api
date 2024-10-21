export const PROXY_URL = "https://gh-proxy.com";

export const PLATFORM = {
  WINDOWS_X86: "windows-x86",
  WINDOWS_X64: "windows-x64",
  WINDOWS_ARM: "windows-arm",
  MACOS_ARM: "macos-arm",
  MACOS_X64: "macos-x64",
  LINUX_APPIMAGE: "linux-appimage",
  LINUX_DEB: "linux-deb",
  LINUX_RPM: "linux-rpm",
};

export const EXTNAME = {
  [PLATFORM.WINDOWS_X86]: "x86-setup.exe",
  [PLATFORM.WINDOWS_X64]: "x64-setup.exe",
  [PLATFORM.WINDOWS_ARM]: "arm64-setup.exe",
  [PLATFORM.MACOS_ARM]: "aarch64.dmg",
  [PLATFORM.MACOS_X64]: "x64.dmg",
  [PLATFORM.LINUX_APPIMAGE]: ".AppImage",
  [PLATFORM.LINUX_DEB]: ".deb",
  [PLATFORM.LINUX_RPM]: ".rpm",
};
