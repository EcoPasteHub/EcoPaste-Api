import { Hono } from "hono";
import { cors } from "hono/cors";
import { Release } from "./types";
import { EXTNAME, PLATFORM } from "./constants";

const app = new Hono();

app.use("/*", cors());

const getProxyURL = (url: string) => {
  return `https://gh-proxy.com/${url}`;
};

const getReleases = async (latest = false) => {
  let url = "https://api.github.com/repos/EcoPasteHub/EcoPaste/releases";

  if (latest) {
    url += "/latest";
  }

  const response = await fetch(url, {
    headers: {
      "User-Agent": "EcoPaste",
    },
  });

  const result = await response.json<Release | Release[]>();

  const releases = Array.isArray(result) ? result : [result];

  for (const release of releases) {
    release.assets = release.assets.filter((asset) => {
      asset.browser_download_url = getProxyURL(asset.browser_download_url);

      return Object.values(EXTNAME).some((extname) => {
        return asset.name.endsWith(extname);
      });
    });
  }

  return releases;
};

// 获取全部版本列表
app.get("/", async (c) => {
  const releases = await getReleases();

  return c.json(releases);
});

// 获取最新版本的更新文件
app.get("/update", async (c) => {
  const releases = await getReleases();

  const joinBeta = c.req.header("join-beta");

  let version = releases[0].name;

  if (joinBeta === "false") {
    version = releases.find(({ name }) => !name.includes("-"))!.name;
  }

  const url = getProxyURL(
    `https://github.com/EcoPasteHub/EcoPaste/releases/download/${version}/latest.json`
  );

  return c.redirect(url);
});

// 获取最新稳定版的信息
app.get("/latest", async (c) => {
  const releases = await getReleases(true);

  return c.json(releases[0]);
});

// 获取指定版本的指定平台的下载链接
app.get("/download", async (c) => {
  const version = c.req.query("version");
  const platform = c.req.query("platform");

  const releases = await getReleases(!version);

  let release: Release | undefined = releases[0];

  if (version) {
    release = releases.find((release) => {
      return release.name.endsWith(version);
    });
  }

  if (!release) {
    const versions = releases.map((release) => release.name);

    return c.text(`请传入正确的 version 参数：${versions.join("、")}`);
  }

  const platforms = Object.values(PLATFORM);

  if (typeof platform !== "string" || !platforms.includes(platform)) {
    return c.text(`请传入正确的 platform 参数：${platforms.join("、")}`);
  }

  const downloadUrl = release.assets.find(({ name }) =>
    name.endsWith(EXTNAME[platform])
  )!.browser_download_url;

  return c.redirect(downloadUrl);
});

// 获取所有稳定版列表
app.get("/stable", async (c) => {
  let releases = await getReleases();

  releases = releases.filter((release) => {
    return !release.name.includes("-");
  });

  return c.json(releases);
});

// 获取所有测试版列表
app.get("/beta", async (c) => {
  let releases = await getReleases();

  releases = releases.filter((release) => {
    return release.name.includes("-");
  });

  return c.json(releases);
});

export default app;
