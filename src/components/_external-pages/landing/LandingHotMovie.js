import Slider from 'react-slick';
import PropTypes from 'prop-types';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { alpha, useTheme, styled } from '@material-ui/core/styles';
import { Box, Card, Paper, Typography, CardContent, Container, Link, Icon } from '@material-ui/core';
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

const CarouselImgStyle = styled('img')(({ theme }) => ({
	top: 0,
	width: '100%',
	height: '100%',
	objectFit: 'cover',
	position: 'absolute',
	transition: theme.transitions.create('all')
}));

// ----------------------------------------------------------------------

CarouselItem.propTypes = {
	item: PropTypes.object
};

function CarouselItem({ item }) {
	const { bia, ten, ma } = item;

	return (
		<Paper
			sx={{
				mx: 1,
				mb: 2,
				borderRadius: 2,
				overflow: 'hidden',
				paddingTop: 'calc(16 /9 * 100%)',
				position: 'relative',
				'&:hover img': {
					width: '120%',
					height: '120%'
				}
			}}
		>
			<CarouselImgStyle alt={ten} src={bia} />
			<CardContent
				sx={{
					bottom: 0,
					zIndex: 9,
					width: '100%',
					textAlign: 'left',
					position: 'absolute',
					color: 'common.white',
					backgroundImage: (theme) =>
						`linear-gradient(to top, ${theme.palette.grey[900]} 0%,${alpha(theme.palette.grey[900], 0)} 100%)`
				}}
			>
				<Typography variant="h4" paragraph>
					{ten}
				</Typography>
				<Link
					to={`/movies/${ma}`}
					color="inherit"
					variant="overline"
					component={RouterLink}
					sx={{
						opacity: 0.72,
						alignItems: 'center',
						display: 'inline-flex',
						transition: (theme) => theme.transitions.create('opacity'),
						'&:hover': { opacity: 1 }
					}}
				>
					xem chi tiết
					<Box component={Icon} icon={arrowForwardFill} sx={{ width: 16, height: 16, ml: 1 }} />
				</Link>
			</CardContent>
		</Paper>
	);
}

export default function LandingHotMovie() {
	const theme = useTheme();
	const [movies, setMovies] = useState([]);
	const isMountedRef = useIsMountedRef();

	console.log(movies);

	const getMovies = useCallback(async () => {
		try {
		  const response = await axios.get('/api/phim?skip=20');
		  if (isMountedRef.current) {
			setMovies(response.data.results);
		  }
		} catch (err) {
		  //
		}
	  }, [isMountedRef]);
	
	  useEffect(() => {
		getMovies();
	  }, [getMovies]);

	const carouselRef = useRef();
	const settings = {
		slidesToShow: 3,
		centerMode: true,
		centerPadding: '60px',
		rtl: Boolean(theme.direction === 'rtl'),
		arrows: false,
		responsive: [
			{
				breakpoint: 1024,
				settings: { slidesToShow: 2 }
			},
			{
				breakpoint: 600,
				settings: { slidesToShow: 1 }
			},
			{
				breakpoint: 480,
				settings: { slidesToShow: 1, centerPadding: '0' }
			}
		]
	};

	const handlePrevious = () => {
		carouselRef.current.slickPrev();
	};

	const handleNext = () => {
		carouselRef.current.slickNext();
	};

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
							Phim đang hot trên rạp
						</Typography>
					</MotionInView>
				</Box>
				<Card>
					<CardContent>
						<Slider ref={carouselRef} {...settings}>
							{movies.map((item, index) => (
								<CarouselItem key={item.ma} item={item} index={index} />
							))}
						</Slider>
					</CardContent>
					<CarouselControlsArrowsBasic2 onNext={handleNext} onPrevious={handlePrevious} />
				</Card>
			</Container>
		</RootStyle>
	);
}
