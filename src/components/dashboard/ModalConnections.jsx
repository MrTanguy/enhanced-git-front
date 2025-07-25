import '../../styles/modal.css';
import apiService from '../../services/api/ApiService';

export default function ModalConnections({ onClose }) {
    const { getOAuthUrl } = apiService();

    return (
        <div className="modalBackground" onClick={onClose}>
            <div className="modalDiv" onClick={(e) => e.stopPropagation()}>
                <div className="listSites">
                    <div className="siteDiv" onClick={() => getOAuthUrl("github")}>
                        <img src="./github.svg" className="githubSvg" alt="GitHub Logo" />
                        <div className="siteName">GitHub</div>
                    </div>
                    <div className="siteDiv" onClick={() => getOAuthUrl("gitlab")}>
                        <img src="./gitlab.svg" className="gitlabSvg" alt="GitLab Logo" />
                        <div className="siteName">GitLab</div>
                    </div>
                </div>
                <button className="button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}
