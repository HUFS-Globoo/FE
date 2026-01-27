import AmericaProfileImg from "../assets/img-profile1-America.svg";
import KoreaProfileImg from "../assets/img-profile1-Korea.svg";
import ItalyProfileImg from "../assets/img-profile1-Italy.svg";
import EgyptProfileImg from "../assets/img-profile1-Egypt.svg";
import ChinaProfileImg from "../assets/img-profile1-China.svg";

const API_BASE = import.meta.env.VITE_API_BASE_URL as string;
const ORIGIN = API_BASE.replace(/\/api\/?$/, "").replace(/\/$/, "");

const COUNTRY_FALLBACK: Record<string, string> = {
  US: AmericaProfileImg,
  KR: KoreaProfileImg,
  IT: ItalyProfileImg,
  EG: EgyptProfileImg,
  CN: ChinaProfileImg,
};

const normalizeSlashes = (url: string) => url.replace(/([^:]\/)\/+/g, "$1");

export const getProfileSrc = (
  profileImageUrl: string | null | undefined,
  country: string | null | undefined
) => {
  if (profileImageUrl) {
    if (/^https?:\/\//i.test(profileImageUrl)) return normalizeSlashes(profileImageUrl);
    const path = profileImageUrl.startsWith("/") ? profileImageUrl : `/${profileImageUrl}`;
    return normalizeSlashes(`${ORIGIN}${path}`);
  }
  return COUNTRY_FALLBACK[country ?? ""] ?? KoreaProfileImg;
};
