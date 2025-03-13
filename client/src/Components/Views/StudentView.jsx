import { Link, useNavigate } from 'react-router-dom';
import { Button } from '..';
import { icons } from '../../Assets/icons';
import { LOGO } from '../../Constants/constants';
import { usePopupContext, useContractorContext } from '../../Contexts';
import { getRollNo } from '../../Utils';

export default function StudentView({ student, reference, children }) {
    const { _id, avatar, fullName, userName, phoneNumber } = student;
    const { setShowPopup, setPopupInfo } = usePopupContext();
    const { setTargetStudent } = useContractorContext();

    async function removeStudent() {
        setTargetStudent(student);
        setPopupInfo({ type: 'removeStudent' });
        setShowPopup(true);
    }

    async function editStudent() {
        setTargetStudent(student);
        setPopupInfo({ type: 'editStudent' });
        setShowPopup(true);
    }

    return (
        <div
            ref={reference}
            className="min-w-[250px] flex flex-col items-start justify-center gap-6 relative w-full p-4 bg-white drop-shadow-md rounded-2xl overflow-hidden"
        >
            <div className="w-full flex justify-between gap-4">
                <div className="flex items-center justify-start gap-4">
                    {/* avatar */}
                    <div>
                        <div className="size-[80px] overflow-hidden rounded-full drop-shadow-md">
                            <img
                                alt="student avatar"
                                src={avatar || LOGO}
                                className="size-full object-cover"
                            />
                        </div>
                    </div>

                    {/* info */}
                    <div className="">
                        <div className="text-ellipsis line-clamp-1 text-[18px] hover:text-[#5c5c5c] font-medium text-black w-fit">
                            {fullName}
                        </div>

                        <div className="text-black hover:text-[#5c5c5c] text-[15px] w-fit">
                            <span className="font-medium">Roll No: </span>
                            {getRollNo(userName)}
                        </div>

                        <div className="text-black hover:text-[#5c5c5c] text-[15px] w-fit">
                            <span className="font-medium">Phone Number: </span>{' '}
                            {phoneNumber}
                        </div>
                    </div>
                </div>

                <div className="w-fit flex flex-col gap-4 items-end justify-center">
                    <div onClick={(e) => e.stopPropagation()}>
                        <Button
                            btnText={
                                <div className="size-[16px] group-hover:fill-[#4977ec]">
                                    {icons.edit}
                                </div>
                            }
                            className="bg-[#f0efef] p-2 group rounded-full drop-shadow-lg hover:bg-[#ebeaea]"
                            onClick={editStudent}
                        />
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                        <Button
                            btnText={
                                <div className="size-[16px] group-hover:fill-red-700">
                                    {icons.delete}
                                </div>
                            }
                            className="bg-[#f0efef] p-2 group rounded-full drop-shadow-lg hover:bg-[#ebeaea]"
                            onClick={removeStudent}
                        />
                    </div>
                </div>
            </div>

            {children}
        </div>
    );
}
