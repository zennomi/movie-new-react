// material
import { styled } from '@material-ui/core/styles';
import { Outlet } from 'react-router-dom';
// components
import Page from '../../components/Page';
import CartWidget from "../../components/CartWidget";

// ----------------------------------------------------------------------

const RootStyle = styled(Page)({
	marginTop: '100px',
	height: '100%'
});

const ContentStyle = styled('div')(({ theme }) => ({
	overflow: 'hidden',
	position: 'relative',
	backgroundColor: theme.palette.background.default
}));

// ----------------------------------------------------------------------

export default function LandingPage() {
	return (
		<RootStyle title="Phim đang chiếu rạp" id="move_top">
			<ContentStyle>
				<Outlet />
				<CartWidget />
			</ContentStyle>
		</RootStyle>
	);
}
