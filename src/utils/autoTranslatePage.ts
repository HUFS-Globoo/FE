import { translateText } from "../api/translateAPI";

/**
 * 페이지의 모든 텍스트 노드를 찾아서 자동으로 번역하는 유틸리티
 * DOM 기반으로 작동하므로 React 컴포넌트 외부에서도 사용 가능
 */
/**
 * 페이지의 모든 텍스트 노드를 찾아서 자동으로 번역하는 유틸리티
 * 주의: DOM 직접 조작은 React와 충돌하고 레이아웃을 깨뜨릴 수 있으므로
 * 가능한 한 React 컴포넌트 레벨에서 번역 키를 사용하는 것을 권장합니다.
 * 
 * 이 함수는 레이아웃에 영향을 주지 않도록 더 보수적으로 작동합니다.
 */
export const translatePageText = async (targetLang: "한국어" | "영어" = "영어") => {
  // React로 관리되는 요소는 건드리지 않도록 더 보수적인 선택자 사용
  // 주로 placeholder나 title 같은 속성만 번역
  const attributeSelectors = [
    "input[placeholder]",
    "textarea[placeholder]",
    "[title]",
    "[aria-label]"
  ];

  const elements: HTMLElement[] = [];
  attributeSelectors.forEach(selector => {
    const found = document.querySelectorAll(selector);
    found.forEach(el => {
      if (el instanceof HTMLElement) {
        elements.push(el);
      }
    });
  });

  // 중복 제거
  const uniqueElements = Array.from(new Set(elements));
  
  // 배치로 번역 (너무 많은 요청 방지)
  const batchSize = 5;
  for (let i = 0; i < uniqueElements.length; i += batchSize) {
    const batch = uniqueElements.slice(i, i + batchSize);
    
    await Promise.all(
      batch.map(async (el) => {
        // placeholder 번역
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
          const placeholder = el.placeholder?.trim();
          if (placeholder && !el.dataset.translatedPlaceholder) {
            try {
              const response = await translateText({
                text: placeholder,
                targetLang: targetLang,
              });

              if (response.translatedText && response.translatedText !== placeholder) {
                el.dataset.originalPlaceholder = placeholder;
                el.placeholder = response.translatedText;
                el.dataset.translatedPlaceholder = "true";
              }
            } catch (error) {
              console.error(`placeholder 번역 실패 (${placeholder}):`, error);
            }
          }
        }

        // title 속성 번역
        const title = el.getAttribute("title");
        if (title && !el.dataset.translatedTitle) {
          try {
            const response = await translateText({
              text: title,
              targetLang: targetLang,
            });

            if (response.translatedText && response.translatedText !== title) {
              el.dataset.originalTitle = title;
              el.setAttribute("title", response.translatedText);
              el.dataset.translatedTitle = "true";
            }
          } catch (error) {
            console.error(`title 번역 실패 (${title}):`, error);
          }
        }

        // aria-label 속성 번역
        const ariaLabel = el.getAttribute("aria-label");
        if (ariaLabel && !el.dataset.translatedAriaLabel) {
          try {
            const response = await translateText({
              text: ariaLabel,
              targetLang: targetLang,
            });

            if (response.translatedText && response.translatedText !== ariaLabel) {
              el.dataset.originalAriaLabel = ariaLabel;
              el.setAttribute("aria-label", response.translatedText);
              el.dataset.translatedAriaLabel = "true";
            }
          } catch (error) {
            console.error(`aria-label 번역 실패 (${ariaLabel}):`, error);
          }
        }
      })
    );

    // 배치 간 약간의 지연 (API 부하 방지)
    if (i + batchSize < uniqueElements.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
};

/**
 * 번역을 되돌리는 함수
 */
export const revertPageTranslation = () => {
  // placeholder 복원
  const translatedPlaceholders = document.querySelectorAll("[data-translated-placeholder='true']");
  translatedPlaceholders.forEach(el => {
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      const original = el.dataset.originalPlaceholder;
      if (original) {
        el.placeholder = original;
        el.removeAttribute("data-translated-placeholder");
        el.removeAttribute("data-original-placeholder");
      }
    }
  });

  // title 복원
  const translatedTitles = document.querySelectorAll("[data-translated-title='true']");
  translatedTitles.forEach(el => {
    const original = el.getAttribute("data-original-title");
    if (original && el instanceof HTMLElement) {
      el.setAttribute("title", original);
      el.removeAttribute("data-translated-title");
      el.removeAttribute("data-original-title");
    }
  });

  // aria-label 복원
  const translatedAriaLabels = document.querySelectorAll("[data-translated-aria-label='true']");
  translatedAriaLabels.forEach(el => {
    const original = el.getAttribute("data-original-aria-label");
    if (original && el instanceof HTMLElement) {
      el.setAttribute("aria-label", original);
      el.removeAttribute("data-translated-aria-label");
      el.removeAttribute("data-original-aria-label");
    }
  });
};
