import { useState } from "react"
import Input from "./Input";
import "./index.css";


const InputTag = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [tag, setTag] = useState("");


  const addTag = (e) => {
    e.preventDefault();
    if (!tag) {
      setError("tag is impty");
      return;
    }
    if(tags.includes(tag)) {
       setError("Duplicate tag");
       return;
    }
    setTags([tag, ...tags]);
    setTag("");
    setError("");
  }

  const removeTag = (index: number) => {
    const newTags = [...tags.slice(0, index), ...tags.slice(index+1, tags.length)];
    setTags(newTags);
  }

  return (
    <div className="container">
      <header>
        <h3> Add tag</h3>
      </header>
      <section className="form-wrapper">
        <form onSubmit={addTag}>
          <Input
          name="tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="enter to add tag nam here"
          id="tag"
          label="Tag:"
        />
        {error && <p className="error-info">{error}</p>}
        </form>
      </section>
      <section className="tag-section">
        <h3>
          Added Tags
        </h3>
        <ul className="tag-list">
          {tags.map((tagName, index) => (
            <li className="tag-list-item">
              <span>{tagName}</span>
              <button className="remove-cta" onClick={() => removeTag(index)}>remove</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default InputTag;