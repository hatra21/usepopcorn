import { useEffect } from "react";

export function useKey(key, action) {
  useEffect(() => {
    function callbackAction(e) {
      if (e.code.toLowerCase() === key.toLowerCase()) {
        action();
        console.log("close");
      }
    }

    document.addEventListener("keydown", callbackAction);

    return () => document.removeEventListener("keydown", callbackAction);
  }, [action, key]);
}
