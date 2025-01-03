import '../styles/modal.css';
import { UseAuth } from '../hooks/AuthProvider';

export default function ModalConnections({ onClose }) {
    const { getOAuthUrl } = UseAuth();

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
                <button className="closeButton" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}
