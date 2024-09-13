import {
    Box,
    Loader,
    Avatar,
    Table,
    Text,
    Title,
    Flex,
    Paper,
    Button,
    Modal,
    TextInput,
    Grid,
    NumberInput,
    MultiSelect,
    Select,
    TagsInput,
    Group,
    Tooltip,
    UnstyledButton,
    Center,
    rem,
    Pagination,
    Checkbox,
    Container
} from '@mantine/core'
import axios from 'axios';
import { useEffect, useState } from 'react';
import HeaderMenu from './HeaderMenu';
import { useNavigate, useParams } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import { IoPersonAddOutline, IoPersonOutline } from "react-icons/io5";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { useDisclosure } from "@mantine/hooks";
import { MdAlternateEmail, MdAttachMoney, MdEditCalendar, MdOutlineDeleteForever } from "react-icons/md";
import { TbCategoryPlus, TbCategory } from "react-icons/tb";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { DatePickerInput } from '@mantine/dates';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons-react';
import { GrMoney } from "react-icons/gr";

function checkEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email) || email === '' | email === null;
}

function AddNewMember(props) {
    const {uid, title, users} = props;
    const [newMember, setNewMember] = useState(null);
    const [newEmail, setNewEmail] = useState(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [status, setStatus] = useState(null);
    const [nameError, setNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    
    const handleAddButton = async(e) => {
        e.preventDefault();
        const inValidMember = newMember === null;
        setNameError(nameError||inValidMember);
        if (!inValidMember && !nameError && !emailError)
        {
            try {
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + localStorage.getItem('token')
                }
                const response = await axios.post(`/users/${uid}/budgets/${title}/add/member/`, {
                    newMember,
                    newEmail
                },{
                    headers: headers
                });
                setStatus(response.status);
            } catch (e) {
                console.error('Creation failed:', e);
            }
        }

    }

    useEffect(()=>{
        const inValidMember = newMember === '' || users.includes(newMember);
        const invalidEmail = !checkEmail(newEmail);
        setEmailError(invalidEmail);
        setNameError(inValidMember);
        setStatus(null);
    }, [newMember, newEmail]);

    return (
        <>
            <Modal size={'xl'} opened={opened} onClose={close} title={<Text>Add new member to the budget ({<span style={{color:'red'}}>*</span>}<span style={{fontSize:'15px', color:'gray'}}>: required field</span>)</Text>} centered>
                {(emailError || nameError) && <Text c='red' size='md' ta="left" mb='md'>Invalid member name or email</Text>}
                {(status===201) && <Text c='blue' size='md' ta="left" mb='md'>Successfully add new member: "{newMember}"</Text>}
                <Grid>
                    <Grid.Col span={5}>
                        <TextInput
                            placeholder='New member name'
                            label='Name'
                            required
                            leftSection={<IoPersonOutline size={20}/>}
                            error={nameError}
                            onChange={(e)=>setNewMember(e.target.value)}
                            
                        />
                    </Grid.Col>
                    <Grid.Col span={7}>
                        <TextInput
                            placeholder='Email'
                            label='Email'
                            leftSection={<MdAlternateEmail/>}
                            error={emailError}
                            onChange={(e)=>setNewEmail(e.target.value)}
                        />
                    </Grid.Col>
                </Grid>
                <Button mt={'md'} type="submit" variant='outline' fw={'normal'} onClick={handleAddButton}>Add</Button>
            </Modal>
            <Button
                    mt='xl'
                    variant='default'
                    fw={'normal'}
                    leftSection={<IoPersonAddOutline size={20}/>}
                    onClick={open}
                >
                    Add member
            </Button>
        </>
    )
}

function NewSession(props) {
    const {uid, title, users, createdCategories} = props;
    // console.log(createdCategories)
    const [opened, { open, close }] = useDisclosure(false);
    const [status, setStatus] = useState(null);
    const [nOutcome, setNOutcome] = useState(0);
    const [newCategories, setNewCategories] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [categories, setCategories] = useState(createdCategories);
    const [outcomes, setOutcomes] = useState([]);
    const [error, setError] = useState(false);
    const [date, setDate] = useState(null)

    function updateCostChange(i, value) {
        let index = outcomes.findIndex(e => e.index === i);
        let updatedOutcomes = [...outcomes];
        if (index === -1) {
            updatedOutcomes.push({index: i, cost: value});
        } else {
            updatedOutcomes[index].cost = value;
        }
        setOutcomes(updatedOutcomes);
    }

    function updateCategoryChange(i, cat) {
        let index = outcomes.findIndex(e => e.index === i);
        let updatedOutcomes = [...outcomes];
        if (index === -1) {
            updatedOutcomes.push({index: i, category: cat});
        } else {
            updatedOutcomes[index].category = cat;
        }
        setOutcomes(updatedOutcomes);
    }

    useEffect(() => {
        let er = outcomes.length !== nOutcome;
        er = er || outcomes.some((e)=> e.category === null) || date === '';
        setError(er);
    }, [nOutcome, date, outcomes]);

    // console.log(outcomes, error, nOutcome, date);

    const handleAddSessionSummit = async (e) => {
        if (!error) {
            let updatedOutcomes = [...outcomes];
            updatedOutcomes.forEach((elt)=> {
                if (elt.cost === undefined) elt.cost = 0;
            })
            setOutcomes(updatedOutcomes);
            try {
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + localStorage.getItem('token')
                }
                const response = await axios.post(`/users/${uid}/budgets/${title}/add/session/`, {
                    outcomes,
                    date,
                    newCategories,
                    participants
                }, {headers: headers});

                setStatus(response.status);
                if (response.status === 201) window.location.reload();//navigate(`/users/${uid}/budgets/${title}/detail/`)

            } catch (e) {
                console.log(e);
                setError(true);
            }
        }
    }

    const outcomeInputs = [...Array(nOutcome).keys()].map(i => (
        <Grid key={i}>
            <Grid.Col span={8}>
                <Select id={`category${i}`}
                    placeholder='Pick the category'
                    mb='md'
                    leftSection={<TbCategory/>}
                    data={categories}
                    searchable
                    onChange={(e) => updateCategoryChange(i,e)}
                />
            </Grid.Col>

            <Grid.Col span={4}>
                <NumberInput id={`cost.${i}`}
                    placeholder='Cost'
                    leftSection={<MdAttachMoney/>}
                    mb='md'
                    onChange={(e) => updateCostChange(i,e)}
                />
            </Grid.Col>
        </Grid>
    ));

    // console.log(participantInputs)

    return (
        <>
            <Modal size={'lg'} opened={opened} onClose={close} title='Add new session to the budget' centered>
               { error && <Text c='red'>Date or category missing</Text>}
               <DatePickerInput
                    mt='md'
                    placeholder='Pick date'
                    label='Session Date'
                    required
                    leftSection={<MdEditCalendar/>}
                    onChange={(e) => setDate(e.toDateString())}
               />
                <MultiSelect
                    mt='md'
                    label='Participants'
                    placeholder='Pick name'
                    data={users}
                    leftSection={<IoPersonAddOutline/>}
                    hidePickedOptions
                    onChange={setParticipants}
                />
                <TagsInput
                    mt='md'
                    label='Enter to submit new category'
                    description='Update the categories if do not find in select box'
                    placeholder='New category'
                    // data={createdCategories}
                    leftSection={<TbCategoryPlus/>}
                    // value={categories}
                    onChange={(cats)=> {
                        setNewCategories(cats)
                        setCategories([...new Set([...createdCategories, ...cats])])
                    }}
                />
                <NumberInput
                    min={0}
                    maw={200} mt='md' mb='md'
                    placeholder='Number of outcomes'
                    onChange={setNOutcome}
                    leftSection={<AiOutlineFieldNumber/>}
                />
                {outcomeInputs}
                <Button mt={'md'} type="submit" variant='outline' fw={'normal'} onClick={handleAddSessionSummit}>
                    Add
                </Button>
            </Modal>
            <Button
                    mt='md'
                    variant='default'
                    fw={'normal'}
                    leftSection={<IoMdAdd size={20}/>}
                    onClick={open}
                >
                    New session
            </Button>
        </>
    );

}

