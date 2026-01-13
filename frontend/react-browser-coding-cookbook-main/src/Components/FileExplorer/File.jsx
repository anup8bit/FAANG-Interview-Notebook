const File = ({name}) => {

  return (
    <li className="file-list-item">
      <button className="file-cta">{name}</button>
    </li>
  )
}

export default File;