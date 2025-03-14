import { useEffect, useState } from 'react';
import { studentService } from '../Services';
import { paginate } from '../Utils';
import { useNavigate, useParams } from 'react-router-dom';
import {
    useContractorContext,
    usePopupContext,
    useSearchContext,
    useUserContext,
} from '../Contexts';
import { LIMIT } from '../Constants/constants';
import { Button, StudentView } from '../Components';
import { icons } from '../Assets/icons';

export default function StudentsPage() {
    const { students, setStudents } = useContractorContext();
    const { setPopupInfo, setShowPopup } = usePopupContext();
    const [studentsInfo, setStudentsInfo] = useState({});
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const { user } = useUserContext();
    const { search } = useSearchContext();
    const navigate = useNavigate();
    const { canteenId } = useParams();
    const paginateRef = paginate(studentsInfo?.hasNextPage, loading, setPage);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function getStudents() {
            try {
                setLoading(true);
                const res = await studentService.getStudents(
                    canteenId,
                    signal,
                    page,
                    LIMIT
                );
                if (res && !res.message) {
                    setStudents((prev) => [...prev, ...res.students]);
                    setStudentsInfo(res.studentsInfo);
                }
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            controller.abort();
            setStudents([]);
            setStudentsInfo({});
        };
    }, [page]);

    const studentElements = students
        ?.filter(
            (student) =>
                !search ||
                student.fullName.toLowerCase().includes(search.toLowerCase()) ||
                student.userName.toLowerCase().includes(search.toLowerCase())
        )
        .map((student, index) => (
            <StudentView
                key={student._id}
                student={student}
                reference={
                    index + 1 === students.length && studentsInfo?.hasNextPage
                        ? paginateRef
                        : null
                }
            />
        ));

    async function removeAllStudents() {
        setPopupInfo({ type: 'removeAllStudents' });
        setShowPopup(true);
    }

    return (
        <div className="lg:p-8 pt-4 lg:pt-4">
            {studentElements.length > 0 && (
                <div className="w-full">
                    {user.role === 'contractor' && (
                        <div className=" w-full flex justify-center mb-8">
                            <Button
                                title="Remove all Students"
                                onClick={removeAllStudents}
                                btnText={
                                    <div className="flex gap-2 items-center justify-center px-1">
                                        <div className="size-[16px] fill-white group-hover:fill-red-700">
                                            {icons.delete}
                                        </div>
                                        <p>Remove All Students</p>
                                    </div>
                                }
                                className="bg-red-700 text-white p-2 rounded-lg"
                            />
                        </div>
                    )}
                    <div
                        className={`grid gap-6 ${studentElements.length <= 1 ? 'grid-cols-[repeat(auto-fit,minmax(300px,550px))]' : 'grid-cols-[repeat(auto-fit,minmax(300px,1fr))]'}`}
                    >
                        {studentElements}
                    </div>
                </div>
            )}

            {loading ? (
                page === 1 ? (
                    <div className="w-full text-center">
                        loading first batch...
                        {/* pulses */}
                    </div>
                ) : (
                    <div className="flex items-center justify-center my-2 w-full">
                        <div className="size-7 fill-[#4977ec] dark:text-[#f7f7f7]">
                            {icons.loading}
                        </div>
                    </div>
                )
            ) : (
                studentElements.length === 0 && <div>No student found !!</div>
            )}
        </div>
    );
}
