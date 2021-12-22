import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useEffect, useState, useCallback } from 'react';
import Countdown, { zeroPad } from 'react-countdown';
import { sum } from 'lodash';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
// material
import { Grid, Card, Button, CardHeader, Typography, CardContent } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import {
    onNextStep,
    onBackStep
} from '../../redux/slices/ticket';

//
import Scrollbar from '../Scrollbar';
import EmptyContent from '../EmptyContent';
import PaymentMethods from './PaymentMethods';
import CheckoutTicketList from './CheckoutTicketList';

// axios
import axios from "../../utils/axios";

// hooks
import useIsMountedRef from '../../hooks/useIsMountedRef';

// ----------------------------------------------------------------------

export default function CheckoutPayment() {
    const { enqueueSnackbar } = useSnackbar();

    const dispatch = useDispatch();
    const isMountedRef = useIsMountedRef();

    const [detailedTickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { checkout, total, tickets } = useSelector((state) => state.ticket);
    const { cart, discount, subtotal, activeStep } = checkout;
    const isEmptyCart = total === 0;


    const PaymentSchema = Yup.object().shape({

    });

    const formik = useFormik({
        initialValues: {
            method: 'paypal',
            card: 'mastercard',
            newCardName: '',
            newCardNumber: '',
            newCardExpired: '',
            newCardCvv: ''
        },
        validationSchema: PaymentSchema,
        onSubmit: async (values, { resetForm }) => {
            setIsLoading(true);
            const submitData = {

            };
            if (values.method === 'paypal') {
                alert(
                    JSON.stringify(
                        {
                            ...submitData,
                            method: values.method
                        },
                        null,
                        2
                    )
                );
            } else {
                alert(
                    JSON.stringify(
                        {
                            ...submitData,
                            method: values.method,
                            newCardName: values.newCardName,
                            newCardNumber: values.newCardNumber,
                            newCardExpired: values.newCardExpired,
                            newCardCvv: values.newCardCvv
                        },
                        null,
                        2
                    )
                );
            }
            resetForm();
            enqueueSnackbar('Payment success', { variant: 'success' });
            // dispatch(onNextStep());
        }
    });

    const getTickets = useCallback(async () => {
        try {
            const response = await axios.post(`/api/dat-ve`, tickets);
            if (isMountedRef.current) {
                setTickets(response.data.results);
            }
        } catch (err) {
            //
        }
    }, [isMountedRef, tickets]);

    const countdownRenderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            return <Typography sx={{ color: 'error.main' }}>Hết thời gian thanh toán</Typography>
        }
        return <Typography>
            Vui lòng thanh toán trong <Typography component="span" sx={{ color: 'success.main' }}>{zeroPad(minutes)}:{zeroPad(seconds)}</Typography>
        </Typography>

    }

    const handleComplete = useCallback(async () => {
        // setIsLoading(true);
        await axios.post(`/api/huy-ve`, tickets);
        dispatch(onBackStep());
    }, []);

    useEffect(() => {
        getTickets();
    }, [getTickets])


    return (

        <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
                <Card sx={{ mb: 3 }}>
                    <CardHeader
                        title={
                            <Typography variant="h6">
                                Card
                                <Typography component="span" sx={{ color: 'text.secondary' }}>
                                    &nbsp;({total} item)
                                </Typography>
                            </Typography>
                        }
                        sx={{ mb: 3 }}
                    />

                    {!isEmptyCart ? (
                        <Scrollbar>
                            <CheckoutTicketList
                                detailedTickets={detailedTickets}
                            />
                        </Scrollbar>
                    ) : (
                        <EmptyContent
                            title="Cart is empty"
                            description="Look like you have no items in your shopping cart."
                            img="/static/illustrations/illustration_empty_cart.svg"
                        />
                    )}
                </Card>

                <Button
                    color="inherit"
                    onClick={() => { dispatch(onBackStep()) }}
                    startIcon={<Icon icon={arrowIosBackFill} />}

                >
                    Quay lại giỏ vé
                </Button>
            </Grid>

            <Grid item xs={12} md={4}>
                <Card sx={{ mb: 3 }}>
                    <CardHeader
                        title={
                            <Typography variant="h6">
                                Chọn phương thức thanh toán
                            </Typography>
                        }
                        sx={{ mb: 3 }}
                    />
                    <CardContent>
                        <Countdown date={Date.now() + 5 * 60 * 1000} renderer={countdownRenderer} onComplete={handleComplete} />
                        <FormikProvider formik={formik} >
                            <PaymentMethods formik={formik} />
                            <LoadingButton
                                fullWidth
                                size="large"
                                variant="contained"
                                type="submit"
                                disabled={detailedTickets.length === 0}
                                onClick={() => { formik.handleSubmit() }}
                                loading={isLoading}
                            >
                                Thanh toán
                            </LoadingButton>
                        </FormikProvider>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>

    );
}
