import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { LastLocationProvider } from 'react-router-last-location'
import Landing from './components/landing/Landing'
import Navigation from './components/Navigation'

function App() {
	return (
		<Router>
			<LastLocationProvider>
				<Switch>
					<Route path={['/choose', '/select']}>
						<Navigation></Navigation>
					</Route>
					<Route path="/">
						<Landing></Landing>
					</Route>
				</Switch>
			</LastLocationProvider>
		</Router>
	)
}

export default App