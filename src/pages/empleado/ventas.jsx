import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Divider,
  Container,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ventaService } from "../../services/ventaService";
import { authService } from "../../services/authService";
import TarjetaFisicaModal from "../../components/payments/TarjetaModal";
import EfectivoModal from "../../components/payments/EfectivoModal";

const ProductoItem = ({ producto, onEliminar, onActualizarCantidad }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" my={1.5}>
    <Box display="flex" alignItems="center" sx={{ flex: 1 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#fbe4e7",
          borderRadius: 1,
          mr: 2,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {producto.imagen ? (
          <img
            src={`http://localhost:4000${producto.imagen}`}
            alt={producto.nombre}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Typography variant="caption" color="text.secondary">
            Img
          </Typography>
        )}
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="body1" fontWeight="medium" noWrap>
          {producto.nombre}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {producto.categoria || "Sin categoría"}
        </Typography>
        <Box display="flex" alignItems="center" mt={0.5}>
          <IconButton
            size="small"
            onClick={() =>
              onActualizarCantidad(producto._id, producto.cantidad - 1)
            }
            disabled={producto.cantidad <= 1}
          >
            -
          </IconButton>
          <Typography variant="body2" sx={{ mx: 1 }}>
            {producto.cantidad}
          </Typography>
          <IconButton
            size="small"
            onClick={() =>
              onActualizarCantidad(producto._id, producto.cantidad + 1)
            }
            disabled={producto.cantidad >= producto.stock}
          >
            +
          </IconButton>
        </Box>
      </Box>
    </Box>
    <Box display="flex" alignItems="center">
      <Typography variant="body1" fontWeight="bold" sx={{ ml: 1, mr: 2 }}>
        ${(producto.precioVenta * producto.cantidad).toFixed(2)}
      </Typography>
      <IconButton
        size="small"
        onClick={() => onEliminar(producto._id)}
        sx={{ color: "error.main" }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  </Box>
);

const Carrito = () => {
  const [carrito, setCarrito] = useState([]);
  const [deliveryType, setDeliveryType] = useState("store");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tarjetaModalOpen, setTarjetaModalOpen] = useState(false);
  const [efectivoOpen, setEfectivoOpen] = useState(false);
  const [metodoPago, setMetodoPago] = useState("tarjeta"); // Puede ser "tarjeta" o "efectivo"

  // Cargar carrito desde localStorage
  useEffect(() => {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) setCarrito(JSON.parse(carritoGuardado));
  }, []);

  const agregarAlCarrito = (producto) => {
    const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
    const productoExistente = carritoActual.find(item => item._id === producto._id);

    let nuevoCarrito;
    if (productoExistente) {
      nuevoCarrito = carritoActual.map(item =>
        item._id === producto._id ? { ...item, cantidad: item.cantidad + 1 } : item
      );
    } else {
      nuevoCarrito = [...carritoActual, { ...producto, cantidad: 1 }];
    }

    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    window.dispatchEvent(new Event('carritoActualizado'));
  };

  const subtotal = carrito.reduce(
    (sum, item) => sum + item.precioVenta * item.cantidad,
    0
  );
  const costoEnvio = deliveryType === "home" ? 5.0 : 0;
  const total = subtotal + costoEnvio;

  const eliminarProducto = (productoId) => {
    const nuevoCarrito = carrito.filter((item) => item._id !== productoId);
    setCarrito(nuevoCarrito);
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    const nuevoCarrito = carrito.map((item) =>
      item._id === productoId ? { ...item, cantidad: nuevaCantidad } : item
    );
    setCarrito(nuevoCarrito);
  };

  // Pago con tarjeta física
  const iniciarPagoTarjetaFisica = () => {
    if (carrito.length === 0) {
      setError("El carrito está vacío");
      return;
    }

    const usuario = authService.getCurrentUser();
    if (!usuario) {
      setError("Debes iniciar sesión para continuar");
      return;
    }

    const ventaData = {
      productos: carrito.map((item) => ({
        producto: item._id,
        cantidad: item.cantidad,
        precioUnitario: item.precioVenta,
        subtotal: item.precioVenta * item.cantidad,
      })),
      total,
      cliente: usuario.id,
      empleado: usuario.id,
      metodoPago: "tarjeta física",
    };

    setMetodoPago("tarjeta física");
    setTarjetaModalOpen(true);
    window.ventaTemporal = ventaData;
  };

  // Pago en efectivo
  const iniciarPagoEfectivo = () => {
    if (carrito.length === 0) {
      setError("El carrito está vacío");
      return;
    }

    const usuario = authService.getCurrentUser();
    if (!usuario) {
      setError("Debes iniciar sesión para continuar");
      return;
    }

    const ventaData = {
      productos: carrito.map((item) => ({
        producto: item._id,
        cantidad: item.cantidad,
        precioUnitario: item.precioVenta,
        subtotal: item.precioVenta * item.cantidad,
      })),
      total,
      cliente: usuario.id,
      empleado: usuario.id,
      metodoPago: "efectivo",
    };

    setMetodoPago("efectivo");
    setEfectivoOpen(true);
    window.ventaTemporal = ventaData;
  };

  return (
    <>
      <Container
        maxWidth={false}
        sx={{ py: 4, backgroundColor: "#f1f1f1", minHeight: "100vh" }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ ml: 3 }}>
          Pedido en Línea
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, mx: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mx: { xs: 0, md: "auto" } }}>
          {/* Carrito */}
          <Grid xs={12} md={4}>
            <Card elevation={0} sx={{ height: "100%" }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="bold">
                    Carrito ({carrito.length} productos)
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    Subtotal
                  </Typography>
                </Box>
                <Divider sx={{ mb: 1.5 }} />
                <Box sx={{ maxHeight: "60vh", overflowY: "auto" }}>
                  {carrito.length > 0 ? (
                    carrito.map((producto) => (
                      <ProductoItem
                        key={producto._id}
                        producto={producto}
                        onEliminar={eliminarProducto}
                        onActualizarCantidad={actualizarCantidad}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                      El carrito está vacío
                    </Typography>
                  )}
                </Box>
              </CardContent>
              <CardContent sx={{ pt: 0 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Envío:</Typography>
                  <Typography variant="body2">${costoEnvio.toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box display="flex" justifyContent="space-between" mt={1} pt={1}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6" fontWeight="bold">${total.toFixed(2)}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Tipo de Entrega y Forma de Pago */}
          <Grid xs={12} md={4}>
            <Card elevation={0} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Tipo De Entrega
                </Typography>
                <RadioGroup
                  value={deliveryType}
                  onChange={(e) => setDeliveryType(e.target.value)}
                  name="delivery-type-group"
                >
                  <FormControlLabel value="store" control={<Radio />} label="Recoger En Tienda" />
                  <FormControlLabel
                    value="home"
                    control={<Radio />}
                    label={
                      <Box component="span">
                        Entrega A Domicilio
                        <Typography variant="caption" color="text.secondary" ml={0.5}>
                          (Costo Extra: $5.00)
                        </Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
              </CardContent>
            </Card>

            <Card elevation={0}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Forma De Pago
                </Typography>
                <Box display="flex" flexDirection="column" alignItems="center" py={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={carrito.length === 0 || loading}
                    onClick={iniciarPagoTarjetaFisica}
                    sx={{
                      backgroundColor: "#fbe4e7",
                      color: "black",
                      "&:hover": { backgroundColor: "#f9d4da" },
                      maxWidth: 300,
                      p: 1.5,
                      mb: 1,
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : "Pagar con Tarjeta (Terminal)"}
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    disabled={carrito.length === 0 || loading}
                    onClick={iniciarPagoEfectivo}
                    sx={{ maxWidth: 300, p: 1.5 }}
                  >
                    Pagar en Efectivo
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Confirmación de Pedido */}
          <Grid xs={12} md={4}>
            <Card elevation={0} sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Confirmación De Pedido
                </Typography>
                {carrito.length > 0 ? (
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      <strong>Productos:</strong> {carrito.length}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Entrega:</strong>{" "}
                      {deliveryType === "store" ? "Recoger en tienda" : "A domicilio"}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Envío:</strong> ${costoEnvio.toFixed(2)}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      <strong>Total:</strong> ${total.toFixed(2)}
                    </Typography>
                  </Box>
                ) : (
                  <Box height="calc(100% - 40px)" display="flex" alignItems="center" justifyContent="center">
                    <Typography variant="body2" color="text.secondary">
                      Agrega productos al carrito para ver el resumen
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Modales de Pago */}
      <TarjetaFisicaModal
        open={tarjetaModalOpen}
        onClose={() => setTarjetaModalOpen(false)}
        carrito={carrito}
        total={total}
      />

      <EfectivoModal
        open={efectivoOpen}
        onClose={() => setEfectivoOpen(false)}
        total={total}
        carrito={carrito}
        metodoPago={metodoPago}
      />
    </>
  );
};

export default Carrito;
