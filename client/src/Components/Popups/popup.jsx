import { useRef } from 'react';
import {
    UpdateAvatarPopup,
    RemoveStudentPopup,
    EditStudentPopup,
    RemoveAllStudentsPopup,
} from '..';
import { usePopupContext } from '../../Contexts';

export default function Popup() {
    const { popupInfo, setShowPopup, showPopup } = usePopupContext();
    const ref = useRef();

    function close(e) {
        if (e.target === ref.current) setShowPopup(false);
    }

    const Wrapper = ({ children }) => (
        <div
            className="fixed inset-0 z-[1000] backdrop-blur-sm flex items-center justify-center drop-shadow-md"
            ref={ref}
            onClick={close}
        >
            {children}
        </div>
    );

    if (!showPopup) return null;

    switch (popupInfo.type) {
        case 'removeStudent':
            return (
                <Wrapper>
                    <RemoveStudentPopup />
                </Wrapper>
            );
        case 'editStudent':
            return (
                <Wrapper>
                    <EditStudentPopup />
                </Wrapper>
            );
        case 'removeAllStudents':
            return (
                <Wrapper>
                    <RemoveAllStudentsPopup />
                </Wrapper>
            );
        case 'updateAvatar':
            return (
                <Wrapper>
                    <UpdateAvatarPopup />
                </Wrapper>
            );
        default:
            return null;
    }
}
