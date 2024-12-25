import Pagination from "./Pagination";

import { createClassName } from "../utils/utils";

const List = ({ className, children, postsPerPage, totalPosts, paginateBack, paginateFront, currentPage, maxPages }) => {
  return (
    <div className={ createClassName("pb-[30px]", className) }>
      { children }
      <Pagination
        postsPerPage={ postsPerPage }
        totalPosts={ totalPosts }
        paginateBack={ paginateBack }
        paginateFront={ paginateFront }
        currentPage={ currentPage }
        maxPages={ maxPages }
      />
    </div>
  )
}

const ListItem = ({ className, children }) => {
  return (
    <div className={ className }>{ children }</div>
  )
}

export { List, ListItem }
