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
} from "@mui/material";
import {
  Notifications,
  AccountCircle,
  Inventory2,
  Assessment,
  People,
  RestaurantMenu,
  LocalShipping,
  Person,
  Home,
  ExitToApp,
  Coffee,
  MenuBook,
  LocalCafe,
} from "@mui/icons-material";

const menuItems = [
  { text: "Inicio", icon: <Home />, path: "/admin/inicio" },
  { text: "Inventario", icon: <Inventory2 />, path: "/admin/inventario" },
  { text: "Ventas y Reportes", icon: <Assessment />, path: "/admin/ventas-reportes" },
  { text: "Control de Usuarios", icon: <People />, path: "/admin/control-usuarios" },
  { text: "Menú y Recetas", icon: <RestaurantMenu />, path: "/admin/recetas" },
  { text: "Proveedores", icon: <LocalShipping />, path: "/admin/proveedores" },
  { text: "Gestión De Productos", icon: <Person />, path: "/admin/perfil" },
];

const AdminNavbar = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [usuario, setUsuario] = useState(null);
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
    <Box sx={{ height: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Barra superior - Tema café */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#8B4513", // Café oscuro
          color: "white",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocalCafe sx={{ fontSize: 28 }} />
            <Typography variant="h6" fontWeight="bold">
              RoMa Café
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton color="inherit">
              <Notifications />
            </IconButton>

            <IconButton color="inherit" onClick={handleMenu}>
              <AccountCircle />
            </IconButton>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={handleClose}>Perfil</MenuItem>
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

      {/* Sidebar + contenido */}
      <Box sx={{ display: "flex", height: "calc(100vh - 64px)" }}>
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: 240,
              boxSizing: "border-box",
              backgroundColor: "#fff",
              borderRight: "1px solid #e0e0e0",
              top: "64px",
              height: "calc(100vh - 64px)",
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <List>
              {menuItems.map((item) => (
                <ListItemButton
                  key={item.text}
                  sx={{
                    borderRadius: 2,
                    my: 0.5,
                    "&:hover": { 
                      backgroundColor: "#f3e5d8",
                      color: "#8B4513"
                    },
                  }}
                  component={Link}
                  to={item.path}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <ListItemButton
              sx={{ 
                borderRadius: 2,
                "&:hover": { 
                  backgroundColor: "#ffebee",
                  color: "#d32f2f"
                }
              }}
              onClick={handleLogout}
            >
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="Cerrar sesión" />
            </ListItemButton>
          </Box>
        </Drawer>

        {/* Contenido principal */}
        <Box
          sx={{
            flexGrow: 1,
            backgroundColor: "#fafafa",
            borderRadius: "8px",
            m: 2,
            p: 3,
            overflowY: "auto",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminNavbar;
