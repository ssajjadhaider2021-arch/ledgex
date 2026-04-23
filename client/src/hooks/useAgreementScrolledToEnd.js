import { useCallback, useRef, useState } from "react";

export function useAgreementScrolledToEnd(thresholdPx = 6) {
  const ref = useRef(null);
  const [reachedEnd, setReachedEnd] = useState(false);

  const onScroll = useCallback(() => {
    if (reachedEnd) return;
    const el = ref.current;
    if (!el) return;
    const { scrollTop, clientHeight, scrollHeight } = el;
    if (scrollTop + clientHeight >= scrollHeight - thresholdPx) {
      setReachedEnd(true);
    }
  }, [reachedEnd, thresholdPx]);

  return { scrollRef: ref, reachedEnd, onScroll };
}
