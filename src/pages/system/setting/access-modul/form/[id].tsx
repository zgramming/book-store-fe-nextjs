import AccessModulTransferList, { TransferListDataType } from '@/components/AccessModulTransferList';
import AdminLayout from '@/components/layout/AdminLayout';
import { AuthenticationContext } from '@/context/AuthenticationContext';
import { AccessModulRepository } from '@/features/access-modul/access-modul.repository';
import { AccessModulCreateDTO } from '@/features/access-modul/dto/access-modul-create.dto';
import { RoleRepository } from '@/features/role/role.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, TextInput, Group, Button, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useContext, useEffect, useState } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Access Modul">{page}</AdminLayout>;

const delimiter = '|||';

export default function Page() {
  const { jwtPayload } = useContext(AuthenticationContext);
  const form = useForm({
    initialValues: {
      code: '',
      name: '',
    },
    validate: {},
  });
  const { back, query, isReady } = useRouter();

  const { id, action } = query;
  const isEdit = action === 'edit';
  const { setFieldValue } = form;

  const { data: dataGroup, isLoading: isLoadingGroup } = RoleRepository.hooks.useById(id as string | undefined);
  const [dataTransfer, setDataTransfer] = useState<[TransferListDataType[], TransferListDataType[]]>([[], []]);
  const { data: dataSelectedModul } = AccessModulRepository.hooks.useByRole(id as string | undefined);

  const handleTransfer = (transferFrom: number, options: TransferListDataType[]) => {
    return setDataTransfer((current) => {
      const transferTo = transferFrom === 0 ? 1 : 0;
      const transferFromData = current[transferFrom].filter((item) => !options.includes(item));
      const transferToData = [...current[transferTo], ...options];

      const result = [];
      result[transferFrom] = transferFromData;
      result[transferTo] = transferToData;
      return result as [TransferListDataType[], TransferListDataType[]];
    });
  };

  const onSubmit = async (values: any) => {
    try {
      if (!dataGroup) return;

      const userId = jwtPayload?.userId ?? 0;
      const [unselectedModul, selectedModul] = dataTransfer;

      const mapping: AccessModulCreateDTO[] = selectedModul.map((item) => {
        const [appModulId, appCategoryModulId] = item.value.split(delimiter);

        return {
          role_id: dataGroup.id,
          app_modul_id: +appModulId,
          app_category_modul_id: +appCategoryModulId,
          created_by: userId,
        };
      });

      console.log({
        values,
        unselectedModul,
      });

      await AccessModulRepository.api.create(mapping);

      notifications.show({
        title: 'Success',
        message: `Berhasil ${isEdit ? 'mengubah' : 'menambahkan'} data`,
        color: 'green',
      });

      back();
    } catch (error) {
      const message = getErrorMessageAxios(error);
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
      });
    }
  };

  // Set initial value for form
  useEffect(() => {
    if (!isReady) return;

    if (dataGroup) {
      setFieldValue('code', dataGroup.code);
      setFieldValue('name', dataGroup.name);
    }

    return () => {};
  }, [dataGroup, isReady, setFieldValue]);

  // Set initial value for transfer list
  useEffect(() => {
    if (!isReady) return;

    if (dataSelectedModul.dataExists && dataSelectedModul.dataNotExists) {
      const dataExist = dataSelectedModul.dataExists;
      const dataNotExist = dataSelectedModul.dataNotExists;

      const dataSelected = dataExist.map((item) => {
        const group = `${item.app_category_modul.name} (${item.app_category_modul.code})`;
        const dataModul = {
          value: `${item.id}`,
          label: item.name,
          group,
        };
        return dataModul;
      });

      const dataNotSelected = dataNotExist.map((item) => {
        const group = `${item.app_category_modul.name} (${item.app_category_modul.code})`;

        // Format value = app_modul_id|||app_category_modul_id
        const combinationValue = `${item.id}${delimiter}${item.app_category_modul_id}`;
        const dataModul = {
          value: combinationValue,
          label: item.name,
          group,
        };
        return dataModul;
      });

      const result: [TransferListDataType[], TransferListDataType[]] = [dataNotSelected ?? [], dataSelected ?? []];

      setDataTransfer(result);
    }

    return () => {};
  }, [dataSelectedModul.dataExists, dataSelectedModul.dataNotExists, isReady]);

  return (
    <>
      <LoadingOverlay visible={isLoadingGroup} />
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap={'xl'}>
          <Card withBorder>
            <Group justify="right">
              <Button onClick={back} variant="default">
                Kembali
              </Button>
              <Button type="submit">Simpan</Button>
            </Group>
          </Card>
          <Card withBorder>
            <Card.Section withBorder inheritPadding py={'sm'} mb={'sm'}>
              Card Section
            </Card.Section>
            <Stack gap={'md'}>
              <TextInput placeholder="Your Code" label="Group Code" disabled {...form.getInputProps('code')} />
              <TextInput placeholder="Your role" label="Group Name" disabled {...form.getInputProps('name')} />
              <Group align="center" style={{ marginTop: 10, marginBottom: 10 }}>
                <Stack gap={'md'}>
                  <div className="font-semibold">Unselected Access</div>
                  <AccessModulTransferList
                    options={dataTransfer[0]}
                    type="forward"
                    onTransfer={(val) => handleTransfer(0, val)}
                  />
                </Stack>
                <Stack gap={'md'}>
                  <div className="font-semibold">Selected Access</div>
                  <AccessModulTransferList
                    options={dataTransfer[1]}
                    type="backward"
                    onTransfer={(val) => handleTransfer(1, val)}
                  />
                </Stack>
              </Group>
            </Stack>
          </Card>
        </Stack>
      </form>
    </>
  );
}
