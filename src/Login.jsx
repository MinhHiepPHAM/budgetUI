import HeaderMenu from "./HeaderMenu";
import React, { useState } from 'react';
import axios from 'axios';	
import { useNavigate } from 'react-router-dom';
import {
    TextInput,
    PasswordInput,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Button,
	Box,
} from '@mantine/core';

import { useViewportSize } from '@mantine/hooks';

function LoginForm() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {	
		e.preventDefault();
		try {
			const response = await axios.post('/login/', {
				username,
				password,
			},{
				headers: {'Content-Type': 'application/json'}
			});
			// console.log(response.data)
			
			localStorage.clear();
			localStorage.setItem('token', response.data.token);
			localStorage.setItem('username', username);
			localStorage.setItem('uid',response.data.uid)
			navigate(`/users/${response.data.uid}/budgets/all/`);
		} catch (e) {
			// console.error('Login failed:', e);
			setError('Invalid username or password');
		}
	};
	return (
		<Container size={420} my={40}>
			<Title ta="center">
				Welcome back!
			</Title>
			<Text c="dimmed" size="sm" ta="center" mt={5}>
				Do not have an account yet?
				<Anchor size="sm" component="button" onClick={(e)=>navigate('/signup')}>
					Create account
				</Anchor>
			</Text>

			<Paper withBorder shadow="md" p={30} mt={30} radius="md">
				{	error &&
					<Text c='red' size='md' ta="left" mb='md'>
						{error}
					</Text>
				}
				<TextInput
					label="Username" placeholder="Your username" required
					onChange={(e) => setUsername(e.target.value)}
				/>
				<PasswordInput
					label="Password" placeholder="Your password" required mt="md" 
					onChange={(e) => setPassword(e.target.value)}
					/>
				{/* <Group justify="space-between" mt="lg"> */}
					{/* <Checkbox label="Remember me" /> */}
                <Anchor component="button" size="sm">
                    Forgot password?
                </Anchor>
				{/* </Group> */}
				<Button fullWidth mt="xl" type='submit' onClick={handleSubmit}>
					Sign in
				</Button>
			</Paper>
		</Container>
	);
}

function Login() {
	// const { height, width } = useViewportSize();
	return (
		<>
			<HeaderMenu/>
			<LoginForm />
		</>
	);
}
export default Login