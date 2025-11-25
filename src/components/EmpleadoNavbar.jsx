import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
} from "@mui/material";
import {
  Notifications,
  AccountCircle,
  Dashboard,
  Inventory2,
  Assessment,
  Inventory,
  PointOfSale,
  AutoStories,
  ExitToApp,
  Home,
  LocalCafe,
  Group,
  Receipt,
} from "@mui/icons-material";

const menuItems = [
  { text: "Inicio", icon: <Home />, path: "/empleado/inicio" },
  { text: "Menú y Productos", icon: <LocalCafe />, path: "/empleado/catalogo" },
  { text: "Punto de Venta", icon: <PointOfSale />, path: "/empleado/ventas" },
  { text: "Dashboard", icon: <Dashboard />, path: "/empleado/panel" },
  { text: "Reportes", icon: <Assessment />, path: "/empleado/reportes" },
  { text: "Inventario", icon: <Inventory />, path: "/empleado/inventario" },
  { text: "Recetas", icon: <AutoStories />, path: "/empleado/recetas" },
];

const EmpleadoNavbar = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [notificacionesCount, setNotificacionesCount] = useState(3); // Ejemplo
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setAnchorEl(null);
    navigate("/login");
  };

  return (
    <Box sx={{ height: "100vh", backgroundColor: "#fafafa" }}>
      {/* AppBar - Tema café profesional */}
      <AppBar
        position="static"
        sx={{ 
          backgroundColor: "#6D4C41", // Café medio profesional
          color: "white", 
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)" 
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocalCafe sx={{ fontSize: 28 }} />
            <Typography variant="h6" fontWeight="bold">
              RoMa Café
            </Typography>
            <Typography variant="body2" sx={{ ml: 1, opacity: 0.9 }}>
              Empleado
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Notificaciones con badge */}
            <IconButton color="inherit">
              <Badge 
                badgeContent={notificacionesCount} 
                color="secondary"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#FFB74D',
                    color: '#5D4037',
                    fontWeight: 'bold'
                  }
                }}
              >
                <Notifications />
              </Badge>
            </IconButton>

            <IconButton color="inherit" onClick={handleMenu}>
              <AccountCircle />
            </IconButton>

            <Menu 
              anchorEl={anchorEl} 
              open={Boolean(anchorEl)} 
              onClose={handleClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  '& .MuiMenuItem-root': {
                    px: 2,
                    py: 1,
                  }
                }
              }}
            >
              <MenuItem onClick={handleClose}>Mi Perfil</MenuItem>
              <MenuItem onClick={handleClose}>Configuración</MenuItem>
              <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
            </Menu>

            {usuario && (
              <Typography variant="body1" fontWeight="medium">
                {usuario.nombre}
              </Typography>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", height: "calc(100vh - 64px)" }}>
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: 240,
              boxSizing: "border-box",
              backgroundColor: "#FFFFFF",
              borderRight: "1px solid #E0E0E0",
              top: "64px",
              height: "calc(100vh - 64px)",
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography 
              variant="subtitle2" 
              color="#6D4C41" 
              fontWeight="bold" 
              sx={{ mb: 2, px: 1 }}
            >
              PANEL DE EMPLEADO
            </Typography>
            
            <List>
              {menuItems.map((item) => (
                <ListItemButton 
                  key={item.text} 
                  component={Link} 
                  to={item.path}
                  sx={{
                    borderRadius: 2,
                    my: 0.5,
                    "&:hover": { 
                      backgroundColor: "#F3E5D8",
                      color: "#6D4C41"
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ fontSize: '14px', fontWeight: 500 }}
                  />
                </ListItemButton>
              ))}
            </List>

            <Divider sx={{ my: 2, borderColor: '#E0E0E0' }} />

            <ListItemButton 
              sx={{ 
                borderRadius: 2,
                "&:hover": { 
                  backgroundColor: "#FFEBEE",
                  color: "#D32F2F"
                }
              }} 
              onClick={handleLogout}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText 
                primary="Cerrar sesión" 
                primaryTypographyProps={{ fontSize: '14px', fontWeight: 500 }}
              />
            </ListItemButton>

            {/* Información rápida del empleado */}
            {usuario && (
              <Box sx={{ mt: 3, p: 2, backgroundColor: '#F5F5F5', borderRadius: 2 }}>
                <Typography variant="caption" color="#6D4C41" fontWeight="medium">
                  👋 Hola, {usuario.nombre.split(' ')[0]}
                </Typography>
                <Typography variant="caption" color="#6D4C41" sx={{ display: 'block', mt: 0.5 }}>
                  Rol: Empleado
                </Typography>
              </Box>
            )}
          </Box>
        </Drawer>

        <Box
          sx={{ 
            flexGrow: 1, 
            backgroundColor: "#fafafa", 
            m: 2, 
            p: 3, 
            overflowY: "auto",
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default EmpleadoNavbar;
