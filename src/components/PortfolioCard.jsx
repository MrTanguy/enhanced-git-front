

const PortfolioCard = ({ portfolio }) => {

    return (
        <div className='plusCard plusCardPortfolios'>
            <div className="titleCard">{portfolio.title}</div>
            <div>{portfolio.description}</div>
        </div>
    )
}

export default PortfolioCard;