'use client';

import styles from './styles.module.css';
import MyError from '@/components/Error/MyError';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import { useState } from 'react';
import MyButton from '@/components/UI/button/MyButton';
import { getApiUrl } from '@/utils/getApiUrl';
import ContinueWithGoogle from '@/components/ContinueWithGoogle/ContinueWithGoogle';
import { loginService } from '@/services';

function Login() {
    const [error, setError] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const router = useRouter();
    const { login } = useAuth();
    const statusCodes: Record<number, string> = {
        401: 'Почта или пароль неверные!',
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validate: (values) => {
            const errors: Partial<typeof values> = {};

            if (!values.email) {
                errors.email = 'Email обязателен';
            } else if (!/\S+@\S+\.\S+/.test(values.email)) {
                errors.email = 'Некорректный формат email';
            }

            if (!values.password) {
                errors.password = 'Пароль обязателен';
            } else if (values.password.length < 10) {
                errors.password = 'Пароль должен быть не менее 10 символов';
            }

            return errors;
        },
        onSubmit: async (values, { setSubmitting }) => {
            try {
                setError('');

                const { token, user } = await loginService.Login(
                    values.email,
                    values.password
                );
                login(token, user);
                router.push('/');
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    setError('Почта или пароль неверные!');
                } else {
                    setError('Произошла неизвестная ошибка');
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className={styles.login}>
            <form className={styles.form} onSubmit={formik.handleSubmit}>
                {/*<h1 className={styles.title}>Авторизация</h1>*/}

                <div className={styles.pole}>
                    <label>Почта: </label>
                    <input
                        type="email"
                        name="email"
                        className={styles.nameInput}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <MyError error={formik.errors.email} />
                    )}
                </div>

                <div className={styles.pole}>
                    <label>Пароль: </label>
                    <input
                        name="password"
                        className={styles.nameInput}
                        value={formik.values.password}
                        type={showPassword ? 'text' : 'password'}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <MyError error={formik.errors.password} />
                    )}

                    <div className={styles.showPassword}>
                        <label htmlFor="showPassword">Показать пароль</label>
                        <input
                            id="showPassword"
                            className={styles.checkbox}
                            type="checkbox"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                        />
                    </div>
                </div>
                <MyError error={error} />
                <div className={styles.footer}>
                    <MyButton type="submit" disabled={formik.isSubmitting}>
                        {formik.isSubmitting ? 'Загрузка...' : 'Авторизоваться'}
                    </MyButton>
                    <ContinueWithGoogle
                        onClick={() => {
                            window.location.href =
                                getApiUrl() + '/signin-google';
                        }}
                    />
                </div>
                <Link href="/registration" className={styles.registration}>
                    <MyButton type="button">Нет аккаунта</MyButton>
                </Link>
            </form>
        </div>
    );
}

export default Login;
