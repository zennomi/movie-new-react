import { useCallback, useEffect, useState } from "react";
import QRImage from 'react-qr-image'
// material
import { Alert, Card, CardContent, CardHeader, Grid, Typography, Stack, Chip, Skeleton } from "@material-ui/core";
// icons
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import EventIcon from '@material-ui/icons/Event';
// utils
import axios from "../../utils/axios";
import { fAmountTime } from '../../utils/formatNumber';

// redux
import { useSelector } from '../../redux/store';

export default function CheckoutTickets() {
    const { checkout } = useSelector((state) => state.ticket);
    const { billing } = checkout;
    console.log(billing);
    const [tickets, setTickets] = useState([]);
    console.log(tickets);
    const getTickets = useCallback(async () => {
        try {
            const response = await axios.get(`/api/hoa-don/${billing}`);
            setTickets(response.data.results.ve);
        } catch (error) {
            console.log(error);
        }
    }, [billing]);

    useEffect(() => {
        getTickets();
    }, [getTickets]);

    return (
        <>
            <Alert severity="warning" sx={{ mb: 2 }}>Vui lòng lưu lại mã QR hoá đơn trước khi tải lại trang</Alert>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardHeader
                            title={
                                <Typography variant="h6">
                                    Mã QR các vé lẻ
                                </Typography>
                            }
                            sx={{ mb: 1 }}
                        />
                        <CardContent>
                            <Grid container space={2} spacing={2}>
                                {
                                    tickets.length === 0 ?
                                        Array(2).fill(
                                            <Grid item xs={6}><Skeleton width="100%" height="100%"/></Grid>
                                        ) :
                                        tickets.map(t =>
                                            <Grid key={t.ma} item xs={6} >
                                                <Grid container spacing={1} sx={{ mb: 1 }}>
                                                    <Grid item xs={3}>
                                                        <Card sx={{ borderRadius: 0.5 }}>
                                                            {t.suatchieu && <img alt={t.suatchieu.phim.ten} src={t.suatchieu.phim.bia} />}
                                                        </Card>
                                                    </Grid>
                                                    <Grid item xs={9} sx={{ mb: 1 }}>
                                                        <Stack >
                                                            <Typography
                                                                variant="h5"
                                                                color="primary"
                                                            >
                                                                {t.suatchieu.phim.ten}{" "}
                                                                <Chip color="primary" icon={<EventIcon />} label={`${t.suatchieu.ngay} ${t.suatchieu.ca}`} size="small" />
                                                            </Typography>
                                                            <Grid item container spacing={1}>
                                                                <Grid item>
                                                                    <Chip color="primary" icon={<HourglassEmptyIcon />} label={fAmountTime(t.suatchieu.phim.thoigian)} size="small" />
                                                                </Grid>
                                                                <Grid item>
                                                                    <Chip color="primary" label={`Ghế: ${t.hang + 1}-${t.cot + 1}`} size="small" />
                                                                </Grid>
                                                            </Grid>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                                <Card>
                                                    <QRImage text={`ve-${t.ma}`} style={{ width: "100%" }} />
                                                </Card>
                                            </Grid>
                                        )
                                }
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>

                    <Card>
                        <CardHeader
                            title={
                                <>
                                    <Typography variant="h6">
                                        Mã QR hoá đơn
                                    </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>
                                        Bạn có thể mỗi lưu mã QR hoá đơn
                                    </Typography>
                                </>
                            }
                            sx={{ mb: 3 }}
                        />
                        <CardContent>
                            <Card>
                                <QRImage text={`hoa-don-${billing}`} style={{ width: "100%" }} />
                            </Card>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}