import React, { useState, useEffect } from "react";
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
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Snackbar
} from "@mui/material";
import {
  Search,
  Add,
  Remove,
  Delete,
  ShoppingCart,
  CreditCard,
  Money,
  ReceiptLong,
  Close
} from "@mui/icons-material";

const API_BASE = "http://localhost:4000";

const PuntoDeVenta = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Cargar productos
  useEffect(() => {
    cargarProductos();
    // Cargar carrito desde localStorage
    const carritoGuardado = localStorage.getItem('carritoVentas');
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  }, []);

  // Guardar carrito en localStorage
  useEffect(() => {
    localStorage.setItem('carritoVentas', JSON.stringify(carrito));
  }, [carrito]);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/productos`);
      if (!res.ok) throw new Error("Error al cargar productos");
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError('Error al cargar productos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Categorías únicas
  const categorias = ['Todas', ...new Set(productos.map(p => p.categoria).filter(Boolean))];

  // Filtrar productos
  const productosFiltrados = productos.filter(p => {
    const coincideBusqueda = p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
                            p.categoria?.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaActiva === 'Todas' || p.categoria === categoriaActiva;
    return coincideBusqueda && coincideCategoria;
  });

  // Funciones del carrito
  const agregarAlCarrito = (producto) => {
    if (producto.stock === 0) {
      mostrarSnackbar("Producto agotado", "warning");
      return;
    }

    const productoExistente = carrito.find(item => item._id === producto._id);
    
    if (productoExistente) {
      if (productoExistente.cantidad >= producto.stock) {
        mostrarSnackbar("No hay suficiente stock", "warning");
        return;
      }
      setCarrito(carrito.map(item =>
        item._id === producto._id 
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCarrito([...carrito, {
        ...producto,
        cantidad: 1
      }]);
    }
    mostrarSnackbar(`Agregado: ${producto.nombre}`, "success");
  };

  const aumentarCantidad = (productoId) => {
    const producto = carrito.find(item => item._id === productoId);
    const productoStock = productos.find(p => p._id === productoId)?.stock || 0;
    
    if (producto.cantidad >= productoStock) {
      mostrarSnackbar("No hay suficiente stock", "warning");
      return;
    }
    
    setCarrito(carrito.map(item =>
      item._id === productoId 
        ? { ...item, cantidad: item.cantidad + 1 }
        : item
    ));
  };

  const disminuirCantidad = (productoId) => {
    setCarrito(carrito.map(item =>
      item._id === productoId && item.cantidad > 1
        ? { ...item, cantidad: item.cantidad - 1 }
        : item
    ));
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito(carrito.filter(item => item._id !== productoId));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    mostrarSnackbar("Carrito vaciado", "info");
  };

  // Cálculos
  const subtotal = carrito.reduce((sum, item) => sum + (item.precioVenta * item.cantidad), 0);
  const total = subtotal;

  // Procesar venta
  const procesarVenta = async () => {
    if (carrito.length === 0) {
      mostrarSnackbar("El carrito está vacío", "warning");
      return;
    }

    try {
      const ventaData = {
        productos: carrito.map(item => ({
          producto: item._id,
          cantidad: item.cantidad,
          precioUnitario: item.precioVenta,
          subtotal: item.precioVenta * item.cantidad
        })),
        total: total,
        metodoPago: metodoPago,
        estado: "pagado"
      };

      const res = await fetch(`${API_BASE}/api/ventas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ventaData)
      });

      if (!res.ok) throw new Error("Error al procesar la venta");

      const ventaCreada = await res.json();
      
      // Actualizar stock de productos
      await Promise.all(
        carrito.map(item =>
          fetch(`${API_BASE}/api/productos/${item._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              stock: item.stock - item.cantidad
            })
          })
        )
      );

      mostrarSnackbar(`Venta procesada exitosamente - Total: $${total.toFixed(2)}`, "success");
      setCarrito([]);
      setDialogOpen(false);
      cargarProductos(); // Recargar productos para actualizar stock
    } catch (err) {
      console.error('Error al procesar venta:', err);
      mostrarSnackbar("Error al procesar la venta", "error");
    }
  };

  const mostrarSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "white", borderRadius: 2, boxShadow: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Punto de Venta
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Sistema de ventas rápido y eficiente
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Chip
            icon={<ShoppingCart />}
            label={`${carrito.length} productos`}
            color="primary"
            variant="outlined"
          />
          <Button
            variant="contained"
            startIcon={<ReceiptLong />}
            onClick={() => setDialogOpen(true)}
            disabled={carrito.length === 0}
            sx={{
              backgroundColor: "#e91e63",
              "&:hover": { backgroundColor: "#c2185b" },
            }}
          >
            Finalizar Venta (${total.toFixed(2)})
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Columna izquierda - Catálogo de productos */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <TextField
                placeholder="Buscar productos..."
                variant="outlined"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                size="small"
                sx={{ width: "60%" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <Box display="flex" gap={1} flexWrap="wrap">
                {categorias.map((cat) => (
                  <Button
                    key={cat}
                    variant={cat === categoriaActiva ? "contained" : "outlined"}
                    size="small"
                    onClick={() => setCategoriaActiva(cat)}
                    sx={{
                      backgroundColor: cat === categoriaActiva ? "#fbe4e7" : "transparent",
                      color: "black",
                      borderColor: "#fbe4e7",
                    }}
                  >
                    {cat}
                  </Button>
                ))}
              </Box>
            </Box>
          </Paper>

          {/* Grid de productos */}
          <Grid container spacing={2}>
            {productosFiltrados.map((producto) => (
              <Grid item xs={12} sm={6} md={4} key={producto._id}>
                <Card
                  sx={{
                    height: "100%",
                    cursor: producto.stock > 0 ? "pointer" : "not-allowed",
                    opacity: producto.stock > 0 ? 1 : 0.6,
                    transition: "all 0.3s ease",
                    "&:hover": producto.stock > 0 ? {
                      transform: "translateY(-4px)",
                      boxShadow: 3
                    } : {}
                  }}
                  onClick={() => producto.stock > 0 && agregarAlCarrito(producto)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box
                      sx={{
                        height: 120,
                        backgroundColor: "#f5f5f5",
                        borderRadius: 1,
                        mb: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}
                    >
                      {producto.imagen ? (
                        <img 
                          src={`${API_BASE}${producto.imagen}`} 
                          alt={producto.nombre}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover' 
                          }}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Sin imagen
                        </Typography>
                      )}
                    </Box>

                    <Typography variant="body1" fontWeight="medium" noWrap>
                      {producto.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.primary" fontWeight="bold">
                      ${producto.precioVenta?.toFixed(2)}
                    </Typography>
                    <Typography variant="caption" color={producto.stock > 0 ? 'success.main' : 'error.main'}>
                      {producto.stock > 0 ? `${producto.stock} disponibles` : 'Agotado'}
                    </Typography>
                    {producto.stock > 0 && (
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{ mt: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          agregarAlCarrito(producto);
                        }}
                      >
                        Agregar
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {productosFiltrados.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                No se encontraron productos
              </Typography>
            </Box>
          )}
        </Grid>

        {/* Columna derecha - Carrito de compras */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, position: "sticky", top: 20 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Carrito de Venta
            </Typography>

            {carrito.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography variant="body2" color="text.secondary">
                  El carrito está vacío
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Agrega productos desde el catálogo
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Producto</TableCell>
                        <TableCell align="center">Cant.</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                        <TableCell align="center">Acción</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {carrito.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {item.nombre}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ${item.precioVenta?.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                              <IconButton 
                                size="small" 
                                onClick={() => disminuirCantidad(item._id)}
                                disabled={item.cantidad <= 1}
                              >
                                <Remove fontSize="small" />
                              </IconButton>
                              <Typography variant="body2">{item.cantidad}</Typography>
                              <IconButton 
                                size="small" 
                                onClick={() => aumentarCantidad(item._id)}
                                disabled={item.cantidad >= item.stock}
                              >
                                <Add fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="bold">
                              ${(item.precioVenta * item.cantidad).toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => eliminarDelCarrito(item._id)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ p: 2, backgroundColor: "#f9f9f9", borderRadius: 1 }}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Subtotal:</Typography>
                    <Typography fontWeight="bold">${subtotal.toFixed(2)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      ${total.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={vaciarCarrito}
                  sx={{ mt: 2 }}
                >
                  Vaciar Carrito
                </Button>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog de confirmación de venta */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              Confirmar Venta
            </Typography>
            <IconButton onClick={() => setDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Resumen de la venta:
          </Typography>

          <Box sx={{ mb: 3 }}>
            {carrito.map((item) => (
              <Box key={item._id} display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">
                  {item.nombre} x {item.cantidad}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  ${(item.precioVenta * item.cantidad).toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="space-between" mb={3}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              ${total.toFixed(2)}
            </Typography>
          </Box>

          <Typography variant="subtitle2" mb={1}>
            Método de Pago:
          </Typography>
          <Box display="flex" gap={1} mb={2}>
            {["Efectivo", "Tarjeta"].map((metodo) => (
              <Button
                key={metodo}
                variant={metodoPago === metodo ? "contained" : "outlined"}
                startIcon={metodo === "Efectivo" ? <Money /> : <CreditCard />}
                onClick={() => setMetodoPago(metodo)}
                sx={{
                  flex: 1,
                  backgroundColor: metodoPago === metodo ? "#e91e63" : "transparent",
                  borderColor: "#e91e63",
                  color: metodoPago === metodo ? "white" : "#e91e63",
                }}
              >
                {metodo}
              </Button>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={procesarVenta}
            sx={{
              backgroundColor: "#e91e63",
              "&:hover": { backgroundColor: "#c2185b" },
            }}
          >
            Confirmar Venta
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PuntoDeVenta;
