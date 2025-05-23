import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Box, Typography, Alert, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchUsuarios = () => {
    if (!token) {
      setError('Debes iniciar sesión para ver los usuarios.');
      setLoading(false);
      return;
    }
    setLoading(true);
    axios.get('http://localhost:3000/usuarios', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(res => {
        setUsuarios(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Error al cargar usuarios');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsuarios();
    // eslint-disable-next-line
  }, []);

  const handleOpenDialog = (user = null) => {
    setEditUser(user);
    setNombre(user ? user.Nombre : '');
    setCorreo(user ? user.Correo : '');
    setContrasena('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditUser(null);
    setNombre('');
    setCorreo('');
    setContrasena('');
  };

  const handleSave = async () => {
    try {
      if (editUser) {
        // Editar usuario
        await axios.put(`http://localhost:3000/usuarios/${editUser.IdUsuario}`, {
          Nombre: nombre,
          Correo: correo,
          Contraseña: contrasena || undefined
        }, {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        setSnackbar({ open: true, message: 'Usuario actualizado', severity: 'success' });
      } else {
        // Crear usuario
        await axios.post('http://localhost:3000/usuarios', {
          Nombre: nombre,
          Correo: correo,
          Contraseña: contrasena
        });
        setSnackbar({ open: true, message: 'Usuario creado', severity: 'success' });
      }
      handleCloseDialog();
      fetchUsuarios();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.error || 'Error al guardar', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      await axios.delete(`http://localhost:3000/usuarios/${id}`, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      setSnackbar({ open: true, message: 'Usuario eliminado', severity: 'success' });
      fetchUsuarios();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.error || 'Error al eliminar', severity: 'error' });
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
          Ir a Login
        </Button>
      </Box>
    </Container>
  );

  return (
    <Container maxWidth="md">
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">Lista de Usuarios</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            Nuevo Usuario
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map(u => (
                <TableRow key={u.IdUsuario}>
                  <TableCell>{u.IdUsuario}</TableCell>
                  <TableCell>{u.Nombre}</TableCell>
                  <TableCell>{u.Correo}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpenDialog(u)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(u.IdUsuario)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialogo para crear/editar */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{editUser ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Nombre"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Correo"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              fullWidth
              margin="normal"
              type="email"
            />
            <TextField
              label={editUser ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
              value={contrasena}
              onChange={e => setContrasena(e.target.value)}
              fullWidth
              margin="normal"
              type="password"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button onClick={handleSave} variant="contained">Guardar</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
    </Container>
  );
}

export default UsuariosPage; 