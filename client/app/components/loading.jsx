export default function Loading() {
    return (
        <div className="loading-container">
            <div className="loading-content">
                <div className="loading-logo">
                    <i className="fas fa-coins"></i>
                </div>

                <div className="loading-spinner">
                    <div className="spinner-circle"></div>
                    <div className="spinner-circle spinner-circle-secondary"></div>
                </div>

                <h5 className="loading-title">Carregando</h5>

                <p className="loading-text">
                    Aguarde enquanto preparamos as informações
                </p>

                <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>

            <style jsx>{`
                .loading-container {
                    width: 100%;
                    min-height: 320px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 20px;
                }

                .loading-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }

                .loading-logo {
                    width: 62px;
                    height: 62px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 22px;
                    border-radius: 18px;
                    background: linear-gradient(
                        135deg,
                        #1f3c88,
                        #3168d8
                    );
                    color: white;
                    font-size: 27px;
                    box-shadow: 0 12px 30px rgba(31, 60, 136, 0.25);
                    animation: flutuar 2s ease-in-out infinite;
                }

                .loading-spinner {
                    position: relative;
                    width: 62px;
                    height: 62px;
                    margin-bottom: 20px;
                }

                .spinner-circle {
                    position: absolute;
                    inset: 0;
                    border: 4px solid rgba(31, 60, 136, 0.12);
                    border-top-color: #1f3c88;
                    border-radius: 50%;
                    animation: girar 1s linear infinite;
                }

                .spinner-circle-secondary {
                    inset: 9px;
                    border-width: 3px;
                    border-color: rgba(49, 104, 216, 0.12);
                    border-bottom-color: #3168d8;
                    animation-direction: reverse;
                    animation-duration: 0.8s;
                }

                .loading-title {
                    margin: 0 0 7px;
                    color: #1f3c88;
                    font-weight: 800;
                    letter-spacing: 0.3px;
                }

                .loading-text {
                    margin: 0;
                    color: #7a8499;
                    font-size: 14px;
                }

                .loading-dots {
                    display: flex;
                    gap: 6px;
                    margin-top: 16px;
                }

                .loading-dots span {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #3168d8;
                    animation: pulsar 1.2s infinite ease-in-out;
                }

                .loading-dots span:nth-child(2) {
                    animation-delay: 0.15s;
                }

                .loading-dots span:nth-child(3) {
                    animation-delay: 0.3s;
                }

                @keyframes girar {
                    to {
                        transform: rotate(360deg);
                    }
                }

                @keyframes flutuar {
                    0%,
                    100% {
                        transform: translateY(0);
                    }

                    50% {
                        transform: translateY(-7px);
                    }
                }

                @keyframes pulsar {
                    0%,
                    80%,
                    100% {
                        opacity: 0.3;
                        transform: scale(0.8);
                    }

                    40% {
                        opacity: 1;
                        transform: scale(1.2);
                    }
                }
            `}</style>
        </div>
    );
}