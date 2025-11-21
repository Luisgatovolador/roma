import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  InputAdornment,
  Grid,
  Modal,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const PRIMARY_COLOR = "#D7385E";
const LIGHT_PINK = "#F7E7EB";
const API_BASE = process.env.REACT_APP_API_BASE_URL;

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
  border: `4px solid ${LIGHT_PINK}`,
};

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

  useEffect(() => {
    if (producto) {
      setForm({
        nombre: producto.nombre,
        categoria: producto.categoria,
        precioVenta: producto.precioVenta,
        stock: producto.stock,
        proveedor: producto.proveedor,
        imagen: null,
      });
      setPreview(producto.imagen ? `${API_BASE}/${producto.imagen}` : null);
    } else {
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
  }, [producto]);

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
    try {
      const formData = new FormData();
      for (const key in form) formData.append(key, form[key]);

      const url = producto
        ? `${API_BASE}/api/productos/${producto._id}`
        : `${API_BASE}/api/productos`;
      const method = producto ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error("Error al guardar producto");

      onSave();
      handleClose();
    } catch (err) {
      console.error("❌ Error al guardar producto:", err);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
        <Typography
          variant="h5"
          sx={{ mb: 3, fontWeight: "bold", color: PRIMARY_COLOR }}
        >
          {producto ? "Editar Producto" : "Crear Nuevo Producto"}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="NOMBRE"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="CATEGORÍA"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              required
              size="small"
            >
              <MenuItem value="Frutas">Frutas</MenuItem>
              <MenuItem value="Lacteos">Lácteos</MenuItem>
              <MenuItem value="Panaderia">Panadería</MenuItem>
              <MenuItem value="Bebidas">Bebidas</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="PRECIO"
              name="precioVenta"
              value={form.precioVenta}
              onChange={handleChange}
              type="number"
              required
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="STOCK"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              type="number"
              required
              size="small"
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
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
              sx={{
                backgroundColor: PRIMARY_COLOR,
                "&:hover": { backgroundColor: "#C03350" },
              }}
            >
              Subir Imagen
              <input
                type="file"
                hidden
                accept="image/*"
                name="imagen"
                onChange={handleChange}
              />
            </Button>
            {preview && (
              <Box mt={2} textAlign="center">
                <img
                  src={preview}
                  alt="Vista previa"
                  style={{ width: "100px", borderRadius: "8px" }}
                />
              </Box>
            )}
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 4,
            backgroundColor: LIGHT_PINK,
            color: "#000",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#E0D0D4" },
          }}
        >
          {producto ? "GUARDAR CAMBIOS" : "GUARDAR PRODUCTO"}
        </Button>
      </Box>
    </Modal>
  );
};

// --- COMPONENTE PRINCIPAL ---
const ProductManagement = () => {
  const [productos, setProductos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [productoEdit, setProductoEdit] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  const getProductos = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/productos`);
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error("❌ Error al obtener productos:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    await fetch(`${API_BASE}/api/productos/${id}`, { method: "DELETE" });
    getProductos();
  };

  useEffect(() => {
    getProductos();
  }, []);

  const productosFiltrados = productos.filter((p) => {
    const coincideBusqueda = p.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaFiltro
      ? p.categoria === categoriaFiltro
      : true;
    return coincideBusqueda && coincideCategoria;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Encabezado */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Gestión De Productos
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            select
            label="Filtrar por categoría"
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            size="small"
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">Todas</MenuItem>
            <MenuItem value="Frutas">Frutas</MenuItem>
            <MenuItem value="Lacteos">Lácteos</MenuItem>
            <MenuItem value="Panaderia">Panadería</MenuItem>
            <MenuItem value="Bebidas">Bebidas</MenuItem>
          </TextField>

          <TextField
            placeholder="Buscar producto"
            variant="outlined"
            size="small"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: PRIMARY_COLOR }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: "20px",
                backgroundColor: LIGHT_PINK,
              },
            }}
          />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: PRIMARY_COLOR,
              "&:hover": { backgroundColor: "#C03350" },
              textTransform: "none",
              fontWeight: "bold",
            }}
            onClick={() => {
              setProductoEdit(null);
              setOpenModal(true);
            }}
          >
            Nuevo Producto +
          </Button>
        </Box>
      </Box>

      {/* Tabla */}
      <Paper elevation={0} sx={{ border: "1px solid #e0e0e0" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Imagen</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productosFiltrados.map((producto) => (
                <TableRow key={producto._id}>
                  <TableCell>
                    {producto.imagen ? (
                      <img
                        src={`${API_BASE}${producto.imagen}`}
                        alt={producto.nombre}
                        width="60"
                      />
                    ) : (
                      "Sin imagen"
                    )}
                  </TableCell>
                  <TableCell>{producto.nombre}</TableCell>
                  <TableCell>{producto.categoria}</TableCell>
                  <TableCell>${producto.precioVenta}</TableCell>
                  <TableCell>{producto.stock}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleDelete(producto._id)}
                      aria-label="eliminar"
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setProductoEdit(producto);
                        setOpenModal(true);
                      }}
                      aria-label="editar"
                    >
                      <EditIcon color="primary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modal */}
      <CreateProductModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        onSave={getProductos}
        producto={productoEdit}
      />
    </Container>
  );
};

export default ProductManagement;
