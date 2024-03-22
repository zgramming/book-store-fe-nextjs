import AccessModulTransferList, { TransferListDataType } from '@/components/AccessModulTransferList';
import AdminLayout from '@/components/layout/AdminLayout';
import { GroupRepository } from '@/features/setting/group/group.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, TextInput, Group, Button, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Access Modul">{page}</AdminLayout>;

export default function Page() {
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

  const { data: dataGroup, isLoading: isLoadingGroup } = GroupRepository.hooks.useByIdGroup(id as string | undefined);
  const [dataTransfer, setDataTransfer] = useState<[TransferListDataType[], TransferListDataType[]]>([[], []]);
  const { data: dataSelectedModul } = GroupRepository.hooks.useListgroupForAppModul(id as string | undefined);

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
      console.log({
        id,
        values,
        isEdit,
        setFieldValue,
      });

      const [unselectedModul, selectedModul] = dataTransfer;
      const dataAccess = {
        select_data: selectedModul.map((it) => it.value),
        un_select_data: unselectedModul.map((it) => it.value),
        group_id: dataGroup?.kodeGroup,
      };

      await GroupRepository.api.updateAccessModuleGroup(dataAccess);

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

  useEffect(() => {
    if (!isReady) return;

    if (dataSelectedModul) {
      const dataSelected = dataSelectedModul?.dataExist?.map((item: any) => {
        const group = `${item.category?.namaKategori} (${item.category?.kodeKategori})`;
        const dataModul = {
          value: `${item.kodeModul}`,
          label: item.namaModul,
          group,
        };
        return dataModul;
      });

      const dataNotSelected = dataSelectedModul?.dataNotExist?.map((item: any) => {
        const group = `${item.category?.namaKategori} (${item.category?.kodeKategori})`;
        const dataModul = {
          value: `${item.kodeModul}`,
          label: item.namaModul,
          group,
        };
        return dataModul;
      });
      console.log({
        dataNotSelected,
        dataSelected,
      });
      const result: [TransferListDataType[], TransferListDataType[]] = [dataNotSelected ?? [], dataSelected ?? []];

      setDataTransfer(result);
    }

    if (dataGroup) {
      setFieldValue('code', `${dataGroup?.kodeGroup}`);
      setFieldValue('name', `${dataGroup?.namaGroup}`);
    }

    return () => {};
  }, [dataGroup, dataSelectedModul, isReady, setFieldValue]);

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
