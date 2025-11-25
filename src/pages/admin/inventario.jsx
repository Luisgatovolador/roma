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
  Chip,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Snackbar,
  Modal
} from "@mui/material";
import { 
  Search, 
  Inventory2, 
  AddCircle, 
  Warning,
  Edit,
  Delete,
  Refresh,
  Close
} from "@mui/icons-material";

// Función para color del estado
const getEstadoColor = (stock) => {
  if (stock === 0) return "error";
  if (stock < 10) return "warning";
  return "success";
};

const getEstadoTexto = (stock) => {
  if (stock === 0) return "Agotado";
  if (stock < 10) return "Bajo";
  return "Suficiente";
};

// Estilo para el modal
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 450, md: 550 },
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  border: "4px solid #fbe4e7",
};

const API_BASE = "http://localhost:4000";

// --- MODAL DE CREAR/EDITAR ---
const CreateProductModal = ({ open, handleClose, onSave, producto }) => {
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    precioVenta: "",
    stock: "",
    proveedor: "",
    imagen: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Categorías disponibles
  const categorias = [
    "Bebidas",
    "Bebidas Calientes",
    "Bebidas Frías", 
    "Panadería",
    "Pastelería",
    "Sandwiches",
    "Ensaladas",
    "Snacks",
    "Otros"
  ];

  useEffect(() => {
    if (producto) {
      // Modo edición
      setForm({
        nombre: producto.nombre || "",
        categoria: producto.categoria || "",
        precioVenta: producto.precioVenta || "",
        stock: producto.stock || "",
        proveedor: producto.proveedor || "",
        imagen: null,
      });
      setPreview(producto.imagen ? `${API_BASE}${producto.imagen}` : null);
    } else {
      // Modo creación
      setForm({
        nombre: "",
        categoria: "",
        precioVenta: "",
        stock: "",
        proveedor: "",
        imagen: null,
      });
      setPreview(null);
    }
    setError("");
  }, [open, producto]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagen") {
      const file = files[0];
      setForm({ ...form, imagen: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validaciones básicas
      if (!form.nombre.trim()) {
        throw new Error("El nombre del producto es requerido");
      }
      if (!form.categoria) {
        throw new Error("La categoría es requerida");
      }
      if (!form.precioVenta || form.precioVenta <= 0) {
        throw new Error("El precio de venta debe ser mayor a 0");
      }
      if (!form.stock || form.stock < 0) {
        throw new Error("El stock no puede ser negativo");
      }

      const formData = new FormData();
      
      // Agregar campos del formulario usando el mismo método que funciona
      for (const key in form) {
        if (form[key] !== null && form[key] !== undefined) {
          formData.append(key, form[key]);
        }
      }

      const url = producto
        ? `${API_BASE}/api/productos/${producto._id}`
        : `${API_BASE}/api/productos`;
      const method = producto ? "PUT" : "POST";

      console.log("📤 Enviando producto:", {
        url,
        method,
        datos: Object.fromEntries(formData)
      });

      const res = await fetch(url, { 
        method, 
        body: formData 
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al guardar producto");
      }

      onSave();
      handleClose();
    } catch (err) {
      console.error("❌ Error al guardar producto:", err);
      setError(err.message || "Error al guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  const quitarImagen = () => {
    setForm({ ...form, imagen: null });
    setPreview(null);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
        <Typography
          variant="h5"
          sx={{ mb: 3, fontWeight: "bold", color: "#e91e63" }}
        >
          {producto ? "Editar Producto" : "Crear Nuevo Producto"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="NOMBRE *"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              size="small"
              margin="normal"
              placeholder="Ej: Coca-cola, Café Americano, etc."
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="CATEGORÍA *"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              required
              size="small"
              margin="normal"
            >
              {categorias.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="PRECIO *"
              name="precioVenta"
              value={form.precioVenta}
              onChange={handleChange}
              type="number"
              required
              size="small"
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              placeholder="0.00"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="STOCK *"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              type="number"
              required
              size="small"
              margin="normal"
              placeholder="Cantidad disponible"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="PROVEEDOR"
              name="proveedor"
              value={form.proveedor}
              onChange={handleChange}
              size="small"
              margin="normal"
              placeholder="Opcional"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mt: 1, mb: 1, color: "text.secondary" }}>
              IMAGEN DEL PRODUCTO
            </Typography>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{
                borderColor: "#e91e63",
                color: "#e91e63",
                "&:hover": { 
                  borderColor: "#c2185b",
                  backgroundColor: "#fbe4e7"
                },
              }}
            >
              Seleccionar Imagen
              <input
                type="file"
                hidden
                accept="image/*"
                name="imagen"
                onChange={handleChange}
              />
            </Button>
            {preview && (
              <Box mt={2} textAlign="center" position="relative" display="inline-block">
                <img
                  src={preview}
                  alt="Vista previa"
                  style={{ 
                    width: "120px", 
                    height: "120px", 
                    borderRadius: "8px",
                    objectFit: "cover" 
                  }}
                />
                <IconButton
                  size="small"
                  onClick={quitarImagen}
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    backgroundColor: "error.main",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "error.dark",
                    },
                  }}
                >
                  <Close />
                </IconButton>
              </Box>
            )}
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            * Campos obligatorios
          </Typography>
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            mt: 3,
            backgroundColor: "#e91e63",
            "&:hover": { backgroundColor: "#c2185b" },
            fontWeight: "bold",
            py: 1.5
          }}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Guardando..." : (producto ? "ACTUALIZAR PRODUCTO" : "CREAR PRODUCTO")}
        </Button>
      </Box>
    </Modal>
  );
};

