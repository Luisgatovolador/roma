import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  IconButton,
  Alert
} from "@mui/material";
import { Close, CreditCard } from "@mui/icons-material";
import { ventaService } from "../../services/ventaService";

const TarjetaFisicaModal = ({ open, onClose, carrito, total }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const procesarVenta = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (carrito.length === 0) {
        setError("El carrito está vacío");
        return;
      }

      // Creamos la venta con "metodoPago: tarjeta física"
      const ventaData = {
        productos: carrito.map(item => ({
          producto: item._id,
          cantidad: item.cantidad,
          precioUnitario: item.precioVenta,
          subtotal: item.precioVenta * item.cantidad
        })),
        total,
        metodoPago: "tarjeta",
        estado: "pagado" // o "completada" si ya se procesó en la terminal
      };

      // Enviar al backend
      const respuesta = await ventaService.createVenta(ventaData);

      // Limpiar carrito local
      localStorage.removeItem("carrito");

      setSuccess("✅ Venta registrada para procesar en la terminal");
    } catch (err) {
      console.error(err);
      setError("Error al registrar la venta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Pago con Tarjeta
          </Typography>
          <IconButton onClick={onClose}><Close /></IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box display="flex" alignItems="center" mb={2}>
          <CreditCard sx={{ mr: 1, color: "#e91e63" }} />
          <Typography>
            El cliente pagará con tarjeta en la terminal física.
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Total a cobrar: <strong>${total.toFixed(2)}</strong>
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          color="primary"
          disabled={loading}
          onClick={procesarVenta}
        >
          {loading ? "Procesando..." : "Registrar Venta"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TarjetaFisicaModal;
