import { useId, type FC, type KeyboardEvent } from "react";
import type { ISearchField } from "./types";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export const SearchField: FC<ISearchField> = ({
  query,
  placeholder,
  label,
  setQuery,
  onSearch,
}) => {
  const inputId = useId();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel htmlFor={inputId}>{label || "Никнейм"}</InputLabel>
      <OutlinedInput
        id={inputId}
        placeholder={placeholder}
        label={label || "Никнейм"}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        endAdornment={
          <InputAdornment position="end">
            <IconButton aria-label="поиск" onClick={onSearch} edge="end">
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

export default SearchField;
