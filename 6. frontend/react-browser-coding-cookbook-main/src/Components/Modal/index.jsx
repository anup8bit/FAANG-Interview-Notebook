import "./index.css";


const Modal = ({ open, toggleModal }) => {

    if (!open) return null;

    return (
        <div className="modal-container">
            <div className="modal-wrapper">
                <div className="modal-header">
                    <h3>Header</h3>
                    <button className="modal-close-cta-icon" onClick={toggleModal}>X</button>
                </div>
                <div className="modal-content">
                    <section>
                        <p>
                            Pick a Color: colormap Or Enter a Color: OK Or Use HTML5: Selected Color: Black Text Shadow White Text Shadow Red #ff0000 rgb(255, 0, 0) hsl(0, 100%, 50%)
                        </p>
                    </section>
                </div>
                <div className="modal-footer">
                    <button onClick={toggleModal} className="modal-close-cta">Close</button>
                </div>
            </div>
        </div>
    )
}

export default Modal;