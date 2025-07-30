import '../../styles/modal.css';
import apiService from '../../services/api/ApiService';

export default function ModalConnections({ onClose }) {
    const { getOAuthUrl } = apiService();

    const handleKeyDown = (e, site) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            getOAuthUrl(site);
        }
    };

    return (
        <div
            className="modalBackground"
            onClick={onClose}
            role="presentation"
        >
            <div
                className="modalDiv"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                tabIndex={-1}
            >
                <h2 id="modal-title" style={{ position: 'absolute', left: '-9999px', height: '1px', overflow: 'hidden' }}>
                    Connect your account
                </h2>
                <div className="listSites">
                    <div
                        className="siteDiv"
                        onClick={() => getOAuthUrl("github")}
                        tabIndex={0}
                        role="button"
                        aria-label="Connect your GitHub account"
                        onKeyDown={(e) => handleKeyDown(e, "github")}
                    >
                        <img src="./github.svg" className="githubSvg" alt="GitHub Logo" />
                        <div className="siteName">GitHub</div>
                    </div>
                    <div
                        className="siteDiv"
                        onClick={() => getOAuthUrl("gitlab")}
                        tabIndex={0}
                        role="button"
                        aria-label="Connect your GitLab account"
                        onKeyDown={(e) => handleKeyDown(e, "gitlab")}
                    >
                        <img src="./gitlab.svg" className="gitlabSvg" alt="GitLab Logo" />
                        <div className="siteName">GitLab</div>
                    </div>
                </div>
                <button
                    className="button"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
