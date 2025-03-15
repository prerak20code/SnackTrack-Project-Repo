import { useState, useRef } from 'react';
import { contractorService } from '../../Services';
import { usePopupContext, useSnackContext } from '../../Contexts';
import { useNavigate } from 'react-router-dom';
import { Button, InputField } from '..';
import { verifyExpression, fileRestrictions } from '../../Utils';
import toast from 'react-hot-toast';
import { icons } from '../../Assets/icons';
import { MAX_FILE_SIZE } from '../../Constants/constants';

export default function EditSnackPopup() {
    const { setSnacks } = useSnackContext();
    const { setShowPopup, popupInfo } = usePopupContext();
    const ref = useRef();
    const [imagePreview, setImagePreview] = useState(popupInfo.target.image);
    const [inputs, setInputs] = useState({
        name: popupInfo.target.name || '',
        password: '',
        price: popupInfo.target.price || '',
        image: null,
    });
    const [error, setError] = useState({
        root: '',
        name: '',
        password: '',
        price: '',
        image: '',
    });
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    async function handleChange(e) {
        const { value, name, files, type } = e.target;
        setInputs((prev) => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value,
        }));
        if (type === 'file') {
            const file = files[0];
            setImagePreview(URL.createObjectURL(file));
            if (!fileRestrictions(files[0])) {
                setError((prev) => ({
                    ...prev,
                    image: `only PNG, JPG/JPEG files are allowed and File size should not exceed ${MAX_FILE_SIZE} MB`,
                }));
            } else setError((prev) => ({ ...prev, image: '' }));
        }
    }

    const handleBlur = (e) => {
        let { name, value, type, files } = e.target;
        if (value && type !== 'file') verifyExpression(name, value, setError);
    };

    function onMouseOver() {
        if (
            Object.values(inputs).some((value) => !value) ||
            Object.entries(error).some(
                ([key, value]) => value && key !== 'root'
            )
        ) {
            setDisabled(true);
        } else setDisabled(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setDisabled(true);
        try {
            const res = await contractorService.updateSnackDetails(
                inputs,
                popupInfo.target._id
            );
            if (res && !res.message) {
                toast.success('Details updated successfully 👍');
                setSnacks((prev) =>
                    prev.map((snack) => {
                        if (snack._id === popupInfo.target._id) {
                            return {
                                ...snack,
                                name: inputs.name,
                                price: inputs.price,
                                image: res.image,
                            };
                        } else return snack;
                    })
                );
                setShowPopup(false);
            } else setError((prev) => ({ ...prev, root: res.message }));
        } catch (err) {
            navigate('/server-error');
        } finally {
            setDisabled(false);
            setLoading(false);
        }
    }

    const inputFields = [
        {
            type: 'text',
            name: 'name',
            label: 'Name',
            placeholder: 'Enter new Name',
            required: true,
        },
        {
            type: 'number',
            name: 'price',
            label: 'Price',
            placeholder: 'Enter new Price',
            required: true,
        },
        {
            type: showPassword ? 'text' : 'password',
            name: 'password',
            label: 'Password',
            placeholder: 'Enter password to confirm update',
            required: true,
        },
    ];

    const inputElements = inputFields.map((field) =>
        field.name === 'password' ? (
            <InputField
                key={field.name}
                field={field}
                handleChange={handleChange}
                error={error}
                inputs={inputs}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
            />
        ) : (
            <div className="w-full" key={field.name}>
                <InputField
                    field={field}
                    handleChange={handleChange}
                    error={error}
                    inputs={inputs}
                    handleBlur={handleBlur}
                />
                {error[field.name] && (
                    <div className="text-red-500 text-xs font-medium">
                        {error[field.name]}
                    </div>
                )}
            </div>
        )
    );

    return (
        <div className="relative w-[350px] sm:w-[450px] transition-all duration-300 bg-white rounded-xl overflow-hidden text-black p-6 flex flex-col items-center justify-center gap-3">
            <Button
                btnText={
                    <div className="size-[20px] stroke-black">
                        {icons.cross}
                    </div>
                }
                title="Close"
                onClick={() => setShowPopup(false)}
                className="absolute top-2 right-2"
            />

            <p className="text-2xl font-bold">Update Snack Details</p>
            <p className="text-[15px]">
                <span className="font-medium">Name: </span>
                {popupInfo.target.name}
            </p>

            <div className="w-full flex flex-col items-center justify-center gap-3 relative -top-2">
                {error.root && (
                    <div className="text-red-500 w-full text-center">
                        {error.root}
                    </div>
                )}

                {/* preview */}
                <div
                    className="cursor-pointer w-full mt-4 flex items-center justify-center"
                    onClick={() => ref.current.click()}
                >
                    <img
                        src={imagePreview}
                        alt="preview"
                        className={`hover:brightness-75 size-[120px] rounded-xl border-[0.2rem] object-cover ${
                            error.image ? 'border-red-500' : 'border-green-500'
                        }`}
                    />
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col items-start justify-center gap-2 w-full"
                >
                    <input
                        type="file"
                        name="image"
                        id="image"
                        className="hidden"
                        onChange={handleChange}
                        ref={ref}
                    />

                    {error.image && (
                        <div className="text-sm px-2 text-red-500 w-full text-center">
                            {error.image}
                        </div>
                    )}

                    {inputElements}

                    <div className="w-full">
                        <Button
                            type="submit"
                            className="text-white rounded-md py-2 mt-4 h-[45px] flex items-center justify-center text-lg w-full bg-[#4977ec] hover:bg-[#3b62c2]"
                            disabled={disabled}
                            onMouseOver={onMouseOver}
                            btnText={
                                loading ? (
                                    <div className="flex items-center justify-center w-full">
                                        <div className="size-5 fill-[#4977ec] dark:text-[#a2bdff]">
                                            {icons.loading}
                                        </div>
                                    </div>
                                ) : (
                                    'Update'
                                )
                            }
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
