import React, { useEffect, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import clockFill from '@iconify/icons-eva/clock-fill';
import roundVerified from '@iconify/icons-ic/round-verified';
import roundVerifiedUser from '@iconify/icons-ic/round-verified-user';
import { useParams, Link } from 'react-router-dom';
import ReactPlayer from 'react-player/youtube'
// material
import { alpha, styled, useTheme } from '@material-ui/core/styles';
import { Box, Card, Grid, Divider, Container, Typography, Stack, Rating, Button, Skeleton } from '@material-ui/core';
// icon
import roundAddShoppingCart from '@iconify/icons-ic/round-add-shopping-cart';
// hooks
import useIsMountedRef from '../../hooks/useIsMountedRef';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import LoadingScreen from '../../components/LoadingScreen';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const PRODUCT_DESCRIPTION = [
	{
		title: 'Thanh toán online 100%',
		description: 'Bằng thẻ ngân hàng, Momo, Viettelpay.',
		icon: roundVerified
	},
	{
		title: 'Đặt vé trước 1 ngày',
		description: 'Đặt xong xem. Easy.',
		icon: clockFill
	},
	{
		title: 'Không cần đăng nhập',
		description: 'Nhận mã QR hoá đơn & vé. Quy đổi tại rạp.',
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
	}, [isMountedRef, maphim]);

	useEffect(() => {
		getMovie();
	}, [getMovie]);

	return (
		<Page title={movie?.ten}>
			<Container maxWidth={themeStretch ? false : 'lg'}>
				<HeaderBreadcrumbs
					heading={movie?.tenphim || ""}
					links={[
						{ name: 'Phim rạp', href: '/movies' },
						{ name: movie ? (movie.ten).toUpperCase() : '' }
					]}
				/>
				{movie ? (
					<>
						<Card sx={{ mb: 2 }}>
							<Grid container sx={{ p: 2 }} spacing={3}>
								<Grid item xs={12} md={3} lg={4}>
									<Card>
										<img src={movie.bia} alt="movie poster" />
									</Card>
								</Grid>
								<Grid item xs={12} md={9} lg={8}>
									<Stack direction="row" spacing={2}>
										{
											movie.theloai.map(genre => (
												<Label
													key={genre}
													variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
													color="primary"
													sx={{ textTransform: 'uppercase' }}
												>
													{(genre).toUpperCase()}
												</Label>
											))
										}
									</Stack>
									<Stack
										direction="row"
										spacing={2}
										sx={{ mt: 2, mb: 1 }}>
										<Typography
											variant="h5"
										>
											{movie.ten.toUpperCase()}{" "}
										</Typography>
										<Rating value={movie.danhgia} precision={0.1} readOnly />
									</Stack>
									<Stack
										direction="row"
										spacing={2}
										sx={{ mb: 1 }}
									>
										<Label
											variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
											color="primary"
											sx={{ textTransform: 'uppercase' }}
										>
											{`${movie.thoigian} phút`}
										</Label>
										<Label
											variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
											color="error"
											sx={{ textTransform: 'uppercase' }}
										>
											{movie.rate}
										</Label>
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
									<Grid container sx={{ my: 4 }}>
										{PRODUCT_DESCRIPTION.map((item) => (
											<Grid item xs={12} md={4} key={item.title}>
												<Box sx={{ mx: 'auto', textAlign: 'center' }}>
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
								</Grid>
							</Grid>
						</Card>
						<Card sx={{ mb: 2 }} style={{ position: "relative", paddingTop: "56.25%" }}>
							{movie?.trailer && <ReactPlayer url={movie.trailer} width='100%' height='100%' style={{ position: 'absolute', top: 0, left: 0 }} />}
						</Card>

					</>
				) :
				<LoadingScreen sx={{backgroundColor: 'transperent', minHeight: 500}} />
			
			}
			</Container>
		</Page>
	)
}