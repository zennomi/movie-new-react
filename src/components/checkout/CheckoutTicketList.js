import { Icon } from '@iconify/react';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
// material
import { styled } from '@material-ui/styles';
import {
    Box,
    Table,
    Stack,
    Divider,
    Skeleton,
    TableRow,
    TableBody,
    TableCell,
    TableHead,
    Typography,
    TableContainer
} from '@material-ui/core';
// utils
import { fCurrency } from '../../utils/formatNumber';
//
import { MIconButton } from '../@material-extend';

const ThumbImgStyle = styled('img')(({ theme }) => ({
    width: 64,
    height: 64,
    objectFit: 'cover',
    marginRight: theme.spacing(2),
    borderRadius: theme.shape.borderRadiusSm
}));

export default function CheckoutTicketList({ detailedTickets, onDelete, activeStep, total }) {
    return (
        <TableContainer sx={{ minWidth: 720 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Vé</TableCell>
                        <TableCell align="left">Giá</TableCell>
                        {activeStep === 0 &&
                            <>
                                <TableCell align="left">Trạng thái</TableCell>
                                <TableCell align="right" />
                            </>
                        }
                    </TableRow>
                </TableHead>

                <TableBody>
                    {
                        detailedTickets.length === 0 ?
                            Array(total).fill(
                                <TableRow>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Skeleton sx={(theme) => ({
                                                width: 64,
                                                height: 64,
                                                objectFit: 'cover',
                                                marginRight: theme.spacing(2),
                                                borderRadius: theme.shape.borderRadiusSm
                                            })} />

                                            <Box>
                                                <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240, mb: 0.5 }}>
                                                    <Skeleton variant="text" />
                                                </Typography>

                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    alignItems="center"
                                                    divider={<Divider orientation="vertical" sx={{ height: 14, alignSelf: 'center' }} />}
                                                >
                                                    <Typography variant="body2">
                                                        <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                                                            <Skeleton variant="text"  />
                                                        </Typography>
                                                    </Typography>

                                                    <Typography variant="body2">
                                                        <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                                                            <Skeleton variant="text"  />
                                                        </Typography>
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                        </Box>
                                    </TableCell>

                                    <TableCell align="left"><Skeleton /></TableCell>
                                    {activeStep === 0 &&
                                        <><TableCell align="left"><Skeleton /></TableCell>

                                            <TableCell align="right">
                                                <MIconButton >
                                                    <Icon icon={trash2Fill} width={20} height={20} />
                                                </MIconButton>
                                            </TableCell>
                                        </>
                                    }
                                </TableRow>) :
                            detailedTickets.map((ticket) => {
                                const { suatchieu, hang, cot, gia } = ticket;
                                const { phim } = suatchieu;
                                return (
                                    <TableRow key={`${suatchieu.masuatchieu}-${hang}-${cot}`}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <ThumbImgStyle alt="product image" src={phim.bia} />
                                                <Box>
                                                    <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240, mb: 0.5 }}>
                                                        {phim.ten}
                                                    </Typography>

                                                    <Stack
                                                        direction="row"
                                                        spacing={1}
                                                        alignItems="center"
                                                        divider={<Divider orientation="vertical" sx={{ height: 14, alignSelf: 'center' }} />}
                                                    >
                                                        <Typography variant="body2">
                                                            <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                                                                Giờ:&nbsp;
                                                            </Typography>
                                                            {`${suatchieu.ngay} - ${suatchieu.ca}`}
                                                        </Typography>

                                                        <Typography variant="body2">
                                                            <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                                                                Vị trí::&nbsp;
                                                            </Typography>
                                                            {`${ticket.hang + 1}-${ticket.cot + 1}`}
                                                        </Typography>
                                                    </Stack>
                                                </Box>
                                            </Box>
                                        </TableCell>

                                        <TableCell align="left">{fCurrency(gia)}</TableCell>
                                        {activeStep === 0 &&
                                            <><TableCell align="left">{ticket.trong ? <Typography sx={{ color: 'success.main' }}>Trống</Typography> : <Typography sx={{ color: 'error.main' }}>Đã hết</Typography>}</TableCell>

                                                <TableCell align="right">
                                                    <MIconButton onClick={() => onDelete({ showtimeId: suatchieu.masuatchieu, r: hang, c: cot })}>
                                                        <Icon icon={trash2Fill} width={20} height={20} />
                                                    </MIconButton>
                                                </TableCell>
                                            </>
                                        }

                                    </TableRow>
                                );
                            })}
                    <TableRow>
                        {activeStep === 1 &&
                            <>
                                <TableCell align="right"><Typography variant="subtitle1">Tổng số tiền</Typography></TableCell>
                                <TableCell align="left">{fCurrency(detailedTickets.map(t => t.gia).reduce((a, b) => a + b, 0))}</TableCell>
                            </>
                        }
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}
