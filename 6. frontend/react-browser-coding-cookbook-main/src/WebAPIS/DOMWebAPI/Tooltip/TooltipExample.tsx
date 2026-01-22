import Tooltip from "."

const TooltipExapmle = () => {
  return (
    <main>
      <section>
        <h3>Tooltip Basic Example</h3>
        <p>Hover over the buttons below to see the tooltip</p>
      </section>
      <section>
        <p>
          Jane, I will not trouble you with abominable details:
           some strong words shall express what I have to say.  
           I lived with that woman
           <Tooltip content="I am Anup Gupta. I will not trouble you with abominable">
              <button>Who are you?</button>
            </Tooltip> upstairs four years, and before 
           that time she had tried me indeed: her character ripened and developed with 
           frightful rapidity;
            her vices sprang up fast and rank: they were so strong, 
           only cruelty could check them, and I would not use cruelty. 
            What a pigmy intellect she had, and what giant propensities! 
             How fearful were the curses those propensities entailed on me!  
             Bertha Mason, the true daughter of an infamous mother,
              dragged me through all the hideous and degrading agonies 
              which must attend a man bound to a wife at once intemperate and unchaste.
        </p>
      </section>
    </main>
  )
}

export default TooltipExapmle;