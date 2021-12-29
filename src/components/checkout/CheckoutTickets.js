import { useCallback, useEffect, useState } from "react";
import QRCode from "qrcode.react";
// material
import { Alert, Box, Card, CardContent, CardHeader, Grid, Typography } from "@material-ui/core";
// axios
import axios from "../../utils/axios";
// redux
import { useSelector } from '../../redux/store';
// hooks
import useIsMountedRef from '../../hooks/useIsMountedRef';

export default function CheckoutTickets() {
    const isMountedRef = useIsMountedRef();
    const { checkout } = useSelector((state) => state.ticket);
    const { billing } = checkout;
    console.log(billing);
    const [tickets, setTickets] = useState([]);

    const getTickets = useCallback(async () => {
        try {
            const response = await axios.get(`/api/hoa-don/${billing}`);
            console.log(response.data.result);
            if (isMountedRef.current) {
                setTickets(response.data.result.ve);
            }
        } catch (error) {
            console.log(error);
        }
    }, [isMountedRef, tickets]);

    useEffect(() => {
        getTickets();
    }, []);

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
                            sx={{ mb: 3 }}
                        />
                        <CardContent>
                            <Grid container space={2}>
                                {
                                    tickets.map(t =>
                                        <Grid item xs={6} sx={{padding: 2}}>
                                            <QRCode value={`ve-${t.ma}`} size={256} style={{ width: "100%" }} />
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
                            <QRCode value={`hoa-don-${billing}`} size={256} style={{ width: "100%" }} />
                        </CardContent>

                    </Card>

                </Grid>
            </Grid>
        </>
    )
}