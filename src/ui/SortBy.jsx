import { useSearchParams } from "react-router-dom";
import Select from "./Select.jsx";
import useUrl from "../hooks/useUrl.js";

function SortBy({ options }) {
  const { pasteUrl, readUrl, searchParams } = useUrl("sortBy");
  const sortBy = searchParams.get("sortBy") || "";

  function handleChange(e) {
    readUrl(e);
    pasteUrl();
  }

  return (
    <Select
      options={options}
      type="white"
      onChange={handleChange}
      value={sortBy}
    />
  );
}

export default SortBy;
