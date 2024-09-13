// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/dates/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import {DEFAULT_THEME, MantineProvider, createTheme, mergeThemeOverrides } from '@mantine/core';
import axios from 'axios';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import CreateNewBudget from './CreateNewBudget';
import AllBugets from './AllBugets';
import BudgetInfo from './BudgetInfo';
import Balance from './Balance';

const themeOverride = createTheme({
	autoContrast : true,
	luminanceThreshold: 0.66,
	focusRing: 'auto',
	defaultRadius:'sm',
	cursorType: 'pointer',
	primaryShade:6
})
const myTheme = mergeThemeOverrides(DEFAULT_THEME, themeOverride);

export default function App() {
  	return <MantineProvider theme={myTheme}>
		{
			<BrowserRouter>
				<div className="App">	
					<main>
						<Routes>
							<Route path="/login" element={<Login/>} />
							<Route path="/signup" element={<Register/>} />
							<Route path="/" element={<Home/>} />
							<Route path='/users/:uid/budgets/create' element={<CreateNewBudget/>} />
							<Route path='/users/:uid/budgets/all' element={<AllBugets/>} />
							<Route path='/users/:uid/budgets/:title/detail' element={<BudgetInfo/>} />
							<Route path='/users/:uid/budgets/:title/balance' element={<Balance/>} />
						</Routes>
					</main>
				</div>
			</BrowserRouter>
		}</MantineProvider>;
}