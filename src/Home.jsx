import { Box,
    Container, 
    Group, 
    Text,
    Flex,
    Image,
    Paper,
    List,
    ThemeIcon,
    Grid,
    Button
} from "@mantine/core";
import HeaderMenu from "./HeaderMenu";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import allBudgetImage from './assets/allBudget.png'
import budgetInfoImage from './assets/budgetInfo.png'
import balanceImage from './assets/balance.png'
import { GrMoney } from "react-icons/gr";
import { MdOutlineSportsKabaddi } from "react-icons/md";
import { FaMoneyBillTransfer } from "react-icons/fa6";

function Home() {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(()=> {
        setIsAuth(localStorage.getItem('token') !== null);
    },[]);


    const intro = (
        <>
        <Text
            size="lg"
            fw={500}
            c={'indigo'}
        >
            Managing finances can be a challenge, especially when you're doing it with others.
            Whether you're splitting expenses with your group of friends, sharing costs with your co-workers, 
            ClubBudget is here to simplify the process.
            Our user-friendly platform allows you to effortlessly track, manage, and share budgets in real-time.
        </Text>
        </>
    )
    const demo = (
        <>
        <Flex justify={'center'} mb={'xl'} mt={'xl'}>
                <Paper withBorder shadow="md" p={30} mt={30} mr='md' radius="md">
                    <Image
                        src={budgetInfoImage}
                        h={'auto'} w={'auto'}
                    />
                </Paper> 
                
        </Flex>
        <Paper withBorder shadow="md" p={30} mt={30} mr='md' mb='xl' radius="md">
        <iframe
                    allow="autoplay"
                    allowFullScreen
                    title="Demo"
                    height='100%'  width='100%'
                    src="https://www.youtube.com/embed/4wPtLNOpups?si=_3mG1C2FsGeuuuLS"
                />
        </Paper>
        
        </>
    )

    const listCanDo = [
        {icon: GrMoney, description: 'List a summary of all budgets and filter by title'},
        {icon: MdOutlineSportsKabaddi, description: 'Show all club sessions and explore various options: Add a new participant, new session, category, and more.'},
        {icon: FaMoneyBillTransfer, description: 'Just click to view the amount contributed by each club member for every period.'},
    ]
    
    const cando = (
        <>
        <Text size="lg"  fw={500} c={'indigo'} mb='md' mt='md'> With ClubBudget you can: </Text>
        <List
            spacing="xs"
            size="xs"
            center
        >
            {
                listCanDo.map((elt,i) => (
                    <List.Item key={i}
                        icon={
                            <ThemeIcon variant="light" size={24} radius="xl">
                                <elt.icon size={20}/>
                            </ThemeIcon>
                        }
                    >
                        <Text size="lg" fw={500} c={'indigo'}>
                            {elt.description}
                        </Text>
                    </List.Item>

                ))
            }

        </List>
        </>
    )

    
    return (
        <> 
            <HeaderMenu/>
            <Box ml='15%' mr='15%'>
                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    {intro}

                    {cando}
                </Paper>
                {demo}
            </Box>
            
        </>
    )
}

export default Home