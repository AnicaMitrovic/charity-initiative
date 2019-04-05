import Rect from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import { Container } from 'semantic-ui-react';
//import Style from '../css/';

/*
            <link
            rel="stylesheet"
            href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
            />

            				<link
					rel='stylesheet'
					href='//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css'
				/>
            */

export default props => {
	return (
		<Container>
			<Head>
				<link
					rel='stylesheet'
					href='//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css'
				/>
				<link rel='stylesheet' href='../style.css' />
			</Head>
			<Navbar />
			{props.children}
		</Container>
	);
};
