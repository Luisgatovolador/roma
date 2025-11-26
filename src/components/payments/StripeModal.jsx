import React, { useState } from "react";
import { Modal, Box, Typography, Button, Alert } from "@mui/material";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { ventaService } from "../../services/ventaService";
import { useNavigate } from "react-router-dom"; // 🔹 Importamos useNavigate

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 450,
  maxHeight: "90vh",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
};

function StripeForm({ clientSecret, onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate(); // 🔹 Hook de navegación

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError("");

      if (!stripe || !elements) return;

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {},
        redirect: "if_required",
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        console.log("💳 Pago exitoso:", paymentIntent);

        const ventaFinal = window.ventaTemporal;
        if (!ventaFinal) {
          setError("❌ No existe la venta temporal.");
          return;
        }
        console.log("VENTA TEMPORAL:", ventaFinal);

        const respuesta = await ventaService.createVenta(ventaFinal);
        console.log("🧾 Venta registrada:", respuesta.data);

        // 🔹 Vaciar carrito
        localStorage.removeItem("carrito");

        // 🔹 Redirigir a página de éxito
        navigate("/historial");
        
        // 🔹 Cerrar modal
        onClose();
      }
    } catch (err) {
      console.error(err);
      setError("Error al procesar el pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
        <PaymentElement />
      </Box>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
        disabled={loading}
        onClick={handleConfirm}
      >
        {loading ? "Procesando..." : "Confirmar Pago"}
      </Button>
    </>
  );
}

export default function StripeModal({ open, onClose, clientSecret, stripePromise }) {
  if (!clientSecret) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Completar Pago
        </Typography>

        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <StripeForm clientSecret={clientSecret} onClose={onClose} />
        </Elements>
      </Box>
    </Modal>
  );
}