const InventarioProductos = () => {
  const [busqueda, setBusqueda] = useState("");
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [productoEdit, setProductoEdit] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_BASE}/api/productos`);
      if (!res.ok) throw new Error("Error al cargar productos");
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError('Error al cargar el inventario: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (producto) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el producto "${producto.nombre}"?`)) {
      try {
        const res = await fetch(`${API_BASE}/api/productos/${producto._id}`, { 
          method: "DELETE" 
        });
        if (!res.ok) throw new Error("Error al eliminar producto");
        mostrarSnackbar("Producto eliminado correctamente", "success");
        cargarProductos();
      } catch (err) {
        console.error('Error al eliminar producto:', err);
        mostrarSnackbar("Error al eliminar el producto", "error");
      }
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleBuscar = (e) => {
    const valor = e.target.value.toLowerCase();
    setBusqueda(valor);
  };

  const handleEditar = (producto) => {
    setProductoEdit(producto);
    setDialogOpen(true);
  };

  const handleGuardarProducto = () => {
    cargarProductos();
    mostrarSnackbar(
      productoEdit ? "Producto actualizado correctamente" : "Producto creado correctamente", 
      "success"
    );
  };

  const mostrarSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre?.toLowerCase().includes(busqueda) ||
      (p.categoria && p.categoria.toLowerCase().includes(busqueda))
  );

  const productosBajoStock = productos.filter(p => p.stock < 10);
  const productosAgotados = productos.filter(p => p.stock === 0);

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "white", borderRadius: 2, boxShadow: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Inventario de Productos
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Control y seguimiento de existencias
          </Typography>
        </Box>
        <Button
          startIcon={<Refresh />}
          onClick={cargarProductos}
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
            <Button color="inherit" size="small" onClick={cargarProductos}>
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Barra de búsqueda */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <TextField
          placeholder="Buscar por nombre o categoría..."
          variant="outlined"
          value={busqueda}
          onChange={handleBuscar}
          size="small"
          sx={{ width: "70%" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddCircle />}
          sx={{
            backgroundColor: "#e91e63",
            "&:hover": { backgroundColor: "#c2185b" },
            borderRadius: 2,
          }}
          onClick={() => {
            setProductoEdit(null);
            setDialogOpen(true);
          }}
        >
          Nuevo Producto
        </Button>
      </Box>

      {/* Tabla de productos */}
      <TableContainer
        component={Paper}
        sx={{
          border: "1px solid #f9d4da",
          borderRadius: 2,
          backgroundColor: "#fffafc",
          mb: 3
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#fbe4e7" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Producto</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Categoría</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">Stock</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">Precio Venta</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">Estado</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {productosFiltrados.map((producto) => (
              <TableRow
                key={producto._id}
                hover
                sx={{
                  "&:hover": { backgroundColor: "#fef2f4" },
                }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {producto.imagen ? (
                      <img 
                        src={`${API_BASE}${producto.imagen}`} 
                        alt={producto.nombre}
                        style={{ 
                          width: "40px", 
                          height: "40px", 
                          objectFit: "cover",
                          borderRadius: "4px"
                        }}
                      />
                    ) : (
                      <Inventory2 fontSize="small" color="action" />
                    )}
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {producto.nombre}
                      </Typography>
                      {producto.proveedor && (
                        <Typography variant="caption" color="text.secondary">
                          Proveedor: {producto.proveedor}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{producto.categoria || 'Sin categoría'}</TableCell>
                <TableCell align="center">
                  <Typography 
                    variant="body2" 
                    fontWeight="bold"
                    color={producto.stock === 0 ? 'error.main' : producto.stock < 10 ? 'warning.main' : 'success.main'}
                  >
                    {producto.stock || 0} pza
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="bold">
                    ${producto.precioVenta?.toFixed(2) || '0.00'}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={getEstadoTexto(producto.stock)}
                    color={getEstadoColor(producto.stock)}
                    variant="outlined"
                    size="small"
                    icon={producto.stock < 10 ? <Warning /> : undefined}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => handleEditar(producto)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => handleEliminar(producto)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {productosFiltrados.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No se encontraron productos
          </Typography>
        </Box>
      )}

      {/* Resumen general */}
      <Divider sx={{ my: 3 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: "center", backgroundColor: "#fdf3f5" }}>
            <Typography variant="h6" fontWeight="bold">
              Total de Productos
            </Typography>
            <Typography variant="h4" color="primary.main">
              {productos.length}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: "center", backgroundColor: "#fdf3f5" }}>
            <Typography variant="h6" fontWeight="bold">
              Stock Bajo
            </Typography>
            <Typography variant="h4" color="warning.main">
              {productosBajoStock.length}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: "center", backgroundColor: "#fdf3f5" }}>
            <Typography variant="h6" fontWeight="bold">
              Agotados
            </Typography>
            <Typography variant="h4" color="error.main">
              {productosAgotados.length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Modal para agregar/editar producto */}
      <CreateProductModal
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        onSave={handleGuardarProducto}
        producto={productoEdit}
      />

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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

export default InventarioProductos;
