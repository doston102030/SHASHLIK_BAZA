import { createContext, useContext, useEffect, useRef } from "react";
import { usePersistedState } from "../utils/usePersistedState";
import { transliterate } from "../utils/transliterate";

const LanguageContext = createContext();

const SKIP_TAGS = new Set(["SCRIPT", "STYLE"]);

// Har bir matn tugunining "lotin manba"si va oxirgi yozilgan "kirill natija"si
// shu ikki xaritada saqlanadi — shu tufayli React keyinroq yangi matn qo'shsa yoki
// mavjud matnni o'zgartirsa ham, avtomatik ravishda to'g'ri o'giriladi.
const originalMap = new WeakMap();
const outputMap = new WeakMap();

function isTextNodeEligible(node) {
  const parent = node.parentNode;
  if (!parent || SKIP_TAGS.has(parent.tagName)) return false;
  return !!(node.nodeValue && node.nodeValue.trim());
}

function syncTextNode(node, script) {
  if (!isTextNodeEligible(node)) return;
  const currentValue = node.nodeValue;
  const lastOutput = outputMap.get(node);
  const isOwnOutput = lastOutput !== undefined && currentValue === lastOutput;

  if (isOwnOutput) {
    if (script === "kirill") return;
    const orig = originalMap.get(node);
    if (orig !== undefined) node.nodeValue = orig;
    outputMap.delete(node);
    return;
  }

  originalMap.set(node, currentValue);
  if (script === "kirill") {
    const converted = transliterate(currentValue);
    if (converted !== currentValue) {
      node.nodeValue = converted;
      outputMap.set(node, converted);
    }
  }
}

function walkAndSync(root, script) {
  if (root.nodeType === Node.TEXT_NODE) {
    syncTextNode(root, script);
    return;
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) syncTextNode(node, script);
}

export function LanguageProvider({ children }) {
  const [script, setScript] = usePersistedState("script", "lotin");
  const scriptRef = useRef(script);
  scriptRef.current = script;
  const observerRef = useRef(null);

  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;

    const observer = new MutationObserver((mutations) => {
      observerRef.current?.disconnect();
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          syncTextNode(mutation.target, scriptRef.current);
        } else if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => walkAndSync(node, scriptRef.current));
        }
      }
      observerRef.current?.observe(root, { childList: true, subtree: true, characterData: true });
    });
    observerRef.current = observer;
    observer.observe(root, { childList: true, subtree: true, characterData: true });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    observerRef.current?.disconnect();
    walkAndSync(root, script);
    observerRef.current?.observe(root, { childList: true, subtree: true, characterData: true });
  }, [script]);

  const toggleScript = () => setScript((s) => (s === "lotin" ? "kirill" : "lotin"));

  return (
    <LanguageContext.Provider value={{ script, setScript, toggleScript }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage LanguageProvider ichida ishlatilishi kerak");
  }
  return context;
}
