import './index.css';

const Cell = ({row, col, onCellClick, value, disabled,isWinningCell}) => {

    const handleClick = () => {
        if(onCellClick && typeof onCellClick === 'function') {
            onCellClick(row, col);
        }
    }

    let wrapperClassNames = 'cell-wrapper';

    if (isWinningCell) {
        wrapperClassNames += " winning-cell"
    }

    return (
        <div className={wrapperClassNames}>
            <button className='cell-button' onClick={handleClick} disabled={disabled || value}>{value}</button>
        </div>
    )
}

export default Cell;
