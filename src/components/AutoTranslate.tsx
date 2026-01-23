import { ReactNode, useEffect, useState, useMemo } from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface AutoTranslateProps {
  children: ReactNode;
  skipTranslation?: boolean; // 번역을 건너뛸 요소 (예: 코드, 이메일 등)
}

/**
 * 자동 번역 컴포넌트
 * children의 모든 텍스트를 현재 언어에 맞게 자동으로 번역합니다.
 */
export const AutoTranslate = ({ children, skipTranslation = false }: AutoTranslateProps) => {
  const { language, translateDynamic } = useLanguage();
  const [translatedChildren, setTranslatedChildren] = useState<ReactNode>(children);

  useEffect(() => {
    if (skipTranslation || language === "ko") {
      setTranslatedChildren(children);
      return;
    }

    const translateNode = async (node: any): Promise<any> => {
      if (typeof node === "string") {
        // 문자열인 경우 번역
        if (node.trim()) {
          try {
            return await translateDynamic(node);
          } catch (error) {
            console.error("자동 번역 실패:", error);
            return node;
          }
        }
        return node;
      }

      if (typeof node === "number") {
        return node;
      }

      if (!node || typeof node !== "object") {
        return node;
      }

      // React 요소인 경우
      if (node.type) {
        // props를 처리
        const newProps: any = { ...node.props };

        // children이 있으면 재귀적으로 번역
        if (node.props.children) {
          if (Array.isArray(node.props.children)) {
            newProps.children = await Promise.all(
              node.props.children.map((child: any) => translateNode(child))
            );
          } else {
            newProps.children = await translateNode(node.props.children);
          }
        }

        // placeholder, alt, title 등의 텍스트 속성도 번역
        if (newProps.placeholder && typeof newProps.placeholder === "string") {
          try {
            newProps.placeholder = await translateDynamic(newProps.placeholder);
          } catch (error) {
            console.error("placeholder 번역 실패:", error);
          }
        }

        if (newProps.alt && typeof newProps.alt === "string") {
          try {
            newProps.alt = await translateDynamic(newProps.alt);
          } catch (error) {
            console.error("alt 번역 실패:", error);
          }
        }

        if (newProps.title && typeof newProps.title === "string") {
          try {
            newProps.title = await translateDynamic(newProps.title);
          } catch (error) {
            console.error("title 번역 실패:", error);
          }
        }

        return {
          ...node,
          props: newProps,
        };
      }

      // 배열인 경우
      if (Array.isArray(node)) {
        return Promise.all(node.map((item) => translateNode(item)));
      }

      return node;
    };

    translateNode(children).then(setTranslatedChildren);
  }, [children, language, translateDynamic, skipTranslation]);

  return <>{translatedChildren}</>;
};

/**
 * 간단한 텍스트 자동 번역 훅
 */
export const useAutoTranslate = (text: string): string => {
  const { language, translateDynamic } = useLanguage();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    if (language === "ko" || !text || !text.trim()) {
      setTranslated(text);
      return;
    }

    translateDynamic(text)
      .then(setTranslated)
      .catch((error) => {
        console.error("자동 번역 실패:", error);
        setTranslated(text);
      });
  }, [text, language, translateDynamic]);

  return translated;
};
