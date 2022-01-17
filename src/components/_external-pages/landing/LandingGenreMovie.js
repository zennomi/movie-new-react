import Slider from 'react-slick';
import PropTypes from 'prop-types';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { alpha, useTheme, styled } from '@material-ui/core/styles';
import { Box, Card, CardActionArea, CardContent, CardHeader, Paper, Grid, Typography, Container, Link, Icon, Skeleton } from '@material-ui/core';
import arrowForwardFill from '@iconify/icons-eva/arrow-forward-fill';
// utils
import axios from '../../../utils/axios';
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
//
import { varFadeInUp, MotionInView, varFadeInDown } from '../../animate';
import { CarouselControlsArrowsBasic2 } from '../../carousel/controls';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
	overflow: 'hidden',
	position: 'relative',
	paddingTop: theme.spacing(15),
	[theme.breakpoints.up('md')]: {
		paddingBottom: theme.spacing(15)
	}
}));

const ImgStyle = styled('img')(({ theme }) => ({
	top: 0,
	width: '100%',
	height: '100%',
	objectFit: 'cover',
	position: 'absolute',
	transition: theme.transitions.create('all')
}));
// ----------------------------------------------------------------------

export default function LandingHotMovie() {
	const theme = useTheme();
	const [anime, setAnime] = useState([]);
	const [actionMovies, setActionMovies] = useState([]);
	const isMountedRef = useIsMountedRef();

	const getAnime = useCallback(async () => {
		try {
			const response = await axios.get(`/api/phim?theloai=${encodeURIComponent("Hoạt hình")}`)
			if (isMountedRef.current) {
				setAnime(response.data.results);
			}
		} catch (err) {
			//
		}
	}, [isMountedRef]);

	useEffect(() => {
		getAnime();
	}, [getAnime]);

	const getActionMovies = useCallback(async () => {
		try {
			const response = await axios.get(`/api/phim?theloai=${encodeURIComponent("Hành động")}`)
			if (isMountedRef.current) {
				setActionMovies(response.data.results);
			}
		} catch (err) {
			//
		}
	}, [isMountedRef]);

	useEffect(() => {
		getActionMovies();
	}, [getActionMovies]);

	return (
		<RootStyle>
			<Container maxWidth="lg">
				<Box sx={{ mb: { xs: 5, md: 10 } }}>
					<MotionInView variants={varFadeInUp}>
						<Typography component="p" variant="overline" sx={{ mb: 2, color: 'text.secondary', textAlign: 'center' }}>
							Movie New
						</Typography>
					</MotionInView>
					<MotionInView variants={varFadeInDown}>
						<Typography variant="h2" sx={{ textAlign: 'center' }}>
							Thể loại hay
						</Typography>
					</MotionInView>
				</Box>
				<Grid container spacing={2}>
					<Grid item xs={12} md={6}>
						<Card>
							<CardHeader title="Phim hoạt hình" />
							<CardContent>
								<Grid container spacing={1}>
									{
										anime.map(movie => (
											<Grid item xs={12} md={6}>

												<RouterLink to={`/movies/${movie.ma}`}>
													<Paper
														sx={{
															mx: 1,
															mb: 2,
															borderRadius: 2,
															overflow: 'hidden',
															paddingTop: 'calc(4/3 * 100%)',
															position: 'relative',
															'&:hover img': {
																width: '120%',
																height: '120%'
															}
														}}
													>
														<ImgStyle src={movie.bia} alt={movie.ten} />
													</Paper>
												</RouterLink>
											</Grid>
										))
									}
								</Grid>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} md={6}>
						<Card>
							<CardHeader title="Phim hành động hay" />
							<CardContent>
								<Grid container spacing={1}>
									{
										actionMovies.map(movie => (
											<Grid item xs={12} md={6}>

												<RouterLink to={`/movies/${movie.ma}`}>
													<Paper
														sx={{
															mx: 1,
															mb: 2,
															borderRadius: 2,
															overflow: 'hidden',
															paddingTop: 'calc(4/3 * 100%)',
															position: 'relative',
															'&:hover img': {
																width: '120%',
																height: '120%'
															}
														}}
													>
														<ImgStyle src={movie.bia} alt={movie.ten} />
													</Paper>
												</RouterLink>
											</Grid>
										))
									}
								</Grid>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Container>
		</RootStyle>
	);
}
