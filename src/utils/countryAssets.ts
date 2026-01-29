type CountryAsset = { banner: string; character: string };

/* =========================
   배너 (img-banner_XX.svg)
========================= */
import BannerKR from "../assets/img-banner_KR.svg";
import BannerUS from "../assets/img-banner_US.svg";
import BannerCN from "../assets/img-banner_CN.svg";
import BannerIT from "../assets/img-banner_IT.svg";
import BannerEG from "../assets/img-banner_EG.svg";

import BannerUK from "../assets/img-banner_UK.svg";
import BannerFR from "../assets/img-banner_FR.svg";
import BannerDE from "../assets/img-banner_DE.svg";
import BannerES from "../assets/img-banner_ES.svg";
import BannerPT from "../assets/img-banner_PT.svg";
import BannerGR from "../assets/img-banner_GR.svg";
import BannerRU from "../assets/img-banner_RU.svg";
import BannerPL from "../assets/img-banner_PL.svg";
import BannerCZ from "../assets/img-banner_CZ.svg";
import BannerSK from "../assets/img-banner_SK.svg";
import BannerRO from "../assets/img-banner_RO.svg";
import BannerBG from "../assets/img-banner_BG.svg";
import BannerJP from "../assets/img-banner_JP.svg";
import BannerMN from "../assets/img-banner_MN.svg";
import BannerVN from "../assets/img-banner_VN.svg";
import BannerTH from "../assets/img-banner_TH.svg";
import BannerID from "../assets/img-banner_ID.svg";
import BannerMY from "../assets/img-banner_MY.svg";
import BannerIN from "../assets/img-banner_IN.svg";
import BannerIR from "../assets/img-banner_IR.svg";
import BannerTR from "../assets/img-banner_TR.svg";
import BannerIL from "../assets/img-banner_IL.svg";
import BannerSA from "../assets/img-banner_SA.svg";
import BannerKZ from "../assets/img-banner_KZ.svg";
import BannerUZ from "../assets/img-banner_UZ.svg";

/* =========================
   캐릭터 (img-profile1-XX.svg)
========================= */
import CharKR from "../assets/img-profile1-KR.svg";
import CharUS from "../assets/img-profile1-US.svg";
import CharCN from "../assets/img-profile1-CN.svg";
import CharIT from "../assets/img-profile1-IT.svg";
import CharEG from "../assets/img-profile1-EG.svg";

import CharUK from "../assets/img-profile1-UK.svg";
import CharFR from "../assets/img-profile1-FR.svg";
import CharDE from "../assets/img-profile1-DE.svg";
import CharES from "../assets/img-profile1-ES.svg";
import CharPT from "../assets/img-profile1-PT.svg";
import CharGR from "../assets/img-profile1-GR.svg";
import CharRU from "../assets/img-profile1-RU.svg";
import CharPL from "../assets/img-profile1-PL.svg";
import CharCZ from "../assets/img-profile1-CZ.svg";
import CharSK from "../assets/img-profile1-SK.svg";
import CharRO from "../assets/img-profile1-RO.svg";
import CharBG from "../assets/img-profile1-BG.svg";
import CharJP from "../assets/img-profile1-JP.svg";
import CharMN from "../assets/img-profile1-MN.svg";
import CharVN from "../assets/img-profile1-VN.svg";
import CharTH from "../assets/img-profile1-TH.svg";
import CharID from "../assets/img-profile1-ID.svg";
import CharMY from "../assets/img-profile1-MY.svg";
import CharIN from "../assets/img-profile1-IN.svg";
import CharIR from "../assets/img-profile1-IR.svg";
import CharTR from "../assets/img-profile1-TR.svg";
import CharIL from "../assets/img-profile1-IL.svg";
import CharSA from "../assets/img-profile1-SA.svg";
import CharKZ from "../assets/img-profile1-KZ.svg";
import CharUZ from "../assets/img-profile1-UZ.svg";

/* =========================
   매핑 테이블
========================= */
export const COUNTRY_ASSETS: Record<string, CountryAsset> = {
  // 기존 5개
  KR: { banner: BannerKR, character: CharKR },
  US: { banner: BannerUS, character: CharUS },
  CN: { banner: BannerCN, character: CharCN },
  IT: { banner: BannerIT, character: CharIT },
  EG: { banner: BannerEG, character: CharEG },

  // 추가 국가들
  UK: { banner: BannerUK, character: CharUK },
  FR: { banner: BannerFR, character: CharFR },
  DE: { banner: BannerDE, character: CharDE },
  ES: { banner: BannerES, character: CharES },
  PT: { banner: BannerPT, character: CharPT },
  GR: { banner: BannerGR, character: CharGR },
  RU: { banner: BannerRU, character: CharRU },

  PL: { banner: BannerPL, character: CharPL },
  CZ: { banner: BannerCZ, character: CharCZ },
  SK: { banner: BannerSK, character: CharSK },
  RO: { banner: BannerRO, character: CharRO },
  BG: { banner: BannerBG, character: CharBG },

  JP: { banner: BannerJP, character: CharJP },
  MN: { banner: BannerMN, character: CharMN },
  VN: { banner: BannerVN, character: CharVN },
  TH: { banner: BannerTH, character: CharTH },
  ID: { banner: BannerID, character: CharID },
  MY: { banner: BannerMY, character: CharMY },
  IN: { banner: BannerIN, character: CharIN },
  IR: { banner: BannerIR, character: CharIR },
  TR: { banner: BannerTR, character: CharTR },
  IL: { banner: BannerIL, character: CharIL },
  SA: { banner: BannerSA, character: CharSA },
  KZ: { banner: BannerKZ, character: CharKZ },
  UZ: { banner: BannerUZ, character: CharUZ },
};
