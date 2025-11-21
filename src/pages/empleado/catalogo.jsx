import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  CircularProgress,
  Alert
} from "@mui/material";
import { productoService } from "../../services/productoService";

const ProductoCard = ({ producto, onAgregarCarrito }) => {
  return (
    <Card
      elevation={0}
      sx={{
        position: "relative",
        border: "1px solid #ddd",
        p: 1,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        }
      }}
    >
      {producto.precioVenta < producto.precioRegular && (
        <Chip
          label="PROM"
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "error.main",
            color: "white",
            fontWeight: "bold",
            zIndex: 1,
            height: 20,
          }}
        />
      )}

      <CardContent sx={{ p: 1, "&:last-child": { pb: 1 }, flexGrow: 1 }}>
        <Box
          sx={{
            height: 140,
            backgroundColor: "#fbe4e7",
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
              src={`http://localhost:4000${producto.imagen}`} 
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
          ${producto.precioVenta?.toFixed(2) || '0.00'}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ 
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {producto.descripcion || 'Sin descripción'}
        </Typography>
        <Typography variant="caption" display="block" color={producto.stock > 0 ? 'success.main' : 'error.main'}>
          {producto.stock > 0 ? `${producto.stock} disponibles` : 'Agotado'}
        </Typography>
      </CardContent>

      <Box display="flex" justifyContent="flex-end" px={1} pb={1}>
        <Button
          variant="outlined"
          size="small"
          fullWidth
          disabled={producto.stock === 0}
          onClick={() => onAgregarCarrito(producto)}
          sx={{
            borderColor: "#fbe4e7",
            color: "black",
            backgroundColor: "#fff",
            "&:hover": {
              backgroundColor: "#f9d4da",
              borderColor: "#fbe4e7",
            },
            "&:disabled": {
              borderColor: '#ccc',
              color: '#ccc'
            }
          }}
        >
          {producto.stock > 0 ? 'Agregar' : 'Agotado'}
        </Button>
      </Box>
    </Card>
  );
};

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [carrito, setCarrito] = useState(
    JSON.parse(localStorage.getItem('carrito')) || []
  );

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);
  

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const response = await productoService.getProductos();
      setProductos(response.data);
      console.log(response)
      
      // Extraer categorías únicas
      const cats = ['Todas', ...new Set(response.data.map(p => p.categoria).filter(Boolean))];
      setCategorias(cats);
    } catch (err) {
      setError('Error al cargar los productos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const productosFiltrados = categoriaActiva === 'Todas' 
    ? productos 
    : productos.filter(p => p.categoria === categoriaActiva);

    const agregarAlCarrito = (producto) => {
      const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
      
      const productoExistente = carritoActual.find(item => item._id === producto._id);
      
      if (productoExistente) {
        // Si ya existe, aumentar cantidad
        const nuevoCarrito = carritoActual.map(item =>
          item._id === producto._id 
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
        setCarrito(nuevoCarrito);
        localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
      } else {
        // Si no existe, agregar nuevo producto
        const nuevoProducto = {
          ...producto,
          cantidad: 1
        };
        const nuevoCarrito = [...carritoActual, nuevoProducto];
        setCarrito(nuevoCarrito);
        localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
      }
      
      alert(`Agregado: ${producto.nombre}`);
    };

  if (loading) {
    return (
      <Container maxWidth={false} sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        py: 4,
        backgroundColor: "#f1f1f1",
        minHeight: "100vh",
        width: "100%",
        px: { xs: 2, sm: 4, md: 6 },
      }}
    >
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {/* Botones de Categorías */}
      <Box mb={4} display="flex" flexWrap="wrap" gap={2}>
        {categorias.map((cat, index) => (
          <Button
            key={cat}
            variant="text"
            onClick={() => setCategoriaActiva(cat)}
            sx={{
              backgroundColor: cat === categoriaActiva ? "#fbe4e7" : "transparent",
              color: "black",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: 1,
              p: 1,
              "&:hover": {
                backgroundColor: "#f9d4da",
              },
            }}
          >
            {cat}
          </Button>
        ))}
      </Box>

      

      {/* Grid de Productos */}
      <Grid container spacing={2}>
        {productosFiltrados.map((producto) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={producto._id}>
            <ProductoCard 
              producto={producto} 
              onAgregarCarrito={agregarAlCarrito}
            />
          </Grid>
        ))}
      </Grid>

      {productosFiltrados.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No hay productos en esta categoría
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Catalogo;
