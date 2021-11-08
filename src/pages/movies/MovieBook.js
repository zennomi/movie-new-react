import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// material
import { alpha, useTheme, styled } from '@material-ui/core/styles';
import { Box, Card, Chip, Button, Divider, Typography, CardContent, Container, Link, Icon, Grid, Stack, Autocomplete, TextField } from '@material-ui/core';
import { DesktopDatePicker, LocalizationProvider } from '@material-ui/lab';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';


import clockFill from '@iconify/icons-eva/clock-fill';
// components
import Page from "../../components/Page";
// utils
import mockData from '../../utils/mock-data';
//
import { varFadeInUp, MotionInView, varFadeInDown } from '../../components/animate';
import Label from '../../components/Label';


const RootStyle = styled('div')(({ theme }) => ({
	overflow: 'hidden',
	position: 'relative',
	paddingTop: theme.spacing(15),
	[theme.breakpoints.up('md')]: {
		paddingBottom: theme.spacing(15)
	}
}));

const MOCK_MOVIES = [...Array(5)].map((_, index) => ({
	id: mockData.id(index),
	title: mockData.text.title(index),
	image: mockData.image.feed(index),
	short: mockData.role(index),
	description: mockData.text.description(index),
}));


const MOCK_SLOTS = [...Array(5)].map((_, index) => ({
	id: mockData.id(index),
	title: mockData.text.title(index),
	image: mockData.image.feed(index),
	short: mockData.role(index),
	description: mockData.text.description(index),
}));

export default function MovieBook() {
	const location = useLocation();
	const maphim = Number(new URLSearchParams(location.search).get("maphim"));
	const [movie, setMovie] = useState();
	const [date, setDate] = useState(new Date());
	console.log(maphim, movie, MOCK_MOVIES[maphim]);

	useEffect(() => {
		if (maphim != null) setMovie(MOCK_MOVIES[maphim]);
	}, [])
	return (
		<Page title="Đặt vé">
			<RootStyle>
				<Container maxWidth="lg">
					<Box sx={{ mb: { xs: 5, md: 10 } }}>
						<MotionInView variants={varFadeInUp}>
							<Typography component="p" variant="overline" sx={{ mb: 2, color: 'text.secondary', textAlign: 'center' }}>
								Đặt vé
							</Typography>
						</MotionInView>
						<MotionInView variants={varFadeInDown}>
							<Typography variant="h2" sx={{ textAlign: 'center' }}>
								Chọn lịch phim và thanh toán~
							</Typography>
						</MotionInView>
					</Box>
					<Box>
						<Grid container spacing={1}>
							<Grid item xs={12} md={4}>
								<Card><CardContent>

									<Stack spacing={2}>
										<Typography variant="h5" sx={{ color: 'primary.main' }}>
											Chọn phim và ngày
										</Typography>
										<Autocomplete
											disablePortal
											options={MOCK_MOVIES}
											getOptionLabel={option => option.title}
											renderInput={(params) => <TextField {...params} label="Phim" />}
											value={movie}
											onChange={(event, newMovie) => { setMovie(newMovie) }}
											key={movie && movie.title}
											sx={{ w: 1 }}
										/>
										<LocalizationProvider dateAdapter={AdapterDateFns}>
											<DesktopDatePicker
												label="Ngày"
												inputFormat="dd/MM/yyyy"
												value={date}
												onChange={(newDate) => { setDate(newDate) }}
												renderInput={(params) => <TextField {...params} />}
												sx={{ w: 1 }}
											/>
										</LocalizationProvider>
									</Stack>
								</CardContent></Card>
							</Grid>
							<Grid item xs={12} md={5}>
								<Card>
									<CardContent>
										<Stack spacing={2}>
											<Typography variant="h5" sx={{ color: 'primary.main' }}>
												Các suất chiếu
											</Typography>
											{MOCK_SLOTS.map(slot =>
											(
												<>
													<Divider />
													<Grid container spacing={1}>
														<Grid item xs={2}>
															<img
																src={slot.image}
																alt="Live from space album cover"
																style={{ width: '100%' }}
															/>
														</Grid>
														<Grid item xs={10}>
															<Typography>
																{slot.title}
															</Typography>
														</Grid>
														<Grid item xs={12}>
														<Label>08/11/2021</Label>

														</Grid>
													</Grid>
												</>
											))}
										</Stack>
									</CardContent>
								</Card>
							</Grid>
							<Grid item xs={12} md={3}>
								<Typography variant="h5" sx={{ color: 'primary.main' }}>
									Các suất chiếu
								</Typography>
							</Grid>
						</Grid>
					</Box>
				</Container>
			</RootStyle>
		</Page>
	)
}