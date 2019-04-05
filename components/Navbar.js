import Rect from 'react';
import { Menu } from 'semantic-ui-react';
import Link from 'next/link';

export default props => {
	return (
		<Menu style={{ marginTop: '10px' }}>
			<Link href='/'>
				<a className='item'>BlockchainCharity</a>
			</Link>

			<Menu.Menu position='right'>
				<Link href='/'>
					<a className='item'>Home</a>
				</Link>
				<Link href='/initiatives/new'>
					<a className='item'>New</a>
				</Link>
				<Link href='/show'>
					<a className='item'>Donate</a>
				</Link>
				<Link href='/about'>
					<a className='item'>About</a>
				</Link>
			</Menu.Menu>
		</Menu>
	);
};
