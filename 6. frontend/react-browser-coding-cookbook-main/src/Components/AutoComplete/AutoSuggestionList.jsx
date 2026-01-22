import withLoader from "../../hoc/withLoader";

const AutoSuggestionsList = ({
  data,
  listRefs,
  listContainerRef,
  activeIndex
}) => {
  if(data.length === 0) return null;

  return (
    <ul ref={listContainerRef} className="auto-complete-list">
      {data.map((item, index) => {
        let listClassName = "auto-complete-list-item";
        if (index === activeIndex) {
          listClassName += " active-list"
        }

        return (
          <li
            className={listClassName}
            id={item.id}
            ref={(elem) => listRefs.current[index] = elem}
          >
            {item.label}
          </li>
        )
      })}
    </ul>
  )
}

export default withLoader(AutoSuggestionsList);