import { useCallback, useEffect, useState } from "react";
import QRCode from "qrcode.react";
// material
import { Alert, Box, Card, CardContent, Grid, Typography } from "@material-ui/core";
// axios
import axios from "../../utils/axios";
// redux
import { useDispatch, useSelector } from '../../redux/store';
// hooks
import useIsMountedRef from '../../hooks/useIsMountedRef';

export default function CheckoutTickets() {
    const isMountedRef = useIsMountedRef();
    const { checkout } = useSelector((state) => state.ticket);
    const { billing } = checkout;

    const [tickets, setTickets] = useState([]);

    const getTickets = useCallback(async () => {
        try {
            const response = await axios.post(`/api/hoa-don/`, tickets);
            if (isMountedRef.current) {
                setTickets(response.data.result.tickets);
            }
        } catch (err) {
            //
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
                        <CardContent>
                            <Typography variant="subtitle1">
                                Mã QR các vé lẻ
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1">
                        Mã QR hoá đơn
                    </Typography>
                    <Typography variant="subtitle2">
                        Bạn có thể mỗi lưu mã QR hoá đơn
                    </Typography>
                    <Card>
                        <CardContent>
                                <QRCode value={`hoa-don-${billing}`} size={256} style={{width: "100%"}}/>
                        </CardContent>
                    </Card>

                </Grid>
            </Grid>
        </>
    )
}