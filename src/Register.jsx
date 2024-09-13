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
import React, { useState } from 'react';
import axios from 'axios';	
import { useNavigate } from 'react-router-dom';
import { useViewportSize } from '@mantine/hooks';
import HeaderMenu from './HeaderMenu';


function RegisterForm() {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password1, setPassword1] = useState('');
	const [password2, setPassword2] = useState('');
	const [error, setError] = useState(null);

	const navigate = useNavigate();

	const handleSubmit = async (e) => {	
		e.preventDefault();
		try {
			const response = await axios.post('/signup/', {
				username,
				email,
				password1,
				password2
			},{
				headers: {'Content-Type': 'application/json'}
			});
			navigate('/login');
		} catch (e) {
			console.error('Login failed:', e);
			setError(e.response ? e.response.data.error : 'No Internet')
		}
	};
	return (
		<Container size={420} my={40}>
			<Title ta="center">
				Welcome to QClub!
			</Title>
			<Text c="dimmed" size="sm" ta="center" mt={5}>
				You have already an account?
				<Anchor size="sm" component="button" onClick={(e)=>{navigate('/login')}}>
					Log In
				</Anchor>
			</Text>

			<Paper withBorder shadow="md" p={30} mt={30} radius="md">
				{	error &&
					<Text c='red' size='md' ta="left" mb='md'>
						{error}
					</Text>
				}
				
				<TextInput
					label="Username" placeholder="Your username" required mb="md"
					onChange={(e) => setUsername(e.target.value)}
				/>
				<TextInput
					label="Email" placeholder="Your Email" required
					onChange={(e) => setEmail(e.target.value)}
				/>
				<PasswordInput
					label="Password" placeholder="Your password" required mt="md" 
					onChange={(e) => setPassword1(e.target.value)}
				/>
				<PasswordInput
					label="Confirm password" placeholder="Confirm your password" required mt="md" 
					onChange={(e) => setPassword2(e.target.value)}
				/>
				<Button fullWidth mt="xl" type='submit' onClick={handleSubmit}>
					Register
				</Button>
			</Paper>
		</Container>
	);
}

function Register() {
	return (
		<>
			<HeaderMenu/>
			<RegisterForm />
		</>
	);
}
export default Register