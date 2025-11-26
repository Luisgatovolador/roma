import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Divider,
  IconButton,
  TextField
} from "@mui/material";
import { Close, Money } from "@mui/icons-material";

const EfectivoModal = ({ open, onClose, carrito, total, procesarVenta }) => {
  const [pagoCliente, setPagoCliente] = useState("");
  const pagoNumerico = parseFloat(pagoCliente) || 0;
  const cambio = pagoNumerico - total;

  const handleConfirmar = () => {
    if (pagoNumerico < total) return; // no permitir procesar si no alcanza
    procesarVenta(pagoNumerico, cambio);
    setPagoCliente(""); // limpiar input
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">Pago en Efectivo</Typography>
          <IconButton onClick={onClose}><Close /></IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Ingresa la cantidad entregada por el cliente
        </Typography>

        <TextField
          fullWidth
          label="Pago del cliente"
          type="number"
          value={pagoCliente}
          onChange={(e) => setPagoCliente(e.target.value)}
          InputProps={{ startAdornment: <Money sx={{ mr: 1 }} /> }}
          sx={{ mb: 2 }}
        />

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between">
          <Typography variant="body1">Total a pagar:</Typography>
          <Typography variant="body1" fontWeight="bold">${total.toFixed(2)}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mt={1}>
          <Typography variant="body1">Cambio a regresar:</Typography>
          <Typography variant="body1" fontWeight="bold" color={cambio < 0 ? "error.main" : "success.main"}>
            {cambio < 0 ? "Pago insuficiente" : `$${cambio.toFixed(2)}`}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          disabled={pagoNumerico < total}
          onClick={handleConfirmar}
          sx={{ backgroundColor: "#e91e63", "&:hover": { backgroundColor: "#c2185b" } }}
        >
          Confirmar Venta
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EfectivoModal;
