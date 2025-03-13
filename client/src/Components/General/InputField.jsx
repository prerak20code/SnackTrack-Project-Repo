import { icons } from '../../Assets/icons';

export default function InputField({
    field = {
        name: '',
        type: '',
        required: false,
        label: '',
        placeholder: '',
    },
    inputs,
    handleChange = null,
    handleBlur = null,
    setShowPassword = null,
    showPassword = false,
}) {
    const passwordVariants = [
        'password',
        'oldPassword',
        'newPassword',
        'confirmPassword',
        'contractorPassword',
    ];
    return (
        <div key={field.name} className="w-full">
            <div className="bg-white z-[1] ml-2 px-2 w-fit relative top-3 font-medium">
                <label htmlFor={field.name}>
                    {field.required && <span className="text-red-500">* </span>}
                    {field.label} :
                </label>
            </div>
            <div className="relative">
                <input
                    type={field.type}
                    name={field.name}
                    id={field.name}
                    value={inputs[field.name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={field.placeholder}
                    className="shadow-md py-3 rounded-md indent-3 w-full border-[0.01rem] border-gray-500 bg-transparent"
                />
                {passwordVariants.includes(field.name) && (
                    <div
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="size-[20px] absolute right-0 top-[50%] transform translate-y-[-50%] mr-4 cursor-pointer fill-[#474747]"
                    >
                        {showPassword ? icons.eyeOff : icons.eye}
                    </div>
                )}
            </div>
        </div>
    );
}
