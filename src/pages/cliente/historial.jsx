import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  Card, 
  CardContent, 
  Modal,
  CircularProgress,
  Alert
} from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { ventaService } from "../../services/ventaService";
import { authService } from "../../services/authService";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 600, md: 700 },
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const DetallePedidoModal = ({ open, handleClose, pedido }) => {
  if (!pedido) return null;

  const estadoColor = pedido.estado === 'pagado' ? 'success.main' : 'error.main';

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight="bold">
            Detalles del Pedido #{pedido._id?.slice(-6).toUpperCase() || 'N/A'}
          </Typography>
          <Button onClick={handleClose} sx={{ color: 'black' }}>
            <CloseIcon />
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Box mb={3} display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="body2" color="text.secondary">Fecha de Pedido</Typography>
            <Typography variant="body1" fontWeight="medium">
              {pedido.fecha ? new Date(pedido.fecha).toLocaleDateString() : 'N/A'}
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="body2" color="text.secondary">Estado</Typography>
            <Typography variant="body1" fontWeight="bold" sx={{ color: estadoColor }}>
              {pedido.estado === 'pagado' ? 'Completado' : 'Cancelado'}
            </Typography>
          </Box>
        </Box>

        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>Productos</Typography>
        <List disablePadding sx={{ border: '1px solid #eee', borderRadius: 1, mb: 3 }}>
          {pedido.productos && pedido.productos.length > 0 ? (
            pedido.productos.map((item, index) => (
              <ListItem key={index} sx={{ borderBottom: index < pedido.productos.length - 1 ? '1px solid #eee' : 'none' }}>
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between">
                      <Typography>{item.producto?.nombre || 'Producto no disponible'}</Typography>
                      <Typography fontWeight="medium">${item.subtotal?.toFixed(2) || '0.00'}</Typography>
                    </Box>
                  }
                  secondary={`Cantidad: ${item.cantidad} x $${item.precioUnitario?.toFixed(2) || '0.00'}`}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No hay productos en este pedido" />
            </ListItem>
          )}
        </List>

        <Box mb={3}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6" fontWeight="bold">Total:</Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: 'error.main' }}>
              ${pedido.total?.toFixed(2) || '0.00'}
            </Typography>
          </Box>
        </Box>

        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>Información de Pago</Typography>
        <Typography variant="body2" color="text.secondary">Método de Pago:</Typography>
        <Typography variant="body1" fontWeight="medium" mb={2}>
          {pedido.metodoPago === 'efectivo' ? 'Efectivo' : 
           pedido.metodoPago === 'tarjeta' ? 'Tarjeta' : 
           pedido.metodoPago === 'transferencia' ? 'Transferencia' : 'No especificado'}
        </Typography>

        <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
          <Button 
            variant="contained" 
            sx={{ 
              backgroundColor: '#fbe4e7', 
              color: 'black', 
              fontWeight: 'bold', 
              '&:hover': { backgroundColor: '#f9d4da' } 
            }}
          >
            Descargar Comprobante
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const PedidoItem = ({ pedido, onOpenDetails }) => (
  <ListItem
    sx={{
      borderBottom: '1px solid #eee',
      py: 1.5,
      '&:hover': { backgroundColor: '#f9f9f9', cursor: 'pointer' },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <ListItemText
      sx={{ flexGrow: 1, mr: 2 }}
      primary={
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body1" fontWeight="bold">
            Pedido #{pedido._id?.slice(-6).toUpperCase() || 'N/A'}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: pedido.estado === 'pagado' ? 'success.main' : 'error.main', 
              fontWeight: 'bold', 
              border: `1px solid ${pedido.estado === 'pagado' ? 'success.main' : 'error.main'}`, 
              borderRadius: 1, 
              px: 1, 
              py: 0.2 
            }}
          >
            {pedido.estado === 'pagado' ? 'Completado' : 'Cancelado'}
          </Typography>
        </Box>
      }
      secondary={
        <Box display="flex" justifyContent="space-between" mt={0.5}>
          <Typography variant="body2" color="text.secondary">
            Fecha: {pedido.fecha ? new Date(pedido.fecha).toLocaleDateString() : 'N/A'}
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            Total: ${pedido.total?.toFixed(2) || '0.00'}
          </Typography>
        </Box>
      }
    />

    <Box display="flex" alignItems="center" sx={{ flexShrink: 0 }}>
      <Button
        variant="outlined"
        size="small"
        onClick={() => onOpenDetails(pedido)}
        sx={{
          mr: 1,
          borderColor: '#fbe4e7',
          color: 'black',
          '&:hover': {
            backgroundColor: '#f9d4da',
            borderColor: '#fbe4e7',
          },
        }}
      >
        Ver Detalles
      </Button>
      <ChevronRight />
    </Box>
  </ListItem>
);

const HistorialPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      setError('');
      
      const usuario = authService.getCurrentUser();
      console.log("👤 Usuario actual:", usuario);
      
      if (!usuario) {
        setError('Debes iniciar sesión para ver tu historial');
        return;
      }

      const response = await ventaService.getVentasByCliente(usuario.id);
      console.log("📦 Respuesta del servicio:", response);
      
      setPedidos(response.data || []);
      
    } catch (err) {
      console.error('❌ Error al cargar el historial:', err);
      setError('Error al cargar el historial de pedidos: ' + (err.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = (pedido) => {
    setSelectedPedido(pedido);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  if (loading) {
    return (
      <Card sx={{ 
        width: '100%', 
        flexGrow: 1, 
        boxShadow: 3, 
        p: 2, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 200 
      }}>
        <Box textAlign="center">
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Cargando historial...
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Card sx={{ width: '100%', flexGrow: 1, boxShadow: 3, p: 2 }}>
      <CardContent sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        p: 0, 
        "&:last-child": { pb: 0 } 
      }}>
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Historial de Pedidos
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mx: 2, mb: 2 }}>
            {error}
            <Button 
              variant="text" 
              size="small" 
              onClick={cargarPedidos}
              sx={{ ml: 1 }}
            >
              Reintentar
            </Button>
          </Alert>
        )}

        {pedidos.length > 0 ? (
          <Box sx={{ overflowY: 'auto', flexGrow: 1, px: 2, pb: 2 }}>
            <List sx={{ p: 0 }}>
              {pedidos.map((pedido) => (
                <PedidoItem 
                  key={pedido._id} 
                  pedido={pedido} 
                  onOpenDetails={handleOpenDetails} 
                />
              ))}
            </List>
          </Box>
        ) : (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            flexGrow={1} 
            py={4}
            flexDirection="column"
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {error ? 'No se pudieron cargar los pedidos' : 'Aún no tienes pedidos registrados.'}
            </Typography>
            {!error && (
              <Button 
                variant="outlined" 
                onClick={() => window.location.href = '/catalogo'}
                sx={{ mt: 2 }}
              >
                Ir al Catálogo
              </Button>
            )}
          </Box>
        )}
      </CardContent>

      <DetallePedidoModal 
        open={openModal} 
        handleClose={handleCloseModal} 
        pedido={selectedPedido} 
      />
    </Card>
  );
};

export default HistorialPedidos;
