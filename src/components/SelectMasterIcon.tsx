// import { MasterIconRepository } from '@/features/setting/master_icon/master_icon.repository';
// import { Combobox, Group, Input, InputBase, ScrollArea, Stack, Text, useCombobox } from '@mantine/core';
// import { useEffect, useState } from 'react';
// import Image from 'next/image';
// import { FileRepository } from '@/features/common/file/file.repository';

// type CustomSelectOptionProps = {
//   id_inc: number;
//   nama_icon: string;
//   filename?: string;
// };
// const CustomSelectOption = ({ id_inc, nama_icon, filename }: CustomSelectOptionProps) => {
//   const [imageDataUrl, setImageDataUrl] = useState<any>(null);

//   useEffect(() => {
//     const fetchIcon = async () => {
//       const result = await FileRepository.hooks.useGet(filename);
//       if (result) {
//         setImageDataUrl(result);
//       }
//     };

//     fetchIcon();
//   }, [filename]);

//   return (
//     <Combobox.Option value={`${id_inc}`} key={id_inc}>
//       <Group gap={'md'}>
//         {!imageDataUrl && <div>loading...</div>}
//         {imageDataUrl && <Image src={imageDataUrl} alt="Divider Modul" width={30} height={30} />}

//         {/* {<Image src={data ?? IconSubModul} alt="Divider Modul" width={30} height={30} />} */}
//         <Text size="sm">{nama_icon}</Text>
//       </Group>
//     </Combobox.Option>
//   );
// };

// type SelectMasterIconProps = {
//   value: string | null;
//   // eslint-disable-next-line no-unused-vars
//   onChange?: (value: string) => void;
// };
// const SelectMasterIcon = ({ value, onChange }: SelectMasterIconProps) => {
//   const { items: iconData } = MasterIconRepository.hooks.useListMasterIcon({
//     page: 1,
//     pageSize: 100,
//   });

//   const [search, setSearch] = useState('');
//   const combobox = useCombobox({
//     onDropdownClose: () => {
//       combobox.resetSelectedOption();
//       combobox.focusTarget();
//       setSearch('');
//     },

//     onDropdownOpen: () => {
//       combobox.focusSearchInput();
//     },
//   });

//   const [val, setVal] = useState<string | null>(null);
//   const selectedValue = iconData.find((item) => `${item.id_inc}` === val);

//   const [imageDataUrl, setImageDataUrl] = useState<any>(null);

//   const options = iconData
//     .filter((item) => item.nama_icon.toLowerCase().includes(search.toLowerCase().trim()))
//     .map((item) => (
//       <CustomSelectOption key={item.id_inc} id_inc={item.id_inc} nama_icon={item.nama_icon} filename={item.url_icon} />
//     ));

//   useEffect(() => {
//     if (!selectedValue?.url_icon) {
//       return;
//     }
//     const fetchIcon = async () => {
//       const result = await FileRepository.hooks.useGet(selectedValue?.url_icon);
//       if (result) {
//         setImageDataUrl(result);
//       }
//     };

//     fetchIcon();
//   }, [selectedValue?.url_icon]);

//   useEffect(() => {
//     if (value) {
//       setVal(value);
//     }

//     return () => {};
//   }, [value]);

//   return (
//     <Stack gap={5}>
//       <Text size="sm" fw={500}>
//         Icon
//       </Text>
//       <Combobox
//         store={combobox}
//         withinPortal={false}
//         onOptionSubmit={(val) => {
//           setVal(val);
//           onChange && onChange(val);
//           combobox.closeDropdown();
//         }}
//       >
//         <Combobox.Target>
//           <InputBase
//             component="button"
//             type="button"
//             pointer
//             rightSection={<Combobox.Chevron />}
//             onClick={() => combobox.toggleDropdown()}
//             rightSectionPointerEvents="none"
//           >
//             {val && imageDataUrl && (
//               <Group gap={'md'}>
//                 <Image src={imageDataUrl} alt="Divider Modul" width={30} height={30} />
//                 <Text size="sm">{selectedValue?.nama_icon}</Text>
//               </Group>
//             )}
//             {!val && <Input.Placeholder>Pilih Icon</Input.Placeholder>}
//           </InputBase>
//         </Combobox.Target>

//         <Combobox.Dropdown>
//           <Combobox.Search
//             value={search}
//             onChange={(event) => setSearch(event.currentTarget.value)}
//             placeholder="Cari Icon"
//           />
//           <Combobox.Options>
//             <ScrollArea.Autosize type="scroll" mah={200}>
//               {options.length > 0 ? options : <Combobox.Empty>Nothing found</Combobox.Empty>}
//             </ScrollArea.Autosize>
//           </Combobox.Options>
//         </Combobox.Dropdown>
//       </Combobox>
//     </Stack>
//   );
// };

// export default SelectMasterIcon;
