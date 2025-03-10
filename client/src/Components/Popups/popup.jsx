import { useRef } from 'react';
import { DeleteAccount, LoginPopup } from '..';
import { usePopupContext } from '../../Contexts';

export default function Popup() {
    const { popupInfo, setShowPopup, showPopup } = usePopupContext();
    const ref = useRef();

    function close(e) {
        if (e.target === ref.current) setShowPopup(false);
    }

    const Wrapper = ({ children }) => (
        <div
            className="fixed inset-0 z-[1000] backdrop-blur-sm flex items-center justify-center"
            ref={ref}
            onClick={close}
        >
            {children}
        </div>
    );

    if (!showPopup) return null;

    switch (popupInfo.type) {
        case 'login':
            return (
                <Wrapper>
                    <LoginPopup />
                </Wrapper>
            );
        case 'deleteAccount':
            return (
                <Wrapper>
                    <DeleteAccount />
                </Wrapper>
            );
        default:
            return null;
    }
}
