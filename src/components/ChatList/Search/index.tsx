import { useChatListSearch } from "@/store/AppStore/hooks";
import { FC } from "react";
import { TH__SearchContainer, TH__SearchInput } from "./styled";


const Search: FC = () => {
    const [searchVal, setSearch] = useChatListSearch();
  
    return (
      <TH__SearchContainer>
          <TH__SearchInput
            type="text" 
            placeholder="Search something" 
            onChange={e => setSearch(e.target.value)} 
            value={searchVal}
          />
      </TH__SearchContainer>
    );
  };
  
  export default Search;