import apiService from '../services/api/ApiService';

const ConnectionCard = ({ connection, setUserData }) => {
    const { deleteConnection } = apiService();

    const handleDelete = async (e) => {
        e.stopPropagation();
        try {
            await deleteConnection(connection.id);
            setUserData(prevData => ({
                ...prevData,
                connections: prevData.connections.filter(conn => conn.id !== connection.id)
            }));
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    };

    const handleRedirect = () => {
        const links = {
            github: `https://github.com/${connection.username}`,
            gitlab: `https://gitlab.com/${connection.username}`
        };
    
        const link = links[connection.website.toLowerCase()];
        if (link) {
            window.open(link, "_blank");
        }
    };

    const getIconPath = (website) => {
        switch (website.toLowerCase()) {
            case 'github':
                return '/github.svg';
            case 'gitlab':
                return '/gitlab.svg';
            default:
                return '/default.svg';
        }
    };

    return (
        <div className='plusCard plusCardConnections' onClick={handleRedirect}>
            <button className="deleteButton" onClick={handleDelete}>
                <img src="/cross.svg" alt="Delete" className="deleteIcon" />
            </button>
            <img className='connectionSvg' src={getIconPath(connection.website)} alt={connection.website} />
            <p className='titleCard'>{connection.username}</p>
        </div>
    );
};

export default ConnectionCard;
