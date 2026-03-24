'use client';

import { FormEvent, useRef, useState } from 'react';
import styles from './styles.module.css';
import Link from 'next/link';
import MyButton from '@/components/UI/button/MyButton';
import CreateUser from '@/components/CreateUser/CreateUser';
import MyError from '@/components/Error/MyError';
import ContinueWithGoogle from '@/components/ContinueWithGoogle/ContinueWithGoogle';
import { getApiUrl } from '@/utils/getApiUrl';
import { useRouter } from 'next/navigation';
import MyModal from '@/components/MyModal/MyModal';
import { registrationValidateSchema } from '@/schemas/registration.schema';
import InputCode from '@/components/InputCode/InputCode';
import { emailCodeService } from '@/services';

interface FirstRegistrationRequest {
    email: string;
    password1: string;
    password2: string;
}

export default function Registration() {
    const [error, setError] = useState<string>('');
    const [formRegistration, setFormRegistration] =
        useState<FirstRegistrationRequest>({
            email: '',
            password1: '',
            password2: '',
        });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const router = useRouter();
    const [step, setStep] = useState<'createUser' | 'form'>('form');
    const [isShowInputCode, setShowInputCode] = useState<boolean>(false);
    const [isSuccessEmail, setIsSuccessEmail] = useState<boolean>(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const resultValidation =
            registrationValidateSchema.safeParse(formRegistration);

        if (!resultValidation.success) {
            setError(resultValidation.error.issues[0].message);

            setStep('form');

            return;
        }

        if (!isSuccessEmail) {
            setShowInputCode(true);

            const response = await emailCodeService.SendCode(
                formRegistration.email
            );

            if (response.code !== 200) {
                setError('Ошибка отправки кода на почту');

                return;
            }

            return;
        }

        setStep('createUser');
    }

    if (step === 'createUser' || isSuccessEmail) {
        return (
            <CreateUser
                email={formRegistration.email}
                password={formRegistration.password1}
            />
        );
    }

    return (
        <div className={styles.registration}>
            <form className={styles.form}>
                {/*<h1 className={styles.title}>Регистрация</h1>*/}
                <div className={styles.pole}>
                    <label>Почта: </label>
                    <input
                        type="email"
                        className={styles.nameInput}
                        value={formRegistration.email}
                        required
                        onChange={(e) =>
                            setFormRegistration({
                                ...formRegistration,
                                email: e.target.value,
                            })
                        }
                    ></input>
                </div>
                <div className={styles.pole}>
                    <label>Пароль: </label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className={styles.nameInput}
                        required
                        value={formRegistration.password1}
                        onChange={(e) =>
                            setFormRegistration({
                                ...formRegistration,
                                password1: e.target.value,
                            })
                        }
                    ></input>
                </div>
                <div className={styles.pole}>
                    <label>Повторный пароль: </label>
                    <input
                        required
                        type={showPassword ? 'text' : 'password'}
                        className={styles.nameInput}
                        value={formRegistration.password2}
                        onChange={(e) =>
                            setFormRegistration({
                                ...formRegistration,
                                password2: e.target.value,
                            })
                        }
                    ></input>
                    <div className={styles.showPassword}>
                        <label htmlFor="showPassword">Показать пароль</label>
                        <input
                            id="showPassword"
                            className={styles.checkbox}
                            type="checkbox"
                            value={showPassword.toString()}
                            onChange={() => setShowPassword(!showPassword)}
                        ></input>
                    </div>
                </div>
                {error && <MyError error={error} />}
                <div className={styles.footer}>
                    <MyButton onClick={handleSubmit}>
                        Зарегистрироваться
                    </MyButton>
                    <ContinueWithGoogle
                        onClick={() => {
                            router.push(getApiUrl() + '/signin-google');
                        }}
                    />
                </div>
                <Link href="/login" className={styles.authorization}>
                    <MyButton type="button">Есть аккаунт</MyButton>
                </Link>
                <MyModal
                    visible={isShowInputCode}
                    setVisible={setShowInputCode}
                    positionStyle={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    isCloseOnClickToVoid={true}
                >
                    <InputCode
                        email={formRegistration.email}
                        setShowInputCode={setShowInputCode}
                        setIsSuccessEmail={setIsSuccessEmail}
                    />
                </MyModal>
            </form>
        </div>
    );
}
