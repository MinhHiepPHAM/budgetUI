import {
    Box,
    Loader,
    Table,
    Text,
    Title,
    Flex,
    MultiSelect,
    ScrollArea,
    Button,
    Group
} from '@mantine/core'
import axios from 'axios';
import { useEffect, useState } from 'react';
import HeaderMenu from './HeaderMenu';
import { useNavigate, useParams } from 'react-router-dom';
import { IoPersonOutline } from "react-icons/io5";
import { MdEditCalendar } from "react-icons/md";
import { DatePickerInput } from '@mantine/dates';
import { TableHeader } from './TableSort';
import { RiSave3Fill } from "react-icons/ri";
import { GrMoney } from "react-icons/gr";
import { GiReturnArrow } from "react-icons/gi";

function sortData(data, sortBy, reverse) {
    return [...data].sort((a,b) => {
        if (reverse) {
            return b[sortBy] > a[sortBy]
        } else {
            return a[sortBy] > b[sortBy]
        }
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function BalanceMilestone(props) {
    const {milestones} = props;
    const [sortBy, setSortBy] = useState(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [sortedData, setSortedData] = useState([]);

    function onSort(field) {
        const reverse = field === sortBy ? !reverseSortDirection: false
        setReverseSortDirection(reverse);
        setSortBy(field);
        setSortedData(sortData(milestones, field, reverse));
    };

    useEffect(()=> {
        setSortedData([...milestones])
    },[milestones]);

    const rowDatas = sortedData.map((data,i) => (
        <Table.Tr key={i}>
            <Table.Td>{new Date(data.date).toDateString()}</Table.Td>
            <Table.Td>{new Date(data.start).toDateString()}</Table.Td>
            <Table.Td>{new Date(data.terminate).toDateString()}</Table.Td>
        </Table.Tr>
    ));

    const fields = [
        {name: 'date', display: 'Date'},
        {name: 'start', display: 'From'},
        {name: 'terminate', display: 'To'},
    ];

    const headers = fields.map((field)=> (
        <TableHeader key={field.name}
            sorted={sortBy === field.name}
            reversed={reverseSortDirection}
            onSort={()=>onSort(field.name)}
        >
            {field.display}
        </TableHeader>
    ));

    return (
        <>
        <Text ta='center' c='blue' fz={19}>Last Balance check</Text>
        <Table striped highlightOnHover withTableBorder mt='lg'>
            <Table.Thead>
                <Table.Tr>
                    {headers}
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {rowDatas}
            </Table.Tbody>
        </Table>
        </>
    ) 

}

function BalanceTable(props) {
    const {balances} = props;
    const [sortBy, setSortBy] = useState(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [sortedData, setSortedData] = useState([]);

    function onSort(field) {
        const reverse = field === sortBy ? !reverseSortDirection: false
        setReverseSortDirection(reverse);
        setSortBy(field);
        setSortedData(sortData(balances, field, reverse));
    };

    useEffect(()=> {
        setSortedData([...balances])
    },[balances]);

    const rowDatas = sortedData.map((data) => (
        <Table.Tr key={data.name}>
            <Table.Td>{data.name}</Table.Td>
            <Table.Td>{data.cost}</Table.Td>
        </Table.Tr>
    ));

    const fields = [
        {name: 'name'},
        {name: 'cost'},
    ];

    const headers = fields.map((field)=> (
        <TableHeader key={field.name}
            sorted={sortBy === field.name}
            reversed={reverseSortDirection}
            onSort={()=>onSort(field.name)}
        >
            {capitalizeFirstLetter(field.name)}
        </TableHeader>
    ));

    return (
        <>
        <Text ta='center' c='blue' fz={19}>Balance</Text>
        <Table striped highlightOnHover withTableBorder mt='lg'>
            <Table.Thead>
                <Table.Tr>
                    {headers}
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {rowDatas}
            </Table.Tbody>
        </Table>
        </>
    ) 
}

function SaveBalanceMilestone(props) {
    const {uid, title} = useParams();
    const {start, end} = props;

    const handleSaveDate = async (e) => {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token')
            }
            const response = await axios.post(`/users/${uid}/budgets/${title}/balance/save/`, {
                start,
                end
            },{
                headers: headers
            });
            (response.status === 201) && window.location.reload() // TODO: change to reload only the last balance check table
        } catch (e) {
            console.error('Failed:', e);
        }
    } 

    return (
        <>
            <Button
                mt='md'
                maw={120}
                title='Save the from/to date'
                variant='default'
                fw={'normal'}
                leftSection={<RiSave3Fill size={20}/>}
                onClick={handleSaveDate}
            >
                Save
            </Button>
        </>
    )

}

function Balance() {
    const {uid, title} = useParams();
    const [loaded, setLoaded] = useState(false);
    const [amount, setAmount] = useState(0);
    const [selectedNames, setSelectedNames] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [balances, setBalances] = useState([]);
    const [milestones, setMilestones] = useState([]);
    const [participants, setParticipants] = useState([]);
    const navigate = useNavigate()

    useEffect(()=> {
        async function fetchData(){
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token')
            }
            
            try {
                const queryParams = new URLSearchParams();
                if (selectedNames.length > 0) {
                    selectedNames.forEach((name)=>{
                        queryParams.append('name', name);
                    })
                }
                
                startDate && queryParams.append('start', new Date(startDate).toDateString());
                endDate && queryParams.append('end', new Date(endDate).toDateString());

                const response = await axios.get(`/users/${uid}/budgets/${title}/balance/?${queryParams.toString()}`, {headers:headers});

                setBalances(response.data.balances);
                setMilestones(response.data.milestones);
                setParticipants(response.data.participants);
                setStartDate(new Date(response.data.first).toDateString());
                setEndDate(new Date(response.data.last).toDateString());
                setLoaded(true);
            } catch (e) {
                console.log(e)
            }    
        }
        fetchData();
         
    }, [loaded, selectedNames, startDate, endDate]);

    if (!loaded) {
        return (
            <Box>
                <HeaderMenu/>
                <Box ml={'15%'} mr={'15%'} >
                    <Loader  ml='50%' mt='10%' color="blue" />
                </Box>
            </Box>
        )
    }

    return (
        <>
            <HeaderMenu/>
            <Box ml={'15%'} mr={'15%'} >
                <Group justify='space-between'>
                    <Title c={'blue.5'} ml={'xs'} order={3}>
                            {title}
                    </Title>
                    <Flex direction='column'>
                        <Button
                            mt='xl'
                            maw={200}
                            variant='default'
                            fw={'normal'}
                            leftSection={<GrMoney size={20}/>}
                            onClick={()=> {navigate(`/users/${uid}/budgets/all/`)}}
                        >
                            All Budgets
                        </Button>
                        <Button
                            mt='xs'
                            maw={200}
                            variant='default'
                            fw={'normal'}
                            leftSection={<GiReturnArrow size={20}/>}
                            onClick={()=> {navigate(`/users/${uid}/budgets/${title}/detail/`)}}
                        >
                            Return to budget
                        </Button>
                    </Flex>
                </Group>
                <Flex direction='row'>
                    <Flex direction='column'>
                        <MultiSelect
                            maw={180} mt='xl' mr='xl'
                            label='Filter by participant name'
                            placeholder='Pick name'
                            data={participants}
                            leftSection={<IoPersonOutline/>}
                            hidePickedOptions
                            onChange={setSelectedNames}
                        />
                        <Flex direction='row' gap='lg'>
                            <DatePickerInput
                                mt='md'
                                placeholder='Pick date'
                                label='From Date'
                                description='Filter by date'
                                value={new Date(startDate)}
                                leftSection={<MdEditCalendar/>}
                                onChange={(e) => e ? setStartDate(e.toDateString()): setStartDate(null)}
                                clearable
                            />

                            <DatePickerInput
                                mt='md' mr='xl'
                                placeholder='Pick date'
                                label='To Date'
                                description='Filter by date'
                                value={new Date(endDate)}
                                leftSection={<MdEditCalendar/>}
                                onChange={(e) => e ? setEndDate(e.toDateString()): setEndDate(null)}
                                clearable
                            />
                        </Flex>
                       <SaveBalanceMilestone
                            start={startDate}
                            end={endDate}
                       />
                    </Flex>

                    <ScrollArea mah={600} mr='xl'>
                        <BalanceTable
                            balances={balances}
                            start={startDate}
                            end={endDate}
                        />
                    </ScrollArea>

                    <ScrollArea mah={600}>
                        <BalanceMilestone
                            milestones={milestones}
                        />
                    </ScrollArea>        
                </Flex>
            </Box>
        </>
    );

}

export default Balance;