// material
import {
  Box,
  Card,
  Stack,
  Divider,
  CardHeader,
  Typography,
  CardContent,
} from '@material-ui/core';
// utils
import { fCurrency } from '../../utils/formatNumber';

// ----------------------------------------------------------------------

export default function CheckoutSummary({
  detailedTickets
}) {

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="Hoá đơn"
      />

      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Số vé còn trống
            </Typography>
            <Typography variant="subtitle2">{detailedTickets.filter(t => t.trong).length}</Typography>
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">Total</Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
                {fCurrency(detailedTickets.filter(t => t.trong).map(t => t.gia).reduce((a, b) => a + b, 0))}
              </Typography>
              <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                (cả VAT)
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
