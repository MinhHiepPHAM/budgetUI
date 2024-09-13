import {
    Group,
    Button,
    Image,
    Avatar,
    Text,
    Flex,
    UnstyledButton
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import pageLogo from './assets/samuraiX.png'
import axios from 'axios';
import { IoLogInOutline } from "react-icons/io5";
import { MdPersonPin } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import { GrMoney } from "react-icons/gr";
import { RiRefund2Line } from "react-icons/ri";

function NotLoggedIn() {
    return (
        <Flex direction={'row'} gap='md' mr='xl'>
            <Button
                href="/login"
                component='a'
                fw={'normal'}
                bg={'white'} c={'blue'}
                rightSection={<IoLogInOutline size={20} />}
            >
                Sign In
            </Button>
            <Button
                href="/signup"
                component='a'
                bg={'white'} c={'blue'}
                fw={'normal'}
                rightSection={<MdPersonPin size={20} />}
            >
                Sign Up
            </Button>
        </Flex>
    )
}

function LoggedIn({username, uid}) {
    const navigate = useNavigate()
    const logoutHandle = (e) =>{
        try {
                axios.post('/logout/', {
                    token : localStorage.getItem('token')
                },{ headers: {
                    'Content-Type': 'import { GrMoney } from "react-icons/gr";application/json',
                    'Authorization': 'Token ' + localStorage.getItem('token')
                }
              });
              
                localStorage.removeItem('username');
                localStorage.removeItem('token');
                localStorage.removeItem('uid');
                navigate('/login')
        } catch (error) {
              console.error('Logout failed:', error);
        }
    }
    return (
    <Flex direction={'row'} gap='md' mr='xl'>
        <a href={`/users/${uid}/budgets/all/`}>
            <Avatar
                title='Budgets'
                color='blue' ml={'10px'} variant='white' radius="xl"
            >
                <GrMoney size={22}/>
            </Avatar>
        </a>
        <Button
            onClick={logoutHandle}
            bg={'white'} c={'blue'}
            fw={'normal'}
            rightSection={<MdLogout size={19} />}
        >
            Log Out
        </Button>
    </Flex>
    )
}

function HeaderMenu() {
    const username = localStorage.getItem('username')
    const uid = localStorage.getItem('uid')
    const isAuthenticated = localStorage.getItem('token') !== null
    const navigate = useNavigate();
  
    return (
        <Group justify="space-between" bg='var(--mantine-color-blue-4)'>
            <a href='/' title='Home'><Image src={pageLogo} h={65} w={65} radius={'50%'}/></a>
            {isAuthenticated ? <LoggedIn username={username} uid={uid}/> : <NotLoggedIn/>}
        </Group>
    );
}

export default HeaderMenu;