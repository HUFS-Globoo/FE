// src/utils/profileImage.ts
import { COUNTRY_ASSETS } from "./countryAssets";

const API_BASE = import.meta.env.VITE_API_BASE_URL as string;
const ORIGIN = API_BASE.replace(/\/api\/?$/, "").replace(/\/$/, "");

const normalizeSlashes = (url: string) => url.replace(/([^:]\/)\/+/g, "$1");

export const getProfileSrc = (
  profileImageUrl: string | null | undefined,
  country: string | null | undefined
) => {
  // 1) 서버 이미지가 있으면 그걸 우선 사용
  if (profileImageUrl) {
    if (/^https?:\/\//i.test(profileImageUrl)) return normalizeSlashes(profileImageUrl);

    const path = profileImageUrl.startsWith("/") ? profileImageUrl : `/${profileImageUrl}`;
    return normalizeSlashes(`${ORIGIN}${path}`);
  }

  // 2) 서버 이미지가 없으면 국가별 기본 캐릭터
  const code = (country ?? "KR").toString().trim().toUpperCase();
  return COUNTRY_ASSETS[code]?.character ?? COUNTRY_ASSETS.KR.character;
};
