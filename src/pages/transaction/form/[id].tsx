import AdminLayout from '@/components/layout/AdminLayout';
import { InventoryRepository } from '@/features/inventory/inventory.repository';
import { MasterStudentRepository } from '@/features/master-student/master-student.repository';
import { TransactionRepository } from '@/features/transaction/transaction.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, Grid, TextInput, Group, Button, LoadingOverlay, Table, Select, Badge } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCalendar, IconMinus, IconPlus } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';

interface SelectedItem {
  book_id: string;
  book_author: string;
  book_title: string;
  quantity: number;
}

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Transaction">{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {
      student_id: undefined as string | undefined,
      date_loan: undefined as Date | undefined,
      date_return: undefined as Date | undefined,
    },
    validate: {
      student_id: (value) => (value ? undefined : 'Student ID is required'),
      date_loan: (value) => (value ? undefined : 'Date Loan is required'),
      date_return: (value) => (value ? undefined : 'Date Return is required'),
    },
  });
  const { back, query, isReady } = useRouter();

  const { id } = query;
  const { setFieldValue } = form;
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  const { data: masterBookData, isLoading } = MasterStudentRepository.hooks.useById(id as string | undefined);
  const { data: masterStudentData } = MasterStudentRepository.hooks.useList({
    limit: 100,
    page: 1,
  });
  const { data: inventoryData, isLoading: isLoadingInventory } = InventoryRepository.hooks.useList({
    limit: 100,
    page: 1,
  });

  const calculateDurationLoan = () => {
    const dateLoan = form.values.date_loan;
    const dateReturn = form.values.date_return;

    if (dateLoan && dateReturn) {
      const duration = dayjs(dateReturn).diff(dayjs(dateLoan), 'day');
      return `${duration} days`;
    }
  };

  const onAddItem = (item: SelectedItem) => {
    setSelectedItems((prev) => {
      const isExist = prev.find((prevItem) => prevItem.book_id === item.book_id);

      if (isExist) {
        return prev.map((prevItem) => {
          if (prevItem.book_id === item.book_id) {
            return {
              ...prevItem,
              quantity: prevItem.quantity + 1,
            };
          }

          return prevItem;
        });
      }

      return [...prev, item];
    });
  };

  const onRemoveItem = (item: SelectedItem) => {
    setSelectedItems((prev) => {
      const book = prev.find((prevItem) => prevItem.book_id === item.book_id);

      if (book) {
        if (book.quantity === 1) {
          return prev.filter((prevItem) => prevItem.book_id !== item.book_id);
        }

        return prev.map((prevItem) => {
          if (prevItem.book_id === item.book_id) {
            return {
              ...prevItem,
              quantity: prevItem.quantity - 1,
            };
          }

          return prevItem;
        });
      }

      return prev;
    });
  };

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        setFieldValue,
      });

      if (selectedItems.length === 0) {
        notifications.show({
          title: 'Error',
          message: 'Please select at least 1 item',
          color: 'red',
        });
        return;
      }

      const payload = {
        student_id: values.student_id,
        date_loan: dayjs(values.date_loan).format('YYYY-MM-DD'),
        date_return: dayjs(values.date_return).format('YYYY-MM-DD'),
        items: selectedItems.map((item) => ({
          book_id: +item.book_id,
          quantity: item.quantity,
        })),
      };

      await TransactionRepository.api.create(payload);

      notifications.show({
        title: 'Success',
        message: 'Data berhasil disimpan',
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

  // Initialize form value
  useEffect(() => {
    if (!isReady) return;

    if (masterBookData) {
      setFieldValue('name', masterBookData.name);
      setFieldValue('nim', masterBookData.nim);
      setFieldValue('status', masterBookData.status);
    }

    return () => {};
  }, [isReady, masterBookData, setFieldValue]);

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap={'xl'}>
          <LoadingOverlay visible={isLoading} />
          <Card withBorder>
            <Group justify="right">
              <Button onClick={back} variant="default">
                Kembali
              </Button>
            </Group>
          </Card>

          <Card withBorder>
            <Card.Section withBorder inheritPadding py={'sm'} mb={'sm'}>
              Form Transaction
            </Card.Section>
            <Grid gutter={'xl'} grow>
              <Grid.Col
                span={{
                  xs: 12,
                  sm: 12,
                  md: 12,
                  lg: 8,
                  xl: 8,
                }}
              >
                <Stack gap={'md'}>
                  <Card withBorder>
                    <Card.Section withBorder inheritPadding py={'sm'} mb={'sm'}>
                      TRANSACTION INFORMATION
                    </Card.Section>
                    <Stack gap={'md'}>
                      <Select
                        label="Student"
                        placeholder="Choose Student"
                        data={masterStudentData.map((item) => ({
                          value: `${item.id}`,
                          label: `${item.nim} - ${item.name}`,
                        }))}
                        nothingFoundMessage="No options"
                        searchable
                        clearable
                        {...form.getInputProps('student_id')}
                      />
                      <DateInput
                        rightSection={<IconCalendar />}
                        label="Date Loan"
                        placeholder="Date Loan"
                        valueFormat="YYYY-MM-DD"
                        {...form.getInputProps('date_loan')}
                      />
                      <DateInput
                        rightSection={<IconCalendar />}
                        label="Date Return"
                        placeholder="Date Return"
                        valueFormat="YYYY-MM-DD"
                        {...form.getInputProps('date_return')}
                      />
                      <TextInput value={calculateDurationLoan()} label="Duration Loan" disabled />
                    </Stack>
                  </Card>
                  <Card withBorder>
                    <Card.Section withBorder inheritPadding py={'sm'} mb={'sm'}>
                      BOOK STOCK INFORMATION
                    </Card.Section>
                    <Table.ScrollContainer minWidth={500}>
                      <LoadingOverlay visible={isLoadingInventory} />
                      <Table verticalSpacing={'md'}>
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th>NO</Table.Th>
                            <Table.Th>AUTHOR</Table.Th>
                            <Table.Th>BOOK</Table.Th>
                            <Table.Th>LOCATION</Table.Th>
                            <Table.Th>INITIAL STOCK</Table.Th>
                            <Table.Th>CURRENT STOCK</Table.Th>
                            <Table.Th>ACTION</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {inventoryData.map((item, index) => {
                            return (
                              <Table.Tr key={item.id}>
                                <Table.Td>{index + 1}</Table.Td>

                                <Table.Td>{item.book.author}</Table.Td>
                                <Table.Td>{item.book.title}</Table.Td>
                                <Table.Td>{item.location}</Table.Td>
                                <Table.Td>{item.stock}</Table.Td>
                                <Table.Td>{item.current_stock}</Table.Td>
                                <Table.Td>
                                  <Group gap={'md'}>
                                    <Button
                                      size="xs"
                                      variant="filled"
                                      color="green"
                                      onClick={() =>
                                        onAddItem({
                                          book_id: `${item.book.id}`,
                                          book_title: item.book.title,
                                          book_author: item.book.author,
                                          quantity: 1,
                                        })
                                      }
                                    >
                                      <IconPlus size={16} />
                                    </Button>

                                    <Button
                                      size="xs"
                                      variant="filled"
                                      color="red"
                                      onClick={() =>
                                        onRemoveItem({
                                          book_id: `${item.book.id}`,
                                          book_title: item.book.title,
                                          book_author: item.book.author,
                                          quantity: 1,
                                        })
                                      }
                                    >
                                      <IconMinus size={16} />
                                    </Button>
                                  </Group>
                                </Table.Td>
                              </Table.Tr>
                            );
                          })}
                        </Table.Tbody>
                      </Table>
                    </Table.ScrollContainer>
                  </Card>
                </Stack>
              </Grid.Col>
              <Grid.Col
                span={{
                  xs: 12,
                  sm: 12,
                  md: 12,
                  lg: 4,
                  xl: 4,
                }}
              >
                <Stack gap={'md'}>
                  <Card withBorder>
                    <Card.Section withBorder inheritPadding py={'sm'} mb={'sm'}>
                      SUMMARY TRANSACTION
                    </Card.Section>
                    <Stack gap={'md'}>
                      {selectedItems.map((item, index) => {
                        return (
                          <Card key={item.book_id} withBorder>
                            <Card.Section withBorder inheritPadding py={'sm'} mb={'sm'}>
                              <b>{item.book_author}</b>
                            </Card.Section>
                            <Group justify="space-between">
                              <div>{`${index + 1}. ${item.book_title}`}</div>
                              <Badge color="blue">x{item.quantity}</Badge>
                            </Group>
                          </Card>
                        );
                      })}

                      {selectedItems.length === 0 && <div className="text-center">No data</div>}
                      {selectedItems.length > 0 && (
                        <Button type="submit" size="md">
                          Simpan
                        </Button>
                      )}
                    </Stack>
                  </Card>
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>
        </Stack>
      </form>
    </>
  );
}
