import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Divider,
    Grid,
    List,
    ListItemButton,
    ListItemText,
    Chip,
    Button,
    CircularProgress,
    Alert
} from '@mui/material';
import { CreditCard, Money, ReceiptLong, CheckCircle, Refresh } from '@mui/icons-material';

const API_BASE = "http://localhost:4000";

// --- Íconos según el método de pago ---
const getMetodoIcon = (metodo) => {
    switch (metodo) {
        case 'Efectivo':
            return <Money fontSize="small" />;
        case 'Tarjeta':
            return <CreditCard fontSize="small" />;
        default:
            return <ReceiptLong fontSize="small" />;
    }
};

const ConsultaVentas = () => {
    const [ventas, setVentas] = useState([]);
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        cargarVentas();
    }, []);

    const cargarVentas = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await fetch(`${API_BASE}/api/ventas`);
            if (!res.ok) throw new Error("Error al cargar ventas");
            const data = await res.json();
            setVentas(data);
            if (data.length > 0) {
                setVentaSeleccionada(data[0]);
            }
        } catch (err) {
            console.error('Error al cargar ventas:', err);
            setError('Error al cargar las ventas: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const calcularSubtotal = (productos) => {
        return productos?.reduce((sum, item) => sum + (item.subtotal || 0), 0) || 0;
    };

    const calcularIVA = (subtotal) => {
        return subtotal * 0.16; // 16% de IVA
    };

    if (loading) {
        return (
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2, boxShadow: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                    <Typography variant="h4" fontWeight="bold">
                        Consulta de Ventas
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Historial y detalle de ventas reales
                    </Typography>
                </Box>
                <Button
                    startIcon={<Refresh />}
                    onClick={cargarVentas}
                    variant="outlined"
                >
                    Actualizar
                </Button>
            </Box>

            {error && (
                <Alert 
                    severity="error" 
                    sx={{ mb: 2 }}
                    action={
                        <Button color="inherit" size="small" onClick={cargarVentas}>
                            Reintentar
                        </Button>
                    }
                >
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* 🧾 Columna Izquierda: Lista de Ventas */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={1} sx={{ p: 1, minHeight: 500, backgroundColor: '#fdf3f5' }}>
                        <Typography variant="subtitle1" fontWeight="bold" p={1}>
                            Ventas Recientes ({ventas.length})
                        </Typography>
                        <Divider sx={{ mb: 1 }} />

                        <List disablePadding>
                            {ventas.map((venta) => (
                                <ListItemButton
                                    key={venta._id}
                                    selected={ventaSeleccionada && venta._id === ventaSeleccionada._id}
                                    onClick={() => setVentaSeleccionada(venta)}
                                    sx={{ 
                                        borderRadius: 1, 
                                        my: 0.5,
                                        '&.Mui-selected': {
                                            backgroundColor: '#fbe4e7',
                                            '&:hover': { backgroundColor: '#f9d4da' }
                                        }
                                    }}
                                >
                                    <ListItemText 
                                        primary={`Venta #${venta._id?.slice(-6).toUpperCase()}`} 
                                        secondary={`Total: $${venta.total?.toFixed(2) || '0.00'} — ${new Date(venta.fecha).toLocaleTimeString()}`} 
                                    />
                                    <Chip 
                                        label={venta.metodoPago} 
                                        size="small"
                                        icon={getMetodoIcon(venta.metodoPago)}
                                        sx={{ backgroundColor: '#f7c0c9', color: 'black' }}
                                    />
                                </ListItemButton>
                            ))}
                        </List>

                        {ventas.length === 0 && (
                            <Box textAlign="center" py={4}>
                                <Typography variant="body2" color="text.secondary">
                                    No hay ventas registradas
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* 💳 Columna Derecha: Detalle de la Venta Seleccionada */}
                <Grid item xs={12} md={8}>
                    {ventaSeleccionada ? (
                        <Paper elevation={1} sx={{ p: 3, minHeight: 500 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 2
                                }}
                            >
                                <Typography variant="h5" fontWeight="bold">
                                    Detalle Venta #{ventaSeleccionada._id?.slice(-6).toUpperCase()}
                                </Typography>
                                <Chip 
                                    label={ventaSeleccionada.estado || 'Completada'} 
                                    icon={<CheckCircle />}
                                    color="success"
                                    size="medium"
                                />
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            <Grid container spacing={3}>
                                {/* 🛒 Desglose de productos */}
                                <Grid item xs={12} lg={7}>
                                    <Typography variant="h6" mb={2}>Productos Vendidos</Typography>
                                    <TableContainer component={Paper} elevation={0}>
                                        <Table size="small">
                                            <TableHead sx={{ backgroundColor: '#fbe4e7' }}>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Producto</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Cant.</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Precio U.</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Subtotal</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {ventaSeleccionada.productos?.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            {item.producto?.nombre || 'Producto no disponible'}
                                                        </TableCell>
                                                        <TableCell align="center">{item.cantidad}</TableCell>
                                                        <TableCell align="right">${item.precioUnitario?.toFixed(2) || '0.00'}</TableCell>
                                                        <TableCell align="right">
                                                            ${item.subtotal?.toFixed(2) || '0.00'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>

                                {/* 💰 Resumen de pago */}
                                <Grid item xs={12} lg={5}>
                                    <Paper sx={{ p: 2, backgroundColor: '#fdf3f5', border: '1px solid #f9d4da' }}>
                                        <Typography variant="h6" fontWeight="bold" mb={2}>
                                            Información de Pago
                                        </Typography>

                                        <Box mb={2}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Fecha y Hora:
                                            </Typography>
                                            <Typography fontWeight="bold">
                                                {new Date(ventaSeleccionada.fecha).toLocaleString()}
                                            </Typography>
                                        </Box>

                                        <Box mb={2}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Método de Pago:
                                            </Typography>
                                            <Typography fontWeight="bold" display="flex" alignItems="center" gap={1}>
                                                {getMetodoIcon(ventaSeleccionada.metodoPago)} {ventaSeleccionada.metodoPago}
                                            </Typography>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        <Typography variant="h6" fontWeight="bold" mb={2}>
                                            Resumen Financiero
                                        </Typography>

                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography>Subtotal:</Typography>
                                            <Typography fontWeight="bold">
                                                ${calcularSubtotal(ventaSeleccionada.productos).toFixed(2)}
                                            </Typography>
                                        </Box>

                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography>IVA (16%):</Typography>
                                            <Typography fontWeight="bold">
                                                ${calcularIVA(calcularSubtotal(ventaSeleccionada.productos)).toFixed(2)}
                                            </Typography>
                                        </Box>

                                        <Divider sx={{ my: 1 }} />

                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="h6">TOTAL PAGADO:</Typography>
                                            <Typography variant="h6" fontWeight="bold" color="error.main">
                                                ${ventaSeleccionada.total?.toFixed(2) || '0.00'}
                                            </Typography>
                                        </Box>
                                    </Paper>

                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        sx={{
                                            mt: 3,
                                            color: '#e91e63',
                                            borderColor: '#f7c0c9',
                                            fontWeight: 'bold',
                                            '&:hover': { borderColor: '#f9d4da', backgroundColor: '#fce4ec' }
                                        }}
                                        onClick={() => window.print()}
                                    >
                                        Imprimir Recibo
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    ) : (
                        <Paper
                            elevation={1}
                            sx={{
                                p: 3,
                                minHeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Typography variant="h6" color="text.secondary">
                                Selecciona una venta del historial para ver su detalle.
                            </Typography>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default ConsultaVentas;
