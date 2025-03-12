import { useSearchParams } from "react-router-dom";

function useUrl(urlField) {
  const [searchParams, setSearchParams] = useSearchParams();

  function readUrl(e) {
    searchParams.set(urlField, e.target.value);
  }

  function pasteUrl() {
    setSearchParams(searchParams);
  }

  return { readUrl, pasteUrl, searchParams };
}

export default useUrl;
