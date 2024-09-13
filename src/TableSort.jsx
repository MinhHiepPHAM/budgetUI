import {
    Table,
    UnstyledButton,
    Text,
    TextInput,
    rem,
    Group,
    Center,
} from '@mantine/core';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons-react';


export function TableHeader({ children, reversed, sorted, onSort, width }) {
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    return (
    <Table.Th w={width}>
        <UnstyledButton onClick={onSort}>
            <Group justify="space-between">
                <Text fw={500} fz="md">
                    {children}
                </Text>
                <Center>
                    <Icon style={{ width: rem(16), height: rem(16) }} />
                </Center>
            </Group>
        </UnstyledButton>
    </Table.Th>
    );
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function TableSort(props) {
    const {rowDatas, fieldConfigs, searchQuery, onSearchChange, sortBy, reverseSortDirection, onSort} = props;

    return (
        <>
        <TextInput
            placeholder="Search by title"
            mb="md" mt='xl'
            leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }}/>}
            value={searchQuery}
            onChange={onSearchChange}
        />

        <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed" striped highlightOnHover>
            <Table.Thead>
                <Table.Tr>
                {fieldConfigs.map((field,i) => (
                    <TableHeader key={i}
                        sorted={sortBy === field.name}
                        reversed={reverseSortDirection}
                        onSort={()=>onSort(field.name)}
                        width={field.width}
                    >
                        {capitalizeFirstLetter(field.name)}
                    </TableHeader>
                ))}
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {rowDatas.length > 0 ? (
                    rowDatas
                ) : (
                    <Table.Tr>
                        <Table.Td>
                            <Text fw={500} ta="center">
                                Nothing found
                            </Text>
                        </Table.Td>
                    </Table.Tr>
                )}
            </Table.Tbody>
        </Table>
        </>
    )


}


export default TableSort;