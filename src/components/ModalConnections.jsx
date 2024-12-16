import '../styles/modal.css'

export default function ModalConnections({ onClose }) {
    return (
        <div className='modalBackground' onClick={onClose}>
            <div className='modalDiv' onClick={(e) => e.stopPropagation()}>
                <div className='title'>Choose your connection :</div>
                <div className='subtitle'>Developer :</div>
                <div className='siteDiv'>
                    <img src='./github.svg' className='githubSvg' ></img>
                    <div className='siteName'>Github</div>
                </div>
                <button onClick={onClose} style={{ marginTop: "20px", padding: "10px 20px" }}>
                    Fermer
                </button>
            </div>
        </div>
    );
}