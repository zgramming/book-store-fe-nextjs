import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useForm } from '@mantine/form';
import Logo from '@images/logo.png';
import { Button, Checkbox, Group, PasswordInput, Stack, TextInput } from '@mantine/core';
import BGLogin from '@images/bg-login.png';
import { getErrorMessageAxios } from '@/utils/function';
import { notifications } from '@mantine/notifications';

export default function Page() {
  const { push } = useRouter();

  const onSubmit = async (values: any) => {
    try {
      console.log({
        username: values.username,
        password: values.password,
      });
      push('/');
    } catch (e) {
      const message = getErrorMessageAxios(e);
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
      });
    }
  };

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

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login" />
      </Head>
      <div className="flex flex-col items-stretch min-h-screen">
        <div
          className={`
        h-20 w-full shadow-md px-5
        lg:px-20
        `}
        >
          <div className="flex items-center justify-start w-full h-full ">
            <Image src={Logo} alt="Logo" width={200} />
          </div>
        </div>
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
              Masuk Agen Pegadaian
            </div>
            <div
              className={`
              text-center text-base font-medium pb-3
              lg:pb-10 lg:text-xl lg:text-left
            `}
            >
              Mengatasi Masalah tanpa Masalah
            </div>

            <Stack gap={'lg'}>
              <Stack gap={5}>
                <div className="text-base font-medium lg:text-xl">Username</div>
                <TextInput placeholder="Username" {...form.getInputProps('username')} />
              </Stack>
              <Stack gap={5}>
                <div className="text-base font-medium lg:text-xl">Password</div>
                <PasswordInput placeholder="Username" {...form.getInputProps('password')} />
              </Stack>
              <Group justify="apart">
                <Checkbox label="Remember Me" {...form.getInputProps('remember')} />
                <Button variant="subtle" color="gray">
                  Forgot Password
                </Button>
              </Group>
              <Button variant="filled" size="lg" fullWidth onClick={onSubmit}>
                Masuk
              </Button>
            </Stack>
          </div>
        </div>
      </div>
    </>
  );
}