function SessionInfo(props) {
    const {data, uid, title, onDelete} = props;
    const [sorted, setSorted] = useState(false);
    const [reverseSort, setReverseSort] = useState(false);
    const [sortedData, setSortedData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(()=> {
        setSortedData([...data])
    },[data]);

    function sortByDate(data, reverse=false) {
        return [...data].sort((a,b) => {
            if (reverse) {
                return b.date.localeCompare(a.date)
            } else {
                return a.date.localeCompare(b.date)
            }
        });
    }

    function onSort() {
        const reverse = !reverseSort;
        setReverseSort(reverse);
        setSorted(true);
        setSortedData(sortByDate(data, reverse));
    };


    const Icon = sorted ? (reverseSort ? IconChevronUp : IconChevronDown) : IconSelector;
    const sessionHeader = (
        <UnstyledButton onClick={onSort}>
            <Group justify="space-between">
                <Text fw={500} fz="md">Date</Text>
                <Center>
                    <Icon style={{ width: rem(16), height: rem(16) }} />
                </Center>
            </Group>
        </UnstyledButton>
    )

    const deleteOnClick = async (e) => {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token')
            }
            const queryParams = new URLSearchParams();
            (selectedRows.length > 0) && selectedRows.forEach(id => {
                queryParams.append('id', id);
            });
            const response = await axios.delete(`/users/${uid}/budgets/${title}/delete/session/?${queryParams.toString()}`, {
            }, {headers: headers});

            if (response.status === 200) onDelete(data.filter((session) => !selectedRows.includes(session.id)))
        
        } catch (e) {
            console.log(e);
        }

    }

    const deleteButton = (
        <UnstyledButton
            title='Delete selected session'
            onClick={deleteOnClick}
        >
            <MdOutlineDeleteForever size={28} color='var(--mantine-color-gray-7)'/>
        </UnstyledButton>
            
    )

    const headerFileds = [
        {name: 'check', width: '3%'},
        {name: 'Date', width: '15%'},
        {name: 'Number of participant', width: '15%'},
        {name: 'Cost', width: '10%'},
        {name: 'Participants', width: '50%'},
    ];

    const tableHeader = headerFileds.map((header, i) => (
        <Table.Th key={i} width={header.width}>
            {
                header.name==='Date' 
                ? sessionHeader
                :(header.name==='check'
                    ? deleteButton
                    : <Text>{header.name}</Text>
                )
            }
        </Table.Th>
    ));

    const participantsRender = (participants) => (
        <Avatar.Group gap='xl'>
            {participants.slice(0,8).map((name)=> (
                <Tooltip key={name} label={name} withArrow>
                    <Avatar mr='xs' key={name} name={name} color="initials" />
                </Tooltip>
            ))}
            {participants.length>8 && <Tooltip
                withArrow
                label = {participants.slice(8,participants.length).map((name)=>(
                    <div key={name}>{name}</div>
                ))}
        
            >
                <Avatar>+{participants.length-5}</Avatar>
            </Tooltip>
            }
        </Avatar.Group>

    );

    // console.log(sortedData, data)

    const rowDatas = sortedData.map((session, i) => (
        <Table.Tr key={i}
            bg={selectedRows.includes(session.id) ? 'var(--mantine-color-blue-light)' : undefined}
        >
            <Table.Td>
                <Checkbox
                    aria-label="Select row"
                    checked={selectedRows.includes(session.id)}
                    onChange={(event) =>
                        setSelectedRows(
                        event.currentTarget.checked
                            ? [...selectedRows, session.id]
                            : selectedRows.filter((id) => id !== session.id)
                        )
                    }
                />
            </Table.Td>
            <Table.Td>{new Date(session.date).toDateString()}</Table.Td>
            <Table.Td>{session.participants.length}</Table.Td>
            <Table.Td>{session.cost}</Table.Td>
            <Table.Td>{participantsRender(session.participants)}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Table striped highlightOnHover mt='xl'>
            <Table.Thead>
                <Table.Tr>
                    {tableHeader}
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {rowDatas}
            </Table.Tbody>
        </Table>
    )
}


