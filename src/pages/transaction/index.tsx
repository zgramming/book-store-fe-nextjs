import PaginationComponent, { PaginationSize } from '@/components/PaginationComponent';
import AdminLayout from '@/components/layout/AdminLayout';
import { TransactionRepository } from '@/features/transaction/transaction.repository';
import { getErrorMessageAxios, readableDate } from '@/utils/function';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Flex,
  Grid,
  Group,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Stack,
  Table,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { useDebouncedState, useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconReceiptRefund, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface ModalDetailTransactionProps {
  id?: number;
  onClose: () => void;
  open: boolean;
}

const ModalDetailTransaction: React.FC<ModalDetailTransactionProps> = ({ id, onClose, open }) => {
  const { data: transactionData, isLoading } = TransactionRepository.hooks.useDetail(id);
  return (
    <Modal
      opened={open}
      onClose={onClose}
      title="Detail Transaksi"
      size="lg"
      scrollAreaComponent={ScrollArea.Autosize}
      overlayProps={{
        opacity: 0.55,
        blur: 3,
      }}
    >
      <Stack gap="md">
        <LoadingOverlay visible={isLoading} />
        <Table.ScrollContainer minWidth={500}>
          <Table verticalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>NO</Table.Th>
                <Table.Th>AUTHOR</Table.Th>
                <Table.Th>BOOK NAME</Table.Th>
                <Table.Th>QUANTITY</Table.Th>
                <Table.Th>STATUS</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <tbody>
              {transactionData?.TransactionDetail.map((item, index) => {
                return (
                  <Table.Tr key={item.id}>
                    <Table.Td>{index + 1}</Table.Td>
                    <Table.Td>{item.book.author}</Table.Td>
                    <Table.Td>{item.book.title}</Table.Td>
                    <Table.Td>
                      <b>{item.qty}</b>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={item.status === 'loaned' ? 'yellow' : 'green'}
                        variant={item.status === 'loaned' ? 'filled' : 'light'}
                      >
                        {item.status.toUpperCase()}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </tbody>
          </Table>
        </Table.ScrollContainer>
      </Stack>
    </Modal>
  );
};

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout title="Transaction">{page}</AdminLayout>;
};

export default function Page() {
  const { push } = useRouter();
  const [activePagination, setPagination] = useState(1);
  const [sizePagination, setSizePagination] = useState<PaginationSize>('10');
  const [searchQuery, setSearchQuery] = useDebouncedState<string | undefined>(undefined, 500);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | undefined>(undefined);
  const [isModalDetailTransactionOpen, { open: openModalDetailTransaction, close: closeModalDetailTransaction }] =
    useDisclosure(false);

  const {
    data: transactionData,
    isLoading,
    mutate: reloadTransaction,
    total,
  } = TransactionRepository.hooks.useList({
    page: activePagination,
    limit: parseInt(sizePagination),
    student_name: searchQuery,
  });

  const onReturnHandler = async (id: string) => {
    try {
      await TransactionRepository.api.returnBook(id);

      notifications.show({
        title: 'Success',
        message: 'Book has been returned successfully',
        color: 'green',
      });

      reloadTransaction();
    } catch (error) {
      const message = getErrorMessageAxios(error);
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
      });
    }
  };

  const onReturn = async (id: string) => {
    modals.openConfirmModal({
      title: 'Confirmation',
      children: `Are you sure want to confirm to return this book?`,
      labels: {
        cancel: 'Cancel',
        confirm: 'Return',
      },
      confirmProps: {
        color: 'green',
      },
      onConfirm: () => onReturnHandler(id),
      onCancel: () => {},
    });
  };

  const onOpenModalDetailTransaction = (id: number) => {
    setSelectedTransactionId(id);
    openModalDetailTransaction();
  };

  const onCloseModalDetailTransaction = () => {
    setSelectedTransactionId(undefined);
    closeModalDetailTransaction();
  };

  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    if (value.length === 0 || value === '') {
      setSearchQuery(undefined);
    } else {
      setSearchQuery(value);
    }
  };

  const onAddButton = () => {
    push({
      pathname: 'transaction/form/new',
    });
  };

  return (
    <>
      <Card withBorder>
        <Stack gap={'md'}>
          <Grid gutter={'lg'}>
            <Grid.Col
              span={{
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
                xl: 6,
              }}
            >
              <Group justify="left">
                <TextInput
                  placeholder="Cari sesuatu..."
                  rightSection={<IconSearch />}
                  defaultValue={searchQuery}
                  onChange={onChangeSearch}
                />
              </Group>
            </Grid.Col>
            <Grid.Col
              span={{
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
                xl: 6,
              }}
            >
              <Flex direction={'row'} justify={'end'} gap={'md'}>
                <Button leftSection={<IconPlus />} variant="filled" onClick={onAddButton}>
                  Tambah
                </Button>
              </Flex>
            </Grid.Col>
          </Grid>
          <Stack gap={'md'} id="table">
            <LoadingOverlay visible={isLoading} />
            <Table.ScrollContainer minWidth={500}>
              <Table verticalSpacing={'md'}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>NO</Table.Th>
                    <Table.Th>STUDENT</Table.Th>
                    <Table.Th>DATE LOAN</Table.Th>
                    <Table.Th>DATE RETURN</Table.Th>
                    <Table.Th>TRX</Table.Th>
                    <Table.Th>CREATED AT</Table.Th>
                    <Table.Th>UPDATED AT</Table.Th>
                    <Table.Th>KONTROL</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <tbody>
                  {transactionData.map((item, index) => {
                    return (
                      <Table.Tr key={item.id}>
                        <Table.Td>{index + 1}</Table.Td>
                        <Table.Td>{item.student.name}</Table.Td>
                        <Table.Td>{readableDate(item.date_loan)}</Table.Td>
                        <Table.Td>{readableDate(item.date_return)}</Table.Td>
                        <Table.Td>
                          <Button variant="subtle" size="sm" onClick={() => onOpenModalDetailTransaction(item.id)}>
                            <b>{`${item.TransactionDetail.length} Transaksi`}</b>
                          </Button>
                        </Table.Td>
                        <Table.Td>{readableDate(item.created_at)}</Table.Td>
                        <Table.Td>{readableDate(item.updated_at)}</Table.Td>
                        <Table.Td>
                          <Group gap={'md'} justify="center">
                            {item.status === 'loaned' && (
                              <Tooltip label="Return Book" position="left">
                                {/* <Button variant="outline" size="sm" onClick={() => onReturn(`${item.id}`)}>
                                  <IconReceiptRefund size="1rem" />
                                </Button> */}
                                <ActionIcon size={'lg'} color="blue" onClick={() => onReturn(`${item.id}`)}>
                                  <IconReceiptRefund />
                                </ActionIcon>
                              </Tooltip>
                            )}
                            {item.status === 'returned' && (
                              <Badge color="green" variant="filled">
                                Returned
                              </Badge>
                            )}
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </tbody>
              </Table>
            </Table.ScrollContainer>
            <PaginationComponent
              activePagination={activePagination}
              paginationSize={sizePagination}
              total={total}
              onChangePagination={setPagination}
              onChangePaginationSize={setSizePagination}
            />
          </Stack>
        </Stack>
      </Card>

      {isModalDetailTransactionOpen && (
        <ModalDetailTransaction
          id={selectedTransactionId}
          onClose={onCloseModalDetailTransaction}
          open={isModalDetailTransactionOpen}
        />
      )}
    </>
  );
}
