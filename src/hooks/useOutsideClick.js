import { useEffect, useRef } from "react";

function useOutsideClick(handler, listenCapturing = true) {
  const ref = useRef();

  useEffect(() => {
    function callback(e) {
      if (e.target.textContent === "Confirm") return;
      if (e.target.textContent === "Create cabin") return;
      if (ref.current && !ref.current.contains(e.target)) handler();
    }

    document.addEventListener("click", callback, listenCapturing);

    return () =>
      document.removeEventListener("click", callback, listenCapturing);
  }, [handler, listenCapturing]);

  return ref;
}

export default useOutsideClick;
