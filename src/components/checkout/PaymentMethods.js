import { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import checkmarkCircle2Fill from '@iconify/icons-eva/checkmark-circle-2-fill';
import infoFill from '@iconify/icons-eva/info-fill';

// material
import { styled } from '@material-ui/styles';
import {
    Stack,
    Paper,
    Radio,
    Button,
    Collapse,
    TextField,
    Typography,
    RadioGroup,
    FormControlLabel,
    Popover,
    InputAdornment,
} from '@material-ui/core';
//
import { MHidden, MIconButton } from '../@material-extend';

// ----------------------------------------------------------------------

const PAYMENT_OPTIONS = [
    {
        value: 'paypal',
        title: 'Pay with Paypal',
        icons: ['/static/icons/ic_paypal.svg']
    },
    {
        value: 'credit_card',
        title: 'Credit / Debit Card',
        icons: ['/static/icons/ic_mastercard.svg', '/static/icons/ic_visa.svg']
    }
];

const RootStyle = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(5),
    marginTop: theme.spacing(5)
}));

const OptionStyle = styled(Paper)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2),
    transition: theme.transitions.create('all'),
    border: `solid 1px ${theme.palette.grey[500_32]}`
}));

// ----------------------------------------------------------------------

PaymentMethods.propTypes = {
    formik: PropTypes.object
};

export default function PaymentMethods({ formik }) {
    const [show, setShow] = useState(false);
    const [isOpen, setIsOpen] = useState(null);

    const { values, getFieldProps } = formik;


    return (
        <RootStyle>
            <RadioGroup {...getFieldProps('method')}>
                <Stack spacing={3}>
                    {PAYMENT_OPTIONS.map((method) => {
                        const { value, title, icons } = method;
                        const hasChildren = value === 'credit_card';

                        return (
                            <OptionStyle
                                key={title}
                                sx={{
                                    ...(values.method === value && {
                                        boxShadow: (theme) => theme.customShadows.z8
                                    }),
                                    ...(hasChildren && { flexWrap: 'wrap' })
                                }}
                            >
                                <FormControlLabel
                                    value={value}
                                    control={<Radio checkedIcon={<Icon icon={checkmarkCircle2Fill} />} />}
                                    label={
                                        <Typography variant="subtitle2" sx={{ ml: 1 }}>
                                            {title}
                                        </Typography>
                                    }
                                    sx={{ py: 3, mx: 0 }}
                                />

                                <MHidden width="smDown">
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        {icons.map((icon) => (
                                            <img key={icon} alt="logo card" src={icon} />
                                        ))}
                                    </Stack>
                                </MHidden>

                                {hasChildren && (
                                    <Collapse in={values.method === 'credit_card'} sx={{ width: 1 }}>

                                        <>
                                            <Paper
                                                sx={{
                                                    p: 2.5,
                                                    mb: 2.5,
                                                    bgcolor: 'background.neutral'
                                                }}
                                            >
                                                <Stack spacing={2}>
                                                    <Typography variant="subtitle1">Add new card</Typography>
                                                    <TextField fullWidth size="small" label="Name on card" {...getFieldProps('newCardName')}/>

                                                    <TextField fullWidth size="small" label="Card number" {...getFieldProps('newCardNumber')}/>

                                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                                        <TextField size="small" label="MM/YY" {...getFieldProps('newCardExpired')}/>
                                                        <TextField
                                                            size="small"
                                                            label="CVV"

                                                            InputProps={{
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        <MIconButton size="small" edge="end" onClick={(e) => setIsOpen(e.currentTarget) }>
                                                                            <Icon icon={infoFill} />
                                                                        </MIconButton>
                                                                    </InputAdornment>
                                                                )
                                                            }}
                                                        />
                                                    </Stack>
                                                </Stack>
                                            </Paper>

                                            <Popover
                                                open={Boolean(isOpen)}
                                                anchorEl={isOpen}
                                                onClose={() => setIsOpen(null)}
                                                anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
                                                transformOrigin={{ vertical: 'center', horizontal: 'center' }}
                                                PaperProps={{
                                                    sx: {
                                                        p: 1,
                                                        maxWidth: 200
                                                    }
                                                }}
                                            >
                                                <Typography variant="body2" align="center">
                                                    Three-digit number on the back of your VISA card
                                                </Typography>
                                            </Popover>
                                        </>
                                    </Collapse>
                                )}
                            </OptionStyle>
                        );
                    })}
                </Stack>
            </RadioGroup>
        </RootStyle>
    );
}