function BudgetInfo() {
    const {uid, title} = useParams();
    const [loaded, setLoaded] = useState(false);
    const [amount, setAmount] = useState(0);
    const [memberNames, setMemberNames] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [budget, setBudget] = useState(null);
    const [categories, setCategories] = useState([]);
    const [numPage, setNumPage] = useState(0); 
    const [selectedNames, setSelectedNames] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const navigate = useNavigate();

    useEffect(()=> {
        async function fetchData(){
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token')
            }
            
            try {
                const queryParams = new URLSearchParams();
                if (currentPage !== 1) queryParams.append('page', currentPage.toString())
                if (selectedNames.length > 0) {
                    selectedNames.forEach((name)=>{
                        queryParams.append('name', name);
                    })
                }
                
                startDate && queryParams.append('start', new Date(startDate).toDateString());
                endDate && queryParams.append('end', new Date(endDate).toDateString());

                const response = await axios.get(`/users/${uid}/budgets/${title}/detail/?${queryParams.toString()}`, {headers:headers});
                // console.log(response);
                setAmount(response.data.amount);
                setMemberNames(response.data.participants);
                setSessions(response.data.sessions.data);
                setBudget(response.data.budget);
                setCategories(response.data.categories);
                setNumPage(response.data.sessions.num_page);
                setLoaded(true);
            } catch (e) {
                console.log(e)
            }    
        }
        fetchData();
         
    }, [loaded, currentPage, numPage, selectedNames, startDate, endDate, sessions.data]);

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

    const summary = (
        <Flex direction='row' gap='xl'>
            <Paper withBorder shadow="md" p={30} radius="md" mt='md'>
                <Table>
                    <Table.Thead></Table.Thead>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td>Amount</Table.Td>
                            <Table.Td>{amount}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td>Number of participants</Table.Td>
                            <Table.Td>{memberNames.length}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td>Start</Table.Td>
                            <Table.Td>{new Date(budget.start).toLocaleDateString()}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td>Last balance reset</Table.Td>
                            <Table.Td>{new Date(budget.start_base).toLocaleDateString()}</Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </Paper>
            <Flex direction='column'>
                <AddNewMember
                    uid={uid}
                    title={title}
                    users={memberNames}
                />
                <NewSession
                    uid={uid}
                    title={title}
                    users={memberNames}
                    createdCategories={categories}
                />
                <Button
                    mt='md'
                    variant='default'
                    fw={'normal'}
                    leftSection={<FaMoneyBillTransfer size={20}/>}
                    onClick={()=> navigate(`/users/${uid}/budgets/${title}/balance/`)}
                >
                    Get balance
                </Button>
            </Flex>
            <Flex direction='column'>
                <MultiSelect
                    mt='md'
                    label='Select the names to show in session table'
                    placeholder='Pick name'
                    data={memberNames}
                    leftSection={<IoPersonAddOutline/>}
                    hidePickedOptions
                    onChange={setSelectedNames}
                />
                <Flex direction='row' gap='lg'>
                    <DatePickerInput
                        mt='md'
                        placeholder='Pick date'
                        label='From Date'
                        description='Filter by date'
                        leftSection={<MdEditCalendar/>}
                        onChange={(e) => e ? setStartDate(e.toDateString()): setStartDate(null)}
                        clearable
                />

                    <DatePickerInput
                        mt='md'
                        placeholder='Pick date'
                        label='To Date'
                        description='Filter by date'
                        leftSection={<MdEditCalendar/>}
                        onChange={(e) => e ? setEndDate(e.toDateString()): setEndDate(null)}
                        clearable
                />
               </Flex>

            </Flex>
        </Flex>
    )

    return (
        <div>
            <HeaderMenu/>
            <Box ml={'15%'} mr={'15%'} >
                <Group justify='space-between'>
                    <Title c={'blue.5'} mt={'xl'} ml={'xs'} order={3}>
                        {title}
                    </Title>
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
                </Group>
                {summary}
                <SessionInfo
                    data={sessions}
                    uid={uid}
                    title={title}
                    onDelete={setSessions}
                />
                <Pagination
                    mt='md'
                    total={numPage}
                    boundaries={1}
                    onChange={setCurrentPage}
                />
            </Box>
        </div>
    );
}

export default BudgetInfo;