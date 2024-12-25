import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faChevronDown } from "@fortawesome/free-solid-svg-icons"

import Button from "./Button";
import Label from "./Label";
import { LabeledDropdown, DropdownItem } from "./Dropdown";

import { createClassName } from "../utils/utils";

const Pagination = ({ className, displayCount = true, handleItemsPerPage, itemsPerPage, table = false, postsPerPage, totalPosts, paginateFront, paginateBack, currentPage, maxPages }) => {
  const itemsLabel = (
    <Label
      rightIcon={ <FontAwesomeIcon className="w-12 h-18" icon={ faChevronDown } /> }
      size="sm"
      value={ postsPerPage }
    >
      { postsPerPage }
    </Label>
  )

  return (
    <div className={ createClassName(`gap-16 font-normal flex ${table ? "grid grid-cols-3 text-body-s" : "items-end justify-end text-body-l"}`, className) }>
      { displayCount &&
        <div className={ `h-[48px] ${table ? "flex items-center justify-start" : "flex items-center justify-center"}` }>
          <p>
            Showing &nbsp;
            <span className="font-semibold">{ (currentPage - 1) * postsPerPage + 1 }</span>
            &nbsp;
            to
            <span className="font-semibold"> { (currentPage - 1) * postsPerPage + postsPerPage > totalPosts ? totalPosts : (currentPage - 1) * postsPerPage + postsPerPage } </span>
            of
            <span className="font-semibold"> { totalPosts } </span>
            results
          </p>
        </div> }
      <div className={ `flex ${table ? "items-center justify-center" : ""}` }>
        <Button onClick={ paginateBack } disabled={ currentPage === 1 } variant="secondary" className={ `!bg-neutral-0 !text-neutral-800 disabled:!text-neutral-200 disabled:!border-neutral-200 !border-neutral-200 w-[48px] ${table ? "h-32 border-none" : "h-[48px] !shadow-light-25"} mr-16` }>
          <FontAwesomeIcon icon={ faArrowLeft } className="h-16" />
        </Button>
        { table && <p className="mr-16">Page <span className="font-semibold">{ currentPage }</span> out of <span className="font-semibold">{ maxPages - 1 }</span></p> }
        <Button onClick={ paginateFront } disabled={ currentPage === maxPages - 1 } variant="secondary" className={ `!bg-neutral-0 !text-neutral-800 disabled:!text-neutral-200 disabled:!border-neutral-200 !border-neutral-200 w-[48px] ${table ? "h-32 border-none" : "h-[48px] !shadow-light-25"}` }>
          <FontAwesomeIcon icon={ faArrowRight } className="h-16" />
        </Button>
      </div>

      { table && (<div className="flex gap-8 items-center justify-end">
        Display
        <LabeledDropdown
          className="!w-64"
          label={ itemsLabel }
          value={ postsPerPage }
        >
          { itemsPerPage.map((item, i) => {
            return (
              <DropdownItem
                key={ i }
                className={ `${postsPerPage === item ? "font-semibold" : "font-normal"}` }
                onClick={ () => { handleItemsPerPage(item) } }
              >
                { item }
              </DropdownItem>
            )
          }
          ) }

        </LabeledDropdown>
        items per page.
      </div>
      ) }
    </div>
  )
}

export default Pagination;
