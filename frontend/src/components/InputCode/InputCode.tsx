import React, {
    useRef,
    useState,
    useEffect,
    Dispatch,
    SetStateAction,
} from 'react';
import styles from './InputCode.module.css';
import MyButton from '@/components/UI/button/MyButton';
import MyError from '@/components/Error/MyError';
import { emailCodeService } from '@/services';

const InputCode = ({
    email,
    setShowInputCode,
    setIsSuccessEmail,
}: {
    email: string;
    setShowInputCode: Dispatch<SetStateAction<boolean>>;
    setIsSuccessEmail: Dispatch<SetStateAction<boolean>>;
}) => {
    const [code, setCode] = useState<string>('');
    const [error, setError] = useState('');

    const handleChange = (value: string) => {
        if (value === '' || /^\d+$/.test(value)) {
            setError('');
            setCode(value);
        }
    };

    async function handleSubmit() {
        const responseSuccess = await emailCodeService.CheckEmailCode(
            email,
            code
        );

        if (!responseSuccess) {
            setError('Неверный код подтверждения. Попробуйте еще раз.');

            console.warn('Неверный код подтверждения');

            return;
        }

        setShowInputCode(false);
        setIsSuccessEmail(true);
    }

    return (
        <div className={styles.containerInputCode}>
            <span>Введите код, отправленный на почту:</span>

            <div className={styles.inputCode}>
                <input
                    type="text"
                    inputMode="numeric"
                    value={code ?? ''}
                    onChange={(e) => handleChange(e.target.value)}
                    pattern="[0-9]*"
                    className="w-auto border text-center h-[50px] text-2xl rounded-md"
                    maxLength={5}
                />
            </div>
            {error && <MyError error={error} />}
            <MyButton disabled={!code} onClick={handleSubmit}>
                Подтвердить
            </MyButton>
        </div>
    );
};

export default InputCode;
