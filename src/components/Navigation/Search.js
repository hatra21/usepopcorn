import { useEffect, useRef } from "react";
import { useKey } from "../../custom_hooks/useKey";

export function Search({ query, setQuery }) {
  const searchInputDOMEl = useRef(null);

  // useEffect(() => {
  //   function focusOnEnterClick(e) {
  //     if (document.activeElement === searchInputDOMEl.current) return;

  //     if (e.code === "Enter") {
  //       searchInputDOMEl.current.focus();
  //       setQuery("");
  //     }
  //   }

  //   document.addEventListener("keydown", focusOnEnterClick);
  //   return () => document.removeEventListener("keydown", focusOnEnterClick);
  // }, [setQuery]);

  useKey("Enter", () => {
    if (document.activeElement === searchInputDOMEl.current) return;
    searchInputDOMEl.current.focus();
    setQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={searchInputDOMEl}
    />
  );
}
