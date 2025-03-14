import { Button } from '..';
import {
    studentService,
    adminService,
    contractorService,
} from '../../Services';
import { icons } from '../../Assets/icons';
import { useState } from 'react';

export default function Logout() {
    const [loading, setLoading] = useState(false);

    async function logout() {
        setLoading(true);
        try {
            let res = null;
            if (user.role === 'student') {
                res = await studentService.logout();
            } else if (user.role === 'admin') {
                res = await adminService.logout();
            } else {
                res = await contractorService.logout();
            }
            if (res && res.message === 'user loggedout successfully') {
                setUser(null);
                toast.success('Logged out Successfully 🙂');
            }
        } catch (err) {
            navigate('/server-error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            onClick={logout}
            disabled={loading}
            btnText={
                loading ? (
                    <div className="size-5 fill-[#4977ec] dark:text-[#a2bdff]">
                        {icons.loading}
                    </div>
                ) : (
                    'Logout'
                )
            }
            title="Logout"
            className="text-white rounded-md py-[5px] w-fit px-3 h-[35px] bg-[#4977ec] hover:bg-[#3b62c2]"
        />
    );
}
