import React, { useEffect, useState } from "react";
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
  TextField,
  InputAdornment,
  Button,
  Checkbox,
  Divider,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar
} from "@mui/material";
import {
  Search,
  Store,
  AddCircle,
  Compare,
  Receipt,
  Edit,
  Delete,
  Add,
  Refresh
} from "@mui/icons-material";

import ModalCompararProveedores from "../../components/ModalCompararProveedores.jsx";
import ModalCrearProveedor from "../../components/ModalCrearProveedor.jsx";
import ModalOrdenCompra from "../../components/ModalOrdenCompra.jsx";

const API_BASE = "http://localhost:4000";

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [seleccionados, setSeleccionados] = useState([]);
  const [comparacion, setComparacion] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openCrear, setOpenCrear] = useState(false);
  const [openOrden, setOpenOrden] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_BASE}/api/proveedores`);
      if (!res.ok) throw new Error("Error al cargar proveedores");
      const data = await res.json();
      setProveedores(data);
    } catch (err) {
      console.error('Error al cargar proveedores:', err);
      setError('Error al cargar los proveedores: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Seleccionar proveedor ---
  const handleSeleccionar = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // --- Comparar dos proveedores ---
  const handleComparar = () => {
    if (seleccionados.length !== 2) {
      mostrarSnackbar("Selecciona exactamente dos proveedores para comparar.", "warning");
      return;
    }

    const [p1, p2] = seleccionados.map((id) =>
      proveedores.find((p) => p._id === id)
    );

    const comparacionData = compararProveedores(p1, p2);
    setComparacion(comparacionData);
    setOpenModal(true);
  };

  const compararProveedores = (p1, p2) => {
    const resultados = [];
    
    // Comparar productos suministrados
    p1.productosSuministrados?.forEach((prod1) => {
      const prod2 = p2.productosSuministrados?.find(
        (item) => item.materiaPrima?._id === prod1.materiaPrima?._id
      );
      if (prod2) {
        const precioA = prod1.precioUnitario || prod1.costoCaja / (prod1.cantidadPorCaja || 1);
        const precioB = prod2.precioUnitario || prod2.costoCaja / (prod2.cantidadPorCaja || 1);
        
        const mejor = precioA < precioB ? p1.nombre : precioA > precioB ? p2.nombre : "Empate";
        
        resultados.push({
          nombre: prod1.materiaPrima?.nombre || 'Producto',
          precioA: precioA.toFixed(2),
          precioB: precioB.toFixed(2),
          tiempoA: "2-3 días", // Valores por defecto
          tiempoB: "2-3 días",
          mejor,
          proveedorA: p1.nombre,
          proveedorB: p2.nombre,
        });
      }
    });
    
    return resultados;
  };

  // --- Agregar proveedor ---
  const handleGuardarProveedor = async (nuevoProveedor) => {
    try {
      const res = await fetch(`${API_BASE}/api/proveedores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoProveedor)
      });

      if (!res.ok) throw new Error("Error al crear proveedor");

      const proveedorCreado = await res.json();
      setProveedores([...proveedores, proveedorCreado]);
      setOpenCrear(false);
      mostrarSnackbar("Proveedor creado exitosamente", "success");
    } catch (err) {
      console.error('Error al crear proveedor:', err);
      mostrarSnackbar("Error al crear el proveedor", "error");
    }
  };

  // --- Editar proveedor ---
  const handleEditarProveedor = async (id) => {
    const nombre = prompt("Nuevo nombre del proveedor:");
    if (!nombre) return;

    try {
      const res = await fetch(`${API_BASE}/api/proveedores/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre })
      });

      if (!res.ok) throw new Error("Error al actualizar proveedor");

      setProveedores(proveedores.map((p) => p._id === id ? { ...p, nombre } : p));
      mostrarSnackbar("Proveedor actualizado exitosamente", "success");
    } catch (err) {
      console.error('Error al actualizar proveedor:', err);
      mostrarSnackbar("Error al actualizar el proveedor", "error");
    }
  };

  // --- Eliminar proveedor ---
  const handleEliminarProveedor = async (id) => {
    if (!window.confirm("¿Deseas eliminar este proveedor?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/proveedores/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Error al eliminar proveedor");

      setProveedores(proveedores.filter((p) => p._id !== id));
      mostrarSnackbar("Proveedor eliminado exitosamente", "success");
    } catch (err) {
      console.error('Error al eliminar proveedor:', err);
      mostrarSnackbar("Error al eliminar el proveedor", "error");
    }
  };

  const mostrarSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const proveedoresFiltrados = proveedores.filter((p) =>
    p.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

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
          <Typography variant="h4" fontWeight="bold" color="#e91e63">
            Administración de Proveedores
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Gestión, comparación y órdenes de compra
          </Typography>
        </Box>
        <Button
          startIcon={<Refresh />}
          onClick={cargarProveedores}
          variant="outlined"
        >
          Actualizar
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* 🔍 Búsqueda y botones */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <TextField
          placeholder="Buscar proveedor..."
          variant="outlined"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
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
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Compare />}
            sx={{
              backgroundColor: "#4caf50",
              "&:hover": { backgroundColor: "#388e3c" },
              borderRadius: 2,
            }}
            disabled={seleccionados.length !== 2}
            onClick={handleComparar}
          >
            Comparar
          </Button>

          <Button
            variant="contained"
            startIcon={<AddCircle />}
            sx={{
              backgroundColor: "#e91e63",
              "&:hover": { backgroundColor: "#c2185b" },
              borderRadius: 2,
            }}
            onClick={() => setOpenCrear(true)}
          >
            Nuevo
          </Button>

          <Button
            variant="contained"
            startIcon={<Receipt />}
            sx={{
              backgroundColor: "#2196f3",
              "&:hover": { backgroundColor: "#1976d2" },
              borderRadius: 2,
            }}
            onClick={() => setOpenOrden(true)}
          >
            Orden
          </Button>
        </Box>
      </Box>

      {/* 📋 Tabla de proveedores */}
      <TableContainer
        component={Paper}
        sx={{
          border: "1px solid #f8bbd0",
          borderRadius: 2,
          backgroundColor: "#fff0f5",
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#fce4ec" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Sel.</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Proveedor</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Contacto</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Productos</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proveedoresFiltrados.map((p) => (
              <TableRow
                key={p._id}
                hover
                sx={{
                  "&:hover": { backgroundColor: "#f8bbd0" },
                }}
              >
                <TableCell>
                  <Checkbox
                    checked={seleccionados.includes(p._id)}
                    onChange={() => handleSeleccionar(p._id)}
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Store fontSize="small" color="action" />
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {p.nombre}
                      </Typography>
                      {p.marca && (
                        <Typography variant="caption" color="text.secondary">
                          {p.marca}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{p.contacto || p.nombre}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {p.telefono || 'Sin teléfono'}
                  </Typography>
                  {p.email && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      {p.email}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {p.productosSuministrados?.map((prod, index) => (
                    <Chip
                      key={index}
                      label={`${prod.materiaPrima?.nombre || 'Producto'} ($${prod.precioUnitario?.toFixed(2) || '0.00'})`}
                      size="small"
                      variant="outlined"
                      sx={{
                        mr: 0.5,
                        mb: 0.5,
                        backgroundColor: "white",
                        borderColor: "#e91e63",
                      }}
                    />
                  ))}
                  {(!p.productosSuministrados || p.productosSuministrados.length === 0) && (
                    <Typography variant="caption" color="text.secondary">
                      Sin productos
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton
                      onClick={() => handleEditarProveedor(p._id)}
                      color="secondary"
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      onClick={() => handleEliminarProveedor(p._id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {proveedoresFiltrados.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No se encontraron proveedores
          </Typography>
        </Box>
      )}

      {/* 📊 Resumen */}
      <Divider sx={{ my: 3 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: "center", backgroundColor: "#fce4ec" }}>
            <Typography variant="h6" fontWeight="bold">
              Total de Proveedores
            </Typography>
            <Typography variant="h4" color="#e91e63">
              {proveedores.length}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: "center", backgroundColor: "#f3e5f5" }}>
            <Typography variant="h6" fontWeight="bold">
              Proveedores Activos
            </Typography>
            <Typography variant="h4" color="secondary.main">
              {proveedores.filter(p => p.activo !== false).length}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: "center", backgroundColor: "#f8bbd0" }}>
            <Typography variant="h6" fontWeight="bold">
              Seleccionados
            </Typography>
            <Typography variant="h4" color="secondary.main">
              {seleccionados.length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Modales */}
      <ModalCompararProveedores
        open={openModal}
        onClose={() => setOpenModal(false)}
        comparacion={comparacion}
      />
      <ModalCrearProveedor
        open={openCrear}
        onClose={() => setOpenCrear(false)}
        onGuardar={handleGuardarProveedor}
      />
      <ModalOrdenCompra
        open={openOrden}
        onClose={() => setOpenOrden(false)}
        proveedores={proveedores}
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
}
