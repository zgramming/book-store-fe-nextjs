import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useForm } from '@mantine/form';
import { Button, Checkbox, Group, PasswordInput, Stack, TextInput } from '@mantine/core';
import { getErrorMessageAxios } from '@/utils/function';
import { notifications } from '@mantine/notifications';
import BGLogin from '@/images/bg-login.png';
import { AuthenticationRepository } from '@/features/authentication/authentication.repository';
import { useContext } from 'react';
import { AuthenticationContext } from '@/context/AuthenticationContext';

export default function Page() {
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value: string) => {
        if (!value) {
          return 'Username harus diisi';
        }
        return null;
      },
      password: (value: string) => {
        if (!value) {
          return 'Password harus diisi';
        }
        return null;
      },
    },
  });

  const { push } = useRouter();
  const { setToken } = useContext(AuthenticationContext);

  const onSubmit = async (values: any) => {
    console.log(values);

    const dataLogin: any = {
      username: values.username,
      password: values.password,
    };

    try {
      console.log({ dataLogin });

      const response = await AuthenticationRepository.api.login(dataLogin);
      const data = response.data;
      const { token } = data;
      if (!token) {
        throw new Error('Login Invalid, Token not found');
      }

      // // Set Cookie
      setToken(token);

      push('/');
    } catch (e) {
      const message = getErrorMessageAxios(e);
      notifications.show({
        title: 'Error',
        message: message,
        color: 'red',
        autoClose: 5000,
      });
    }
  };

  return (
    <>
      <Head>
        <title>CMS Template - Login</title>
        <meta
          name="description"
          content="CMS Template merupakan aplikasi berbasis web yang digunakan untuk mengelola konten website. Aplikasi ini memiliki fitur yang memudahkan pengguna dalam mengelola konten website seperti menambah, mengedit, menghapus konten website."
        />
        <meta property="og:title" content="CMS Tempalte" />
        <meta property="og:type" content="CMS Tempalte" />
        <meta property="og:image:url" content="https://picsum.photos/400" />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="400" />
        <meta property="og:image:alt" content="CMS Tempalte Image" />
        <meta
          property="og:description"
          content="CMS Template merupakan aplikasi berbasis web yang digunakan untuk mengelola konten website. Aplikasi ini memiliki fitur yang memudahkan pengguna dalam mengelola konten website seperti menambah, mengedit, menghapus konten website."
        />
      </Head>
      <div className="flex flex-col items-stretch min-h-screen">
        <div className="grow bg-white flex flex-row">
          <div
            className={`
          hidden
          lg:block lg:grow lg:basis-4/12
          `}
          >
            <div className="relative w-full h-full rounded-tr-[5%]">
              <Image
                src={BGLogin}
                alt="Logo"
                className="rounded-tr-[5%]"
                style={{
                  objectFit: 'cover',
                }}
                fill
              />
            </div>
          </div>
          <div
            className={`
            grow basis-8/12 flex flex-col justify-center px-5
            lg:basis-8/12 lg:px-40
          `}
          >
            <div
              className={`
            text-black-custom text-2xl text-center font-bold pb-3
              lg:pb-3 lg:text-left lg:text-4xl
            `}
            >
              Masuk Sistem Aplikasi
            </div>
            <div
              className={`
              text-center text-base font-medium pb-3
              lg:pb-10 lg:text-xl lg:text-left
            `}
            >
              Silahkan masukkan username dan password anda
            </div>

            <form onSubmit={form.onSubmit(onSubmit)}>
              <Stack gap={'lg'}>
                <Stack gap={5}>
                  <div className="text-base font-medium lg:text-xl">Username</div>
                  <TextInput placeholder="Username" {...form.getInputProps('username')} />
                </Stack>
                <Stack gap={5}>
                  <div className="text-base font-medium lg:text-xl">Password</div>
                  <PasswordInput placeholder="Password" {...form.getInputProps('password')} />
                </Stack>
                <Group justify="apart">
                  <Checkbox label="Remember Me" {...form.getInputProps('remember')} />
                  <Button variant="subtle" color="gray">
                    Forgot Password
                  </Button>
                </Group>
                <Button type="submit" variant="filled" size="lg" fullWidth>
                  Masuk
                </Button>
              </Stack>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
