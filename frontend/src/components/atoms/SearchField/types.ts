export interface ISearchField {
  query: string;
  placeholder?: string;
  label?: string;
  setQuery: (password: string) => void;
  onSearch: () => void;
}
