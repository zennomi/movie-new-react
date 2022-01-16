import Slider from 'react-slick';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { alpha, useTheme, styled } from '@material-ui/core/styles';
import { Box, Card, Container, Paper, Button, Typography, CardContent } from '@material-ui/core';
// utils
import axios from '../../../utils/axios';
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
//
//
import { varFadeInRight, varFadeInUp, varFadeInDown, MotionInView, MotionContainer } from '../../animate';
import { CarouselControlsArrowsIndex } from '../../carousel/controls';

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
  width: '200%',
  height: '200%',
  objectFit: 'cover',
  position: 'absolute',
  transition: theme.transitions.create('all')
}));

// ----------------------------------------------------------------------

CarouselItem.propTypes = {
  item: PropTypes.object,
  isActive: PropTypes.bool
};

function CarouselItem({ item, isActive }) {
  const { bia, ten, ma, noidung } = item;
  const theme = useTheme();

  return (
    <Paper
      sx={{
        position: 'relative',
        paddingTop: { xs: '100%', md: '50%' },
      }}
    >
      <CarouselImgStyle alt={ten} src={bia} />
      <Box
        sx={{
          top: 0,
          width: '100%',
          height: '100%',
          position: 'absolute',
          backgroundImage: `linear-gradient(to top, ${theme.palette.grey[900]} 0%,${alpha(
            theme.palette.grey[900],
            0
          )} 100%)`
        }}
      />
      <CardContent
        sx={{
          bottom: 0,
          width: '100%',
          maxWidth: 480,
          textAlign: 'left',
          position: 'absolute',
          color: 'common.white'
        }}
      >
        <MotionContainer open={isActive}>
          <motion.div variants={varFadeInRight}>
            <Typography variant="h3" gutterBottom>
              {ten}
            </Typography>
          </motion.div>
          <motion.div variants={varFadeInRight}>
            <Typography variant="body2" noWrap gutterBottom>
              {noidung}
            </Typography>
          </motion.div>
          <motion.div variants={varFadeInRight}>
            <Button component={RouterLink} to={`/movies/${ma}`} variant="contained" sx={{ mt: 3 }}>
              Chi tiết
            </Button>
          </motion.div>
        </MotionContainer>
      </CardContent>
    </Paper>
  );
}

export default function CarouselAnimation() {
  const theme = useTheme();
  const carouselRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(theme.direction === 'rtl' ? movies.length - 1 : 0);
  const [movies, setMovies] = useState([]);
  const isMountedRef = useIsMountedRef();

  const getMovies = useCallback(async () => {
    try {
      const response = await axios.get('/api/phim-sap-chieu?skip=20');
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

  const settings = {
    speed: 800,
    dots: false,
    arrows: false,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    beforeChange: (current, next) => setCurrentIndex(next)
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
              In Coming
            </Typography>
          </MotionInView>
          <MotionInView variants={varFadeInDown}>
            <Typography variant="h2" sx={{ textAlign: 'center' }}>
              Phim sắp chiếu
            </Typography>
          </MotionInView>
        </Box>

        <Card>
          <Slider ref={carouselRef} {...settings}>
            {movies.map((item, index) => (
              <CarouselItem key={item.title} item={item} isActive={index === currentIndex} />
            ))}
          </Slider>

          <CarouselControlsArrowsIndex
            index={currentIndex}
            total={movies.length || 5}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </Card>
      </Container>
    </RootStyle>
  );
}
