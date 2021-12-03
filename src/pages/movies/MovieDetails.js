import React, { useEffect, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import clockFill from '@iconify/icons-eva/clock-fill';
import roundVerified from '@iconify/icons-ic/round-verified';
import roundVerifiedUser from '@iconify/icons-ic/round-verified-user';
import { useParams, Link } from 'react-router-dom';
// material
import { alpha, styled, useTheme } from '@material-ui/core/styles';
import { Box, Tab, Card, Grid, Divider, Skeleton, Container, Typography, Stack, Rating, Button } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
// icon
import roundAddShoppingCart from '@iconify/icons-ic/round-add-shopping-cart';
// hooks
import useIsMountedRef from '../../hooks/useIsMountedRef';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Markdown from '../../components/Markdown';
import Label from '../../components/Label';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// utils
import axios from '../../utils/axios';
import mockData from '../../utils/mock-data';
import { fShortenNumber, fCurrency } from '../../utils/formatNumber';

const MOCK_MOVIES = [...Array(5)].map((_, index) => ({
	id: mockData.id(index),
	title: mockData.text.title(index),
	image: mockData.image.feed(index),
	short: mockData.role(index),
	description: mockData.text.description(index),
}));

// ----------------------------------------------------------------------

const PRODUCT_DESCRIPTION = [
	{
		title: '100% Original',
		description: 'Chocolate bar candy canes ice cream toffee cookie halvah.',
		icon: roundVerified
	},
	{
		title: '10 Day Replacement',
		description: 'Marshmallow biscuit donut dragée fruitcake wafer.',
		icon: clockFill
	},
	{
		title: 'Year Warranty',
		description: 'Cotton candy gingerbread cake I love sugar sweet.',
		icon: roundVerifiedUser
	}
];

const IconWrapperStyle = styled('div')(({ theme }) => ({
	margin: 'auto',
	display: 'flex',
	borderRadius: '50%',
	alignItems: 'center',
	width: theme.spacing(8),
	justifyContent: 'center',
	height: theme.spacing(8),
	marginBottom: theme.spacing(3),
	color: theme.palette.primary.main,
	backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}`
}));

// ----------------------------------------------------------------------

const SkeletonLoad = (
	<Grid container spacing={3}>
		<Grid item xs={12} md={6} lg={7}>
			<Skeleton variant="rectangular" width="100%" sx={{ paddingTop: '100%', borderRadius: 2 }} />
		</Grid>
		<Grid item xs={12} md={6} lg={5}>
			<Skeleton variant="circular" width={80} height={80} />
			<Skeleton variant="text" height={240} />
			<Skeleton variant="text" height={40} />
			<Skeleton variant="text" height={40} />
			<Skeleton variant="text" height={40} />
		</Grid>
	</Grid>
);

export default function MovieDetails() {
	const theme = useTheme();
	const { themeStretch } = useSettings();
	const isMountedRef = useIsMountedRef();

	const { maphim } = useParams();

	const [movie, setMovie] = useState();

	const getMovie = useCallback(async () => {
		try {
			const response = await axios.get(`/api/phim/${maphim}`);
			if (isMountedRef.current) {
				setMovie(response.data.result);
			}
		} catch (err) {
			//
		}
	}, [isMountedRef]);

	useEffect(() => {
		getMovie();
	}, [getMovie]);
	// const movie = MOCK_MOVIES[maphim];

	const [value, setValue] = useState('1');

	const handleChangeTab = (event, newValue) => {
		setValue(newValue);
	};
	
	return (
		<Page title={movie?.title}>
			<Container maxWidth={themeStretch ? false : 'lg'}>
				<HeaderBreadcrumbs
					heading={movie?.tenphim}
					links={[
						{ name: 'Phim rạp', href: '/movies' },
						{ name: movie ? sentenceCase(movie.ten) : '' }
					]}
				/>
				{movie && (
					<>
						<Card>
							<Grid container sx={{ p: 2 }} spacing={3}>
								<Grid item xs={12} md={3} lg={4}>
									<Card>
										<img src={movie.bia} alt="movie poster" />
									</Card>
									{/* <ProductDetailsCarousel /> */}
								</Grid>
								<Grid item xs={12} md={9} lg={8}>
									{/* <ProductDetailsSumary /> */}
									<Label
										variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
										color={movie.ma === 'in_stock' ? 'success' : 'error'}
										sx={{ textTransform: 'uppercase' }}
									>
										{sentenceCase(movie.theloai)}
									</Label>
									<Typography
										variant="overline"
										sx={{
											mt: 2,
											mb: 1,
											display: 'block',
											color: movie.short === 'sale' ? 'error.main' : 'info.main'
										}}
									>
										{movie.thoigian}
									</Typography>

									<Typography variant="h5" paragraph>
										{movie.ten}
									</Typography>
									<Stack spacing={0.5} direction="row" alignItems="center" sx={{ mb: 2 }}>
										<Rating value={movie.danhgia} precision={0.1} readOnly />
										<Typography variant="body2" sx={{ color: 'text.secondary' }}>
											({fShortenNumber(10)}
											reviews)
										</Typography>
									</Stack>
									<Typography paragraph>
										{movie.noidung}
									</Typography>
									<Divider sx={{ borderStyle: 'dashed' }} />
									<Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mt: 5 }}>
										<Button
											fullWidth
											disabled={false}
											size="large"
											type="button"
											color="warning"
											variant="contained"
											startIcon={<Icon icon={roundAddShoppingCart} />}
											// onClick={}
											component={Link}
											to={`/movies/book?maphim=${maphim}`}
											sx={{ whiteSpace: 'nowrap' }}
										>
											Mua vé
										</Button>
										<Button 
										fullWidth
										size="large"
										type="submit"
										variant="contained"
										href={movie.trailer}
										target="_blank"
										>
											Trailer
										</Button>
									</Stack>
								</Grid>
							</Grid>
						</Card>

						<Grid container sx={{ my: 8 }}>
							{PRODUCT_DESCRIPTION.map((item) => (
								<Grid item xs={12} md={4} key={item.title}>
									<Box sx={{ my: 2, mx: 'auto', maxWidth: 280, textAlign: 'center' }}>
										<IconWrapperStyle>
											<Icon icon={item.icon} width={36} height={36} />
										</IconWrapperStyle>
										<Typography variant="subtitle1" gutterBottom>
											{item.title}
										</Typography>
										<Typography sx={{ color: 'text.secondary' }}>{item.description}</Typography>
									</Box>
								</Grid>
							))}
						</Grid>

						<Card>
							<TabContext value={value}>
								<Box sx={{ px: 3, bgcolor: 'background.neutral' }}>
									<TabList onChange={handleChangeTab}>
										<Tab disableRipple value="1" label="Description" />
										<Tab
											disableRipple
											value="2"
											label={`Review (${movie})`}
											sx={{ '& .MuiTab-wrapper': { whiteSpace: 'nowrap' } }}
										/>
									</TabList>
								</Box>

								<Divider />

								<TabPanel value="1">
									<Box sx={{ p: 3 }}>
										<Markdown children={movie.description} />
									</Box>
								</TabPanel>
								<TabPanel value="2">
									{/* <ProductDetailsReview product={product} /> */}
								</TabPanel>
							</TabContext>
						</Card>
					</>
				)}
			</Container>
		</Page>
	)
}